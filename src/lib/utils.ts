import { Reservation, CleaningEvent } from './types';

export function getCleaningsFromReservations(reservations: Reservation[]): CleaningEvent[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Filter reservations that end today or in the future
  const futureReservations = reservations.filter(r => {
    const endDate = new Date(r.end);
    return endDate >= today;
  });
  
  // Sort by end date
  futureReservations.sort((a, b) => 
    new Date(a.end).getTime() - new Date(b.end).getTime()
  );
  
  const cleanings: CleaningEvent[] = [];
  
  for (let i = 0; i < futureReservations.length; i++) {
    const reservation = futureReservations[i];
    const endDate = new Date(reservation.end);
    const cleaningDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
    // Set cleaning time to 11 AM
    cleaningDate.setHours(11, 0, 0, 0);
    
    const diffTime = cleaningDate.getTime() - today.getTime();
    const daysFromNow = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Check for gap after this cleaning
    let hasGapAfter = false;
    let gapDays = 0;
    
    if (i < futureReservations.length - 1) {
      const nextReservation = futureReservations[i + 1];
      const nextStart = new Date(nextReservation.start);
      const nextStartDate = new Date(nextStart.getFullYear(), nextStart.getMonth(), nextStart.getDate());
      
      // Gap is the number of days between checkout and next checkin
      const gapTime = nextStartDate.getTime() - cleaningDate.getTime();
      gapDays = Math.floor(gapTime / (1000 * 60 * 60 * 24));
      
      // If there's 1-3 days gap and it's within the next 7 days, mark as potential last-minute booking
      if (gapDays >= 1 && gapDays <= 3 && daysFromNow <= 7) {
        hasGapAfter = true;
      }
    }
    
    cleanings.push({
      date: cleaningDate,
      formattedDate: formatDate(cleaningDate),
      formattedTime: '11:00 AM - 3:00 PM',
      isToday: daysFromNow === 0,
      isTomorrow: daysFromNow === 1,
      daysFromNow,
      hasGapAfter,
      gapDays,
    });
  }
  
  return cleanings;
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export function formatShortDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export function getDayLabel(daysFromNow: number): string {
  if (daysFromNow === 0) return 'Today';
  if (daysFromNow === 1) return 'Tomorrow';
  if (daysFromNow < 7) return `In ${daysFromNow} days`;
  return '';
}

