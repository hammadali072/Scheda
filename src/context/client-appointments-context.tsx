import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
    INITIAL_CLIENT_APPOINTMENTS,
    type ClientAppointment,
} from "@/mock/clientMockData";
import { useAuth } from "@/context/auth-context";
import { subscribeAppointmentsForClient, updateAppointmentStatus } from "@/services/appointmentService";
import type { Appointment } from "@/types/appointment";

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
    const { profile } = useAuth();
    const [appointments, setAppointments] = useState<ClientAppointment[]>(INITIAL_CLIENT_APPOINTMENTS);

    useEffect(() => {
        if (!profile?.uid) return;

        const unsub = subscribeAppointmentsForClient(profile.uid, (list: Appointment[]) => {
            // map Appointment -> ClientAppointment shape
            const mapped: ClientAppointment[] = list.map((a) => ({
                id: a.id,
                memberId: a.memberId,
                memberName: a.memberName,
                memberRole: a.memberDesignation || "",
                date: a.date,
                time: a.time,
                purpose: a.purpose,
                notes: a.notes,
                status: a.status as ClientAppointment["status"],
            }));

            // sort by date
            mapped.sort((x, y) => x.date.localeCompare(y.date));
            setAppointments(mapped);
        });

        return () => unsub();
    }, [profile?.uid]);

    const addAppointment = (appt: ClientAppointment) => {
        setAppointments((prev) => [appt, ...prev]);
    };

    const cancelAppointment = (id: string) => {
        // persist change to DB and update local state
        void (async () => {
            try {
                await updateAppointmentStatus(id, "cancelled");
                setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "cancelled" as const } : a)));
            } catch (e) {
                console.warn("Failed to cancel appointment:", e);
            }
        })();
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
