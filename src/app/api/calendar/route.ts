import { NextResponse } from 'next/server';
import type { Reservation } from '@/lib/types';
import { getAirbnbCalendarSources } from '@/lib/calendarEnv';

/**
 * Parses iCal date format into an ISO date string (YYYY-MM-DD).
 * We return just the date string to avoid timezone issues.
 * iCal dates with VALUE=DATE are "floating" dates, not tied to any timezone.
 */
function parseICalDate(dateStr: string): string {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${year}-${month}-${day}`;
}

interface ParsedStay {
  summary: string;
  start: string;
  end: string;
  uid: string;
}

function parseICalContent(icalText: string): ParsedStay[] {
  const stays: ParsedStay[] = [];
  const lines = icalText.split(/\r?\n/);

  let currentEvent: Partial<ParsedStay> = {};
  let inEvent = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    while (
      i + 1 < lines.length &&
      (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))
    ) {
      i++;
      line += lines[i].slice(1);
    }

    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      currentEvent = {};
    } else if (line.startsWith('END:VEVENT')) {
      inEvent = false;
      if (currentEvent.start && currentEvent.end && currentEvent.uid) {
        stays.push({
          summary: currentEvent.summary || 'Reservation',
          start: currentEvent.start,
          end: currentEvent.end,
          uid: currentEvent.uid,
        });
      }
    } else if (inEvent) {
      if (line.startsWith('DTSTART')) {
        const value = line.split(':').slice(1).join(':');
        if (value) {
          currentEvent.start = parseICalDate(value);
        }
      } else if (line.startsWith('DTEND')) {
        const value = line.split(':').slice(1).join(':');
        if (value) {
          currentEvent.end = parseICalDate(value);
        }
      } else if (line.startsWith('SUMMARY')) {
        currentEvent.summary = line.split(':').slice(1).join(':');
      } else if (line.startsWith('UID')) {
        currentEvent.uid = line.split(':').slice(1).join(':');
      }
    }
  }

  return stays;
}

async function fetchListingCalendar(
  url: string,
  label: string
): Promise<{ reservations: Reservation[]; error?: string }> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        reservations: [],
        error: `${label}: error HTTP ${response.status}`,
      };
    }

    const icalText = await response.text();
    const stays = parseICalContent(icalText);
    const reservations: Reservation[] = stays.map((s) => ({
      ...s,
      listingLabel: label,
    }));

    reservations.sort((a, b) => a.end.localeCompare(b.end));
    return { reservations };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      reservations: [],
      error: `${label}: ${msg}`,
    };
  }
}

export async function GET() {
  const sources = getAirbnbCalendarSources();

  if (sources.length === 0) {
    console.error(
      'calendar: no AIRBNB_ICAL_URL / AIRBNB_ICAL_URL_1 / AIRBNB_ICAL_URL_2 configured'
    );
    return NextResponse.json(
      {
        error:
          'Calendario no configurado. Define AIRBNB_ICAL_URL (o URL_1 y URL_2) en las variables de entorno.',
      },
      { status: 503 }
    );
  }

  const results = await Promise.all(
    sources.map((s) => fetchListingCalendar(s.url, s.label))
  );

  const warnings: string[] = [];
  const reservations: Reservation[] = [];

  for (const r of results) {
    if (r.error) {
      warnings.push(r.error);
    }
    reservations.push(...r.reservations);
  }

  reservations.sort((a, b) => {
    const byEnd = a.end.localeCompare(b.end);
    if (byEnd !== 0) return byEnd;
    return a.listingLabel.localeCompare(b.listingLabel, 'es');
  });

  if (reservations.length === 0 && warnings.length === sources.length) {
    return NextResponse.json(
      {
        error:
          'No se pudo cargar ningún calendario. Revisa las URLs de Airbnb y los tokens.',
        warnings,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    reservations,
    fetchedAt: new Date().toISOString(),
    ...(warnings.length > 0 ? { warnings } : {}),
  });
}
