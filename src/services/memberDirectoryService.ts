import { get, ref } from "firebase/database";
import { database } from "@/firebase";
import type { DaySchedule } from "@/mock/memberMockData";

export interface MemberDirectoryEntry {
    uid: string;
    memberName: string;
    memberDesignation: string;
    weekly: DaySchedule[];
}

interface RawAvailabilityEntry {
    memberName?: string;
    memberDesignation?: string;
    designation?: string;
    weekly?: Record<string, { enabled: boolean; ranges: Array<{ start: string; end: string }> }>;
}

interface RawUserProfileEntry {
    name?: string;
    designation?: string;
}

function normalizeWeeklySchedule(raw: Record<string, unknown> | null | undefined): DaySchedule[] {
    const days: DaySchedule[] = [
        { day: "monday", label: "Monday", enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: "tuesday", label: "Tuesday", enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: "wednesday", label: "Wednesday", enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: "thursday", label: "Thursday", enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: "friday", label: "Friday", enabled: true, ranges: [{ start: "09:00", end: "15:00" }] },
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

export async function getAllMembers(): Promise<MemberDirectoryEntry[]> {
    const availabilitySnapshot = await get(ref(database, "availability"));
    const usersSnapshot = await get(ref(database, "users"));

    if (!availabilitySnapshot.exists()) {
        return [];
    }

    const data = availabilitySnapshot.val() as Record<string, RawAvailabilityEntry>;
    const userProfiles = usersSnapshot.exists()
        ? (usersSnapshot.val() as Record<string, RawUserProfileEntry>)
        : {};

    return Object.entries(data).map(([uid, entry]) => {
        const profile = userProfiles[uid];
        const profileName = typeof profile?.name === "string" ? profile.name : "";
        const profileDesignation = typeof profile?.designation === "string" ? profile.designation : "";
        const designation = typeof entry.designation === "string" && entry.designation.trim()
            ? entry.designation
            : typeof entry.memberDesignation === "string" && entry.memberDesignation.trim()
                ? entry.memberDesignation
                : profileDesignation;

        return {
            uid,
            memberName: typeof entry.memberName === "string" && entry.memberName.trim()
                ? entry.memberName
                : profileName,
            memberDesignation: designation,
            weekly: normalizeWeeklySchedule(entry.weekly as Record<string, unknown> | null | undefined),
        };
    });
}

export async function getMemberByUid(uid: string): Promise<MemberDirectoryEntry | null> {
    const allMembers = await getAllMembers();
    return allMembers.find((member) => member.uid === uid) ?? null;
}
