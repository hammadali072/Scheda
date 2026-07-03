import { AvailabilityRule, AvailabilityException } from "@/types";

// Ayesha (m1): Mon-Fri, 9am-5pm, 30-min slots
export const mockAvailabilityRules: AvailabilityRule[] = [
    ...[1, 2, 3, 4, 5].map((day, i) => ({
        id: `ar-m1-${i}`,
        memberId: "m1",
        dayOfWeek: day as AvailabilityRule["dayOfWeek"],
        startTime: "09:00",
        endTime: "17:00",
        slotDurationMinutes: 30,
    })),
    // Hamid (m2): Mon/Wed/Fri, 10am-4pm, 30-min slots
    ...[1, 3, 5].map((day, i) => ({
        id: `ar-m2-${i}`,
        memberId: "m2",
        dayOfWeek: day as AvailabilityRule["dayOfWeek"],
        startTime: "10:00",
        endTime: "16:00",
        slotDurationMinutes: 30,
    })),
];

export const mockAvailabilityExceptions: AvailabilityException[] = [
    // m1 — full day leave
    {
        id: "ae1",
        memberId: "m1",
        date: "2026-07-14",
        type: "leave",
    },
    // m1 — custom shorter hours
    {
        id: "ae2",
        memberId: "m1",
        date: "2026-07-18",
        type: "custom-hours",
        overrideStart: "10:00",
        overrideEnd: "13:00",
    },
    // m1 — holiday (company holiday)
    {
        id: "ae3",
        memberId: "m1",
        date: "2026-08-14",
        type: "holiday",
    },
];