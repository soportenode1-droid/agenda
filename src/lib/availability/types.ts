export type MinuteInterval = { startMinute: number; endMinute: number };

export type AvailabilityRule = MinuteInterval & { weekday: number };

export type DateOverride = {
  date: string;
  isBlocked: boolean;
  intervals: MinuteInterval[];
};

export type UtcInterval = { startUtc: string; endUtc: string };

export type ExistingBooking = UtcInterval & { status: "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED" };

export type AvailabilityInput = {
  hostTimezone: string;
  rangeStartDate: string;
  rangeEndDate: string;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  minimumNoticeHours: number;
  maximumHorizonDays: number;
  dailyBookingLimit?: number | null;
  nowUtc: string;
  rules: AvailabilityRule[];
  overrides: DateOverride[];
  busyIntervals: UtcInterval[];
  existingBookings: ExistingBooking[];
};
