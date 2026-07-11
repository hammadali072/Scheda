// app/(admin)/admin/clients/page.tsx
//
// Admin — Clients Management page.
// Table with name, email, joined date, total appointments, and last appointment date.
// Row action: slide-out right Drawer showing the client's full appointment history.
// All data is sourced from lib/data/ — Phase 1 mock only.

"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
    ArrowSquareOutIcon,
    CalendarIcon,
    ClockIcon,
    XIcon,
    UsersIcon,
    CheckCircleIcon,
} from "@phosphor-icons/react";
import StatusBadge from "@/components/admin/status-badge";
import SearchFilterBar from "@/components/admin/search-filter-bar";
import AdminDataTable, { AdminTableRow, AdminTableCell } from "@/components/admin/admin-data-table";
import { mockClients, mockAppointments, mockMembers } from "@/lib/data";
import type { Client, Appointment } from "@/types";

const HISTORY_DRAWER_WIDTH = 420;

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
        month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit",
    });
}

function initials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function clientStats(clientId: string) {
    const appts = mockAppointments.filter((a) => a.clientId === clientId);
    if (appts.length === 0) return { total: 0, last: null };
    const sorted = [...appts].sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    return { total: appts.length, last: sorted[0].startTime };
}

// ── Table columns ─────────────────────────────────────────────────────────────
const COLUMNS = [
    { key: "client", label: "Client" },
    { key: "joined", label: "Joined", width: 130 },
    { key: "total", label: "Appointments", width: 130, align: "center" as const },
    { key: "last", label: "Last Appointment", width: 170 },
    { key: "actions", label: "Actions", align: "right" as const, width: 90 },
];

// ── History Drawer ────────────────────────────────────────────────────────────
interface HistoryDrawerProps {
    client: Client | null;
    onClose: () => void;
    isDark: boolean;
}

function HistoryDrawer({ client, onClose, isDark }: HistoryDrawerProps) {
    if (!client) return null;

    const appts = mockAppointments
        .filter((a) => a.clientId === client.id)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const cardBg = isDark ? "#0f0f0f" : "#ffffff";

    return (
        <Drawer
            anchor="right"
            open={!!client}
            onClose={onClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: { xs: "100vw", sm: HISTORY_DRAWER_WIDTH },
                    bgcolor: cardBg,
                    backgroundImage: "none",
                    borderLeft: `1px solid ${cardBorder}`,
                    p: 0,
                },
            }}
        >
            {/* Drawer header */}
            <Box
                className="flex items-center justify-between px-5 py-4"
                sx={{ borderBottom: `1px solid ${cardBorder}` }}
            >
                <div className="flex items-center gap-3">
                    <Avatar
                        sx={{
                            width: 38, height: 38,
                            bgcolor: isDark ? "rgba(99,102,241,0.2)" : "rgba(29,78,216,0.1)",
                            color: "primary.main", fontWeight: 700, fontSize: "0.85rem",
                        }}
                    >
                        {initials(client.name)}
                    </Avatar>
                    <div>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {client.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {client.email}
                        </Typography>
                    </div>
                </div>
                <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
                    <XIcon size={20} />
                </IconButton>
            </Box>

            {/* Stats row inside drawer */}
            <Box
                className="flex gap-4 px-5 py-4"
                sx={{ borderBottom: `1px solid ${cardBorder}` }}
            >
                <div className="flex items-center gap-2">
                    <CalendarIcon size={16} className="text-primary opacity-70" />
                    <Typography variant="caption" color="text.secondary">
                        <strong className="text-inherit">{appts.length}</strong> total sessions
                    </Typography>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircleIcon size={16} className="text-emerald-500 opacity-70" />
                    <Typography variant="caption" color="text.secondary">
                        <strong className="text-inherit">
                            {appts.filter((a) => a.status === "completed").length}
                        </strong>{" "}
                        completed
                    </Typography>
                </div>
            </Box>

            {/* Appointment list */}
            <Box className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Appointment History
                </Typography>

                {appts.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-3 text-center">
                        <CalendarIcon size={36} className="text-zinc-300 dark:text-zinc-600" />
                        <Typography variant="body2" color="text.secondary">
                            No appointments found for this client.
                        </Typography>
                    </div>
                ) : (
                    appts.map((appt, idx) => {
                        const member = mockMembers.find((m) => m.id === appt.memberId);
                        return (
                            <React.Fragment key={appt.id}>
                                <div className="flex items-start gap-3">
                                    {/* Date block */}
                                    <div
                                        className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center"
                                        style={{
                                            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                                            border: `1px solid ${cardBorder}`,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "0.55rem", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                            {new Date(appt.startTime).toLocaleDateString("en-US", { month: "short" })}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", lineHeight: 1 }}>
                                            {new Date(appt.startTime).getDate()}
                                        </Typography>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {member?.name ?? "Unknown Member"}
                                            </Typography>
                                            <StatusBadge status={appt.status} />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ClockIcon size={11} className="text-zinc-400 dark:text-zinc-500" />
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDateTime(appt.startTime)}
                                            </Typography>
                                        </div>
                                        {appt.notes && (
                                            <Typography variant="caption" color="text.secondary" className="mt-0.5 block italic truncate">
                                                &ldquo;{appt.notes}&rdquo;
                                            </Typography>
                                        )}
                                    </div>
                                </div>
                                {idx < appts.length - 1 && (
                                    <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
                                )}
                            </React.Fragment>
                        );
                    })
                )}
            </Box>
        </Drawer>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminClientsPage() {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";

    const [searchQuery, setSearchQuery] = React.useState("");
    const [historyClient, setHistoryClient] = React.useState<Client | null>(null);

    const filtered = mockClients.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalAppts = mockAppointments.length;

    return (
        <Box className="flex flex-col gap-6">
            {/* Page header */}
            <div>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
                    Clients
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    View client accounts and browse their complete booking histories.
                </Typography>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Clients", value: mockClients.length, Icon: UsersIcon },
                    { label: "Total Appointments", value: totalAppts, Icon: CalendarIcon },
                    {
                        label: "Completed Sessions",
                        value: mockAppointments.filter((a) => a.status === "completed").length,
                        Icon: CheckCircleIcon,
                    },
                ].map(({ label, value, Icon }) => (
                    <Box
                        key={label}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                            bgcolor: isDark ? "#161616" : "#ffffff",
                            p: 3,
                        }}
                    >
                        <Typography sx={{ fontWeight: 800, fontSize: "1.75rem", lineHeight: 1, mb: 0.5 }}>
                            {value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
                            {label}
                        </Typography>
                    </Box>
                ))}
            </div>

            {/* Search bar */}
            <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search by client name or email..."
            />

            {/* Data table */}
            <AdminDataTable
                columns={COLUMNS}
                isEmpty={filtered.length === 0}
                emptyMessage="No clients match your search."
            >
                {filtered.map((client) => {
                    const { total, last } = clientStats(client.id);
                    return (
                        <AdminTableRow key={client.id}>
                            {/* Client */}
                            <AdminTableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        sx={{
                                            width: 36, height: 36,
                                            bgcolor: isDark ? "rgba(99,102,241,0.2)" : "rgba(29,78,216,0.12)",
                                            color: "primary.main",
                                            fontWeight: 700, fontSize: "0.8rem",
                                        }}
                                    >
                                        {initials(client.name)}
                                    </Avatar>
                                    <div className="min-w-0">
                                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                                            {client.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap>
                                            {client.email}
                                        </Typography>
                                    </div>
                                </div>
                            </AdminTableCell>

                            {/* Joined */}
                            <AdminTableCell>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(client.createdAt)}
                                </Typography>
                            </AdminTableCell>

                            {/* Total Appointments */}
                            <AdminTableCell align="center">
                                <Chip
                                    label={total}
                                    size="small"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: "0.75rem",
                                        height: 22,
                                        minWidth: 32,
                                        bgcolor: total > 0
                                            ? isDark ? "rgba(29,78,216,0.12)" : "rgba(29,78,216,0.08)"
                                            : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                                        color: total > 0 ? "primary.main" : "text.disabled",
                                        border: "none",
                                    }}
                                />
                            </AdminTableCell>

                            {/* Last Appointment */}
                            <AdminTableCell>
                                <Typography variant="caption" color="text.secondary">
                                    {last ? formatDateTime(last) : "—"}
                                </Typography>
                            </AdminTableCell>

                            {/* Actions */}
                            <AdminTableCell align="right">
                                <Tooltip title="View appointment history" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={() => setHistoryClient(client)}
                                        sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                                    >
                                        <ArrowSquareOutIcon size={17} />
                                    </IconButton>
                                </Tooltip>
                            </AdminTableCell>
                        </AdminTableRow>
                    );
                })}
            </AdminDataTable>

            {/* Slide-out History Drawer */}
            <HistoryDrawer
                client={historyClient}
                onClose={() => setHistoryClient(null)}
                isDark={isDark}
            />
        </Box>
    );
}
