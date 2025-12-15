import { NextResponse } from 'next/server';

const ICAL_URL = 'https://www.airbnb.com/calendar/ical/1075195298830742575.ics?s=008791599517b62663c32161cac48b7a';

interface Reservation {
  summary: string;
  start: string;
  end: string;
  uid: string;
}

/**
 * Parses iCal date format into an ISO date string (YYYY-MM-DD).
 * We return just the date string to avoid timezone issues.
 * iCal dates with VALUE=DATE are "floating" dates, not tied to any timezone.
 */
function parseICalDate(dateStr: string): string {
  // Handle ICAL date format: YYYYMMDD or YYYYMMDDTHHMMSSZ
  // We only care about the date part, ignore time
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${year}-${month}-${day}`;
}

function parseICalContent(icalText: string): Reservation[] {
  const reservations: Reservation[] = [];
  const lines = icalText.split(/\r?\n/);
  
  let currentEvent: Partial<Reservation> = {};
  let inEvent = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Handle line folding (lines starting with space/tab are continuations)
    while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
      i++;
      line += lines[i].slice(1);
    }
    
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      currentEvent = {};
    } else if (line.startsWith('END:VEVENT')) {
      inEvent = false;
      if (currentEvent.start && currentEvent.end && currentEvent.uid) {
        reservations.push({
          summary: currentEvent.summary || 'Reservation',
          start: currentEvent.start,
          end: currentEvent.end,
          uid: currentEvent.uid,
        });
      }
    } else if (inEvent) {
      if (line.startsWith('DTSTART')) {
        const value = line.split(':')[1];
        if (value) {
          currentEvent.start = parseICalDate(value);
        }
      } else if (line.startsWith('DTEND')) {
        const value = line.split(':')[1];
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
  
  return reservations;
}

export async function GET() {
  try {
    const response = await fetch(ICAL_URL, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar: ${response.status}`);
    }
    
    const icalText = await response.text();
    const reservations = parseICalContent(icalText);
    
    // Sort by end date (string comparison works for YYYY-MM-DD format)
    reservations.sort((a, b) => a.end.localeCompare(b.end));
    
    return NextResponse.json({ 
      reservations,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar data' },
      { status: 500 }
    );
  }
}
