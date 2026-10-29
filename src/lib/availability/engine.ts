import { DateTime, Interval } from "luxon";
import type { AvailabilityInput, MinuteInterval, UtcInterval } from "./types";

const activeStatuses = new Set(["PENDING", "CONFIRMED"]);

function overlaps(candidate: Interval, blocked: UtcInterval[]): boolean {
  return blocked.some(({ startUtc, endUtc }) => candidate.overlaps(Interval.fromDateTimes(DateTime.fromISO(startUtc), DateTime.fromISO(endUtc))));
}

function dayIntervals(input: AvailabilityInput, day: DateTime): MinuteInterval[] {
  const override = input.overrides.find((item) => item.date === day.toISODate());
  if (override) return override.isBlocked ? [] : override.intervals;
  return input.rules.filter((rule) => rule.weekday === day.weekday).map(({ startMinute, endMinute }) => ({ startMinute, endMinute }));
}

export function generateAvailability(input: AvailabilityInput): string[] {
  const now = DateTime.fromISO(input.nowUtc, { zone: "utc" });
  const earliest = now.plus({ hours: input.minimumNoticeHours });
  const latest = now.plus({ days: input.maximumHorizonDays });
  const startDay = DateTime.fromISO(input.rangeStartDate, { zone: input.hostTimezone }).startOf("day");
  const endDay = DateTime.fromISO(input.rangeEndDate, { zone: input.hostTimezone }).startOf("day");
  const blocked = [
    ...input.busyIntervals,
    ...input.existingBookings.filter((booking) => activeStatuses.has(booking.status)).map((booking) => ({
      startUtc: DateTime.fromISO(booking.startUtc).minus({ minutes: input.bufferBeforeMinutes }).toUTC().toISO()!,
      endUtc: DateTime.fromISO(booking.endUtc).plus({ minutes: input.bufferAfterMinutes }).toUTC().toISO()!,
    })),
  ];
  const slots: string[] = [];
  for (let day = startDay; day <= endDay; day = day.plus({ days: 1 })) {
    if (day.toUTC() > latest) continue;
    const reservedToday = input.existingBookings.filter((booking) => activeStatuses.has(booking.status) && DateTime.fromISO(booking.startUtc).setZone(input.hostTimezone).toISODate() === day.toISODate()).length;
    if (input.dailyBookingLimit != null && reservedToday >= input.dailyBookingLimit) continue;
    for (const window of dayIntervals(input, day)) {
      for (let minute = window.startMinute; minute + input.durationMinutes <= window.endMinute; minute += input.durationMinutes) {
        const start = day.plus({ minutes: minute });
        if (!start.isValid) continue;
        const end = start.plus({ minutes: input.durationMinutes });
        const candidate = Interval.fromDateTimes(start.toUTC().minus({ minutes: input.bufferBeforeMinutes }), end.toUTC().plus({ minutes: input.bufferAfterMinutes }));
        if (start.toUTC() >= earliest && end.toUTC() <= latest && !overlaps(candidate, blocked)) slots.push(start.toUTC().toISO()!);
      }
    }
  }
  return slots;
}
