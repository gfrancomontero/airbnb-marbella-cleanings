import { NextResponse } from 'next/server';

const ICAL_URL = 'https://www.airbnb.com/calendar/ical/1075195298830742575.ics?s=008791599517b62663c32161cac48b7a';

interface Reservation {
  summary: string;
  start: string;
  end: string;
  uid: string;
}

function parseICalDate(dateStr: string): Date {
  // Handle ICAL date format: YYYYMMDD or YYYYMMDDTHHMMSSZ
  if (dateStr.includes('T')) {
    // Full datetime
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(4, 6)) - 1;
    const day = parseInt(dateStr.slice(6, 8));
    const hour = parseInt(dateStr.slice(9, 11));
    const minute = parseInt(dateStr.slice(11, 13));
    const second = parseInt(dateStr.slice(13, 15));
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  } else {
    // Date only
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(4, 6)) - 1;
    const day = parseInt(dateStr.slice(6, 8));
    return new Date(year, month, day);
  }
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
          const date = parseICalDate(value);
          currentEvent.start = date.toISOString();
        }
      } else if (line.startsWith('DTEND')) {
        const value = line.split(':')[1];
        if (value) {
          const date = parseICalDate(value);
          currentEvent.end = date.toISOString();
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
    
    // Sort by end date
    reservations.sort((a, b) => new Date(a.end).getTime() - new Date(b.end).getTime());
    
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

