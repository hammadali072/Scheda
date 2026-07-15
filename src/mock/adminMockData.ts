export interface Member {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive";
    appointmentCount: number;
    avatarUrl?: string;
}

export interface Client {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    appointmentCount: number;
}

export interface Appointment {
    id: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    memberId: string;
    memberName: string;
    memberEmail: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM AM/PM
    status: "pending" | "confirmed" | "completed" | "cancelled";
    paid: boolean;
    notes: string;
    amount: number;
}

export const INITIAL_MEMBERS: Member[] = [
    {
        id: "m1",
        name: "Dr. Adrian Thorne",
        email: "adrian.thorne@scheda.com",
        role: "Senior Legal Advisor",
        status: "active",
        appointmentCount: 24,
    },
    {
        id: "m2",
        name: "Sarah Jenkins",
        email: "sarah.j@scheda.com",
        role: "Financial Consultant",
        status: "active",
        appointmentCount: 18,
    },
    {
        id: "m3",
        name: "Marcus Vance",
        email: "marcus.v@scheda.com",
        role: "Corporate Strategist",
        status: "active",
        appointmentCount: 15,
    },
    {
        id: "m4",
        name: "Elena Rostova",
        email: "elena.r@scheda.com",
        role: "Tax Specialist",
        status: "inactive",
        appointmentCount: 9,
    },
];

export const Member = [
    {
        id: "m1",
        name: "Dr. Adrian Thorne",
        email: "adrian.thorne@scheda.com",
        role: "Senior Legal Advisor",
        status: "active",
        appointmentCount: 24,
    },
    {
        id: "m2",
        name: "Sarah Jenkins",
        email: "sarah.j@scheda.com",
        role: "Financial Consultant",
        status: "active",
        appointmentCount: 18,
    },
    {
        id: "m3",
        name: "Marcus Vance",
        email: "marcus.v@scheda.com",
        role: "Corporate Strategist",
        status: "active",
        appointmentCount: 15,
    },
    {
        id: "m4",
        name: "Elena Rostova",
        email: "elena.r@scheda.com",
        role: "Tax Specialist",
        status: "inactive",
        appointmentCount: 9,
    },
];

export const INITIAL_CLIENTS: Client[] = [
    {
        id: "c1",
        name: "John Doe",
        email: "john.doe@gmail.com",
        joinDate: "2026-01-15",
        appointmentCount: 5,
    },
    {
        id: "c2",
        name: "Alice Mercer",
        email: "alice.mercer@outlook.com",
        joinDate: "2026-02-10",
        appointmentCount: 3,
    },
    {
        id: "c3",
        name: "Robert Blake",
        email: "robert.blake@techcorp.io",
        joinDate: "2026-03-01",
        appointmentCount: 7,
    },
    {
        id: "c4",
        name: "Nathaniel West",
        email: "nathaniel.west@designhaus.com",
        joinDate: "2026-03-12",
        appointmentCount: 4,
    },
    {
        id: "c5",
        name: "Clara Pendelton",
        email: "clara.p@venturepartners.com",
        joinDate: "2026-04-02",
        appointmentCount: 2,
    },
];

export const Client = [
    {
        id: "c1",
        name: "John Doe",
        email: "john.doe@gmail.com",
        joinDate: "2026-01-15",
        appointmentCount: 5,
    },
    {
        id: "c2",
        name: "Alice Mercer",
        email: "alice.mercer@outlook.com",
        joinDate: "2026-02-10",
        appointmentCount: 3,
    },
    {
        id: "c3",
        name: "Robert Blake",
        email: "robert.blake@techcorp.io",
        joinDate: "2026-03-01",
        appointmentCount: 7,
    },
    {
        id: "c4",
        name: "Nathaniel West",
        email: "nathaniel.west@designhaus.com",
        joinDate: "2026-03-12",
        appointmentCount: 4,
    },
    {
        id: "c5",
        name: "Clara Pendelton",
        email: "clara.p@venturepartners.com",
        joinDate: "2026-04-02",
        appointmentCount: 2,
    },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
    {
        id: "a1",
        clientId: "c1",
        clientName: "John Doe",
        clientEmail: "john.doe@gmail.com",
        memberId: "m1",
        memberName: "Dr. Adrian Thorne",
        memberEmail: "adrian.thorne@scheda.com",
        date: "2026-07-14",
        time: "09:00 AM",
        status: "confirmed",
        paid: true,
        notes: "Initial strategic advisory session for legal corporate restructuring.",
        amount: 250,
    },
    {
        id: "a2",
        clientId: "c2",
        clientName: "Alice Mercer",
        clientEmail: "alice.mercer@outlook.com",
        memberId: "m2",
        memberName: "Sarah Jenkins",
        memberEmail: "sarah.j@scheda.com",
        date: "2026-07-14",
        time: "10:00 AM",
        status: "pending",
        paid: false,
        notes: "Portfolio optimization review. Client has questions on real estate exposure.",
        amount: 180,
    },
    {
        id: "a3",
        clientId: "c3",
        clientName: "Robert Blake",
        clientEmail: "robert.blake@techcorp.io",
        memberId: "m1",
        memberName: "Dr. Adrian Thorne",
        memberEmail: "adrian.thorne@scheda.com",
        date: "2026-07-14",
        time: "01:00 PM",
        status: "confirmed",
        paid: true,
        notes: "Contract dispute review and drafting advisory.",
        amount: 250,
    },
    {
        id: "a4",
        clientId: "c4",
        clientName: "Nathaniel West",
        clientEmail: "nathaniel.west@designhaus.com",
        memberId: "m3",
        memberName: "Marcus Vance",
        memberEmail: "marcus.v@scheda.com",
        date: "2026-07-15",
        time: "11:00 AM",
        status: "confirmed",
        paid: true,
        notes: "Marketing expansion alignment call.",
        amount: 200,
    },
    {
        id: "a5",
        clientId: "c5",
        clientName: "Clara Pendelton",
        clientEmail: "clara.p@venturepartners.com",
        memberId: "m1",
        memberName: "Dr. Adrian Thorne",
        memberEmail: "adrian.thorne@scheda.com",
        date: "2026-07-16",
        time: "02:00 PM",
        status: "pending",
        paid: false,
        notes: "Review of Seed Term Sheet clauses.",
        amount: 300,
    },
    {
        id: "a6",
        clientId: "c1",
        clientName: "John Doe",
        clientEmail: "john.doe@gmail.com",
        memberId: "m3",
        memberName: "Marcus Vance",
        memberEmail: "marcus.v@scheda.com",
        date: "2026-07-17",
        time: "03:00 PM",
        status: "completed",
        paid: true,
        notes: "Completed quarterly strategy execution check-in.",
        amount: 200,
    },
    {
        id: "a7",
        clientId: "c3",
        clientName: "Robert Blake",
        clientEmail: "robert.blake@techcorp.io",
        memberId: "m2",
        memberName: "Sarah Jenkins",
        memberEmail: "sarah.j@scheda.com",
        date: "2026-07-18",
        time: "10:00 AM",
        status: "cancelled",
        paid: false,
        notes: "Cancelled by client due to scheduling conflict.",
        amount: 180,
    },
];

export const Appointment = [
    {
        id: "a1",
        clientId: "c1",
        clientName: "John Doe",
        clientEmail: "john.doe@gmail.com",
        memberId: "m1",
        memberName: "Dr. Adrian Thorne",
        memberEmail: "adrian.thorne@scheda.com",
        date: "2026-07-14",
        time: "09:00 AM",
        status: "confirmed",
        paid: true,
        notes: "Initial strategic advisory session for legal corporate restructuring.",
        amount: 250,
    },
    {
        id: "a2",
        clientId: "c2",
        clientName: "Alice Mercer",
        clientEmail: "alice.mercer@outlook.com",
        memberId: "m2",
        memberName: "Sarah Jenkins",
        memberEmail: "sarah.j@scheda.com",
        date: "2026-07-14",
        time: "10:00 AM",
        status: "pending",
        paid: false,
        notes: "Portfolio optimization review. Client has questions on real estate exposure.",
        amount: 180,
    },
    {
        id: "a3",
        clientId: "c3",
        clientName: "Robert Blake",
        clientEmail: "robert.blake@techcorp.io",
        memberId: "m1",
        memberName: "Dr. Adrian Thorne",
        memberEmail: "adrian.thorne@scheda.com",
        date: "2026-07-14",
        time: "01:00 PM",
        status: "confirmed",
        paid: true,
        notes: "Contract dispute review and drafting advisory.",
        amount: 250,
    },
    {
        id: "a4",
        clientId: "c4",
        clientName: "Nathaniel West",
        clientEmail: "nathaniel.west@designhaus.com",
        memberId: "m3",
        memberName: "Marcus Vance",
        memberEmail: "marcus.v@scheda.com",
        date: "2026-07-15",
        time: "11:00 AM",
        status: "confirmed",
        paid: true,
        notes: "Marketing expansion alignment call.",
        amount: 200,
    },
    {
        id: "a5",
        clientId: "c5",
        clientName: "Clara Pendelton",
        clientEmail: "clara.p@venturepartners.com",
        memberId: "m1",
        memberName: "Dr. Adrian Thorne",
        memberEmail: "adrian.thorne@scheda.com",
        date: "2026-07-16",
        time: "02:00 PM",
        status: "pending",
        paid: false,
        notes: "Review of Seed Term Sheet clauses.",
        amount: 300,
    },
    {
        id: "a6",
        clientId: "c1",
        clientName: "John Doe",
        clientEmail: "john.doe@gmail.com",
        memberId: "m3",
        memberName: "Marcus Vance",
        memberEmail: "marcus.v@scheda.com",
        date: "2026-07-17",
        time: "03:00 PM",
        status: "completed",
        paid: true,
        notes: "Completed quarterly strategy execution check-in.",
        amount: 200,
    },
    {
        id: "a7",
        clientId: "c3",
        clientName: "Robert Blake",
        clientEmail: "robert.blake@techcorp.io",
        memberId: "m2",
        memberName: "Sarah Jenkins",
        memberEmail: "sarah.j@scheda.com",
        date: "2026-07-18",
        time: "10:00 AM",
        status: "cancelled",
        paid: false,
        notes: "Cancelled by client due to scheduling conflict.",
        amount: 180,
    },
];

export const DateOverride = [
    {
        id: "m1",
        name: "Dr. Adrian Thorne",
        email: "adrian.thorne@scheda.com",
        availability: [
            {
                id: "a1",
                day: "Monday",
                time: "09:00 AM - 12:00 PM",
                status: "active",
            },
            {
                id: "a2",
                day: "Tuesday",
                time: "02:00 PM - 05:00 PM",
                status: "active",
            },
            {
                id: "a3",
                day: "Wednesday",
                time: "09:00 AM - 12:00 PM",
                status: "active",
            },
            {
                id: "a4",
                day: "Thursday",
                time: "02:00 PM - 05:00 PM",
                status: "active",
            },
            {
                id: "a5",
                day: "Friday",
                time: "09:00 AM - 12:00 PM",
                status: "active",
            },
            {
                id: "a6",
                day: "Saturday",
                time: "09:00 AM - 12:00 PM",
                status: "inactive",
            },
            {
                id: "a7",
                day: "Sunday",
                time: "09:00 AM - 12:00 PM",
                status: "inactive",
            },
        ],
    },
];

export const DateSchedule = [
    {
        id: "m1",
        name: "Dr. Adrian Thorne",
        email: "adrian.thorne@scheda.com",
        availability: [
            {
                id: "a1",
                date: "Monday",
                time: "09:00 AM - 12:00 PM",
                status: "active",
            },
            {
                id: "a2",
                date: "Tuesday",
                time: "02:00 PM - 05:00 PM",
                status: "active",
            },
            {
                id: "a3",
                date: "Wednesday",
                time: "09:00 AM - 12:00 PM",
                status: "active",
            },
            {
                id: "a4",
                date: "Thursday",
                time: "02:00 PM - 05:00 PM",
                status: "active",
            },
            {
                id: "a5",
                date: "Friday",
                time: "09:00 AM - 12:00 PM",
                status: "active",
            },
            {
                id: "a6",
                date: "Saturday",
                time: "09:00 AM - 12:00 PM",
                status: "inactive",
            },
            {
                id: "a7",
                date: "Sunday",
                time: "09:00 AM - 12:00 PM",
                status: "inactive",
            },
        ],
    },
];

export type TimeRange = {
    start: string;
    end: string;
};

export const MemberAvailability = [
    {
        id: "m1",
        name: "Dr. Adrian Thorne",
        email: "adrian.thorne@scheda.com",
        availability: [
            {
                id: "a1",
                day: "Monday",
                time: "09:00 AM - 12:00 PM",
                status: "active",
            },
            {
                id: "a2",
                day: "Tuesday",
                time: "02:00 PM - 05:00 PM",
                status: "active",
            },
            {
                id: "a3",
                day: "Wednesday",
                time: "09:00 AM - 12:00 PM",
                status: "active",
            },
            {
                id: "a4",
                day: "Thursday",
                time: "02:00 PM - 05:00 PM",
                status: "active",
            },
            {
                id: "a5",
                day: "Friday",
                time: "09:00 AM - 12:00 PM",
                status: "active",
            },
            {
                id: "a6",
                day: "Saturday",
                time: "09:00 AM - 12:00 PM",
                status: "inactive",
            },
            {
                id: "a7",
                day: "Sunday",
                time: "09:00 AM - 12:00 PM",
                status: "inactive",
            },
        ],
    },
];