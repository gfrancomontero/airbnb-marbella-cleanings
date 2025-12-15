export interface Reservation {
  summary: string;
  start: string;
  end: string;
  uid: string;
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
}

export interface CalendarData {
  reservations: Reservation[];
  fetchedAt: string;
}

