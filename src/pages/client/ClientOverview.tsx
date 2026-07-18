import { Link } from "react-router-dom";
import {
    CalendarBlankIcon,
    HourglassIcon,
    ArrowRightIcon,
    ClockIcon,
    PlusIcon,
    SparkleIcon,
    CaretRightIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { LOGGED_IN_CLIENT } from "@/mock/clientMockData";
import { useClientAppointments } from "@/context/client-appointments-context";
import TitleComponent from "@/components/shared/TitleComponent";

const TODAY = "2026-07-15";

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

    const formatDate = (d: string) =>
        new Date(d + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });

    const getInitials = (name: string) =>
        name
            .split(" ")
            .filter((_, i) => i < 2)
            .map((word) => word[0])
            .join("");

    return (
        <div className="space-y-8">
            <div>
                <h2 className="heading-h2 text-black dark:text-white/90">Welcome back, {LOGGED_IN_CLIENT.name.split(" ")[0]}.</h2>
                <TitleComponent size="small" className="text-black/50 dark:text-white/90 md:text-base mt-1">Here is your appointment snapshot and quick actions.</TitleComponent>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl border border-black/10 bg-white p-5 shadow-shadow2-effect dark:shadow-shadow1 dark:border-white/5 dark:bg-tint-black/60"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className={clsx("p-2 rounded-lg", stat.color)}>
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

            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-shadow2-effect dark:shadow-shadow1 dark:border-white/5 dark:bg-tint-black/60">
                <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 dark:border-white/5">
                    <div className="flex items-center gap-2.5">
                        <span className="rounded-md bg-primary/10 p-1.5 text-primary">
                            <SparkleIcon size={18} weight="bold" />
                        </span>
                        <div>
                            <h6 className="heading-h6 text-black dark:text-white/90">Next Appointment</h6>
                            <TitleComponent size='extra-small' className="text-black/40 dark:text-white/90">
                                {nextAppt ? "Your upcoming session is ready to review." : "No sessions are scheduled yet."}
                            </TitleComponent>
                        </div>
                    </div>
                    <Link
                        to="/client/appointments"
                        className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                    >
                        All Appointments
                        <CaretRightIcon size={13} weight="bold" />
                    </Link>
                </div>

                {nextAppt ? (
                    <div className="p-6 sm:p-8">
                        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5 sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-base font-black text-primary">
                                        {getInitials(nextAppt.memberName)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-black dark:text-white/90">
                                            {nextAppt.memberName}
                                        </div>
                                        <div className="text-sm text-black/50 dark:text-white/90">
                                            {nextAppt.memberRole}
                                        </div>
                                    </div>
                                </div>
                                <span className={clsx(
                                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
                                    STATUS_STYLES[nextAppt.status]
                                )}>
                                    {nextAppt.status}
                                </span>
                            </div>

                            <div className="mt-6 grid gap-3 md:grid-cols-2">
                                <div className="rounded-2xl border border-black/10 bg-white/80 p-4 dark:border-white/10 dark:bg-tint-black/60">
                                    <div className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-black/45 dark:text-white/70">
                                        <CalendarBlankIcon size={11} weight="bold" />
                                        Date & Time
                                    </div>
                                    <div className="text-sm font-bold text-black dark:text-white/90">
                                        {formatDate(nextAppt.date)}
                                    </div>
                                    <div className="mt-1 flex items-center gap-1 text-xs text-black/50 dark:text-white/70">
                                        <ClockIcon size={11} />
                                        {nextAppt.time}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-black/10 bg-white/80 p-4 dark:border-white/10 dark:bg-tint-black/60">
                                    <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-black/45 dark:text-white/70">
                                        Purpose
                                    </div>
                                    <div className="text-sm font-bold text-black dark:text-white/90">
                                        {nextAppt.purpose}
                                    </div>
                                    {nextAppt.notes && (
                                        <div className="mt-1 text-xs leading-relaxed text-black/50 dark:text-white/70">
                                            {nextAppt.notes}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <Link
                                    to="/client/appointments"
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-primary-start to-primary-end px-5 py-2.5 text-sm font-bold text-white shadow-inset transition-all duration-300 hover:from-secondary-start hover:to-secondary-end"
                                >
                                    View all appointments
                                    <ArrowRightIcon size={14} weight="bold" />
                                </Link>
                                <Link
                                    to="/client/find"
                                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black/[0.02] dark:border-white/10 dark:bg-tint-black/60 dark:text-white/90"
                                >
                                    <PlusIcon size={14} weight="bold" />
                                    Book another
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-16 text-center">
                        <div className="mb-2 text-2xl">•</div>
                        <TitleComponent size="small-semibold" className="text-black/50 dark:text-white/90">No upcoming appointments.</TitleComponent>
                        <TitleComponent size="extra-small" className="mt-1 max-w-xs text-black/30 dark:text-white/90 mx-auto">Browse available members and book a session that works for you.</TitleComponent>
                        <Link
                            to="/client/find"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-primary-start to-primary-end px-6 py-3 text-sm font-bold text-white shadow-inset transition-all duration-300 hover:from-secondary-start hover:to-secondary-end"
                        >
                            <PlusIcon size={20} weight="bold" />
                            Book your first appointment
                        </Link>
                    </div>
                )}
            </div>

            {upcoming.length > 1 && (
                <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-shadow2-effect dark:shadow-shadow1 dark:border-white/5 dark:bg-tint-black/60">
                    <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 dark:border-white/5">
                        <div className="flex items-center gap-2.5">
                            <span className="rounded-lg bg-primary/10 p-1.5 text-primary">
                                <CalendarBlankIcon size={18} weight="bold" />
                            </span>
                            <h2 className="text-base font-bold text-black dark:text-white/90">Also Coming Up</h2>
                        </div>
                        <Link
                            to="/client/appointments"
                            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                            All Appointments
                            <CaretRightIcon size={13} weight="bold" />
                        </Link>
                    </div>

                    <ul className="divide-y divide-black/5 dark:divide-white/5">
                        {upcoming.slice(1).map((appt) => (
                            <li
                                key={appt.id}
                                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.01]"
                            >
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                                    {getInitials(appt.memberName)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-semibold text-black dark:text-white/90">
                                        {appt.memberName}
                                    </div>
                                    <div className="truncate text-xs text-black/40 dark:text-white/90">
                                        {appt.purpose}
                                    </div>
                                </div>
                                <div className="mr-3 hidden flex-shrink-0 text-right sm:block">
                                    <div className="text-xs font-semibold text-black dark:text-white/90">
                                        {formatDate(appt.date)}
                                    </div>
                                    <div className="text-[10px] text-black/40 dark:text-white/90">
                                        {appt.time}
                                    </div>
                                </div>
                                <span className={clsx(
                                    "inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
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


