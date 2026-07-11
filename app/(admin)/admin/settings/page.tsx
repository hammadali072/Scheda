// app/(admin)/admin/settings/page.tsx
//
// Admin — Platform Settings page.
// Form bound to AppSettings type: company working days, default slot duration,
// cancellation cutoff, and holiday list management.
// Save updates local state only, with MUI Snackbar success toast.

"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
    FloppyDiskIcon,
    CalendarIcon,
    ClockIcon,
    GearIcon,
    PlusIcon,
    TrashIcon,
    InfoIcon,
} from "@phosphor-icons/react";
import Button from "@/components/ui/button";
import { mockAppSettings } from "@/lib/data";
import type { AppSettings } from "@/types";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const SLOT_DURATIONS = [15, 20, 30, 45, 60];
const CUTOFF_OPTIONS = [1, 2, 4, 6, 12, 24, 48];

export default function AdminSettingsPage() {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";

    // Local settings state — seeded from mock data
    const [settings, setSettings] = React.useState<AppSettings>({ ...mockAppSettings });
    const [newHoliday, setNewHoliday] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const cardBg = isDark ? "#161616" : "#ffffff";

    // ── Handlers ─────────────────────────────────────────────────────────────
    const toggleWorkingDay = (day: number) => {
        setSettings((prev) => ({
            ...prev,
            companyWorkingDays: prev.companyWorkingDays.includes(day)
                ? prev.companyWorkingDays.filter((d) => d !== day)
                : [...prev.companyWorkingDays, day].sort((a, b) => a - b),
        }));
    };

    const handleAddHoliday = () => {
        const trimmed = newHoliday.trim();
        if (!trimmed || settings.holidays.includes(trimmed)) return;
        // TODO: replace with Supabase call in Phase 2
        setSettings((prev) => ({
            ...prev,
            holidays: [...prev.holidays, trimmed].sort(),
        }));
        setNewHoliday("");
    };

    const handleRemoveHoliday = (date: string) => {
        // TODO: replace with Supabase call in Phase 2
        setSettings((prev) => ({
            ...prev,
            holidays: prev.holidays.filter((h) => h !== date),
        }));
    };

    const handleSave = () => {
        // TODO: replace with Supabase call in Phase 2
        setSnackbarOpen(true);
    };

    function formatHolidayDate(iso: string) {
        return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
            weekday: "short", month: "long", day: "numeric", year: "numeric",
        });
    }

    // ── Section card wrapper ──────────────────────────────────────────────────
    function SettingsSection({
        icon,
        title,
        description,
        children,
    }: {
        icon: React.ReactNode;
        title: string;
        description: string;
        children: React.ReactNode;
    }) {
        return (
            <Card
                elevation={0}
                variant="outlined"
                sx={{ borderColor: cardBorder, bgcolor: cardBg, borderRadius: 3 }}
            >
                <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-5">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                                background: isDark ? "rgba(99,102,241,0.12)" : "rgba(29,78,216,0.07)",
                            }}
                        >
                            <span className="text-primary">{icon}</span>
                        </div>
                        <div>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                {description}
                            </Typography>
                        </div>
                    </div>
                    {children}
                </CardContent>
            </Card>
        );
    }

    return (
        <Box className="flex flex-col gap-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
                        Platform Settings
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Configure organization-wide scheduling rules and working hours.
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    startIcon={<FloppyDiskIcon size={18} />}
                    sx={{ borderRadius: 2, flexShrink: 0, alignSelf: "flex-start" }}
                >
                    Save Settings
                </Button>
            </div>

            {/* ── Section 1: Working Days ── */}
            <SettingsSection
                icon={<CalendarIcon size={18} />}
                title="Company Working Days"
                description="Select the days of the week when appointments can be scheduled."
            >
                <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                        const isActive = settings.companyWorkingDays.includes(day);
                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => toggleWorkingDay(day)}
                                className="flex flex-col items-center gap-1 cursor-pointer transition-all duration-150"
                                title={DAY_NAMES[day]}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-sm font-bold border transition-all"
                                    style={{
                                        background: isActive
                                            ? isDark
                                                ? "linear-gradient(135deg, rgba(29,78,216,0.35), rgba(99,102,241,0.25))"
                                                : "linear-gradient(135deg, rgba(29,78,216,0.12), rgba(99,102,241,0.08))"
                                            : isDark
                                            ? "rgba(255,255,255,0.03)"
                                            : "rgba(0,0,0,0.03)",
                                        borderColor: isActive
                                            ? isDark ? "rgba(99,102,241,0.5)" : "rgba(29,78,216,0.3)"
                                            : cardBorder,
                                        color: isActive
                                            ? isDark ? "#818cf8" : "#1d4ed8"
                                            : "var(--text-secondary)",
                                        transform: isActive ? "scale(1.05)" : "scale(1)",
                                    }}
                                >
                                    {DAY_SHORT[day]}
                                </div>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: "0.58rem",
                                        fontWeight: 700,
                                        color: isActive ? "primary.main" : "text.disabled",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    {DAY_NAMES[day].slice(0, 3)}
                                </Typography>
                            </button>
                        );
                    })}
                </div>
                <Typography variant="caption" color="text.secondary" className="mt-3 block">
                    {settings.companyWorkingDays.length} day{settings.companyWorkingDays.length !== 1 ? "s" : ""} selected:{" "}
                    {settings.companyWorkingDays.map((d) => DAY_NAMES[d]).join(", ") || "None"}
                </Typography>
            </SettingsSection>

            {/* ── Section 2: Slot Duration & Cutoff ── */}
            <SettingsSection
                icon={<ClockIcon size={18} />}
                title="Appointment Defaults"
                description="Set the default slot length and how far in advance clients can cancel."
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", mb: 1.5 }}
                        >
                            Default Slot Duration
                        </Typography>
                        <div className="flex flex-wrap gap-2">
                            {SLOT_DURATIONS.map((dur) => {
                                const isSelected = settings.defaultSlotDurationMinutes === dur;
                                return (
                                    <button
                                        key={dur}
                                        type="button"
                                        onClick={() =>
                                            setSettings((prev) => ({
                                                ...prev,
                                                defaultSlotDurationMinutes: dur,
                                            }))
                                        }
                                        className="px-4 py-2 rounded-lg text-sm font-bold border cursor-pointer transition-all"
                                        style={{
                                            background: isSelected
                                                ? isDark ? "rgba(29,78,216,0.2)" : "rgba(29,78,216,0.1)"
                                                : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                                            borderColor: isSelected
                                                ? isDark ? "rgba(99,102,241,0.4)" : "rgba(29,78,216,0.25)"
                                                : cardBorder,
                                            color: isSelected
                                                ? isDark ? "#818cf8" : "#1d4ed8"
                                                : isDark ? "#a1a1aa" : "#52525b",
                                        }}
                                    >
                                        {dur} min
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
                            >
                                Cancellation Cutoff
                            </Typography>
                            <Tooltip title="Clients cannot cancel within this many hours before the appointment." arrow>
                                <span>
                                    <InfoIcon size={13} className="text-zinc-400 cursor-help" />
                                </span>
                            </Tooltip>
                        </div>
                        <TextField
                            select
                            size="small"
                            value={settings.cancellationCutoffHours}
                            onChange={(e) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    cancellationCutoffHours: Number(e.target.value),
                                }))
                            }
                            sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        >
                            {CUTOFF_OPTIONS.map((h) => (
                                <MenuItem key={h} value={h}>
                                    {h} hour{h !== 1 ? "s" : ""} before appointment
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                </div>
            </SettingsSection>

            {/* ── Section 3: Holidays ── */}
            <SettingsSection
                icon={<GearIcon size={18} />}
                title="Company Holidays"
                description="Dates when no appointments will be bookable organization-wide."
            >
                {/* Add holiday input */}
                <div className="flex gap-2 items-center mb-5">
                    <TextField
                        type="date"
                        size="small"
                        value={newHoliday}
                        onChange={(e) => setNewHoliday(e.target.value)}
                        sx={{ flex: 1, maxWidth: 220, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        slotProps={{ inputLabel: { shrink: true } }}
                        label="Add Holiday"
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleAddHoliday}
                        disabled={!newHoliday}
                        startIcon={<PlusIcon size={16} />}
                        sx={{ borderRadius: 2, flexShrink: 0 }}
                    >
                        Add
                    </Button>
                </div>

                {settings.holidays.length === 0 ? (
                    <div
                        className="rounded-xl py-10 flex flex-col items-center gap-2 text-center border border-dashed"
                        style={{ borderColor: cardBorder }}
                    >
                        <CalendarIcon size={30} className="text-zinc-300 dark:text-zinc-600" />
                        <Typography variant="body2" color="text.disabled">
                            No holidays configured.
                        </Typography>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {settings.holidays.map((date, idx) => (
                            <React.Fragment key={date}>
                                <div className="flex items-center justify-between gap-3 py-1.5">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                                            style={{
                                                background: isDark ? "rgba(245,158,11,0.10)" : "rgba(245,158,11,0.08)",
                                                border: `1px solid ${isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.15)"}`,
                                            }}
                                        >
                                            <Typography sx={{ fontSize: "0.55rem", fontWeight: 700, color: isDark ? "#fbbf24" : "#b45309", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                {new Date(date + "T12:00:00Z").toLocaleDateString("en-US", { month: "short" })}
                                            </Typography>
                                            <Typography sx={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1, color: isDark ? "#fbbf24" : "#b45309" }}>
                                                {new Date(date + "T12:00:00Z").getDate()}
                                            </Typography>
                                        </div>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {formatHolidayDate(date)}
                                        </Typography>
                                    </div>
                                    <Tooltip title="Remove holiday" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveHoliday(date)}
                                            sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                                        >
                                            <TrashIcon size={16} />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                {idx < settings.holidays.length - 1 && (
                                    <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </SettingsSection>

            {/* Bottom Save button */}
            <div className="flex justify-end pb-2">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    startIcon={<FloppyDiskIcon size={18} />}
                    sx={{ borderRadius: 2 }}
                >
                    Save All Settings
                </Button>
            </div>

            {/* Success Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3500}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                    Settings saved successfully. (Phase 2 will sync to database.)
                </Alert>
            </Snackbar>
        </Box>
    );
}
