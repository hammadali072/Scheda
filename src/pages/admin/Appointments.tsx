import { useState } from "react";
import { INITIAL_APPOINTMENTS, INITIAL_MEMBERS } from "@/mock/adminMockData";
import type { Appointment } from "@/mock/adminMockData";
import {
    MagnifyingGlassIcon,
    XIcon,
    CalendarBlankIcon,
    UserIcon,
    BriefcaseIcon,
    ChatCenteredTextIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import TitleComponent from "@/components/shared/TitleComponent";

export default function Appointments() {
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [memberFilter, setMemberFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<string>("");

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setMemberFilter("all");
        setDateFilter("");
    };

    const filteredAppointments = appointments.filter((app) => {
        const matchesSearch =
            app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.memberName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || app.status === statusFilter;
        const matchesMember = memberFilter === "all" || app.memberId === memberFilter;

        const matchesDate = !dateFilter || app.date === dateFilter;

        return matchesSearch && matchesStatus && matchesMember && matchesDate;
    });

    const updateAppointment = (id: string, updates: Partial<Appointment>) => {
        const updatedList = appointments.map((app) => {
            if (app.id === id) {
                const nextApp = { ...app, ...updates };
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
                <div>
                    <h2 className="heading-h2 font-extrabold tracking-tight text-black dark:text-white/90">Appointment Log</h2>
                    <TitleComponent className="text-sm text-black/50 dark:text-white/90 md:text-base mt-1">Track, approve, reassign, or cancel consult calls across company members.</TitleComponent>
                </div>

                <div className="bg-white dark:bg-tint-black/60 rounded-2xl border border-black/10 dark:border-white/5 p-5 shadow-shadow2-effect dark:shadow-shadow1 space-y-4">
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
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-transparent dark:bg-tint-black/30 text-base transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                            />
                        </div>

                        <div className="md:col-span-4 relative">
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-transparent dark:bg-tint-black/30 text-base transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                            <span className="text-black/50 dark:text-white/90 font-semibold uppercase tracking-wider">Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-lg border border-black/10 dark:border-white/10 bg-transparent dark:bg-tint-black/30 px-2.5 py-1.5 font-medium text-black dark:text-white/90"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="text-black/50 dark:text-white/90 font-semibold uppercase tracking-wider">Advisor:</span>
                            <select
                                value={memberFilter}
                                onChange={(e) => setMemberFilter(e.target.value)}
                                className="rounded-lg border border-black/10 dark:border-white/10 bg-transparent dark:bg-tint-black/30 px-2.5 py-1.5 font-medium text-black dark:text-white/90"
                            >
                                <option value="all">All Advisors</option>
                                {INITIAL_MEMBERS.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {(searchQuery || statusFilter !== "all" || memberFilter !== "all" || dateFilter) && (
                            <button
                                onClick={clearFilters}
                                className="ml-auto inline-flex items-center gap-1 rounded-full border border-red-500/10 bg-red-500/5 px-2.5 py-1.5 text-red-500 transition-colors hover:bg-red-500/10 font-semibold"
                            >
                                <XIcon size={14} weight="bold" />
                                <span>Reset Filters</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 overflow-hidden">
                    <div className="overflow-x-auto">
                        {hasNoAppointmentsAtAll ? (
                            <div className="p-16 text-center">
                                <div className="text-base font-bold text-black/50 dark:text-white/90">
                                    No appointments scheduled.
                                </div>
                                <TitleComponent size='small' className="text-black/40 dark:text-white/90 mt-1">Once clients choose advisor hours, active consult reservations will populate here.</TitleComponent>
                            </div>
                        ) : filteredAppointments.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="text-base font-bold text-black/50 dark:text-white/90">
                                    No matching results found.
                                </div>
                                <TitleComponent size='small' className="text-black/40 dark:text-white/90 mt-1">Try clearing your current search keywords or adjusting the dropdown filters.</TitleComponent>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/90">
                                        <th className="px-6 py-4">Client</th>
                                        <th className="px-6 py-4">Advisor</th>
                                        <th className="px-6 py-4">Date & Time</th>
                                        <th className="px-6 py-4">Status</th>
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
                                                <div className="font-semibold text-black dark:text-white/90">
                                                    {app.date}
                                                </div>
                                                <div className="text-xs text-black/40 dark:text-white/90">
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={() => setSelectedAppointment(null)}
                    />

                    <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-shadow2-effect dark:shadow-shadow1 dark:border-white/5 dark:bg-tint-black">
                        <div className="flex items-start justify-between border-b border-black/10 bg-black/[0.02] px-6 py-5 dark:border-white/5 dark:bg-white/[0.02]">
                            <div>
                                <h2 className="text-lg font-bold text-black dark:text-white/90">
                                    Appointment Details
                                </h2>
                                <TitleComponent size='small' className="mt-1 text-black/50 dark:text-white/90">Review the consultation details and update its progress cleanly.</TitleComponent>
                            </div>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="rounded-full p-2 text-slate transition hover:bg-black/5 dark:hover:bg-white/5"
                                aria-label="Close details"
                            >
                                <XIcon size={20} />
                            </button>
                        </div>

                        <div className="max-h-[75vh] overflow-y-auto p-6 text-sm">
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 space-y-4 rounded-2xl border border-black/10 p-4 dark:border-white/5 dark:bg-black/30">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                                            <UserIcon size={18} weight="bold" />
                                        </span>
                                        <div className="">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/90">Client Info</span>
                                            <div className="mt-0.5 font-bold text-black dark:text-white/90">
                                                {selectedAppointment.clientName}
                                            </div>
                                            <TitleComponent size="extra-small" className="text-black/50 dark:text-white/90">
                                                {selectedAppointment.clientEmail}
                                            </TitleComponent>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <span className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                                            <BriefcaseIcon size={18} weight="bold" />
                                        </span>
                                        <div className="flex-1">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/90">Assigned Advisor</span>
                                            <TitleComponent size='small-bold' className="mt-0.5 font-bold text-black dark:text-white/90">{selectedAppointment.memberName}</TitleComponent>
                                            <div className="mt-2">
                                                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate dark:text-slate/50">
                                                    Reassign Member
                                                </label>
                                                <select
                                                    value={selectedAppointment.memberId}
                                                    onChange={(e) => {
                                                        const targetMember = INITIAL_MEMBERS.find((m) => m.id === e.target.value);
                                                        if (targetMember) {
                                                            updateAppointment(selectedAppointment.id, {
                                                                memberId: targetMember.id,
                                                                memberName: targetMember.name,
                                                                memberEmail: targetMember.email
                                                            });
                                                        }
                                                    }}
                                                    className="w-full rounded-lg border border-black/10 bg-transparent px-2 py-1.5 text-xs dark:border-white/10 dark:bg-tint-black/30"
                                                >
                                                    {INITIAL_MEMBERS.map((m) => (
                                                        <option key={m.id} value={m.id}>{m.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-black/10 bg-white/80 p-4 dark:border-white/5 dark:bg-black/30">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                                            <CalendarBlankIcon size={18} weight="bold" />
                                        </span>
                                        <div>
                                            <div className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/90">
                                                Date & Time
                                            </div>
                                            <div className="mt-0.5 font-bold text-black dark:text-white/90">
                                                {selectedAppointment.date} at {selectedAppointment.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 rounded-2xl border border-black/10 bg-parchment/20 p-4 dark:border-white/5 dark:bg-black/30">
                                <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/90">
                                    <ChatCenteredTextIcon size={16} />
                                    <span>Consultation Notes</span>
                                </div>
                                <p className="leading-relaxed text-black/70 dark:text-white/90">
                                    {selectedAppointment.notes}
                                </p>
                            </div>

                            <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                                <div className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/90">
                                    Update Status
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    {(["pending", "confirmed", "completed", "cancelled"] as const).map((st) => (
                                        <button
                                            key={st}
                                            type="button"
                                            onClick={() => updateAppointment(selectedAppointment.id, { status: st })}
                                            className={clsx(
                                                "rounded-full border px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider transition-all",
                                                selectedAppointment.status === st
                                                    ? "border-primary bg-gradient-to-b from-primary-start to-primary-end text-white shadow-inset"
                                                    : "border-black/10 bg-transparent text-black hover:bg-black/5 dark:border-white/5 dark:text-white/90 dark:hover:bg-white/5"
                                            )}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end border-t border-black/10 bg-black/[0.02] px-6 py-4 dark:border-white/5 dark:bg-white/[0.02]">
                            <button
                                onClick={() => setSelectedAppointment(null)}
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
