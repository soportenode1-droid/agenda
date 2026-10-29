import { describe, expect, it } from "vitest";
import { generateAvailability } from "./engine";

const base = { hostTimezone: "America/Mexico_City", rangeStartDate: "2026-10-12", rangeEndDate: "2026-10-12", durationMinutes: 30, bufferBeforeMinutes: 0, bufferAfterMinutes: 0, minimumNoticeHours: 0, maximumHorizonDays: 30, nowUtc: "2026-10-01T00:00:00.000Z", rules: [{ weekday: 1, startMinute: 540, endMinute: 660 }], overrides: [], busyIntervals: [], existingBookings: [] };

describe("generateAvailability", () => {
  it("generates slots from weekly rules in UTC", () => expect(generateAvailability(base)).toEqual(["2026-10-12T15:00:00.000Z", "2026-10-12T15:30:00.000Z", "2026-10-12T16:00:00.000Z", "2026-10-12T16:30:00.000Z"]));
  it("removes busy intervals and booking buffers", () => expect(generateAvailability({ ...base, bufferAfterMinutes: 15, busyIntervals: [{ startUtc: "2026-10-12T15:30:00.000Z", endUtc: "2026-10-12T16:00:00.000Z" }], existingBookings: [{ startUtc: "2026-10-12T16:00:00.000Z", endUtc: "2026-10-12T16:30:00.000Z", status: "CONFIRMED" }] })).toEqual([]));
  it("honors overrides, notice and daily limits", () => {
    expect(generateAvailability({ ...base, overrides: [{ date: "2026-10-12", isBlocked: true, intervals: [] }] })).toEqual([]);
    expect(generateAvailability({ ...base, dailyBookingLimit: 1, existingBookings: [{ startUtc: "2026-10-12T14:00:00.000Z", endUtc: "2026-10-12T14:30:00.000Z", status: "CONFIRMED" }] })).toEqual([]);
  });
});
