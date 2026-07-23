import { equalTo, get, orderByChild, push, query, ref, set, update } from "firebase/database";
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
    const appointmentsQuery = query(
        ref(database, "appointments"),
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
