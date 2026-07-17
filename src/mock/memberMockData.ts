// ─── Types ───────────────────────────────────────────────────────────────────

export interface TimeRange {
    start: string; // "09:00" (24-hour)
    end: string;   // "17:00"
}

export interface DaySchedule {
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    label: string;
    enabled: boolean;
    ranges: TimeRange[];
}

export interface DateOverride {
    id: string;
    date: string;        // YYYY-MM-DD
    type: "blocked" | "custom";
    ranges: TimeRange[]; // empty when type === "blocked"
    note: string;
}

export interface MemberAppointment {
    id: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    date: string;  // YYYY-MM-DD
    time: string;  // "09:00 AM"
    status: "pending" | "confirmed" | "completed" | "cancelled";
    notes: string;
}

export interface LoggedInMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    specialty: string;
    bio: string;
    avatar: string; // initials
}

// ─── Mock "current member" ────────────────────────────────────────────────────

export const LOGGED_IN_MEMBER: LoggedInMember = {
    id: "m1",
    name: "Dr. Adrian Thorne",
    email: "adrian.thorne@scheda.com",
    phone: "+1 (555) 012-3456",
    role: "Senior Legal Advisor",
    specialty: "Corporate Law & Restructuring",
    bio: "15+ years advising mid-market companies on mergers, restructuring, and contract disputes. Focused on pragmatic, execution-ready legal strategy.",
    avatar: "AT",
};

// ─── Weekly recurring availability ───────────────────────────────────────────
// Replace with Firestore fetch: collection("members").doc(id).collection("availability")

export const MEMBER_WEEKLY_AVAILABILITY: DaySchedule[] = [
    {
        day: "monday",
        label: "Monday",
        enabled: true,
        ranges: [
            { start: "09:00", end: "12:00" },
            { start: "13:00", end: "17:00" },
        ],
    },
    {
        day: "tuesday",
        label: "Tuesday",
        enabled: true,
        ranges: [{ start: "09:00", end: "17:00" }],
    },
    {
        day: "wednesday",
        label: "Wednesday",
        enabled: true,
        ranges: [{ start: "10:00", end: "16:00" }],
    },
    {
        day: "thursday",
        label: "Thursday",
        enabled: true,
        ranges: [{ start: "09:00", end: "12:00" }],
    },
    {
        day: "friday",
        label: "Friday",
        enabled: true,
        ranges: [{ start: "09:00", end: "15:00" }],
    },
    {
        day: "saturday",
        label: "Saturday",
        enabled: false,
        ranges: [],
    },
    {
        day: "sunday",
        label: "Sunday",
        enabled: false,
        ranges: [],
    },
];

// ─── Date overrides ───────────────────────────────────────────────────────────
// Replace with Firestore fetch: collection("members").doc(id).collection("dateOverrides")

export const MEMBER_DATE_OVERRIDES: DateOverride[] = [
    {
        id: "do1",
        date: "2026-07-20",
        type: "blocked",
        ranges: [],
        note: "Vacation",
    },
    {
        id: "do2",
        date: "2026-07-21",
        type: "blocked",
        ranges: [],
        note: "Vacation",
    },
    {
        id: "do3",
        date: "2026-07-28",
        type: "custom",
        ranges: [{ start: "10:00", end: "13:00" }],
        note: "Half day only",
    },
];

// ─── This member's appointments (Dr. Adrian Thorne — memberId: m1) ────────────
// Replace with Firestore query: collection("appointments").where("memberId", "==", "m1")

export const MEMBER_APPOINTMENTS: MemberAppointment[] = [
    {
        id: "a1",
        clientId: "c1",
        clientName: "John Doe",
        clientEmail: "john.doe@gmail.com",
        date: "2026-07-14",
        time: "09:00 AM",
        status: "confirmed",
        notes: "Initial strategic advisory session for legal corporate restructuring.",
    },
    {
        id: "a3",
        clientId: "c3",
        clientName: "Robert Blake",
        clientEmail: "robert.blake@techcorp.io",
        date: "2026-07-14",
        time: "01:00 PM",
        status: "confirmed",
        notes: "Contract dispute review and drafting advisory.",
    },
    {
        id: "a5",
        clientId: "c5",
        clientName: "Clara Pendelton",
        clientEmail: "clara.p@venturepartners.com",
        date: "2026-07-16",
        time: "02:00 PM",
        status: "pending",
        notes: "Review of Seed Term Sheet clauses — three specific sections flagged for discussion.",
    },
    {
        id: "a10",
        clientId: "c2",
        clientName: "Alice Mercer",
        clientEmail: "alice.mercer@outlook.com",
        date: "2026-07-18",
        time: "11:00 AM",
        status: "pending",
        notes: "Follow-up on restructuring options after last session.",
    },
    {
        id: "a8",
        clientId: "c2",
        clientName: "Alice Mercer",
        clientEmail: "alice.mercer@outlook.com",
        date: "2026-07-10",
        time: "11:00 AM",
        status: "completed",
        notes: "Reviewed partnership agreement draft. Flagged three liability clauses for revision.",
    },
    {
        id: "a9",
        clientId: "c4",
        clientName: "Nathaniel West",
        clientEmail: "nathaniel.west@designhaus.com",
        date: "2026-07-08",
        time: "10:00 AM",
        status: "cancelled",
        notes: "Client cancelled 24 hours before — rescheduling pending.",
    },
];
