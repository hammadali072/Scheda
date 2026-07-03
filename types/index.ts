// src/types/index.ts
//
// Core domain types for Appointment Manager.
// All date/time fields are ISO strings stored/compared in UTC.
// Convert to local time only at the display layer (see lib/date.ts, once created).

export type UserRole = "admin" | "member" | "client";

export type AppointmentStatus =
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "no-show";

export type AvailabilityExceptionType = "leave" | "holiday" | "custom-hours";

/** Base identity shared by every account, regardless of role. */
export interface Profile {
    id: string;
    role: UserRole;
    name: string;
    email: string;
    avatarUrl?: string;
    createdAt: string; // ISO UTC
}

export interface Designation {
    id: string;
    name: string; // e.g. "Cardiologist", "Tax Consultant"
    description?: string;
}

/** An Associated Member — provides appointments, sets their own availability. */
export interface Member extends Profile {
    role: "member";
    designationId: string;
    bio?: string;
    isActive: boolean; // admin can deactivate without deleting
}

/** A Client — books appointments with members. */
export interface Client extends Profile {
    role: "client";
}

/** Recurring weekly availability, e.g. "Mondays 9am-5pm, 30-min slots". */
export interface AvailabilityRule {
    id: string;
    memberId: string;
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
    startTime: string; // "09:00" local member time (24h)
    endTime: string; // "17:00"
    slotDurationMinutes: number;
}

/** One-off override to a recurring rule — leave, holiday, or custom hours for a single date. */
export interface AvailabilityException {
    id: string;
    memberId: string;
    date: string; // ISO date, "2026-07-14"
    type: AvailabilityExceptionType;
    overrideStart?: string; // only used when type === "custom-hours"
    overrideEnd?: string;
}

export interface Appointment {
    id: string;
    clientId: string;
    memberId: string;
    startTime: string; // ISO UTC
    endTime: string; // ISO UTC
    status: AppointmentStatus;
    notes?: string;
    createdAt: string; // ISO UTC
}

/** Platform-wide settings, configured by Admin. */
export interface AppSettings {
    companyWorkingDays: number[]; // e.g. [1,2,3,4,5] = Mon-Fri
    defaultSlotDurationMinutes: number;
    cancellationCutoffHours: number;
    holidays: string[]; // ISO dates
}

/** Convenience type for a slot computed by the availability engine (not stored). */
export interface BookableSlot {
    memberId: string;
    startTime: string; // ISO UTC
    endTime: string; // ISO UTC
}