import React, { useState } from "react";
import {
    X as XIcon,
    User as UserIcon,
    CalendarBlank as CalendarBlankIcon,
    CreditCard as CreditCardIcon,
    ChatCenteredText as ChatCenteredTextIcon,
    CheckCircle as CheckCircleIcon,
    Clock as ClockIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { MEMBER_APPOINTMENTS, MemberAppointment } from "@/mock/memberMockData";

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
    const [appointments, setAppointments] = useState<MemberAppointment[]>(MEMBER_APPOINTMENTS);
    const [activeTab, setActiveTab] = useState<Tab>("upcoming");
    const [selectedAppt, setSelectedAppt] = useState<MemberAppointment | null>(null);

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

    const updateAppt = (id: string, updates: Partial<MemberAppointment>) => {
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

    // Member-appropriate actions only — no reassign
    const availableActions = (appt: MemberAppointment) => {
        const actions: { label: string; action: () => void; danger?: boolean }[] = [];
        if (appt.status === "pending") {
            actions.push({
                label: "Confirm",
                action: () => updateAppt(appt.id, { status: "confirmed" }),
            });
        }
        if (appt.status === "confirmed") {
            actions.push({
                label: "Mark Completed",
                action: () => updateAppt(appt.id, { status: "completed" }),
            });
        }
        if (appt.status !== "cancelled" && appt.status !== "completed") {
            actions.push({
                label: "Cancel Session",
                action: () => updateAppt(appt.id, { status: "cancelled" }),
                danger: true,
            });
        }
        if (!appt.paid && appt.status !== "cancelled") {
            actions.push({
                label: "Mark Paid",
                action: () => updateAppt(appt.id, { paid: true }),
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

    return (
        <div className="relative pb-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-ink dark:text-parchment">
                    My Appointments
                </h1>
                <p className="text-sm text-black/50 dark:text-parchment/50 mt-1">
                    Track and manage your client consultation sessions.
                </p>
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 bg-surface dark:bg-card-dark border border-black/10 dark:border-white/5 rounded-2xl p-1.5 shadow-card w-fit">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setActiveTab(key)}
                        className={clsx(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            activeTab === key
                                ? "bg-primary text-white shadow-sm"
                                : "text-black/50 dark:text-parchment/50 hover:text-ink dark:hover:text-parchment hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        {label}
                        <span
                            className={clsx(
                                "ml-1.5 text-[10px] font-bold",
                                activeTab === key ? "text-white/70" : "text-black/30 dark:text-parchment/30"
                            )}
                        >
                            {tabCounts[key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-surface dark:bg-card-dark rounded-3xl border border-black/10 dark:border-white/5 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center px-6">
                            <div className="text-2xl mb-2">
                                {activeTab === "upcoming" ? "📅" : activeTab === "past" ? "✅" : "🚫"}
                            </div>
                            <p className="text-sm font-semibold text-black/50 dark:text-parchment/40">
                                {activeTab === "upcoming"
                                    ? "No upcoming sessions."
                                    : activeTab === "past"
                                    ? "No completed sessions yet."
                                    : activeTab === "cancelled"
                                    ? "No cancelled sessions."
                                    : "No appointments found."}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                                <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] text-xs font-bold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4 text-right">Fee</th>
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
                                            <div className="font-semibold text-ink dark:text-parchment">
                                                {appt.clientName}
                                            </div>
                                            <div className="text-xs text-black/40 dark:text-parchment/40 truncate max-w-[180px]">
                                                {appt.clientEmail}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-ink dark:text-parchment">
                                                {appt.date}
                                            </div>
                                            <div className="text-xs text-black/40 dark:text-parchment/40">
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
                                        <td className="px-6 py-4">
                                            {appt.paid ? (
                                                <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-xs font-semibold">
                                                    Unpaid
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-ink dark:text-parchment">
                                            ${appt.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ── Appointment Detail Drawer ──────────────────────────────────────── */}
            {selectedAppt && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setSelectedAppt(null)}
                        aria-hidden="true"
                    />

                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <div className="w-screen max-w-md bg-surface dark:bg-card-dark border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col">
                            {/* Drawer header */}
                            <div className="px-6 py-5 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-ink dark:text-parchment">
                                    Session Details
                                </h2>
                                <button
                                    onClick={() => setSelectedAppt(null)}
                                    aria-label="Close details"
                                    className="p-1 rounded-lg text-black/40 dark:text-parchment/40 hover:text-ink dark:hover:text-parchment hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                >
                                    <XIcon size={20} />
                                </button>
                            </div>

                            {/* Drawer body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                                {/* Client info */}
                                <div className="flex items-start gap-3">
                                    <span className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                                        <UserIcon size={18} weight="bold" />
                                    </span>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                            Client
                                        </div>
                                        <div className="font-bold text-ink dark:text-parchment mt-0.5">
                                            {selectedAppt.clientName}
                                        </div>
                                        <div className="text-xs text-black/50 dark:text-parchment/40">
                                            {selectedAppt.clientEmail}
                                        </div>
                                    </div>
                                </div>

                                {/* Date / time */}
                                <div className="flex items-start gap-3">
                                    <span className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                                        <CalendarBlankIcon size={18} weight="bold" />
                                    </span>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                            Date & Time
                                        </div>
                                        <div className="font-bold text-ink dark:text-parchment mt-0.5">
                                            {selectedAppt.date}
                                        </div>
                                        <div className="text-xs text-black/50 dark:text-parchment/40 flex items-center gap-1">
                                            <ClockIcon size={11} />
                                            {selectedAppt.time}
                                        </div>
                                    </div>
                                </div>

                                {/* Fee */}
                                <div className="flex items-start gap-3">
                                    <span className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                                        <CreditCardIcon size={18} weight="bold" />
                                    </span>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                            Consultation Fee
                                        </div>
                                        <div className="font-bold text-ink dark:text-parchment mt-0.5">
                                            ${selectedAppt.amount}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="border-t border-black/5 dark:border-white/5 pt-4">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-parchment/40 mb-2">
                                        <ChatCenteredTextIcon size={14} />
                                        Session Notes
                                    </div>
                                    <p className="text-xs leading-relaxed text-black/70 dark:text-parchment/60 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl p-3">
                                        {selectedAppt.notes}
                                    </p>
                                </div>

                                {/* Status actions — member-appropriate only */}
                                <div className="border-t border-black/5 dark:border-white/5 pt-4 space-y-3">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                        Actions
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {availableActions(selectedAppt).map(({ label, action, danger }) => (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={action}
                                                className={clsx(
                                                    "px-4 py-2 rounded-xl text-xs font-semibold border transition-colors",
                                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                                                    danger
                                                        ? "border-red-500/20 text-red-500 hover:bg-red-500/5"
                                                        : "border-primary/20 text-primary bg-primary/5 hover:bg-primary/10"
                                                )}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Drawer footer — payment toggle */}
                            <div className="px-6 py-4 border-t border-black/10 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-black/40 dark:text-parchment/40">
                                        Payment Status
                                    </div>
                                    <div className="mt-0.5">
                                        {selectedAppt.paid ? (
                                            <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider">
                                                Unpaid
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {selectedAppt.status !== "cancelled" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateAppt(selectedAppt.id, { paid: !selectedAppt.paid })
                                        }
                                        className={clsx(
                                            "px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm",
                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                            selectedAppt.paid
                                                ? "bg-red-500 hover:bg-red-600 text-white focus-visible:ring-red-500"
                                                : "bg-emerald-500 hover:bg-emerald-600 text-white focus-visible:ring-emerald-500"
                                        )}
                                    >
                                        <CheckCircleIcon size={14} weight="bold" />
                                        {selectedAppt.paid ? "Mark Unpaid" : "Mark Paid"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
