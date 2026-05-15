export interface Reservation {
  summary: string;
  start: string;
  end: string;
  uid: string;
  /** Which Airbnb listing this row came from (multi-calendar). */
  listingLabel: string;
}

export interface CleaningEvent {
  date: Date;
  formattedDate: string;
  formattedTime: string;
  isToday: boolean;
  isTomorrow: boolean;
  daysFromNow: number;
  hasGapAfter: boolean;
  gapDays: number;
  listingLabel: string;
  reservationUid: string;
}

export interface CalendarData {
  reservations: Reservation[];
  fetchedAt: string;
  /** Non-fatal issues (e.g. one listing failed while others succeeded). */
  warnings?: string[];
}

