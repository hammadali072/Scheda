import { get, ref, remove, set, update } from "firebase/database";
import { database } from "@/firebase";
import type { DaySchedule, DateOverride } from "@/mock/memberMockData";

export interface AvailabilityData {
    weekly: DaySchedule[];
    overrides: DateOverride[];
    exists: boolean;
}

interface WeeklyNode {
    [day: string]: {
        enabled: boolean;
        ranges: Array<{ start: string; end: string }>;
    };
}

function normalizeWeeklySchedule(raw: Record<string, unknown> | null | undefined): DaySchedule[] {
    const days: DaySchedule[] = [
        { day: "monday", label: "Monday", enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: "tuesday", label: "Tuesday", enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: "wednesday", label: "Wednesday", enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: "thursday", label: "Thursday", enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: "friday", label: "Friday", enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: "saturday", label: "Saturday", enabled: false, ranges: [] },
        { day: "sunday", label: "Sunday", enabled: false, ranges: [] },
    ];

    if (!raw) return days;

    Object.entries(raw).forEach(([dayKey, value]) => {
        const entry = value as Record<string, unknown> | undefined;
        const day = days.find((item) => item.day === dayKey);
        if (!day || !entry) return;

        const ranges = Array.isArray(entry.ranges)
            ? entry.ranges.map((range) => ({
                start: typeof range?.start === "string" ? range.start : "",
                end: typeof range?.end === "string" ? range.end : "",
            }))
            : [];

        day.enabled = typeof entry.enabled === "boolean" ? entry.enabled : false;
        day.ranges = ranges;
    });

    return days;
}

function normalizeOverrides(raw: Record<string, unknown> | null | undefined): DateOverride[] {
    if (!raw) return [];

    return Object.entries(raw)
        .map(([overrideId, value]) => {
            const entry = value as Record<string, unknown> | undefined;
            if (!entry) return null;

            const ranges = Array.isArray(entry.ranges)
                ? entry.ranges.map((range) => ({
                    start: typeof range?.start === "string" ? range.start : "",
                    end: typeof range?.end === "string" ? range.end : "",
                }))
                : [];

            return {
                id: overrideId,
                date: typeof entry.date === "string" ? entry.date : "",
                type: entry.type === "custom" ? "custom" : "blocked",
                ranges,
                note: typeof entry.note === "string" ? entry.note : "",
            } as DateOverride;
        })
        .filter((item): item is DateOverride => Boolean(item));
}

function serializeWeeklySchedule(schedule: DaySchedule[]): WeeklyNode {
    return schedule.reduce<WeeklyNode>((acc, day) => {
        acc[day.day] = {
            enabled: day.enabled,
            ranges: day.ranges.map((range) => ({ start: range.start, end: range.end })),
        };
        return acc;
    }, {});
}

export async function getAvailability(uid: string): Promise<AvailabilityData> {
    const snapshot = await get(ref(database, `availability/${uid}`));
    if (!snapshot.exists()) {
        return {
            weekly: normalizeWeeklySchedule(null),
            overrides: [],
            exists: false,
        };
    }

    const data = snapshot.val() as Record<string, unknown>;
    return {
        weekly: normalizeWeeklySchedule(data.weekly as Record<string, unknown> | null | undefined),
        overrides: normalizeOverrides(data.overrides as Record<string, unknown> | null | undefined),
        exists: true,
    };
}

export async function saveWeeklySchedule(
    uid: string,
    schedule: DaySchedule[],
    memberName: string,
    memberDesignation: string
): Promise<void> {
    await update(ref(database, `availability/${uid}`), {
        weekly: serializeWeeklySchedule(schedule),
        memberName,
        designation: memberDesignation,
        memberDesignation,
    });
}

export async function addOverride(uid: string, override: DateOverride): Promise<void> {
    await set(ref(database, `availability/${uid}/overrides/${override.id}`), {
        date: override.date,
        type: override.type,
        ranges: override.ranges.map((range) => ({ start: range.start, end: range.end })),
        note: override.note,
    });
}

export async function removeOverride(uid: string, overrideId: string): Promise<void> {
    await remove(ref(database, `availability/${uid}/overrides/${overrideId}`));
}
