// app/(member)/member/appointments/page.tsx
//
// My Appointments page for an Associated Member.
// Shows a filterable, tabbed list of all appointments (upcoming, past, cancelled)
// with client details, time, and status chips.
// All data is sourced from lib/data/ — Phase 1 mock only.

"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    WarningCircleIcon,
    ClockCountdownIcon,
    ArrowRightIcon,
    ChatCircleTextIcon,
} from "@phosphor-icons/react";
import { mockAppointments, mockClients } from "@/lib/data";
import type { Appointment, AppointmentStatus } from "@/types";

// TODO: replace with Supabase call in Phase 2 — fetch by authenticated member ID
const MEMBER_ID = "m1";

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
    AppointmentStatus,
    {
        label: string;
        color: "success" | "warning" | "error" | "default" | "info";
        Icon: React.ComponentType<{ size: number }>;
        chipBg: { dark: string; light: string };
        chipColor: { dark: string; light: string };
    }
> = {
    confirmed: {
        label: "Confirmed",
        color: "success",
        Icon: CheckCircleIcon,
        chipBg: { dark: "rgba(34,197,94,0.12)", light: "rgba(34,197,94,0.10)" },
        chipColor: { dark: "#4ade80", light: "#15803d" },
    },
    pending: {
        label: "Pending",
        color: "warning",
        Icon: ClockCountdownIcon,
        chipBg: { dark: "rgba(234,179,8,0.12)", light: "rgba(234,179,8,0.10)" },
        chipColor: { dark: "#facc15", light: "#a16207" },
    },
    completed: {
        label: "Completed",
        color: "default",
        Icon: CheckCircleIcon,
        chipBg: { dark: "rgba(148,163,184,0.10)", light: "rgba(100,116,139,0.08)" },
        chipColor: { dark: "#94a3b8", light: "#475569" },
    },
    cancelled: {
        label: "Cancelled",
        color: "error",
        Icon: XCircleIcon,
        chipBg: { dark: "rgba(239,68,68,0.12)", light: "rgba(239,68,68,0.08)" },
        chipColor: { dark: "#f87171", light: "#b91c1c" },
    },
    "no-show": {
        label: "No Show",
        color: "error",
        Icon: WarningCircleIcon,
        chipBg: { dark: "rgba(249,115,22,0.12)", light: "rgba(249,115,22,0.08)" },
        chipColor: { dark: "#fb923c", light: "#c2410c" },
    },
};

type TabValue = "upcoming" | "past" | "cancelled";

function classifyAppointment(appt: Appointment): TabValue {
    const now = new Date();
    const start = new Date(appt.startTime);
    if (appt.status === "cancelled" || appt.status === "no-show") return "cancelled";
    if (appt.status === "completed" || start < now) return "past";
    return "upcoming";
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatTimeRange(start: string, end: string): string {
    const fmt = (iso: string) =>
        new Date(iso).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    return `${fmt(start)} – ${fmt(end)}`;
}

function getClientInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// ── Sub-components ────────────────────────────────────────────────────────────
function EmptyState({ tab }: { tab: TabValue }) {
    const messages: Record<TabValue, string> = {
        upcoming: "No upcoming appointments. Share your profile link so clients can book sessions.",
        past: "No past appointments yet.",
        cancelled: "No cancelled or missed sessions.",
    };
    return (
        <div className="py-14 flex flex-col items-center gap-3 text-center">
            <CalendarIcon size={44} className="text-zinc-300 dark:text-zinc-600" />
            <Typography variant="body2" color="text.secondary" className="max-w-xs">
                {messages[tab]}
            </Typography>
        </div>
    );
}

interface AppointmentRowProps {
    appt: Appointment;
    isDark: boolean;
}

function AppointmentRow({ appt, isDark }: AppointmentRowProps) {
    const cfg = STATUS_CONFIG[appt.status];
    const StatusIcon = cfg.Icon;
    const client = mockClients.find((c) => c.id === appt.clientId);

    return (
        <div
            className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 group"
        >
            {/* Date/time block */}
            <div
                className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-0.5"
                style={{
                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                    border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "text.secondary",
                        textTransform: "uppercase",
                    }}
                >
                    {new Date(appt.startTime).toLocaleDateString("en-US", { month: "short" })}
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", lineHeight: 1 }}>
                    {new Date(appt.startTime).getDate()}
                </Typography>
                <Typography sx={{ fontSize: "0.6rem", color: "text.secondary", fontWeight: 600 }}>
                    {new Date(appt.startTime).toLocaleDateString("en-US", { weekday: "short" })}
                </Typography>
            </div>

            {/* Client info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar
                    src={client?.avatarUrl || ""}
                    alt={client?.name || "Client"}
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: isDark ? "rgba(99,102,241,0.2)" : "rgba(29,78,216,0.12)",
                        color: "primary.main",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                    }}
                >
                    {client ? getClientInitials(client.name) : <UserIcon size={18} />}
                </Avatar>
                <div className="min-w-0">
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {client?.name ?? "Unknown Client"}
                    </Typography>
                    <div className="flex items-center gap-1 mt-0.5">
                        <ClockIcon size={11} className="text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {formatTimeRange(appt.startTime, appt.endTime)}
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Date (desktop) */}
            <div className="hidden sm:flex items-center gap-1.5 min-w-0">
                <CalendarIcon size={13} className="text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                <Typography variant="caption" color="text.secondary" noWrap>
                    {formatDate(appt.startTime)}
                </Typography>
            </div>

            {/* Notes indicator */}
            {appt.notes && (
                <Tooltip title={appt.notes} arrow placement="top">
                    <div className="hidden sm:flex items-center gap-1 cursor-default">
                        <ChatCircleTextIcon size={15} className="text-zinc-400 dark:text-zinc-500" />
                        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 120 }} noWrap>
                            {appt.notes}
                        </Typography>
                    </div>
                </Tooltip>
            )}

            {/* Status chip */}
            <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                <Chip
                    icon={<StatusIcon size={12} />}
                    label={cfg.label}
                    size="small"
                    sx={{
                        fontWeight: 700,
                        fontSize: "0.68rem",
                        height: 24,
                        bgcolor: isDark ? cfg.chipBg.dark : cfg.chipBg.light,
                        color: isDark ? cfg.chipColor.dark : cfg.chipColor.light,
                        border: "none",
                        "& .MuiChip-icon": {
                            color: "inherit",
                            marginLeft: "6px",
                        },
                    }}
                />
                <ArrowRightIcon
                    size={16}
                    className="text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hidden sm:block"
                />
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";
    const [activeTab, setActiveTab] = React.useState<TabValue>("upcoming");

    const memberAppointments = mockAppointments
        .filter((a) => a.memberId === MEMBER_ID)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    const grouped = {
        upcoming: memberAppointments
            .filter((a) => classifyAppointment(a) === "upcoming")
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
        past: memberAppointments.filter((a) => classifyAppointment(a) === "past"),
        cancelled: memberAppointments.filter((a) => classifyAppointment(a) === "cancelled"),
    };

    const counts = {
        upcoming: grouped.upcoming.length,
        past: grouped.past.length,
        cancelled: grouped.cancelled.length,
    };

    // Summary stats
    const allAppts = memberAppointments;
    const confirmedCount = allAppts.filter((a) => a.status === "confirmed").length;
    const completedCount = allAppts.filter((a) => a.status === "completed").length;
    const pendingCount = allAppts.filter((a) => a.status === "pending").length;
    const cancelledCount = allAppts.filter((a) => a.status === "cancelled" || a.status === "no-show").length;

    const stats = [
        { label: "Confirmed", value: confirmedCount, Icon: CheckCircleIcon, color: "text-emerald-500" },
        { label: "Pending", value: pendingCount, Icon: ClockCountdownIcon, color: "text-amber-500" },
        { label: "Completed", value: completedCount, Icon: CheckCircleIcon, color: "text-blue-400" },
        { label: "Cancelled", value: cancelledCount, Icon: XCircleIcon, color: "text-red-400" },
    ];

    return (
        <Box className="flex flex-col gap-6">
            {/* Page header */}
            <div>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
                    My Appointments
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track your upcoming sessions, review past consultations, and monitor cancellations.
                </Typography>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map(({ label, value, Icon, color }) => (
                    <Card
                        key={label}
                        elevation={0}
                        variant="outlined"
                        sx={{
                            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                            bgcolor: isDark ? "#161616" : "#ffffff",
                            borderRadius: 3,
                        }}
                    >
                        <CardContent className="p-4 flex flex-col gap-2">
                            <div className={color}>
                                <Icon size={20} />
                            </div>
                            <Typography sx={{ fontWeight: 800, fontSize: "1.75rem", lineHeight: 1 }}>
                                {value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" className="uppercase tracking-wider font-semibold">
                                {label}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Appointments table card */}
            <Card
                elevation={0}
                variant="outlined"
                sx={{
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                    bgcolor: isDark ? "#161616" : "#ffffff",
                    borderRadius: 3,
                }}
            >
                {/* Tabs */}
                <div
                    className="px-6 pt-4 border-b"
                    style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
                >
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v as TabValue)}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                            minHeight: 40,
                            "& .MuiTab-root": {
                                minHeight: 40,
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                textTransform: "none",
                                padding: "0 4px",
                                mr: 2,
                            },
                        }}
                    >
                        <Tab
                            value="upcoming"
                            label={
                                <span className="flex items-center gap-1.5">
                                    Upcoming
                                    {counts.upcoming > 0 && (
                                        <span
                                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                            style={{
                                                background: isDark ? "rgba(29,78,216,0.2)" : "rgba(29,78,216,0.1)",
                                                color: isDark ? "#93c5fd" : "#1d4ed8",
                                            }}
                                        >
                                            {counts.upcoming}
                                        </span>
                                    )}
                                </span>
                            }
                        />
                        <Tab
                            value="past"
                            label={
                                <span className="flex items-center gap-1.5">
                                    Past
                                    {counts.past > 0 && (
                                        <span
                                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                            style={{
                                                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                                                color: "inherit",
                                            }}
                                        >
                                            {counts.past}
                                        </span>
                                    )}
                                </span>
                            }
                        />
                        <Tab
                            value="cancelled"
                            label={
                                <span className="flex items-center gap-1.5">
                                    Cancelled
                                    {counts.cancelled > 0 && (
                                        <span
                                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                            style={{
                                                background: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.08)",
                                                color: isDark ? "#f87171" : "#b91c1c",
                                            }}
                                        >
                                            {counts.cancelled}
                                        </span>
                                    )}
                                </span>
                            }
                        />
                    </Tabs>
                </div>

                {/* Content */}
                <CardContent className="px-6 py-0">
                    {grouped[activeTab].length === 0 ? (
                        <EmptyState tab={activeTab} />
                    ) : (
                        <div className="divide-y"
                            style={{
                                "--tw-divide-opacity": "1",
                            } as React.CSSProperties}
                        >
                            {grouped[activeTab].map((appt, idx) => (
                                <React.Fragment key={appt.id}>
                                    <AppointmentRow appt={appt} isDark={isDark} />
                                    {idx < grouped[activeTab].length - 1 && (
                                        <Divider
                                            sx={{
                                                borderColor: isDark
                                                    ? "rgba(255,255,255,0.05)"
                                                    : "rgba(0,0,0,0.05)",
                                                mx: -3,
                                            }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </CardContent>

                {/* Footer */}
                {grouped[activeTab].length > 0 && (
                    <div
                        className="px-6 py-3 border-t"
                        style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
                    >
                        <Typography variant="caption" color="text.disabled">
                            Showing {grouped[activeTab].length} {activeTab} appointment{grouped[activeTab].length !== 1 ? "s" : ""}
                            &nbsp;·&nbsp; Pagination and search coming in Phase 2
                        </Typography>
                    </div>
                )}
            </Card>
        </Box>
    );
}
