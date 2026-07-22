import { type DaySchedule } from "@/mock/memberMockData";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface LoggedInClient {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string; // initials
}

export interface BookableMember {
    id: string;
    name: string;
    role: string;
    designation: string;
    bio: string;
    avatar: string; // initials
    nextAvailable: string; // human-readable hint, e.g. "Thu, Jul 17 · 2:00 PM"
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface ClientAppointment {
    id: string;
    memberId: string;
    memberName: string;
    memberRole: string;
    date: string;   // YYYY-MM-DD
    time: string;   // "09:00 AM"
    purpose: string;
    notes: string;
    status: AppointmentStatus;
}

// Reuses DaySchedule shape from memberMockData — per-member availability keyed by memberId
export type MemberAvailabilityMap = Record<string, DaySchedule[]>;

// ─── Mock "logged in as client" ───────────────────────────────────────────────

export const LOGGED_IN_CLIENT: LoggedInClient = {
    id: "c1",
    name: "John Doe",
    email: "john.doe@gmail.com",
    phone: "+1 (555) 234-5678",
    avatar: "JD",
};

// ─── Bookable members (client-facing view) ────────────────────────────────────

export const BOOKABLE_MEMBERS: BookableMember[] = [
    {
        id: "m1",
        name: "Dr. Adrian Thorne",
        role: "Senior Legal Advisor",
        designation: "Corporate Law & Restructuring",
        bio: "15+ years advising mid-market companies on mergers, restructuring, and contract disputes. Focused on pragmatic, execution-ready legal strategy.",
        avatar: "AT",
        nextAvailable: "Thu, Jul 17 · 9:00 AM",
    },
    {
        id: "m2",
        name: "Sarah Jenkins",
        role: "Financial Consultant",
        designation: "Financial Planning & Tax Strategy",
        bio: "Certified financial planner specialising in tax-efficient wealth strategies and business financial structuring for entrepreneurs and growing companies.",
        avatar: "SJ",
        nextAvailable: "Mon, Jul 21 · 8:00 AM",
    },
    {
        id: "m3",
        name: "Marcus Vance",
        role: "Corporate Strategist",
        designation: "Market Entry & Growth Strategy",
        bio: "Former McKinsey consultant helping companies identify growth opportunities, enter new markets, and scale operations. Strong focus on data-driven decisions.",
        avatar: "MV",
        nextAvailable: "Tue, Jul 22 · 2:00 PM",
    },
    {
        id: "m4",
        name: "Dr. Priya Nair",
        role: "HR & Organisational Consultant",
        designation: "Talent Management & Culture Design",
        bio: "Specialises in organisational design, leadership development, and building high-performance cultures. Works with scale-ups and enterprise leadership teams.",
        avatar: "PN",
        nextAvailable: "Mon, Jul 21 · 11:00 AM",
    },
];

// ─── Per-member weekly availability (reuses DaySchedule from memberMockData) ──
// Replace with Firestore fetch: collection("members").doc(id).collection("availability")

export const MEMBER_AVAILABILITY_MAP: MemberAvailabilityMap = {
    m1: [
        { day: "monday", label: "Monday", enabled: true, ranges: [{ start: "09:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
        { day: "tuesday", label: "Tuesday", enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: "wednesday", label: "Wednesday", enabled: true, ranges: [{ start: "10:00", end: "16:00" }] },
        { day: "thursday", label: "Thursday", enabled: true, ranges: [{ start: "09:00", end: "12:00" }] },
        { day: "friday", label: "Friday", enabled: true, ranges: [{ start: "09:00", end: "15:00" }] },
        { day: "saturday", label: "Saturday", enabled: false, ranges: [] },
        { day: "sunday", label: "Sunday", enabled: false, ranges: [] },
    ],
    m2: [
        { day: "monday", label: "Monday", enabled: true, ranges: [{ start: "08:00", end: "12:00" }] },
        { day: "tuesday", label: "Tuesday", enabled: false, ranges: [] },
        { day: "wednesday", label: "Wednesday", enabled: true, ranges: [{ start: "13:00", end: "17:00" }] },
        { day: "thursday", label: "Thursday", enabled: true, ranges: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "16:00" }] },
        { day: "friday", label: "Friday", enabled: true, ranges: [{ start: "10:00", end: "14:00" }] },
        { day: "saturday", label: "Saturday", enabled: false, ranges: [] },
        { day: "sunday", label: "Sunday", enabled: false, ranges: [] },
    ],
    m3: [
        { day: "monday", label: "Monday", enabled: true, ranges: [{ start: "09:00", end: "12:00" }] },
        { day: "tuesday", label: "Tuesday", enabled: true, ranges: [{ start: "14:00", end: "18:00" }] },
        { day: "wednesday", label: "Wednesday", enabled: false, ranges: [] },
        { day: "thursday", label: "Thursday", enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: "friday", label: "Friday", enabled: false, ranges: [] },
        { day: "saturday", label: "Saturday", enabled: false, ranges: [] },
        { day: "sunday", label: "Sunday", enabled: false, ranges: [] },
    ],
    m4: [
        { day: "monday", label: "Monday", enabled: true, ranges: [{ start: "11:00", end: "17:00" }] },
        { day: "tuesday", label: "Tuesday", enabled: true, ranges: [{ start: "09:00", end: "13:00" }] },
        { day: "wednesday", label: "Wednesday", enabled: true, ranges: [{ start: "11:00", end: "15:00" }] },
        { day: "thursday", label: "Thursday", enabled: false, ranges: [] },
        { day: "friday", label: "Friday", enabled: true, ranges: [{ start: "09:00", end: "12:00" }] },
        { day: "saturday", label: "Saturday", enabled: false, ranges: [] },
        { day: "sunday", label: "Sunday", enabled: false, ranges: [] },
    ],
};

// ─── This client's appointments ───────────────────────────────────────────────
// Replace with Firestore query: collection("appointments").where("clientId", "==", "c1")

export const INITIAL_CLIENT_APPOINTMENTS: ClientAppointment[] = [
    {
        id: "ca1",
        memberId: "m1",
        memberName: "Dr. Adrian Thorne",
        memberRole: "Senior Legal Advisor",
        date: "2026-07-18",
        time: "11:00 AM",
        purpose: "Contract Review",
        notes: "Need help reviewing a freelance contract before signing — three liability clauses seem unusual.",
        status: "confirmed",
    },
    {
        id: "ca2",
        memberId: "m2",
        memberName: "Sarah Jenkins",
        memberRole: "Financial Consultant",
        date: "2026-07-22",
        time: "10:00 AM",
        purpose: "Tax Strategy",
        notes: "Looking for advice on structuring my side income for tax efficiency going into next year.",
        status: "pending",
    },
    {
        id: "ca3",
        memberId: "m3",
        memberName: "Marcus Vance",
        memberRole: "Corporate Strategist",
        date: "2026-07-10",
        time: "02:00 PM",
        purpose: "Market Entry Strategy",
        notes: "Discussed EU market entry — identified three priority countries. Follow-up deck needed.",
        status: "completed",
    },
    {
        id: "ca4",
        memberId: "m1",
        memberName: "Dr. Adrian Thorne",
        memberRole: "Senior Legal Advisor",
        date: "2026-07-05",
        time: "09:00 AM",
        purpose: "Partnership Agreement Advice",
        notes: "Reviewed partnership agreement structure for a new venture with two co-founders.",
        status: "cancelled",
    },
];

// ─── Appointment purpose presets (booking dropdown) ───────────────────────────

export const APPOINTMENT_PURPOSES = [
    "Contract Review",
    "Legal Consultation",
    "Financial Planning",
    "Tax Strategy",
    "Business Growth Strategy",
    "Market Entry Advice",
    "HR Consultation",
    "Organisational Design",
    "Partnership Agreement Advice",
    "Merger & Acquisition Advice",
    "Fundraising Preparation",
    "General Advisory",
    "Other",
] as const;

export type AppointmentPurpose = (typeof APPOINTMENT_PURPOSES)[number];
