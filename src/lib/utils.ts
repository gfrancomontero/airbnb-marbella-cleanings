import { Reservation, CleaningEvent } from './types';

/**
 * Converts reservations into cleaning events.
 * Each cleaning happens on the checkout date (end date) of a reservation.
 */
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
    const { hasGapAfter, gapDays } = calculateGap(
      futureReservations,
      i,
      checkoutDate,
      daysFromNow
    );
    
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

/**
 * Calculates if there's a gap after a cleaning that could allow
 * for a last-minute booking (potential extra cleaning).
 */
function calculateGap(
  reservations: Reservation[],
  currentIndex: number,
  checkoutDate: Date,
  daysFromNow: number
): { hasGapAfter: boolean; gapDays: number } {
  let hasGapAfter = false;
  let gapDays = 0;
  
  if (currentIndex < reservations.length - 1) {
    const nextReservation = reservations[currentIndex + 1];
    const nextStart = new Date(nextReservation.start);
    
    // Normalize to midnight for proper day comparison
    const nextCheckinDate = new Date(
      nextStart.getFullYear(),
      nextStart.getMonth(),
      nextStart.getDate()
    );
    
    // Gap is the number of days between checkout and next checkin
    const gapTime = nextCheckinDate.getTime() - checkoutDate.getTime();
    gapDays = Math.round(gapTime / (1000 * 60 * 60 * 24));
    
    // If there's 1+ day gap and it's within the next 10 days, mark as alert
    if (gapDays >= 1 && daysFromNow <= 10) {
      hasGapAfter = true;
    }
  }
  
  return { hasGapAfter, gapDays };
}

/**
 * Formats a date in Spanish long format.
 * Example: "sábado, 20 de diciembre de 2025"
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('es-ES', options);
}

/**
 * Formats a date in Spanish short format.
 * Example: "sáb, 20 dic"
 */
export function formatShortDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('es-ES', options);
}

/**
 * Calculates the gap date and formats it.
 * Used to show when a potential extra cleaning might happen.
 */
export function formatGapDate(cleaningDate: Date, gapDays: number): string {
  const gapDate = new Date(cleaningDate.getTime() + gapDays * 24 * 60 * 60 * 1000);
  return gapDate.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Returns a human-readable label for how far away a date is.
 */
export function getDayLabel(daysFromNow: number): string {
  if (daysFromNow === 0) return 'Hoy';
  if (daysFromNow === 1) return 'Mañana';
  if (daysFromNow < 7) return `En ${daysFromNow} días`;
  return '';
}

/**
 * Filters cleanings to get only those with gaps in the near future.
 */
export function getGapAlerts(cleanings: CleaningEvent[], maxDaysAhead = 10): CleaningEvent[] {
  return cleanings.filter(c => c.hasGapAfter && c.daysFromNow <= maxDaysAhead);
}
