import React, { useState } from "react";
import { INITIAL_APPOINTMENTS, INITIAL_MEMBERS, Appointment, Member } from "@/mock/adminMockData";
import {
    MagnifyingGlass as MagnifyingGlassIcon,
    Funnel as FunnelIcon,
    X as XIcon,
    CalendarBlank as CalendarBlankIcon,
    Clock as ClockIcon,
    User as UserIcon,
    Briefcase as BriefcaseIcon,
    CreditCard as CreditCardIcon,
    ChatCenteredText as ChatCenteredTextIcon,
    CheckCircle as CheckCircleIcon
} from "@phosphor-icons/react";
import clsx from "clsx";

export default function Appointments() {
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // Filters state
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [memberFilter, setMemberFilter] = useState<string>("all");
    const [paymentFilter, setPaymentFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<string>("");

    // Reset filters
    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setMemberFilter("all");
        setPaymentFilter("all");
        setDateFilter("");
    };

    // Filter Logic
    const filteredAppointments = appointments.filter((app) => {
        const matchesSearch =
            app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.memberName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || app.status === statusFilter;
        const matchesMember = memberFilter === "all" || app.memberId === memberFilter;
        const matchesPayment =
            paymentFilter === "all" ||
            (paymentFilter === "paid" && app.paid) ||
            (paymentFilter === "unpaid" && !app.paid);

        const matchesDate = !dateFilter || app.date === dateFilter;

        return matchesSearch && matchesStatus && matchesMember && matchesPayment && matchesDate;
    });

    const updateAppointment = (id: string, updates: Partial<Appointment>) => {
        const updatedList = appointments.map((app) => {
            if (app.id === id) {
                const nextApp = { ...app, ...updates };
                // Keep selected view synchronized
                if (selectedAppointment?.id === id) {
                    setSelectedAppointment(nextApp);
                }
                return nextApp;
            }
            return app;
        });
        setAppointments(updatedList);
    };

    const getStatusBadgeStyles = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
            case "pending":
                return "bg-amber/10 text-amber-600 dark:text-amber-400";
            case "completed":
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
            case "cancelled":
                return "bg-red-500/10 text-red-500";
            default:
                return "bg-slate/10 text-slate";
        }
    };

    const hasNoAppointmentsAtAll = appointments.length === 0;

    return (
        <div className="relative min-h-screen pb-16">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink dark:text-parchment">
                        Appointment Log
                    </h1>
                    <p className="text-sm text-black/50 dark:text-parchment/50 mt-1">
                        Track, approve, reassign, or cancel consult calls across company members.
                    </p>
                </div>

                {/* Filters Board */}
                <div className="bg-surface dark:bg-card-dark rounded-2xl border border-black/10 dark:border-white/5 p-5 shadow-card space-y-4">
                    {/* Top Row: Search & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-8 relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate dark:text-slate/60">
                                <MagnifyingGlassIcon size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search by client or advisor name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                            />
                        </div>

                        <div className="md:col-span-4 relative">
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                            />
                        </div>
                    </div>

                    {/* Bottom Row: Status, Member, Payment, Clear button */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                        {/* Status Filter */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-black/50 dark:text-parchment/40 font-semibold uppercase tracking-wider">Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-lg border border-black/10 dark:border-white/10 bg-parchment/50 dark:bg-ink/50 px-2.5 py-1.5 font-medium text-ink dark:text-parchment outline-none"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Member Filter */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-black/50 dark:text-parchment/40 font-semibold uppercase tracking-wider">Advisor:</span>
                            <select
                                value={memberFilter}
                                onChange={(e) => setMemberFilter(e.target.value)}
                                className="rounded-lg border border-black/10 dark:border-white/10 bg-parchment/50 dark:bg-ink/50 px-2.5 py-1.5 font-medium text-ink dark:text-parchment outline-none"
                            >
                                <option value="all">All Advisors</option>
                                {INITIAL_MEMBERS.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Payment Filter */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-black/50 dark:text-parchment/40 font-semibold uppercase tracking-wider">Payment:</span>
                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                                className="rounded-lg border border-black/10 dark:border-white/10 bg-parchment/50 dark:bg-ink/50 px-2.5 py-1.5 font-medium text-ink dark:text-parchment outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>

                        {/* Clear Trigger */}
                        {(searchQuery || statusFilter !== "all" || memberFilter !== "all" || paymentFilter !== "all" || dateFilter) && (
                            <button
                                onClick={clearFilters}
                                className="ml-auto inline-flex items-center gap-1 py-1 px-2.5 rounded-lg text-red-500 hover:bg-red-500/5 transition-colors font-semibold"
                            >
                                <XIcon size={14} weight="bold" />
                                <span>Reset Filters</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Block */}
                <div className="bg-surface dark:bg-card-dark rounded-3xl border border-black/10 dark:border-white/5 shadow-card overflow-hidden">
                    <div className="overflow-x-auto">
                        {hasNoAppointmentsAtAll ? (
                            <div className="p-16 text-center">
                                <div className="text-base font-bold text-black/50 dark:text-parchment/40">
                                    No appointments scheduled.
                                </div>
                                <p className="text-sm text-black/40 dark:text-parchment/30 mt-1 max-w-sm mx-auto">
                                    Once clients choose advisor hours, active consult reservations will populate here.
                                </p>
                            </div>
                        ) : filteredAppointments.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="text-base font-bold text-black/50 dark:text-parchment/40">
                                    No matching results found.
                                </div>
                                <p className="text-sm text-black/40 dark:text-parchment/30 mt-1 max-w-sm mx-auto">
                                    Try clearing your current search keywords or adjusting the dropdown filters.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] text-xs font-bold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                        <th className="px-6 py-4">Client</th>
                                        <th className="px-6 py-4">Advisor</th>
                                        <th className="px-6 py-4">Date & Time</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Payment</th>
                                        <th className="px-6 py-4 text-right">Fee</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                                    {filteredAppointments.map((app) => (
                                        <tr
                                            key={app.id}
                                            onClick={() => setSelectedAppointment(app)}
                                            className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                                        >
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
                                                <div className="font-semibold text-ink dark:text-parchment">
                                                    {app.date}
                                                </div>
                                                <div className="text-xs text-black/40 dark:text-parchment/40">
                                                    {app.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={clsx(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                                    getStatusBadgeStyles(app.status)
                                                )}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
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
                                            <td className="px-6 py-4 text-right font-bold text-ink dark:text-parchment">
                                                ${app.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Slide-over Side Drawer details view (Page 5) */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setSelectedAppointment(null)}
                    />

                    <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                        {/* Drawer card body */}
                        <div className="w-screen max-w-md bg-surface dark:bg-card-dark border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col justify-between transition-transform duration-300">
                            {/* Drawer Header */}
                            <div className="px-6 py-5 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-ink dark:text-parchment">
                                    Appointment Details
                                </h2>
                                <button
                                    onClick={() => setSelectedAppointment(null)}
                                    className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate"
                                    aria-label="Close details"
                                >
                                    <XIcon size={20} />
                                </button>
                            </div>

                            {/* Drawer scrollable content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                                {/* Details Card Row */}
                                <div className="space-y-4">
                                    {/* Client info */}
                                    <div className="flex items-start gap-3">
                                        <span className="p-2 rounded-xl bg-primary/10 text-primary mt-1">
                                            <UserIcon size={18} weight="bold" />
                                        </span>
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                                Client Info
                                            </div>
                                            <div className="font-bold text-ink dark:text-parchment mt-0.5">
                                                {selectedAppointment.clientName}
                                            </div>
                                            <div className="text-xs text-black/50 dark:text-parchment/40">
                                                {selectedAppointment.clientEmail}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Advisor info */}
                                    <div className="flex items-start gap-3">
                                        <span className="p-2 rounded-xl bg-primary/10 text-primary mt-1">
                                            <BriefcaseIcon size={18} weight="bold" />
                                        </span>
                                        <div className="flex-1">
                                            <div className="text-xs font-semibold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                                Assigned advisor
                                            </div>
                                            <div className="font-bold text-ink dark:text-parchment mt-0.5">
                                                {selectedAppointment.memberName}
                                            </div>
                                            {/* Reassign dropdown selector */}
                                            <div className="mt-2">
                                                <label className="block text-[10px] text-slate dark:text-slate/50 font-bold uppercase mb-1">Reassign Member:</label>
                                                <select
                                                    value={selectedAppointment.memberId}
                                                    onChange={(e) => {
                                                        const targetMember = INITIAL_MEMBERS.find(m => m.id === e.target.value);
                                                        if (targetMember) {
                                                            updateAppointment(selectedAppointment.id, {
                                                                memberId: targetMember.id,
                                                                memberName: targetMember.name,
                                                                memberEmail: targetMember.email
                                                            });
                                                        }
                                                    }}
                                                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 px-2 py-1.5 text-xs outline-none"
                                                >
                                                    {INITIAL_MEMBERS.map(m => (
                                                        <option key={m.id} value={m.id}>{m.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date and time */}
                                    <div className="flex items-start gap-3">
                                        <span className="p-2 rounded-xl bg-primary/10 text-primary mt-1">
                                            <CalendarBlankIcon size={18} weight="bold" />
                                        </span>
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                                Date & Time
                                            </div>
                                            <div className="font-bold text-ink dark:text-parchment mt-0.5">
                                                {selectedAppointment.date} at {selectedAppointment.time}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fee */}
                                    <div className="flex items-start gap-3">
                                        <span className="p-2 rounded-xl bg-primary/10 text-primary mt-1">
                                            <CreditCardIcon size={18} weight="bold" />
                                        </span>
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                                Consultation Fee
                                            </div>
                                            <div className="font-bold text-ink dark:text-parchment mt-0.5">
                                                ${selectedAppointment.amount}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-black/5 dark:border-white/5 pt-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black/40 dark:text-parchment/40 mb-2">
                                        <ChatCenteredTextIcon size={16} />
                                        <span>Consultation Notes</span>
                                    </div>
                                    <p className="text-xs text-black/70 dark:text-parchment/60 leading-relaxed bg-parchment/30 dark:bg-ink/30 p-3 rounded-xl border border-black/5 dark:border-white/5">
                                        {selectedAppointment.notes}
                                    </p>
                                </div>

                                {/* Status Config Panel */}
                                <div className="border-t border-black/5 dark:border-white/5 pt-4 space-y-3">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                        Update Status
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(["pending", "confirmed", "completed", "cancelled"] as const).map((st) => (
                                            <button
                                                key={st}
                                                type="button"
                                                onClick={() => updateAppointment(selectedAppointment.id, { status: st })}
                                                className={clsx(
                                                    "py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all text-center",
                                                    selectedAppointment.status === st
                                                        ? "bg-primary border-primary text-white shadow-sm"
                                                        : "border-black/10 dark:border-white/5 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-ink dark:text-parchment"
                                                )}
                                            >
                                                {st}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Footer Actions */}
                            <div className="p-6 border-t border-black/10 dark:border-white/5 bg-surface/50 dark:bg-card-dark/50 flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate dark:text-slate/50">Payment Status</div>
                                    <div className="mt-0.5">
                                        {selectedAppointment.paid ? (
                                            <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Paid</span>
                                        ) : (
                                            <span className="inline-flex px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider">Unpaid</span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => updateAppointment(selectedAppointment.id, { paid: !selectedAppointment.paid })}
                                    className={clsx(
                                        "px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5",
                                        selectedAppointment.paid
                                            ? "bg-red-500 text-white hover:bg-red-600"
                                            : "bg-emerald-500 text-white hover:bg-emerald-600"
                                    )}
                                >
                                    <CheckCircleIcon size={16} weight="bold" />
                                    <span>{selectedAppointment.paid ? "Mark Unpaid" : "Mark Paid"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
