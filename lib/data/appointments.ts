import { Appointment } from "@/types";

export const mockAppointments: Appointment[] = [
    {
        id: "a1",
        clientId: "c1",
        memberId: "m1",
        startTime: "2026-07-08T10:00:00Z",
        endTime: "2026-07-08T10:30:00Z",
        status: "confirmed",
        createdAt: "2026-07-01T08:00:00Z",
    },
    {
        id: "a2",
        clientId: "c2",
        memberId: "m1",
        startTime: "2026-07-09T11:00:00Z",
        endTime: "2026-07-09T11:30:00Z",
        status: "pending",
        createdAt: "2026-07-02T08:00:00Z",
    },
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