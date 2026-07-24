import { useState, useEffect } from "react";
import {
    XIcon,
    UserIcon,
    CalendarBlankIcon,
    ChatCenteredTextIcon,
    ClockIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import type { Appointment } from "@/types/appointment";
import { useAuth } from "@/context/auth-context";
import {
    subscribeAppointmentsForMember,
    updateAppointmentStatus,
    cancelAppointmentWithReason,
} from "@/services/appointmentService";
import TitleComponent from "@/components/shared/TitleComponent";

type Tab = "upcoming" | "past" | "cancelled" | "all";

const STATUS_STYLES: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    cancelled: "bg-red-500/10 text-red-500",
};

const TABS: { key: Tab; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "cancelled", label: "Cancelled" },
    { key: "all", label: "All" },
];

export default function MemberAppointments() {
    const { profile } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>("upcoming");
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

    const filtered = (() => {
        switch (activeTab) {
            case "upcoming":
                return appointments.filter(
                    (a) => a.status === "pending" || a.status === "confirmed"
                );
            case "past":
                return appointments.filter((a) => a.status === "completed");
            case "cancelled":
                return appointments.filter((a) => a.status === "cancelled");
            default:
                return appointments;
        }
    })();

    const updateAppt = (id: string, updates: Partial<Appointment>) => {
        setAppointments((prev) =>
            prev.map((a) => {
                if (a.id === id) {
                    const next = { ...a, ...updates };
                    if (selectedAppt?.id === id) setSelectedAppt(next);
                    return next;
                }
                return a;
            })
        );
    };

    const availableActions = (appt: Appointment) => {
        const actions: { label: string; action: () => void; danger?: boolean }[] = [];
        if (appt.status === "pending") {
            actions.push({
                label: "Confirm",
                action: async () => {
                    try {
                        await updateAppointmentStatus(appt.id, "confirmed");
                        updateAppt(appt.id, { status: "confirmed" });
                    } catch (e) {
                        console.warn("Failed to confirm appointment:", e);
                    }
                },
            });
        }
        if (appt.status === "confirmed") {
            actions.push({
                label: "Mark Completed",
                action: async () => {
                    try {
                        await updateAppointmentStatus(appt.id, "completed");
                        updateAppt(appt.id, { status: "completed" });
                    } catch (e) {
                        console.warn("Failed to mark completed:", e);
                    }
                },
            });
        }
        if (appt.status !== "cancelled" && appt.status !== "completed") {
            actions.push({
                label: "Cancel Session",
                action: async () => {
                    const reason = window.prompt("Enter cancellation reason (optional):");
                    try {
                        await cancelAppointmentWithReason(appt.id, reason ?? "");
                        updateAppt(appt.id, { status: "cancelled" });
                    } catch (e) {
                        console.warn("Failed to cancel appointment:", e);
                    }
                },
                danger: true,
            });
        }
        return actions;
    };

    const tabCounts: Record<Tab, number> = {
        upcoming: appointments.filter((a) => a.status === "pending" || a.status === "confirmed").length,
        past: appointments.filter((a) => a.status === "completed").length,
        cancelled: appointments.filter((a) => a.status === "cancelled").length,
        all: appointments.length,
    };

    useEffect(() => {
        if (!profile?.uid) return;
        const unsub = subscribeAppointmentsForMember(profile.uid, (list) => {
            setAppointments(list);
        });
        return () => unsub();
    }, [profile?.uid]);

    return (
        <div className="relative pb-6 space-y-8">
            <div>
                <h2 className="heading-h2 text-black dark:text-white/90">My Appointments</h2>
                <TitleComponent size='small' className="text-black/50 dark:text-white/90 md:text-base mt-1">Track and manage your client consultation sessions.</TitleComponent>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-tint-black/60 border border-black/10 dark:border-white/5 rounded-xl p-1.5 shadow-shadow2-effect dark:shadow-shadow1 w-fit">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setActiveTab(key)}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                            "focus: focus-visible:ring-2 focus-visible:ring-primary/40",
                            activeTab === key
                                ? "bg-gradient-to-b from-primary-start to-primary-end text-white shadow-sm"
                                : "text-black/50 dark:text-white/90 hover:text-black dark:hover:text-white/90 hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        {label}
                        <span
                            className={clsx(
                                "ml-1.5 text-[10px] font-bold",
                                activeTab === key ? "text-white/70" : "text-black/30 dark:text-white/90"
                            )}
                        >
                            {tabCounts[key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-tint-black/60 rounded-xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 overflow-hidden">
                <div className="overflow-x-auto">
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center px-6">
                            <div className="text-2xl mb-2">
                                {activeTab === "upcoming" ? "•" : activeTab === "past" ? "•" : "•"}
                            </div>
                            <TitleComponent size="small-semibold" className="text-black/50 dark:text-white/90">
                                {activeTab === "upcoming"
                                    ? "No upcoming sessions."
                                    : activeTab === "past"
                                        ? "No completed sessions yet."
                                        : activeTab === "cancelled"
                                            ? "No cancelled sessions."
                                            : "No appointments found."}
                            </TitleComponent>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                                <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/90">
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                                {filtered.map((appt) => (
                                    <tr
                                        key={appt.id}
                                        onClick={() => setSelectedAppt(appt)}
                                        className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-black dark:text-white/90">
                                                {appt.clientName}
                                            </div>
                                            <div className="text-xs text-black/40 dark:text-white/90 truncate max-w-[180px]">
                                                {appt.clientId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-black dark:text-white/90">
                                                {appt.date}
                                            </div>
                                            <div className="text-xs text-black/40 dark:text-white/90">
                                                {appt.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={clsx(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                                    STATUS_STYLES[appt.status]
                                                )}
                                            >
                                                {appt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {selectedAppt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedAppt(null)}
                        aria-hidden="true"
                    />

                    <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-black/10 bg-white shadow-shadow2-effect dark:shadow-shadow1 dark:border-white/5 dark:bg-tint-black dark:shadow-shadow1">
                        <div className="flex items-start justify-between border-b border-black/10 bg-black/[0.02] px-6 py-5 dark:border-white/5 dark:bg-white/[0.02]">
                            <div>
                                <h6 className="heading-h6 text-black dark:text-white/90">Session Details</h6>
                                <TitleComponent size="small" className="mt-1 text-black/50 dark:text-white/90">Review the consultation details and update its progress cleanly.</TitleComponent>
                            </div>
                            <button
                                onClick={() => setSelectedAppt(null)}
                                className="rounded-full p-2 text-black/40 transition hover:bg-black/5 hover:text-black dark:text-white/90 dark:hover:bg-white/5"
                                aria-label="Close details"
                            >
                                <XIcon size={20} />
                            </button>
                        </div>

                        <div className="max-h-[75vh] overflow-y-auto p-6 text-sm">
                            <div className="grid gap-4">
                                <div className="grid gap-4 rounded-2xl border border-black/10 bg-white/80 p-4 dark:border-white/5 dark:bg-black/30 sm:grid-cols-2">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-1 flex-shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                                            <UserIcon size={18} weight="bold" />
                                        </span>
                                        <div>
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/90">Client Info</span>
                                            <div className="mt-0.5 font-bold text-black dark:text-white/90">
                                                {selectedAppt.clientName}
                                            </div>
                                            <TitleComponent size="extra-small" className="text-black/50 dark:text-white/90">
                                                {selectedAppt.clientId}
                                            </TitleComponent>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <span className="mt-1 flex-shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                                            <CalendarBlankIcon size={18} weight="bold" />
                                        </span>
                                        <div>
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/90">Date & Time</span>
                                            <div className="mt-0.5 font-bold text-black dark:text-white/90">
                                                {selectedAppt.date}
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 text-xs text-black/50 dark:text-white/90">
                                                <ClockIcon size={11} />
                                                {selectedAppt.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-black/10 bg-parchment/20 p-4 dark:border-white/5 dark:bg-black/30">
                                    <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/90">
                                        <ChatCenteredTextIcon size={16} />
                                        <span>Session Notes</span>
                                    </div>
                                    <p className="leading-relaxed text-black/70 dark:text-white/90">
                                        {selectedAppt.notes}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/90">
                                        Actions
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {availableActions(selectedAppt).map(({ label, action, danger }) => (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={action}
                                                className={clsx(
                                                    "rounded-full border px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider transition-all",
                                                    danger
                                                        ? "border-red-500/20 text-red-500 hover:bg-red-500/5"
                                                        : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                                                )}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end border-t border-black/10 bg-black/[0.02] px-6 py-4 dark:border-white/5 dark:bg-white/[0.02]">
                            <button
                                onClick={() => setSelectedAppt(null)}
                                className="rounded-full bg-gradient-to-b from-primary-start to-primary-end px-4 py-2.5 text-sm font-semibold text-white shadow-inset transition hover:from-secondary-start hover:to-secondary-end"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



