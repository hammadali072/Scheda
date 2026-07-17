import { Link } from "react-router-dom";
import {
    CalendarBlankIcon,
    HourglassIcon,
    ArrowRightIcon,
    ClockIcon,
    PlusCircleIcon,
    SparkleIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { LOGGED_IN_CLIENT } from "@/mock/clientMockData";
import { useClientAppointments } from "@/context/client-appointments-context";

const TODAY = "2026-07-15"; // mock "today"

const STATUS_STYLES: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    cancelled: "bg-red-500/10 text-red-500",
};

export default function ClientOverview() {
    const { appointments } = useClientAppointments();

    const upcoming = appointments
        .filter((a) => (a.status === "confirmed" || a.status === "pending") && a.date >= TODAY)
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

    const nextAppt = upcoming[0] ?? null;
    const pendingCount = appointments.filter((a) => a.status === "pending").length;

    const stats = [
        {
            label: "Upcoming Appointments",
            value: upcoming.length,
            icon: CalendarBlankIcon,
            color: "text-primary bg-primary/10",
        },
        {
            label: "Pending Confirmation",
            value: pendingCount,
            icon: HourglassIcon,
            color: "text-amber-500 bg-amber-500/10",
        },
    ];

    // Format YYYY-MM-DD to "Friday, July 18"
    const formatDate = (d: string) =>
        new Date(d + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                        Client Portal
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white/90">
                        Welcome back, {LOGGED_IN_CLIENT.name.split(" ")[0]}.
                    </h1>
                    <p className="text-sm text-black/50 dark:text-white/90 mt-1">
                        Here's your appointment snapshot and quick actions.
                    </p>
                </div>
                <Link
                    to="/client/find"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-sm font-bold text-white shadow-sm shadow-primary/20 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                    <PlusCircleIcon size={17} weight="bold" />
                    Book Appointment
                </Link>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-white dark:bg-tint-black/60 p-5 rounded-2xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className={clsx("p-2 rounded-xl", stat.color)}>
                                <stat.icon size={18} weight="bold" />
                            </span>
                            <span className="text-3xl font-black text-black dark:text-white/90">
                                {stat.value}
                            </span>
                        </div>
                        <div className="text-xs font-semibold text-black/50 dark:text-white/90 leading-tight">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Next Appointment hero card */}
            {nextAppt ? (
                <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-primary/15">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-blue-700" />

                    {/* Decorative blobs */}
                    <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

                    <div className="relative p-6 sm:p-8">

                        {/* Label row */}
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white">
                                <SparkleIcon size={11} weight="fill" />
                                Your Next Appointment
                            </span>
                            <span className={clsx(
                                "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                nextAppt.status === "confirmed"
                                    ? "bg-emerald-400/25 text-emerald-100"
                                    : "bg-amber-400/25 text-amber-100"
                            )}>
                                {nextAppt.status}
                            </span>
                        </div>

                        {/* Member identity */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-xl flex-shrink-0 border border-white/20">
                                {nextAppt.memberName.split(" ").filter((_, i) => i < 2).map(w => w[0]).join("")}
                            </div>
                            <div>
                                <div className="text-white font-extrabold text-xl leading-tight">
                                    {nextAppt.memberName}
                                </div>
                                <div className="text-white/65 text-sm mt-0.5">{nextAppt.memberRole}</div>
                            </div>
                        </div>

                        {/* Info blocks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <div className="text-white/55 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                    <CalendarBlankIcon size={11} weight="bold" />
                                    Date & Time
                                </div>
                                <div className="text-white font-bold text-sm">{formatDate(nextAppt.date)}</div>
                                <div className="text-white/65 text-xs flex items-center gap-1 mt-1">
                                    <ClockIcon size={11} />
                                    {nextAppt.time}
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <div className="text-white/55 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                                    Purpose
                                </div>
                                <div className="text-white font-bold text-sm">{nextAppt.purpose}</div>
                                {nextAppt.notes && (
                                    <div className="text-white/55 text-xs mt-1 line-clamp-2 leading-relaxed">
                                        {nextAppt.notes}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                to="/client/appointments"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary text-sm font-bold hover:bg-white/90 transition-colors focus: focus-visible:ring-2 focus-visible:ring-white/50"
                            >
                                View all appointments
                                <ArrowRightIcon size={14} weight="bold" />
                            </Link>
                            <Link
                                to="/client/find"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 text-white text-sm font-semibold hover:bg-white/25 transition-colors focus: focus-visible:ring-2 focus-visible:ring-white/40 border border-white/20"
                            >
                                <PlusCircleIcon size={14} weight="bold" />
                                Book another
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                /* Empty state */
                <div className="bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 p-12 text-center">
                    <div className="text-5xl mb-5">•</div>
                    <h2 className="text-lg font-bold text-black dark:text-white/90 mb-2">
                        No upcoming appointments
                    </h2>
                    <p className="text-sm text-black/50 dark:text-white/90 max-w-sm mx-auto mb-7 leading-relaxed">
                        You don't have anything scheduled yet. Browse available members and book a session at a time that works for you.
                    </p>
                    <Link
                        to="/client/find"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-sm font-bold text-white shadow-sm shadow-primary/20 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <PlusCircleIcon size={17} weight="bold" />
                        Book your first appointment
                    </Link>
                </div>
            )}

            {/* Also coming up (2nd+ upcoming appt) */}
            {upcoming.length > 1 && (
                <div className="bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 overflow-hidden">
                    <div className="px-6 py-5 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                <CalendarBlankIcon size={18} weight="bold" />
                            </span>
                            <h2 className="text-base font-bold text-black dark:text-white/90">
                                Also Coming Up
                            </h2>
                        </div>
                        <Link
                            to="/client/appointments"
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 focus: focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                        >
                            All appointments
                            <ArrowRightIcon size={13} weight="bold" />
                        </Link>
                    </div>

                    <ul className="divide-y divide-black/5 dark:divide-white/5">
                        {upcoming.slice(1).map((appt) => (
                            <li
                                key={appt.id}
                                className="px-6 py-4 flex items-center gap-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                            >
                                {/* Member avatar */}
                                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                                    {appt.memberName.split(" ").filter((_, i) => i < 2).map(w => w[0]).join("")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-black dark:text-white/90">{appt.memberName}</div>
                                    <div className="text-xs text-black/40 dark:text-white/90 truncate">{appt.purpose}</div>
                                </div>
                                <div className="text-right flex-shrink-0 hidden sm:block mr-3">
                                    <div className="text-xs font-semibold text-black dark:text-white/90">{formatDate(appt.date)}</div>
                                    <div className="text-[10px] text-black/40 dark:text-white/90">{appt.time}</div>
                                </div>
                                <span className={clsx(
                                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0",
                                    STATUS_STYLES[appt.status]
                                )}>
                                    {appt.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}



