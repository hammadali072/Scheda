export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
    id: string;
    clientId: string;
    clientName: string;
    memberId: string;
    memberName: string;
    memberDesignation: string;
    date: string; // YYYY-MM-DD
    time: string; // "09:00 AM" — display format
    startMinutes: number; // minutes since midnight, for slot math
    durationMinutes: number; // default 60
    purpose: string;
    notes: string;
    status: AppointmentStatus;
    createdAt: string;
}
