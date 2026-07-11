// app/(admin)/admin/designations/page.tsx
//
// Admin — Designations Management page.
// Card grid with member counts, Add/Edit/Delete dialog forms.
// Delete is disabled (with tooltip) when members are assigned to a designation.
// All mutations operate on local React state only.

"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
    PencilSimpleIcon,
    TrashIcon,
    PlusIcon,
    TagIcon,
    UsersIcon,
    WarningIcon,
} from "@phosphor-icons/react";
import Button from "@/components/ui/button";
import { mockDesignations, mockMembers } from "@/lib/data";
import type { Designation } from "@/types";

let nextId = 10; // for local state new designations

export default function AdminDesignationsPage() {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";

    // Local state
    const [designations, setDesignations] = React.useState<Designation[]>(mockDesignations);
    const [members] = React.useState(mockMembers);

    // Dialogs
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editTarget, setEditTarget] = React.useState<Designation | null>(null);
    const [formName, setFormName] = React.useState("");
    const [formDesc, setFormDesc] = React.useState("");

    // Delete confirm
    const [deleteTarget, setDeleteTarget] = React.useState<Designation | null>(null);

    const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const cardBg = isDark ? "#161616" : "#ffffff";

    // Count members per designation
    const memberCount = (designationId: string) =>
        members.filter((m) => m.designationId === designationId).length;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleOpenAdd = () => {
        setEditTarget(null);
        setFormName("");
        setFormDesc("");
        setDialogOpen(true);
    };

    const handleOpenEdit = (d: Designation) => {
        setEditTarget(d);
        setFormName(d.name);
        setFormDesc(d.description ?? "");
        setDialogOpen(true);
    };

    const handleSave = () => {
        if (!formName.trim()) return;
        if (editTarget) {
            // TODO: replace with Supabase call in Phase 2
            setDesignations((prev) =>
                prev.map((d) =>
                    d.id === editTarget.id
                        ? { ...d, name: formName.trim(), description: formDesc.trim() || undefined }
                        : d
                )
            );
        } else {
            // TODO: replace with Supabase call in Phase 2
            const newDesig: Designation = {
                id: `d${++nextId}`,
                name: formName.trim(),
                description: formDesc.trim() || undefined,
            };
            setDesignations((prev) => [...prev, newDesig]);
        }
        setDialogOpen(false);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        // TODO: replace with Supabase call in Phase 2
        setDesignations((prev) => prev.filter((d) => d.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <Box className="flex flex-col gap-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
                        Designations
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage member roles and specialties across your organization.
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenAdd}
                    startIcon={<PlusIcon size={18} />}
                    sx={{ borderRadius: 2, flexShrink: 0, alignSelf: "flex-start" }}
                >
                    Add Designation
                </Button>
            </div>

            {/* Summary stat */}
            <Box
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 3, py: 2,
                    borderRadius: 3,
                    border: `1px solid ${cardBorder}`,
                    bgcolor: cardBg,
                    alignSelf: "flex-start",
                }}
            >
                <TagIcon size={20} className="text-primary" />
                <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", lineHeight: 1 }}>
                    {designations.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Total Designations
                </Typography>
            </Box>

            {/* Designations grid */}
            {designations.length === 0 ? (
                <Card
                    elevation={0}
                    variant="outlined"
                    sx={{
                        borderRadius: 3, borderStyle: "dashed",
                        borderColor: cardBorder,
                    }}
                >
                    <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                        <TagIcon size={40} className="text-zinc-300 dark:text-zinc-600" />
                        <Typography color="text.secondary" variant="body2">
                            No designations yet. Click &ldquo;Add Designation&rdquo; to create one.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {designations.map((desig) => {
                        const count = memberCount(desig.id);
                        const canDelete = count === 0;

                        return (
                            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={desig.id}>
                                <Card
                                    elevation={0}
                                    variant="outlined"
                                    sx={{
                                        borderColor: cardBorder,
                                        bgcolor: cardBg,
                                        borderRadius: 3,
                                        height: "100%",
                                        transition: "box-shadow 0.2s, transform 0.2s",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: isDark
                                                ? "0 8px 24px rgba(0,0,0,0.4)"
                                                : "0 8px 24px rgba(0,0,0,0.06)",
                                        },
                                    }}
                                >
                                    <CardContent className="p-5 flex flex-col gap-3 h-full">
                                        {/* Icon + Name row */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        background: isDark
                                                            ? "rgba(99,102,241,0.15)"
                                                            : "rgba(29,78,216,0.08)",
                                                    }}
                                                >
                                                    <TagIcon size={18} className="text-primary" />
                                                </div>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                                                    {desig.name}
                                                </Typography>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                                <Tooltip title="Edit designation" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenEdit(desig)}
                                                        sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                                                    >
                                                        <PencilSimpleIcon size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip
                                                    title={
                                                        canDelete
                                                            ? "Delete designation"
                                                            : `Cannot delete — ${count} member${count > 1 ? "s" : ""} assigned`
                                                    }
                                                    arrow
                                                >
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            disabled={!canDelete}
                                                            onClick={() => setDeleteTarget(desig)}
                                                            sx={{
                                                                color: canDelete ? "text.secondary" : "text.disabled",
                                                                "&:hover": { color: canDelete ? "error.main" : "text.disabled" },
                                                            }}
                                                        >
                                                            <TrashIcon size={16} />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.6, flex: 1 }}
                                        >
                                            {desig.description || "No description provided."}
                                        </Typography>

                                        {/* Member count chip */}
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <UsersIcon size={14} className="text-zinc-400 dark:text-zinc-500" />
                                            <Chip
                                                label={`${count} member${count !== 1 ? "s" : ""}`}
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: "0.68rem",
                                                    height: 20,
                                                    bgcolor: count > 0
                                                        ? isDark ? "rgba(29,78,216,0.12)" : "rgba(29,78,216,0.08)"
                                                        : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                                                    color: count > 0 ? "primary.main" : "text.disabled",
                                                    border: "none",
                                                }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Add / Edit Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
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
                    {editTarget ? "Edit Designation" : "Add Designation"}
                </DialogTitle>
                <DialogContent>
                    <Box className="flex flex-col gap-4 pt-1">
                        <TextField
                            fullWidth
                            size="small"
                            label="Name"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="Description (optional)"
                            multiline
                            rows={3}
                            value={formDesc}
                            onChange={(e) => setFormDesc(e.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button variant="text" onClick={() => setDialogOpen(false)} sx={{ color: "text.secondary" }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={!formName.trim()}
                    >
                        {editTarget ? "Save Changes" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
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
                <DialogTitle sx={{ fontWeight: 800 }}>Delete Designation?</DialogTitle>
                <DialogContent>
                    <div className="flex items-start gap-3 mb-2">
                        <WarningIcon size={22} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <Typography variant="body2" color="text.secondary">
                            This will permanently remove <strong>{deleteTarget?.name}</strong>. This action cannot be undone.
                        </Typography>
                    </div>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button variant="text" onClick={() => setDeleteTarget(null)} sx={{ color: "text.secondary" }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
