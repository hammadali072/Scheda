import { createContext, useContext, useState, type ReactNode } from "react";
import {
    INITIAL_CLIENT_APPOINTMENTS,
    type ClientAppointment,
} from "@/mock/clientMockData";

// ─── Context shape ────────────────────────────────────────────────────────────

interface ClientAppointmentsContextValue {
    appointments: ClientAppointment[];
    addAppointment: (appt: ClientAppointment) => void;
    cancelAppointment: (id: string) => void;
}

const ClientAppointmentsContext = createContext<ClientAppointmentsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
// Wrap ClientLayout with this so all child screens share the same appointments list.
// Replace state initialisation with a Firestore fetch when ready.

export function ClientAppointmentsProvider({ children }: { children: ReactNode }) {
    const [appointments, setAppointments] = useState<ClientAppointment[]>(
        INITIAL_CLIENT_APPOINTMENTS
    );

    const addAppointment = (appt: ClientAppointment) => {
        setAppointments((prev) => [appt, ...prev]);
    };

    const cancelAppointment = (id: string) => {
        setAppointments((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "cancelled" as const } : a))
        );
    };

    return (
        <ClientAppointmentsContext.Provider
            value={{ appointments, addAppointment, cancelAppointment }}
        >
            {children}
        </ClientAppointmentsContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useClientAppointments(): ClientAppointmentsContextValue {
    const ctx = useContext(ClientAppointmentsContext);
    if (!ctx) {
        throw new Error(
            "useClientAppointments must be used inside <ClientAppointmentsProvider>"
        );
    }
    return ctx;
}
