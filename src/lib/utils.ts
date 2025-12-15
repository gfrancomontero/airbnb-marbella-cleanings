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
    
    // Normalize to local date (checkout date)
    const checkoutDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
    // Create cleaning date with 11 AM time for display
    const cleaningDate = new Date(checkoutDate);
    cleaningDate.setHours(11, 0, 0, 0);
    
    const diffTime = checkoutDate.getTime() - today.getTime();
    const daysFromNow = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    // Check for gap after this cleaning
    let hasGapAfter = false;
    let gapDays = 0;
    
    if (i < futureReservations.length - 1) {
      const nextReservation = futureReservations[i + 1];
      const nextStart = new Date(nextReservation.start);
      
      // Normalize both to midnight for proper day comparison
      const nextCheckinDate = new Date(nextStart.getFullYear(), nextStart.getMonth(), nextStart.getDate());
      
      // Gap is the number of days between checkout and next checkin
      // e.g., checkout Dec 20, checkin Dec 21 = 1 day gap (Dec 20 night is open)
      const gapTime = nextCheckinDate.getTime() - checkoutDate.getTime();
      gapDays = Math.round(gapTime / (1000 * 60 * 60 * 24));
      
      // If there's 1+ day gap and it's within the next 10 days, mark as potential last-minute booking
      if (gapDays >= 1 && daysFromNow <= 10) {
        hasGapAfter = true;
      }
    }
    
    cleanings.push({
      date: cleaningDate,
      formattedDate: formatDate(cleaningDate),
      formattedTime: '11:00 - 15:00',
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
  return date.toLocaleDateString('es-ES', options);
}

export function formatShortDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('es-ES', options);
}

export function getDayLabel(daysFromNow: number): string {
  if (daysFromNow === 0) return 'Hoy';
  if (daysFromNow === 1) return 'Mañana';
  if (daysFromNow < 7) return `En ${daysFromNow} días`;
  return '';
}
