// app/(member)/member/availability/page.tsx
//
// My Availability page for an Associated Member.
// Shows a weekly schedule grid of recurring availability rules and
// lists any one-off exceptions (leave, holidays, custom hours).
// All data is sourced from lib/data/ — Phase 1 mock only.

"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
    ClockIcon,
    CalendarBlankIcon,
    WarningIcon,
    CheckCircleIcon,
    ProhibitIcon,
} from "@phosphor-icons/react";
import { mockAvailabilityRules, mockAvailabilityExceptions } from "@/lib/data";
import type { AvailabilityRule, AvailabilityException } from "@/types";

// TODO: replace with Supabase call in Phase 2 — fetch by authenticated member ID
const MEMBER_ID = "m1";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Format "09:00" → "9:00 AM" */
function formatTime(t: string): string {
    const [hStr, mStr] = t.split(":");
    const h = parseInt(hStr, 10);
    const m = mStr;
    const period = h >= 12 ? "PM" : "AM";
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}:${m} ${period}`;
}

/** Format ISO date string "2026-07-14" → "Jul 14, 2026" */
function formatDate(iso: string): string {
    return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

const EXCEPTION_CONFIG: Record<
    AvailabilityException["type"],
    { label: string; color: "error" | "warning" | "info"; Icon: React.ComponentType<{ size: number }> }
> = {
    leave: { label: "Day Off", color: "error", Icon: ProhibitIcon },
    holiday: { label: "Holiday", color: "warning", Icon: WarningIcon },
    "custom-hours": { label: "Custom Hours", color: "info", Icon: ClockIcon },
};

export default function AvailabilityPage() {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";

    const memberRules = mockAvailabilityRules.filter((r) => r.memberId === MEMBER_ID);
    const memberExceptions = mockAvailabilityExceptions.filter((e) => e.memberId === MEMBER_ID);

    // Map dayOfWeek → rule (at most one rule per day for Phase 1)
    const ruleByDay = new Map<number, AvailabilityRule>();
    memberRules.forEach((r) => ruleByDay.set(r.dayOfWeek, r));

    const activeDays = memberRules.length;
    const earliestStart = memberRules.length
        ? memberRules.reduce((min, r) => (r.startTime < min ? r.startTime : min), "23:59")
        : null;
    const latestEnd = memberRules.length
        ? memberRules.reduce((max, r) => (r.endTime > max ? r.endTime : max), "00:00")
        : null;
    const slotDuration = memberRules[0]?.slotDurationMinutes ?? 30;

    return (
        <Box className="flex flex-col gap-6">
            {/* Page header */}
            <div>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
                    My Availability
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Set when you&apos;re available for appointments each week, and manage exceptions.
                </Typography>
            </div>

            {/* Summary stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    {
                        label: "Active Days",
                        value: `${activeDays} / 7`,
                        Icon: CheckCircleIcon,
                        color: "text-emerald-500",
                    },
                    {
                        label: "Earliest Start",
                        value: earliestStart ? formatTime(earliestStart) : "—",
                        Icon: ClockIcon,
                        color: "text-blue-500",
                    },
                    {
                        label: "Latest End",
                        value: latestEnd ? formatTime(latestEnd) : "—",
                        Icon: ClockIcon,
                        color: "text-indigo-500",
                    },
                    {
                        label: "Slot Duration",
                        value: `${slotDuration} min`,
                        Icon: CalendarBlankIcon,
                        color: "text-violet-500",
                    },
                ].map(({ label, value, Icon, color }) => (
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
                            <div className={`${color}`}>
                                <Icon size={20} />
                            </div>
                            <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", lineHeight: 1 }}>
                                {value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" className="uppercase tracking-wider font-semibold">
                                {label}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Weekly Schedule Grid */}
            <Card
                elevation={0}
                variant="outlined"
                sx={{
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                    bgcolor: isDark ? "#161616" : "#ffffff",
                    borderRadius: 3,
                }}
            >
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <CalendarBlankIcon size={20} className="text-primary" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Weekly Schedule
                        </Typography>
                        <Chip
                            label="Recurring"
                            size="small"
                            sx={{
                                ml: "auto",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                bgcolor: isDark ? "rgba(29,78,216,0.15)" : "rgba(29,78,216,0.08)",
                                color: "primary.main",
                                border: "none",
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-7 gap-2 sm:gap-3">
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                            const rule = ruleByDay.get(day);
                            const isActive = !!rule;

                            return (
                                <div key={day} className="flex flex-col items-center gap-2">
                                    {/* Day header */}
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: "0.65rem",
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            color: isActive ? "primary.main" : "text.disabled",
                                        }}
                                    >
                                        {DAY_NAMES[day]}
                                    </Typography>

                                    {/* Time block */}
                                    <Tooltip
                                        title={
                                            isActive && rule
                                                ? `${DAY_FULL[day]}: ${formatTime(rule.startTime)} – ${formatTime(rule.endTime)}`
                                                : `${DAY_FULL[day]}: Not available`
                                        }
                                        arrow
                                        placement="top"
                                    >
                                        <div
                                            className="w-full rounded-xl flex flex-col items-center justify-center gap-1 cursor-default transition-all duration-200 hover:scale-[1.03]"
                                            style={{
                                                minHeight: "96px",
                                                padding: "10px 6px",
                                                background: isActive
                                                    ? isDark
                                                        ? "linear-gradient(135deg, rgba(29,78,216,0.25) 0%, rgba(99,102,241,0.2) 100%)"
                                                        : "linear-gradient(135deg, rgba(29,78,216,0.10) 0%, rgba(99,102,241,0.07) 100%)"
                                                    : isDark
                                                    ? "rgba(255,255,255,0.03)"
                                                    : "rgba(0,0,0,0.03)",
                                                border: isActive
                                                    ? isDark
                                                        ? "1px solid rgba(99,102,241,0.35)"
                                                        : "1px solid rgba(29,78,216,0.20)"
                                                    : isDark
                                                    ? "1px solid rgba(255,255,255,0.06)"
                                                    : "1px solid rgba(0,0,0,0.06)",
                                            }}
                                        >
                                            {isActive && rule ? (
                                                <>
                                                    <ClockIcon
                                                        size={14}
                                                        className="text-primary opacity-80"
                                                    />
                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.6rem",
                                                            fontWeight: 700,
                                                            color: "primary.main",
                                                            textAlign: "center",
                                                            lineHeight: 1.3,
                                                        }}
                                                    >
                                                        {formatTime(rule.startTime)}
                                                    </Typography>
                                                    <div
                                                        className="w-3 border-t"
                                                        style={{
                                                            borderColor: isDark
                                                                ? "rgba(99,102,241,0.4)"
                                                                : "rgba(29,78,216,0.25)",
                                                        }}
                                                    />
                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.6rem",
                                                            fontWeight: 700,
                                                            color: "primary.main",
                                                            textAlign: "center",
                                                            lineHeight: 1.3,
                                                        }}
                                                    >
                                                        {formatTime(rule.endTime)}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <ProhibitIcon
                                                    size={16}
                                                    className={isDark ? "text-zinc-700" : "text-zinc-300"}
                                                />
                                            )}
                                        </div>
                                    </Tooltip>

                                    {/* Active indicator dot */}
                                    <div
                                        className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                                        style={{
                                            background: isActive
                                                ? isDark
                                                    ? "#6366f1"
                                                    : "#1d4ed8"
                                                : isDark
                                                ? "#27272a"
                                                : "#e4e4e7",
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-5 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30" />
                            <Typography variant="caption" color="text.secondary">
                                Available
                            </Typography>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{
                                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                                    border: isDark
                                        ? "1px solid rgba(255,255,255,0.06)"
                                        : "1px solid rgba(0,0,0,0.06)",
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                Unavailable
                            </Typography>
                        </div>
                        <Chip
                            label={`${slotDuration}-min slots`}
                            size="small"
                            variant="outlined"
                            sx={{ ml: "auto", fontSize: "0.65rem", fontWeight: 600 }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Exceptions & Overrides */}
            <Card
                elevation={0}
                variant="outlined"
                sx={{
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                    bgcolor: isDark ? "#161616" : "#ffffff",
                    borderRadius: 3,
                }}
            >
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <WarningIcon size={20} className="text-amber-500" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Exceptions &amp; Overrides
                        </Typography>
                        <Chip
                            label={`${memberExceptions.length} upcoming`}
                            size="small"
                            sx={{
                                ml: "auto",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                bgcolor: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)",
                                color: isDark ? "#fbbf24" : "#b45309",
                                border: "none",
                            }}
                        />
                    </div>

                    {memberExceptions.length === 0 ? (
                        <div className="py-10 flex flex-col items-center gap-3 text-center">
                            <CheckCircleIcon size={36} className="text-emerald-400 opacity-60" />
                            <Typography color="text.secondary" variant="body2">
                                No exceptions scheduled. Your regular hours apply to all dates.
                            </Typography>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {memberExceptions.map((exc, idx) => {
                                const config = EXCEPTION_CONFIG[exc.type];
                                const ExcIcon = config.Icon;
                                return (
                                    <React.Fragment key={exc.id}>
                                        <div className="flex items-start gap-4">
                                            {/* Date block */}
                                            <div
                                                className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5"
                                                style={{
                                                    background: isDark
                                                        ? "rgba(255,255,255,0.04)"
                                                        : "rgba(0,0,0,0.04)",
                                                    border: isDark
                                                        ? "1px solid rgba(255,255,255,0.07)"
                                                        : "1px solid rgba(0,0,0,0.07)",
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
                                                    {new Date(exc.date + "T12:00:00Z").toLocaleDateString("en-US", { month: "short" })}
                                                </Typography>
                                                <Typography sx={{ fontWeight: 800, fontSize: "1.25rem", lineHeight: 1 }}>
                                                    {new Date(exc.date + "T12:00:00Z").getDate()}
                                                </Typography>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {formatDate(exc.date)}
                                                    </Typography>
                                                    <Chip
                                                        icon={<ExcIcon size={12} />}
                                                        label={config.label}
                                                        size="small"
                                                        color={config.color}
                                                        sx={{ fontSize: "0.65rem", fontWeight: 700, height: 20 }}
                                                    />
                                                </div>
                                                <Typography variant="caption" color="text.secondary" className="mt-1 block">
                                                    {exc.type === "custom-hours" && exc.overrideStart && exc.overrideEnd
                                                        ? `Custom hours: ${formatTime(exc.overrideStart)} – ${formatTime(exc.overrideEnd)}`
                                                        : exc.type === "leave"
                                                        ? "Fully unavailable — no appointments will be booked."
                                                        : "Company holiday — no appointments."}
                                                </Typography>
                                            </div>
                                        </div>
                                        {idx < memberExceptions.length - 1 && (
                                            <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}

                    {/* TODO: replace with Supabase call in Phase 2 */}
                    <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                        <div
                            className="h-10 w-full rounded-lg border border-dashed flex items-center justify-center gap-2"
                            style={{
                                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                            }}
                        >
                            <Typography variant="caption" color="text.disabled">
                                + Add exception &nbsp;·&nbsp; (Phase 2 — form to be wired here)
                            </Typography>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Box>
    );
}
