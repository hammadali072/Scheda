// app/(admin)/admin/appointments/page.tsx
//
// Admin — Organization-wide Appointments page.
// Table view + calendar/week view of all appointments across all members.
// Filters by member, designation, status, and date range.
// Admin cancel action with confirmation dialog.
// All mutations operate on local React state only.

"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
    CalendarIcon,
    ListIcon,
    XCircleIcon,
    WarningIcon,
    CheckCircleIcon,
    ClockCountdownIcon,
    UserIcon,
    FunnelIcon,
} from "@phosphor-icons/react";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/admin/status-badge";
import SearchFilterBar from "@/components/admin/search-filter-bar";
import AdminDataTable, { AdminTableRow, AdminTableCell } from "@/components/admin/admin-data-table";
import { mockAppointments, mockMembers, mockClients, mockDesignations } from "@/lib/data";
import type { Appointment, AppointmentStatus } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
}
function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
        hour: "numeric", minute: "2-digit",
    });
}
function formatTimeRange(start: string, end: string) {
    return `${formatTime(start)} – ${formatTime(end)}`;
}
function isoDateOnly(iso: string) {
    return new Date(iso).toISOString().split("T")[0];
}

// ── Stats summary ─────────────────────────────────────────────────────────────
const STATUS_ICON: Record<AppointmentStatus, React.ReactNode> = {
    confirmed: <CheckCircleIcon size={18} />,
    pending: <ClockCountdownIcon size={18} />,
    completed: <CheckCircleIcon size={18} />,
    cancelled: <XCircleIcon size={18} />,
    "no-show": <WarningIcon size={18} />,
};

// ── Table columns ─────────────────────────────────────────────────────────────
const COLUMNS = [
    { key: "client", label: "Client" },
    { key: "member", label: "Member / Specialty" },
    { key: "datetime", label: "Date & Time", width: 200 },
    { key: "status", label: "Status", width: 120 },
    { key: "actions", label: "Actions", align: "right" as const, width: 80 },
];

// ── Day names for calendar view ───────────────────────────────────────────────
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Calendar grid view ────────────────────────────────────────────────────────
interface CalendarViewProps {
    appointments: Appointment[];
    isDark: boolean;
    onCancel: (appt: Appointment) => void;
}

function CalendarView({ appointments, isDark, onCancel }: CalendarViewProps) {
    const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

    // Get 7-day window around today (using mock data start point)
    const refDate = new Date("2026-07-08T00:00:00Z");
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(refDate);
        d.setDate(refDate.getDate() + i);
        days.push(d.toISOString().split("T")[0]);
    }

    const apptsByDay = (dateStr: string) =>
        appointments.filter((a) => isoDateOnly(a.startTime) === dateStr);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
            {days.map((dateStr) => {
                const dateObj = new Date(dateStr + "T12:00:00Z");
                const dayAppts = apptsByDay(dateStr);
                const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                return (
                    <div key={dateStr} className="flex flex-col gap-2">
                        {/* Day header */}
                        <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0.5 mb-1">
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "0.65rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: isWeekend ? "text.disabled" : "text.secondary",
                                }}
                            >
                                {DAY_LABELS[dateObj.getDay()]}
                            </Typography>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: "1.1rem",
                                    lineHeight: 1,
                                    color: isWeekend ? "text.disabled" : "text.primary",
                                }}
                            >
                                {dateObj.getDate()}
                            </Typography>
                        </div>

                        {/* Appointment blocks */}
                        <div className="flex flex-col gap-1.5 min-h-[80px]">
                            {dayAppts.length === 0 ? (
                                <div
                                    className="flex-1 rounded-lg"
                                    style={{
                                        minHeight: 40,
                                        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                                        border: `1px dashed ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                                    }}
                                />
                            ) : (
                                dayAppts.map((appt) => {
                                    const client = mockClients.find((c) => c.id === appt.clientId);
                                    const member = mockMembers.find((m) => m.id === appt.memberId);
                                    const isCancelled = appt.status === "cancelled";

                                    let bgColor: string;
                                    if (isCancelled) {
                                        bgColor = isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.06)";
                                    } else if (appt.status === "completed") {
                                        bgColor = isDark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.06)";
                                    } else if (appt.status === "pending") {
                                        bgColor = isDark ? "rgba(245,158,11,0.10)" : "rgba(245,158,11,0.08)";
                                    } else {
                                        bgColor = isDark ? "rgba(29,78,216,0.12)" : "rgba(29,78,216,0.08)";
                                    }

                                    return (
                                        <div
                                            key={appt.id}
                                            className="rounded-lg px-2 py-1.5 group relative"
                                            style={{
                                                background: bgColor,
                                                border: `1px solid ${cardBorder}`,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: "0.6rem",
                                                    fontWeight: 700,
                                                    color: "text.secondary",
                                                    lineHeight: 1.2,
                                                }}
                                                noWrap
                                            >
                                                {formatTime(appt.startTime)}
                                            </Typography>
                                            <Typography
                                                sx={{ fontSize: "0.68rem", fontWeight: 600, lineHeight: 1.3 }}
                                                noWrap
                                            >
                                                {client?.name ?? "—"}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ fontSize: "0.58rem" }}
                                                noWrap
                                            >
                                                {member?.name ?? "—"}
                                            </Typography>
                                            {/* Cancel hover button */}
                                            {!isCancelled && (
                                                <Tooltip title="Cancel appointment" arrow placement="top">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onCancel(appt)}
                                                        className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        sx={{
                                                            width: 18, height: 18, p: 0,
                                                            color: "error.main",
                                                            bgcolor: isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)",
                                                        }}
                                                    >
                                                        <XCircleIcon size={13} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminAppointmentsPage() {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";
    const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const cardBg = isDark ? "#161616" : "#ffffff";

    // Local state
    const [appointments, setAppointments] = React.useState<Appointment[]>(mockAppointments);
    const [viewMode, setViewMode] = React.useState<"table" | "calendar">("table");

    // Filters
    const [searchQuery, setSearchQuery] = React.useState("");
    const [filterMember, setFilterMember] = React.useState("all");
    const [filterDesignation, setFilterDesignation] = React.useState("all");
    const [filterStatus, setFilterStatus] = React.useState("all");
    const [filterDateFrom, setFilterDateFrom] = React.useState("");
    const [filterDateTo, setFilterDateTo] = React.useState("");

    // Cancel confirm dialog
    const [cancelTarget, setCancelTarget] = React.useState<Appointment | null>(null);

    // ── Derived filtered list ─────────────────────────────────────────────────
    const filtered = appointments.filter((appt) => {
        const client = mockClients.find((c) => c.id === appt.clientId);
        const member = mockMembers.find((m) => m.id === appt.memberId);

        const matchSearch =
            !searchQuery ||
            client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member?.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchMember = filterMember === "all" || appt.memberId === filterMember;

        const matchDesig =
            filterDesignation === "all" ||
            member?.designationId === filterDesignation;

        const matchStatus = filterStatus === "all" || appt.status === filterStatus;

        const apptDate = isoDateOnly(appt.startTime);
        const matchFrom = !filterDateFrom || apptDate >= filterDateFrom;
        const matchTo = !filterDateTo || apptDate <= filterDateTo;

        return matchSearch && matchMember && matchDesig && matchStatus && matchFrom && matchTo;
    });

    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = [
        { label: "Total", value: appointments.length, color: "text-blue-500" },
        { label: "Confirmed", value: appointments.filter((a) => a.status === "confirmed").length, color: "text-emerald-500" },
        { label: "Pending", value: appointments.filter((a) => a.status === "pending").length, color: "text-amber-500" },
        { label: "Cancelled", value: appointments.filter((a) => a.status === "cancelled").length, color: "text-red-400" },
    ];

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleConfirmCancel = () => {
        if (!cancelTarget) return;
        // TODO: replace with Supabase call in Phase 2
        setAppointments((prev) =>
            prev.map((a) =>
                a.id === cancelTarget.id ? { ...a, status: "cancelled" as AppointmentStatus } : a
            )
        );
        setCancelTarget(null);
    };

    return (
        <Box className="flex flex-col gap-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
                        Appointments
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Monitor and manage all scheduled sessions across your organization.
                    </Typography>
                </div>

                {/* View toggle */}
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, v) => v && setViewMode(v)}
                    size="small"
                    sx={{
                        bgcolor: cardBg,
                        border: `1px solid ${cardBorder}`,
                        borderRadius: 2,
                        "& .MuiToggleButton-root": {
                            border: "none",
                            borderRadius: 2,
                            px: 2,
                            py: 0.75,
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            color: "text.secondary",
                            "&.Mui-selected": {
                                bgcolor: isDark ? "rgba(29,78,216,0.15)" : "rgba(29,78,216,0.08)",
                                color: "primary.main",
                            },
                        },
                    }}
                >
                    <ToggleButton value="table">
                        <ListIcon size={16} className="mr-1.5" /> Table
                    </ToggleButton>
                    <ToggleButton value="calendar">
                        <CalendarIcon size={16} className="mr-1.5" /> Calendar
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map(({ label, value, color }) => (
                    <Box
                        key={label}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${cardBorder}`,
                            bgcolor: cardBg,
                            p: 3,
                        }}
                    >
                        <Typography sx={{ fontWeight: 800, fontSize: "1.75rem", lineHeight: 1, mb: 0.5 }}>
                            {value}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}
                        >
                            {label}
                        </Typography>
                    </Box>
                ))}
            </div>

            {/* Filters */}
            <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search by client or member name..."
            >
                <TextField
                    select size="small" label="Member"
                    value={filterMember}
                    onChange={(e) => setFilterMember(e.target.value)}
                    sx={{ minWidth: 160, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                >
                    <MenuItem value="all">All Members</MenuItem>
                    {mockMembers.map((m) => (
                        <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select size="small" label="Specialty"
                    value={filterDesignation}
                    onChange={(e) => setFilterDesignation(e.target.value)}
                    sx={{ minWidth: 160, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                >
                    <MenuItem value="all">All Specialties</MenuItem>
                    {mockDesignations.map((d) => (
                        <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select size="small" label="Status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{ minWidth: 140, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                >
                    <MenuItem value="all">All Statuses</MenuItem>
                    {(["confirmed","pending","completed","cancelled","no-show"] as AppointmentStatus[]).map((s) => (
                        <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    size="small" label="From" type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    sx={{ minWidth: 145, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                    size="small" label="To" type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    sx={{ minWidth: 145, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    slotProps={{ inputLabel: { shrink: true } }}
                />
            </SearchFilterBar>

            {/* Result count */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: -3, ml: 0.5 }}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} matching current filters
            </Typography>

            {/* ── TABLE VIEW ── */}
            {viewMode === "table" && (
                <AdminDataTable
                    columns={COLUMNS}
                    isEmpty={filtered.length === 0}
                    emptyMessage="No appointments match the selected filters."
                >
                    {filtered.map((appt) => {
                        const client = mockClients.find((c) => c.id === appt.clientId);
                        const member = mockMembers.find((m) => m.id === appt.memberId);
                        const designation = mockDesignations.find((d) => d.id === member?.designationId);
                        const isCancelled = appt.status === "cancelled";

                        return (
                            <AdminTableRow key={appt.id}>
                                {/* Client */}
                                <AdminTableCell>
                                    <div className="flex items-center gap-2.5">
                                        <Avatar sx={{
                                            width: 32, height: 32, fontSize: "0.75rem", fontWeight: 700,
                                            bgcolor: isDark ? "rgba(99,102,241,0.15)" : "rgba(29,78,216,0.1)",
                                            color: "primary.main",
                                        }}>
                                            {client?.name.charAt(0) ?? "?"}
                                        </Avatar>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                                            {client?.name ?? "Unknown"}
                                        </Typography>
                                    </div>
                                </AdminTableCell>

                                {/* Member + Designation */}
                                <AdminTableCell>
                                    <div className="min-w-0">
                                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                                            {member?.name ?? "Unknown"}
                                        </Typography>
                                        {designation && (
                                            <Typography variant="caption" color="text.secondary" noWrap>
                                                {designation.name}
                                            </Typography>
                                        )}
                                    </div>
                                </AdminTableCell>

                                {/* Date & Time */}
                                <AdminTableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.82rem" }}>
                                        {formatDate(appt.startTime)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatTimeRange(appt.startTime, appt.endTime)}
                                    </Typography>
                                </AdminTableCell>

                                {/* Status */}
                                <AdminTableCell>
                                    <StatusBadge status={appt.status} />
                                </AdminTableCell>

                                {/* Actions */}
                                <AdminTableCell align="right">
                                    {!isCancelled ? (
                                        <Tooltip title="Cancel appointment" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() => setCancelTarget(appt)}
                                                sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                                            >
                                                <XCircleIcon size={17} />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Typography variant="caption" color="text.disabled">—</Typography>
                                    )}
                                </AdminTableCell>
                            </AdminTableRow>
                        );
                    })}
                </AdminDataTable>
            )}

            {/* ── CALENDAR VIEW ── */}
            {viewMode === "calendar" && (
                <Card
                    elevation={0}
                    variant="outlined"
                    sx={{ borderColor: cardBorder, bgcolor: cardBg, borderRadius: 3 }}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <CalendarIcon size={18} className="text-primary" />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Week of Jul 8 — Jul 14, 2026
                            </Typography>
                            <Chip
                                label={`${filtered.length} visible`}
                                size="small"
                                sx={{
                                    ml: "auto", fontSize: "0.68rem", fontWeight: 600,
                                    bgcolor: isDark ? "rgba(29,78,216,0.12)" : "rgba(29,78,216,0.07)",
                                    color: "primary.main", border: "none",
                                }}
                            />
                        </div>
                        <CalendarView
                            appointments={filtered}
                            isDark={isDark}
                            onCancel={setCancelTarget}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Cancel confirmation dialog */}
            <Dialog
                open={!!cancelTarget}
                onClose={() => setCancelTarget(null)}
                maxWidth="xs"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: cardBg,
                            backgroundImage: "none",
                            borderRadius: 3,
                            border: `1px solid ${cardBorder}`,
                        },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Cancel Appointment?</DialogTitle>
                <DialogContent>
                    <div className="flex items-start gap-3">
                        <WarningIcon size={22} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <Typography variant="body2" color="text.secondary">
                                This will cancel the appointment for{" "}
                                <strong>
                                    {mockClients.find((c) => c.id === cancelTarget?.clientId)?.name ?? "this client"}
                                </strong>{" "}
                                with{" "}
                                <strong>
                                    {mockMembers.find((m) => m.id === cancelTarget?.memberId)?.name ?? "this member"}
                                </strong>
                                {cancelTarget && (
                                    <> on <strong>{formatDate(cancelTarget.startTime)}</strong> at <strong>{formatTime(cancelTarget.startTime)}</strong></>
                                )}.
                            </Typography>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button variant="text" onClick={() => setCancelTarget(null)} sx={{ color: "text.secondary" }}>
                        Keep Appointment
                    </Button>
                    <Button variant="contained" color="error" onClick={handleConfirmCancel}>
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
