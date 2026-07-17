import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    XIcon,
    CalendarBlankIcon,
    ClockIcon,
    SparkleIcon,
    ChatCenteredTextIcon,
    ArrowRightIcon,
    CalendarXIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { type ClientAppointment } from "@/mock/clientMockData";
import { useClientAppointments } from "@/context/client-appointments-context";

const TODAY = "2026-07-15"; // mock "today"

type Tab = "upcoming" | "past" | "cancelled";

const TABS: { key: Tab; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "cancelled", label: "Cancelled" },
];

const STATUS_STYLES: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    cancelled: "bg-red-500/10 text-red-500",
};

function formatDate(d: string) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}
function formatDateLong(d: string) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function MemberAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
    const initials = name.split(" ").filter((_, i) => i < 2).map(w => w[0]).join("");
    return (
        <div className={clsx(
            "rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0",
            size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm"
        )}>
            {initials}
        </div>
    );
}

// â”€â”€â”€ Appointment detail drawer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DetailDrawer({
    appt,
    onClose,
    onCancel,
    onReschedule,
}: {
    appt: ClientAppointment;
    onClose: () => void;
    onCancel: (id: string) => void;
    onReschedule: (appt: ClientAppointment) => void;
}) {
    const canCancel = appt.status !== "cancelled" && appt.status !== "completed";
    const canReschedule = appt.status === "pending" || appt.status === "confirmed";

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="w-screen max-w-md bg-surface dark:bg-tint-black/60 border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col">

                    {/* Header */}
                    <div className="px-6 py-5 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-black dark:text-white/90">
                            Appointment Details
                        </h2>
                        <button
                            onClick={onClose}
                            aria-label="Close details"
                            className="p-1 rounded-lg text-black/40 dark:text-white/90 hover:text-black dark:hover:text-white/90 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                            <XIcon size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">

                        {/* Member */}
                        <div className="flex items-start gap-3">
                            <MemberAvatar name={appt.memberName} />
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-0.5">
                                    Member
                                </div>
                                <div className="font-bold text-black dark:text-white/90">{appt.memberName}</div>
                                <div className="text-xs text-black/50 dark:text-white/90">{appt.memberRole}</div>
                            </div>
                        </div>

                        {/* Status badge */}
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-2">
                                Status
                            </div>
                            <span className={clsx(
                                "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                STATUS_STYLES[appt.status]
                            )}>
                                {appt.status}
                            </span>
                        </div>

                        {/* Date & time */}
                        <div className="flex items-start gap-3">
                            <span className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                                <CalendarBlankIcon size={16} weight="bold" />
                            </span>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-0.5">
                                    Date & Time
                                </div>
                                <div className="font-bold text-black dark:text-white/90">{formatDateLong(appt.date)}</div>
                                <div className="text-xs text-black/50 dark:text-white/90 flex items-center gap-1 mt-0.5">
                                    <ClockIcon size={11} />
                                    {appt.time}
                                </div>
                            </div>
                        </div>

                        {/* Purpose */}
                        <div className="flex items-start gap-3">
                            <span className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                                <SparkleIcon size={16} weight="bold" />
                            </span>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-0.5">
                                    Purpose
                                </div>
                                <div className="font-semibold text-black dark:text-white/90">{appt.purpose}</div>
                            </div>
                        </div>

                        {/* Notes */}
                        {appt.notes && (
                            <div className="border-t border-black/5 dark:border-white/5 pt-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-2">
                                    <ChatCenteredTextIcon size={13} />
                                    Notes
                                </div>
                                <p className="text-xs leading-relaxed text-black/70 dark:text-white/90 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl p-3">
                                    {appt.notes}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        {(canCancel || canReschedule) && (
                            <div className="border-t border-black/5 dark:border-white/5 pt-4 space-y-3">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90">
                                    Actions
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {canReschedule && (
                                        <button
                                            type="button"
                                            onClick={() => onReschedule(appt)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                                        >
                                            <ArrowRightIcon size={12} weight="bold" />
                                            Reschedule
                                        </button>
                                    )}
                                    {canCancel && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onCancel(appt.id);
                                                onClose();
                                            }}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-colors focus: focus-visible:ring-2 focus-visible:ring-red-500/30"
                                        >
                                            <CalendarXIcon size={12} weight="bold" />
                                            Cancel appointment
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ClientAppointments() {
    const navigate = useNavigate();
    const { appointments, cancelAppointment } = useClientAppointments();

    const [activeTab, setActiveTab] = useState<Tab>("upcoming");
    const [selectedAppt, setSelectedAppt] = useState<ClientAppointment | null>(null);

    const filtered = (() => {
        switch (activeTab) {
            case "upcoming":
                return appointments.filter(
                    (a) => (a.status === "pending" || a.status === "confirmed") && a.date >= TODAY
                );
            case "past":
                return appointments.filter((a) => a.status === "completed" || a.date < TODAY && a.status !== "cancelled");
            case "cancelled":
                return appointments.filter((a) => a.status === "cancelled");
        }
    })().sort((a, b) => a.date.localeCompare(b.date));

    const tabCounts: Record<Tab, number> = {
        upcoming: appointments.filter((a) => (a.status === "pending" || a.status === "confirmed") && a.date >= TODAY).length,
        past: appointments.filter((a) => a.status === "completed" || (a.date < TODAY && a.status !== "cancelled")).length,
        cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };

    const handleReschedule = (appt: ClientAppointment) => {
        setSelectedAppt(null);
        navigate(`/client/book/${appt.memberId}`, {
            state: { reschedule: appt },
        });
    };

    const EMPTY_MSG: Record<Tab, { icon: string; title: string; sub: string }> = {
        upcoming: { icon: "ðŸ“…", title: "No upcoming appointments", sub: "Browse available members and book a session." },
        past: { icon: "âœ…", title: "No past appointments", sub: "Completed sessions will appear here." },
        cancelled: { icon: "ðŸš«", title: "No cancelled appointments", sub: "Good news â€” nothing cancelled." },
    };

    return (
        <div className="relative pb-6 space-y-8">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white/90">
                        My Appointments
                    </h1>
                    <p className="text-sm text-black/50 dark:text-white/90 mt-1">
                        Track your bookings and manage upcoming sessions.
                    </p>
                </div>
                <Link
                    to="/client/find"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-sm font-bold text-white shadow-sm shadow-primary/20 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                    <CalendarBlankIcon size={16} weight="bold" />
                    New booking
                </Link>
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 bg-surface dark:bg-tint-black/60 border border-black/10 dark:border-white/5 rounded-2xl p-1.5 shadow-shadow2-effect dark:shadow-shadow1 w-fit">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        id={`tab-${key}`}
                        onClick={() => setActiveTab(key)}
                        className={clsx(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200",
                            "focus: focus-visible:ring-2 focus-visible:ring-primary/40",
                            activeTab === key
                                ? "bg-primary text-white shadow-sm"
                                : "text-black/50 dark:text-white/90 hover:text-black dark:hover:text-white/90 hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                        aria-selected={activeTab === key}
                        role="tab"
                    >
                        {label}
                        <span className={clsx(
                            "ml-1.5 text-[10px] font-bold",
                            activeTab === key ? "text-white/70" : "text-black/30 dark:text-white/90"
                        )}>
                            {tabCounts[key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-surface dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 overflow-hidden">
                <div className="overflow-x-auto">
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center px-6">
                            <div className="text-3xl mb-3">{EMPTY_MSG[activeTab].icon}</div>
                            <p className="text-sm font-semibold text-black/50 dark:text-white/90">
                                {EMPTY_MSG[activeTab].title}
                            </p>
                            <p className="text-xs text-black/30 dark:text-white/90 mt-1">
                                {EMPTY_MSG[activeTab].sub}
                            </p>
                            {activeTab === "upcoming" && (
                                <Link
                                    to="/client/find"
                                    className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                                >
                                    Browse members
                                </Link>
                            )}
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[600px]" role="grid">
                            <thead>
                                <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/90">
                                    <th className="px-6 py-4">Member</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Purpose</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 sr-only">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                                {filtered.map((appt) => (
                                    <tr
                                        key={appt.id}
                                        onClick={() => setSelectedAppt(appt)}
                                        className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-colors group"
                                        tabIndex={0}
                                        role="row"
                                        aria-label={`Appointment with ${appt.memberName} on ${formatDate(appt.date)}`}
                                        onKeyDown={(e) => e.key === "Enter" && setSelectedAppt(appt)}
                                    >
                                        {/* Member */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <MemberAvatar name={appt.memberName} size="sm" />
                                                <div>
                                                    <div className="font-semibold text-black dark:text-white/90">{appt.memberName}</div>
                                                    <div className="text-xs text-black/40 dark:text-white/90">{appt.memberRole}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Date & Time */}
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-black dark:text-white/90">{formatDate(appt.date)}</div>
                                            <div className="text-xs text-black/40 dark:text-white/90 flex items-center gap-1 mt-0.5">
                                                <ClockIcon size={11} />
                                                {appt.time}
                                            </div>
                                        </td>

                                        {/* Purpose */}
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-black dark:text-white/90 max-w-[200px] truncate">{appt.purpose}</div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                                STATUS_STYLES[appt.status]
                                            )}>
                                                {appt.status}
                                            </span>
                                        </td>

                                        {/* Chevron hint */}
                                        <td className="px-6 py-4 text-right">
                                            <ArrowRightIcon
                                                size={14}
                                                className="text-black/20 dark:text-white/90 group-hover:text-primary transition-colors ml-auto"
                                                weight="bold"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Detail drawer */}
            {selectedAppt && (
                <DetailDrawer
                    appt={selectedAppt}
                    onClose={() => setSelectedAppt(null)}
                    onCancel={cancelAppointment}
                    onReschedule={handleReschedule}
                />
            )}
        </div>
    );
}



