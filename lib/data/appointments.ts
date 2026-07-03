import { Appointment } from "@/types";

export const mockAppointments: Appointment[] = [
    // m1 (Ayesha Raza) — confirmed upcoming
    {
        id: "a1",
        clientId: "c1",
        memberId: "m1",
        startTime: "2026-07-08T10:00:00Z",
        endTime: "2026-07-08T10:30:00Z",
        status: "confirmed",
        createdAt: "2026-07-01T08:00:00Z",
    },
    // m1 — pending upcoming
    {
        id: "a2",
        clientId: "c2",
        memberId: "m1",
        startTime: "2026-07-09T11:00:00Z",
        endTime: "2026-07-09T11:30:00Z",
        status: "pending",
        createdAt: "2026-07-02T08:00:00Z",
    },
    // m1 — confirmed upcoming
    {
        id: "a4",
        clientId: "c2",
        memberId: "m1",
        startTime: "2026-07-10T09:00:00Z",
        endTime: "2026-07-10T09:30:00Z",
        status: "confirmed",
        notes: "First consultation session.",
        createdAt: "2026-07-03T08:00:00Z",
    },
    // m1 — confirmed upcoming (same week)
    {
        id: "a5",
        clientId: "c1",
        memberId: "m1",
        startTime: "2026-07-11T14:00:00Z",
        endTime: "2026-07-11T14:30:00Z",
        status: "confirmed",
        createdAt: "2026-07-03T09:00:00Z",
    },
    // m1 — cancelled
    {
        id: "a6",
        clientId: "c2",
        memberId: "m1",
        startTime: "2026-07-07T13:00:00Z",
        endTime: "2026-07-07T13:30:00Z",
        status: "cancelled",
        notes: "Client requested cancellation.",
        createdAt: "2026-07-01T10:00:00Z",
    },
    // m1 — completed past
    {
        id: "a7",
        clientId: "c1",
        memberId: "m1",
        startTime: "2026-06-30T10:00:00Z",
        endTime: "2026-06-30T10:30:00Z",
        status: "completed",
        notes: "Strategy review completed.",
        createdAt: "2026-06-25T08:00:00Z",
    },
    // m1 — no-show past
    {
        id: "a8",
        clientId: "c2",
        memberId: "m1",
        startTime: "2026-06-28T11:00:00Z",
        endTime: "2026-06-28T11:30:00Z",
        status: "no-show",
        createdAt: "2026-06-22T08:00:00Z",
    },
    // m2 (Hamid Sheikh) — completed past
    {
        id: "a3",
        clientId: "c1",
        memberId: "m2",
        startTime: "2026-06-20T14:00:00Z",
        endTime: "2026-06-20T14:30:00Z",
        status: "completed",
        notes: "Discussed Q3 budget planning.",
        createdAt: "2026-06-15T08:00:00Z",
    },
];