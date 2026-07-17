
import { Link } from "react-router-dom";
import { INITIAL_APPOINTMENTS, INITIAL_MEMBERS, INITIAL_CLIENTS } from "@/mock/adminMockData";
import {
    CalendarIcon,
    HourglassIcon,
    CheckCircleIcon,
    UsersIcon,
    ArrowRightIcon,
    ClockIcon
} from "@phosphor-icons/react";
import TitleComponent from "@/components/shared/TitleComponent";

export default function Overview() {
    // Current simulated date is 2026-07-14
    const todayStr = "2026-07-14";

    const todayAppointments = INITIAL_APPOINTMENTS.filter(
        (app) => app.date === todayStr
    );

    const stats = [
        {
            label: "Appointments This Week",
            value: INITIAL_APPOINTMENTS.length,
            icon: CalendarIcon,
            color: "text-primary bg-primary/10",
        },
        {
            label: "Pending Approvals",
            value: INITIAL_APPOINTMENTS.filter((a) => a.status === "pending").length,
            icon: HourglassIcon,
            color: "text-amber bg-amber/10",
        },
        {
            label: "Confirmed Sessions",
            value: INITIAL_APPOINTMENTS.filter((a) => a.status === "confirmed").length,
            icon: CheckCircleIcon,
            color: "text-emerald-500 bg-emerald-500/10",
        },
        {
            label: "Active Team Members",
            value: INITIAL_MEMBERS.filter((m) => m.status === "active").length,
            icon: UsersIcon,
            color: "text-emerald-500 bg-emerald-500/10",
        },
        {
            label: "Active Clients",
            value: INITIAL_CLIENTS.length,
            icon: UsersIcon,
            color: "text-blue-500 bg-blue-500/10",
        },
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
            case "pending":
                return "bg-amber/10 text-amber-600 dark:text-amber-400";
            case "completed":
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
            default:
                return "bg-slate/10 text-slate";
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="heading-h2 text-black dark:text-white/90">Operations Overview</h2>
                <TitleComponent size="small" className="text-black/50 dark:text-white/90 md:text-base mt-1">Live platform operations, scheduling rates, and active advisory records.</TitleComponent>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl border border-black/10 bg-white p-6 shadow-shadow2-effect dark:shadow-shadow1 dark:border-white/5 dark:bg-tint-black/60"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-black dark:text-white/90">{stat.value}</span>
                            <span className={`p-2 rounded-lg ${stat.color}`}>
                                <stat.icon size={22} weight="regular" />
                            </span>
                        </div>
                        <TitleComponent size='extra-small-semibold' className="text-black/50 dark:text-white/90 mt-3 leading-tight">{stat.label}</TitleComponent>
                    </div>
                ))}
            </div>

            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-shadow2-effect dark:shadow-shadow1 dark:border-white/5 dark:bg-tint-black/60">
                <div className="p-6 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <ClockIcon size={18} weight="bold" />
                        </span>
                        <h6 className="heading-h6 text-black dark:text-white/90">Today's Schedule</h6>
                    </div>
                    <Link
                        to="/admin/appointments"
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                        <span>View All Log</span>
                        <ArrowRightIcon size={14} weight="bold" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    {todayAppointments.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-sm font-semibold text-black/40 dark:text-white/90">
                                No appointments today.
                            </div>
                            <TitleComponent size='extra-small' className="text-black/30 dark:text-white/90 mt-1">Check other dates or view all appointments on the log page.</TitleComponent>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/90">
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Advisory Member</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                                {todayAppointments.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                                    >
                                        <td className="px-6 py-4 font-bold text-black dark:text-white/90">
                                            {app.time}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-black dark:text-white/90">
                                                {app.clientName}
                                            </div>
                                            <div className="text-xs text-black/40 dark:text-white/90">
                                                {app.clientEmail}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-black dark:text-white/90">
                                            {app.memberName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyles(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

