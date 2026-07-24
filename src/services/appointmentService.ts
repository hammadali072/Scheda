import { equalTo, get, orderByChild, push, query, ref, set, update, onValue } from "firebase/database";
import { database } from "@/firebase";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

export async function createAppointment(data: Omit<Appointment, "id" | "createdAt">): Promise<string> {
    const appointmentsRef = ref(database, "appointments");
    const newAppointmentRef = push(appointmentsRef);
    const id = newAppointmentRef.key;

    if (!id) {
        throw new Error("Failed to create appointment id.");
    }

    const appointment: Appointment = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
    };

    await set(newAppointmentRef, appointment);
    return id;
}

export async function getAppointmentsForMember(memberId: string): Promise<Appointment[]> {
    const appointmentsRef = ref(database, "appointments");
    try {
        const appointmentsQuery = query(
            appointmentsRef,
            orderByChild("memberId"),
            equalTo(memberId)
        );

        const snapshot = await get(appointmentsQuery);
        if (!snapshot.exists()) {
            return [];
        }

        const value = snapshot.val() as Record<string, Appointment> | null;
        if (!value) {
            return [];
        }

        return Object.entries(value).map(([id, appointment]) => ({
            ...appointment,
            id,
        }));
    } catch (err) {
        // Likely missing index in Realtime Database rules ("Index not defined" error).
        // Fallback: fetch all appointments and filter client-side to avoid runtime crash.
        try {
            const snapshot = await get(appointmentsRef);
            if (!snapshot.exists()) return [];
            const value = snapshot.val() as Record<string, Appointment> | null;
            if (!value) return [];
            return Object.entries(value)
                .map(([id, appointment]) => ({ ...appointment, id }))
                .filter((a) => a.memberId === memberId);
        } catch (e) {
            throw err;
        }
    }
}

export async function getAppointmentsForClient(clientId: string): Promise<Appointment[]> {
    const appointmentsQuery = query(
        ref(database, "appointments"),
        orderByChild("clientId"),
        equalTo(clientId)
    );

    const snapshot = await get(appointmentsQuery);
    if (!snapshot.exists()) {
        return [];
    }

    const value = snapshot.val() as Record<string, Appointment> | null;
    if (!value) {
        return [];
    }

    return Object.entries(value).map(([id, appointment]) => ({
        ...appointment,
        id,
    }));
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> {
    await update(ref(database, `appointments/${id}`), { status });
}

export async function cancelAppointmentWithReason(id: string, reason?: string): Promise<void> {
    await update(ref(database, `appointments/${id}`), { status: "cancelled", cancelReason: reason ?? null });
}

export function subscribeAppointmentsForMember(
    memberId: string,
    callback: (appointments: Appointment[]) => void
): () => void {
    const appointmentsRef = query(ref(database, "appointments"), orderByChild("memberId"), equalTo(memberId));

    const unsub = onValue(appointmentsRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback([]);
            return;
        }

        const value = snapshot.val() as Record<string, Appointment> | null;
        if (!value) {
            callback([]);
            return;
        }

        const list = Object.entries(value).map(([id, appointment]) => ({ ...(appointment as Appointment), id }));
        callback(list);
    }, () => {
        // on error, fallback to one-off fetch
        void get(ref(database, "appointments")).then((snap) => {
            if (!snap.exists()) return callback([]);
            const val = snap.val() as Record<string, Appointment> | null;
            if (!val) return callback([]);
            const list = Object.entries(val).map(([id, appointment]) => ({ ...(appointment as Appointment), id })).filter(a => a.memberId === memberId);
            callback(list);
        }).catch(() => callback([]));
    });

    return () => unsub();
}

export function subscribeAppointmentsForClient(
    clientId: string,
    callback: (appointments: Appointment[]) => void
): () => void {
    const appointmentsRef = query(ref(database, "appointments"), orderByChild("clientId"), equalTo(clientId));

    const unsub = onValue(appointmentsRef, (snapshot) => {
        if (!snapshot.exists()) return callback([]);
        const value = snapshot.val() as Record<string, Appointment> | null;
        if (!value) return callback([]);
        const list = Object.entries(value).map(([id, appointment]) => ({ ...(appointment as Appointment), id }));
        callback(list);
    }, () => {
        void get(ref(database, "appointments")).then((snap) => {
            if (!snap.exists()) return callback([]);
            const val = snap.val() as Record<string, Appointment> | null;
            if (!val) return callback([]);
            const list = Object.entries(val).map(([id, appointment]) => ({ ...(appointment as Appointment), id })).filter(a => a.clientId === clientId);
            callback(list);
        }).catch(() => callback([]));
    });

    return () => unsub();
}
