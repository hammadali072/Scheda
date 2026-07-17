import { Link } from "react-router-dom";
import {
    CalendarBlankIcon,
    HourglassIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    ClockIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { MEMBER_APPOINTMENTS, LOGGED_IN_MEMBER } from "@/mock/memberMockData";

const TODAY = "2026-07-14"; // mock "today"

const STATUS_STYLES: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    cancelled: "bg-red-500/10 text-red-500",
};

export default function MemberOverview() {
    const todayAppts = MEMBER_APPOINTMENTS.filter((a) => a.date === TODAY).sort((a, b) =>
        a.time.localeCompare(b.time)
    );

    const weekAppts = MEMBER_APPOINTMENTS.filter((a) => {
        const d = new Date(a.date);
        const today = new Date(TODAY);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return d >= startOfWeek && d <= endOfWeek;
    });

    const stats = [
        {
            label: "Today's Sessions",
            value: todayAppts.length,
            icon: CalendarBlankIcon,
            color: "text-primary bg-primary/10",
        },
        {
            label: "This Week",
            value: weekAppts.length,
            icon: CheckCircleIcon,
            color: "text-blue-500 bg-blue-500/10",
        },
        {
            label: "Pending Confirmation",
            value: MEMBER_APPOINTMENTS.filter((a) => a.status === "pending").length,
            icon: HourglassIcon,
            color: "text-amber-500 bg-amber-500/10",
        },
        {
            label: "Confirmed Sessions",
            value: MEMBER_APPOINTMENTS.filter((a) => a.status === "confirmed").length,
            icon: CheckCircleIcon,
            color: "text-emerald-500 bg-emerald-500/10",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                    Member Portal
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white/90">
                    Good morning, {LOGGED_IN_MEMBER.name.split(" ")[1]}.
                </h1>
                <p className="text-sm text-black/50 dark:text-white/90 mt-1">
                    Here's your session snapshot and today's schedule.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Today's Schedule */}
            <div className="bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 overflow-hidden">
                <div className="px-6 py-5 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <ClockIcon size={18} weight="bold" />
                        </span>
                        <h2 className="text-base font-bold text-black dark:text-white/90">
                            Today's Schedule
                        </h2>
                        <span className="text-xs text-black/40 dark:text-white/90 font-medium">
                            {TODAY}
                        </span>
                    </div>
                    <Link
                        to="/member/appointments"
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                        All appointments
                        <ArrowRightIcon size={13} weight="bold" />
                    </Link>
                </div>

                {todayAppts.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="text-2xl mb-2">•</div>
                        <p className="text-sm font-semibold text-black/50 dark:text-white/90">
                            Nothing on your schedule today.
                        </p>
                        <p className="text-xs text-black/30 dark:text-white/90 mt-1 max-w-xs mx-auto">
                            Enjoy the downtime - or check upcoming appointments for the rest of the week.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-black/5 dark:divide-white/5">
                        {todayAppts.map((appt) => (
                            <li
                                key={appt.id}
                                className="px-6 py-4 flex items-center gap-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                            >
                                {/* Time column */}
                                <div className="w-24 flex-shrink-0">
                                    <span className="text-sm font-bold text-black dark:text-white/90">
                                        {appt.time}
                                    </span>
                                </div>

                                {/* Client info */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-black dark:text-white/90">
                                        {appt.clientName}
                                    </div>
                                    <div className="text-xs text-black/40 dark:text-white/90 truncate">
                                        {appt.clientEmail}
                                    </div>
                                </div>

                                {/* Status badge */}
                                <span
                                    className={clsx(
                                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0",
                                        STATUS_STYLES[appt.status]
                                    )}
                                >
                                    {appt.status}
                                </span>

                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}


