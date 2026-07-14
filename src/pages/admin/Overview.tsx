import React from "react";
import { Link } from "react-router-dom";
import { INITIAL_APPOINTMENTS, INITIAL_MEMBERS, INITIAL_CLIENTS } from "@/mock/adminMockData";
import {
    Calendar as CalendarIcon,
    Hourglass as HourglassIcon,
    CreditCard as CreditCardIcon,
    Users as UsersIcon,
    ArrowRight as ArrowRightIcon,
    Clock as ClockIcon
} from "@phosphor-icons/react";

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
            label: "Unpaid Appointments",
            value: INITIAL_APPOINTMENTS.filter((a) => !a.paid).length,
            icon: CreditCardIcon,
            color: "text-red-500 bg-red-500/10",
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
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-ink dark:text-parchment">
                    Operations Overview
                </h1>
                <p className="text-sm text-black/50 dark:text-parchment/50 mt-1">
                    Live platform operations, scheduling rates, and active advisory records.
                </p>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-surface dark:bg-card-dark p-6 rounded-2xl border border-black/10 dark:border-white/5 shadow-card"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-ink dark:text-parchment">
                                {stat.value}
                            </span>
                            <span className={`p-2 rounded-xl ${stat.color}`}>
                                <stat.icon size={20} weight="bold" />
                            </span>
                        </div>
                        <div className="text-xs font-semibold text-black/50 dark:text-parchment/40 mt-3 leading-tight">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Area: Today's appointments schedule list */}
            <div className="bg-surface dark:bg-card-dark rounded-3xl border border-black/10 dark:border-white/5 shadow-card overflow-hidden">
                <div className="p-6 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <ClockIcon size={18} weight="bold" />
                        </span>
                        <h2 className="text-lg font-bold text-ink dark:text-parchment">
                            Today's Schedule
                        </h2>
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
                            <div className="text-sm font-semibold text-black/40 dark:text-parchment/40">
                                No appointments today.
                            </div>
                            <p className="text-xs text-black/30 dark:text-parchment/30 mt-1">
                                Check other dates or view all appointments on the log page.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] text-xs font-bold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Advisory Member</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                                {todayAppointments.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                                    >
                                        <td className="px-6 py-4 font-bold text-ink dark:text-parchment">
                                            {app.time}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-ink dark:text-parchment">
                                                {app.clientName}
                                            </div>
                                            <div className="text-xs text-black/40 dark:text-parchment/40">
                                                {app.clientEmail}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-ink dark:text-parchment">
                                            {app.memberName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyles(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {app.paid ? (
                                                <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-xs font-semibold">
                                                    Unpaid
                                                </span>
                                            )}
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
