// components/admin/status-badge.tsx

"use client";
//
// Reusable status chip/badge for admin dashboards.
// Applies style classes dynamically based on active status or appointment states.

import * as React from "react";
import Chip from "@mui/material/Chip";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
    CheckCircleIcon,
    XCircleIcon,
    WarningCircleIcon,
    ClockCountdownIcon,
} from "@phosphor-icons/react";

export type BadgeStatusType = "active" | "inactive" | "pending" | "confirmed" | "completed" | "cancelled" | "no-show";

interface StatusBadgeProps {
    status: BadgeStatusType | string;
    size?: "small" | "medium";
}

const CONFIG: Record<
    BadgeStatusType,
    {
        label: string;
        Icon: React.ComponentType<{ size: number }> | null;
        bgLight: string;
        bgDark: string;
        colorLight: string;
        colorDark: string;
    }
> = {
    active: {
        label: "Active",
        Icon: CheckCircleIcon,
        bgLight: "rgba(16,185,129,0.08)",
        bgDark: "rgba(16,185,129,0.12)",
        colorLight: "#047857",
        colorDark: "#34d399",
    },
    inactive: {
        label: "Inactive",
        Icon: XCircleIcon,
        bgLight: "rgba(107,114,128,0.08)",
        bgDark: "rgba(107,114,128,0.12)",
        colorLight: "#374151",
        colorDark: "#9ca3af",
    },
    confirmed: {
        label: "Confirmed",
        Icon: CheckCircleIcon,
        bgLight: "rgba(59,130,246,0.08)",
        bgDark: "rgba(59,130,246,0.12)",
        colorLight: "#1d4ed8",
        colorDark: "#60a5fa",
    },
    pending: {
        label: "Pending",
        Icon: ClockCountdownIcon,
        bgLight: "rgba(245,158,11,0.08)",
        bgDark: "rgba(245,158,11,0.12)",
        colorLight: "#b45309",
        colorDark: "#fbbf24",
    },
    completed: {
        label: "Completed",
        Icon: CheckCircleIcon,
        bgLight: "rgba(16,185,129,0.08)",
        bgDark: "rgba(16,185,129,0.12)",
        colorLight: "#047857",
        colorDark: "#34d399",
    },
    cancelled: {
        label: "Cancelled",
        Icon: XCircleIcon,
        bgLight: "rgba(239,68,68,0.08)",
        bgDark: "rgba(239,68,68,0.12)",
        colorLight: "#b91c1c",
        colorDark: "#f87171",
    },
    "no-show": {
        label: "No Show",
        Icon: WarningCircleIcon,
        bgLight: "rgba(249,115,22,0.08)",
        bgDark: "rgba(249,115,22,0.12)",
        colorLight: "#c2410c",
        colorDark: "#fb923c",
    },
};

export default function StatusBadge({ status, size = "small" }: StatusBadgeProps) {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";

    const normalizedStatus = (status.toLowerCase()) as BadgeStatusType;
    const cfg = CONFIG[normalizedStatus] || CONFIG.inactive;
    const StatusIcon = cfg.Icon;

    return (
        <Chip
            size={size}
            icon={StatusIcon ? <StatusIcon size={12} /> : undefined}
            label={cfg.label}
            sx={{
                fontWeight: 700,
                fontSize: "0.68rem",
                height: size === "small" ? 22 : 28,
                bgcolor: isDark ? cfg.bgDark : cfg.bgLight,
                color: isDark ? cfg.colorDark : cfg.colorLight,
                border: "none",
                "& .MuiChip-icon": {
                    color: "inherit",
                    marginLeft: size === "small" ? "6px" : "10px",
                },
            }}
        />
    );
}
