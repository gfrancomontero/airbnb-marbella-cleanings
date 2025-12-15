import { Reservation, CleaningEvent } from './types';

/**
 * Parses a date string (YYYY-MM-DD) into date components.
 * This avoids timezone issues by not using Date object for parsing.
 */
function parseDateString(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month: month - 1, day }; // month is 0-indexed for Date constructor
}

/**
 * Creates a Date object for display purposes.
 * Uses local timezone at noon to ensure correct date display.
 */
function createDisplayDate(dateStr: string): Date {
  const { year, month, day } = parseDateString(dateStr);
  return new Date(year, month, day, 12, 0, 0); // noon to avoid DST issues
}

/**
 * Gets today's date as YYYY-MM-DD string for comparison.
 */
function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates the difference in days between two date strings.
 */
function daysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = parseDateString(dateStr1);
  const d2 = parseDateString(dateStr2);
  
  const date1 = Date.UTC(d1.year, d1.month, d1.day);
  const date2 = Date.UTC(d2.year, d2.month, d2.day);
  
  return Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
}

/**
 * Converts reservations into cleaning events.
 * Each cleaning happens on the checkout date (end date) of a reservation.
 */
export function getCleaningsFromReservations(reservations: Reservation[]): CleaningEvent[] {
  const todayStr = getTodayString();
  
  // Filter reservations that end today or in the future
  const futureReservations = reservations.filter(r => r.end >= todayStr);
  
  // Sort by end date
  futureReservations.sort((a, b) => a.end.localeCompare(b.end));
  
  const cleanings: CleaningEvent[] = [];
  
  for (let i = 0; i < futureReservations.length; i++) {
    const reservation = futureReservations[i];
    const checkoutDateStr = reservation.end;
    const daysFromNow = daysDifference(checkoutDateStr, todayStr);
    
    // Check for gap after this cleaning
    const { hasGapAfter, gapDays } = calculateGap(
      futureReservations,
      i,
      checkoutDateStr,
      daysFromNow
    );
    
    // Create display date (for formatting)
    const displayDate = createDisplayDate(checkoutDateStr);
    
    cleanings.push({
      date: displayDate,
      formattedDate: formatDate(displayDate),
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
 * Gets past cleanings from reservations (cleanings that already happened).
 */
export function getPastCleaningsFromReservations(reservations: Reservation[]): CleaningEvent[] {
  const todayStr = getTodayString();
  
  // Filter reservations that ended before today
  const pastReservations = reservations.filter(r => r.end < todayStr);
  
  // Sort by end date (most recent first)
  pastReservations.sort((a, b) => b.end.localeCompare(a.end));
  
  const cleanings: CleaningEvent[] = [];
  
  for (const reservation of pastReservations) {
    const checkoutDateStr = reservation.end;
    const daysFromNow = daysDifference(checkoutDateStr, todayStr);
    const displayDate = createDisplayDate(checkoutDateStr);
    
    cleanings.push({
      date: displayDate,
      formattedDate: formatDate(displayDate),
      formattedTime: '11:00 - 15:00',
      isToday: false,
      isTomorrow: false,
      daysFromNow,
      hasGapAfter: false,
      gapDays: 0,
    });
  }
  
  return cleanings;
}

/**
 * Represents a half-month period with its cleanings.
 */
export interface HalfMonthPeriod {
  label: string;
  startDate: Date;
  endDate: Date;
  cleanings: CleaningEvent[];
}

/**
 * Generates half-month periods for the past year.
 */
export function generateHalfMonthPeriods(): HalfMonthPeriod[] {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const periods: HalfMonthPeriod[] = [];
  
  // Start with current half-month (partial)
  let year = currentYear;
  let month = currentMonth;
  let isFirstHalf = currentDay <= 15;
  
  // If we're in the first half, start from the first half
  // If we're in the second half, start from the second half
  
  // Generate 24 half-month periods (1 year)
  for (let i = 0; i < 24; i++) {
    const startDay = isFirstHalf ? 1 : 16;
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const endDay = isFirstHalf ? 15 : lastDayOfMonth;
    
    const startDate = new Date(year, month, startDay, 12, 0, 0);
    const endDate = new Date(year, month, endDay, 12, 0, 0);
    
    // Format label
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const label = `${startDay} - ${endDay} ${monthNames[month]} ${year}`;
    
    periods.push({
      label,
      startDate,
      endDate,
      cleanings: [],
    });
    
    // Move to previous half-month
    if (isFirstHalf) {
      // Go to previous month's second half
      month--;
      if (month < 0) {
        month = 11;
        year--;
      }
      isFirstHalf = false;
    } else {
      // Go to same month's first half
      isFirstHalf = true;
    }
  }
  
  return periods;
}

/**
 * Assigns cleanings to their respective half-month periods.
 */
export function assignCleaningsToPeriods(
  periods: HalfMonthPeriod[],
  cleanings: CleaningEvent[]
): HalfMonthPeriod[] {
  return periods.map(period => {
    const periodCleanings = cleanings.filter(cleaning => {
      const cleaningTime = cleaning.date.getTime();
      return cleaningTime >= period.startDate.getTime() && 
             cleaningTime <= period.endDate.getTime() + 24 * 60 * 60 * 1000; // Include end day
    });
    
    return {
      ...period,
      cleanings: periodCleanings,
    };
  });
}

/**
 * Calculates if there's a gap after a cleaning that could allow
 * for a last-minute booking (potential extra cleaning).
 */
function calculateGap(
  reservations: Reservation[],
  currentIndex: number,
  checkoutDateStr: string,
  daysFromNow: number
): { hasGapAfter: boolean; gapDays: number } {
  let hasGapAfter = false;
  let gapDays = 0;
  
  if (currentIndex < reservations.length - 1) {
    const nextReservation = reservations[currentIndex + 1];
    const nextCheckinStr = nextReservation.start;
    
    // Gap is the number of days between checkout and next checkin
    gapDays = daysDifference(nextCheckinStr, checkoutDateStr);
    
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
