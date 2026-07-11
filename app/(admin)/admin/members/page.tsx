// app/(admin)/admin/members/page.tsx
//
// Admin — Members Management page.
// Table with search, designation & status filters, toggle active/inactive,
// edit designation dialog, and invite member dialog.
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
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
    PencilSimpleIcon,
    ToggleLeftIcon,
    ToggleRightIcon,
    UserPlusIcon,
    CheckCircleIcon,
} from "@phosphor-icons/react";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/admin/status-badge";
import SearchFilterBar from "@/components/admin/search-filter-bar";
import AdminDataTable, { AdminTableRow, AdminTableCell } from "@/components/admin/admin-data-table";
import { mockMembers, mockDesignations } from "@/lib/data";
import type { Member, Designation } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

function initials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ── Table columns ─────────────────────────────────────────────────────────────
const COLUMNS = [
    { key: "member", label: "Member" },
    { key: "designation", label: "Designation" },
    { key: "status", label: "Status", width: 110 },
    { key: "joined", label: "Joined", width: 130 },
    { key: "actions", label: "Actions", align: "right" as const, width: 120 },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminMembersPage() {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";

    // Local state — mirrors mock data, mutations stay in memory only
    const [members, setMembers] = React.useState<Member[]>(mockMembers);
    const [designations] = React.useState<Designation[]>(mockDesignations);

    // Filters
    const [searchQuery, setSearchQuery] = React.useState("");
    const [filterDesignation, setFilterDesignation] = React.useState("all");
    const [filterStatus, setFilterStatus] = React.useState("all");

    // Edit Designation dialog
    const [editTarget, setEditTarget] = React.useState<Member | null>(null);
    const [editDesignationId, setEditDesignationId] = React.useState("");

    // Invite Member dialog
    const [inviteOpen, setInviteOpen] = React.useState(false);
    const [inviteName, setInviteName] = React.useState("");
    const [inviteEmail, setInviteEmail] = React.useState("");
    const [inviteDesignationId, setInviteDesignationId] = React.useState(designations[0]?.id ?? "");
    const [inviteSuccess, setInviteSuccess] = React.useState(false);

    // ── Derived ───────────────────────────────────────────────────────────────
    const filtered = members.filter((m) => {
        const matchSearch =
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDesig = filterDesignation === "all" || m.designationId === filterDesignation;
        const matchStatus =
            filterStatus === "all" ||
            (filterStatus === "active" ? m.isActive : !m.isActive);
        return matchSearch && matchDesig && matchStatus;
    });

    const activeCount = members.filter((m) => m.isActive).length;
    const inactiveCount = members.length - activeCount;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleToggleActive = (id: string) => {
        // TODO: replace with Supabase call in Phase 2
        setMembers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
        );
    };

    const handleOpenEdit = (member: Member) => {
        setEditTarget(member);
        setEditDesignationId(member.designationId);
    };

    const handleSaveEdit = () => {
        if (!editTarget) return;
        // TODO: replace with Supabase call in Phase 2
        setMembers((prev) =>
            prev.map((m) =>
                m.id === editTarget.id ? { ...m, designationId: editDesignationId } : m
            )
        );
        setEditTarget(null);
    };

    const handleInviteSubmit = () => {
        // TODO: replace with Supabase call in Phase 2
        setInviteSuccess(true);
    };

    const handleInviteClose = () => {
        setInviteOpen(false);
        setInviteName("");
        setInviteEmail("");
        setInviteDesignationId(designations[0]?.id ?? "");
        setInviteSuccess(false);
    };

    const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const cardBg = isDark ? "#161616" : "#ffffff";

    return (
        <Box className="flex flex-col gap-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
                        Members
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage organization staff, designations, and account states.
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setInviteOpen(true)}
                    startIcon={<UserPlusIcon size={18} />}
                    sx={{ borderRadius: 2, flexShrink: 0, alignSelf: "flex-start" }}
                >
                    Invite Member
                </Button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total", value: members.length },
                    { label: "Active", value: activeCount },
                    { label: "Inactive", value: inactiveCount },
                ].map(({ label, value }) => (
                    <Box
                        key={label}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${cardBorder}`,
                            bgcolor: cardBg,
                            p: 3,
                        }}
                    >
                        <Typography sx={{ fontWeight: 800, fontSize: "1.75rem", lineHeight: 1 }}>
                            {value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
                            {label}
                        </Typography>
                    </Box>
                ))}
            </div>

            {/* Search + Filters */}
            <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search by name or email..."
            >
                <TextField
                    select
                    size="small"
                    value={filterDesignation}
                    onChange={(e) => setFilterDesignation(e.target.value)}
                    sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    label="Designation"
                >
                    <MenuItem value="all">All Designations</MenuItem>
                    {designations.map((d) => (
                        <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    size="small"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{ minWidth: 140, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    label="Status"
                >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
            </SearchFilterBar>

            {/* Data table */}
            <AdminDataTable
                columns={COLUMNS}
                isEmpty={filtered.length === 0}
                emptyMessage="No members match your filters."
            >
                {filtered.map((member) => {
                    const designation = designations.find((d) => d.id === member.designationId);
                    return (
                        <AdminTableRow key={member.id}>
                            {/* Member */}
                            <AdminTableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        src={member.avatarUrl}
                                        sx={{
                                            width: 36, height: 36,
                                            bgcolor: isDark ? "rgba(99,102,241,0.2)" : "rgba(29,78,216,0.12)",
                                            color: "primary.main",
                                            fontWeight: 700, fontSize: "0.8rem",
                                        }}
                                    >
                                        {initials(member.name)}
                                    </Avatar>
                                    <div className="min-w-0">
                                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                                            {member.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap>
                                            {member.email}
                                        </Typography>
                                    </div>
                                </div>
                            </AdminTableCell>

                            {/* Designation */}
                            <AdminTableCell>
                                <Chip
                                    label={designation?.name ?? "—"}
                                    size="small"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                                        color: "text.secondary",
                                        border: "none",
                                    }}
                                />
                            </AdminTableCell>

                            {/* Status */}
                            <AdminTableCell>
                                <StatusBadge status={member.isActive ? "active" : "inactive"} />
                            </AdminTableCell>

                            {/* Joined */}
                            <AdminTableCell>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(member.createdAt)}
                                </Typography>
                            </AdminTableCell>

                            {/* Actions */}
                            <AdminTableCell align="right">
                                <div className="flex items-center justify-end gap-1">
                                    <Tooltip
                                        title={member.isActive ? "Deactivate member" : "Activate member"}
                                        arrow
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() => handleToggleActive(member.id)}
                                            sx={{
                                                color: member.isActive ? "success.main" : "text.disabled",
                                                "&:hover": { color: member.isActive ? "error.main" : "success.main" },
                                            }}
                                        >
                                            {member.isActive
                                                ? <ToggleRightIcon size={20} weight="fill" />
                                                : <ToggleLeftIcon size={20} />
                                            }
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit designation" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenEdit(member)}
                                            sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                                        >
                                            <PencilSimpleIcon size={17} />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </AdminTableCell>
                        </AdminTableRow>
                    );
                })}
            </AdminDataTable>

            {/* Edit Designation Dialog */}
            <Dialog
                open={!!editTarget}
                onClose={() => setEditTarget(null)}
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
                <DialogTitle sx={{ fontWeight: 800 }}>Edit Designation</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Reassign <strong>{editTarget?.name}</strong> to a different designation.
                    </Typography>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Designation"
                        value={editDesignationId}
                        onChange={(e) => setEditDesignationId(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    >
                        {designations.map((d) => (
                            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button variant="text" onClick={() => setEditTarget(null)} sx={{ color: "text.secondary" }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Invite Member Dialog */}
            <Dialog
                open={inviteOpen}
                onClose={handleInviteClose}
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
                <DialogTitle sx={{ fontWeight: 800 }}>
                    {inviteSuccess ? "Invitation Sent" : "Invite New Member"}
                </DialogTitle>
                <DialogContent>
                    {inviteSuccess ? (
                        <Box className="py-6 flex flex-col items-center gap-3 text-center">
                            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircleIcon size={36} weight="fill" className="text-emerald-500" />
                            </div>
                            <div>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    Invitation Queued
                                </Typography>
                                <Typography variant="body2" color="text.secondary" className="mt-1">
                                    <strong>{inviteEmail}</strong> will receive an invitation email once the backend is wired in Phase 2.
                                </Typography>
                            </div>
                        </Box>
                    ) : (
                        <Box className="flex flex-col gap-4 pt-1">
                            <TextField
                                fullWidth size="small" label="Full Name"
                                value={inviteName}
                                onChange={(e) => setInviteName(e.target.value)}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                            />
                            <TextField
                                fullWidth size="small" label="Email Address" type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                            />
                            <TextField
                                select fullWidth size="small" label="Designation"
                                value={inviteDesignationId}
                                onChange={(e) => setInviteDesignationId(e.target.value)}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                            >
                                {designations.map((d) => (
                                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    {inviteSuccess ? (
                        <Button variant="contained" color="primary" onClick={handleInviteClose}>
                            Done
                        </Button>
                    ) : (
                        <>
                            <Button variant="text" onClick={handleInviteClose} sx={{ color: "text.secondary" }}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained" color="primary"
                                onClick={handleInviteSubmit}
                                disabled={!inviteName || !inviteEmail}
                            >
                                Send Invitation
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}
