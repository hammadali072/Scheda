// app/(member)/member/profile/page.tsx
//
// Member Profile & Settings page.
// Editable form: name, bio, avatar placeholder, email.
// Designation shown read-only (admin-only change).
// Notification preference toggles (UI only).
// All mutations update local state only.

"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
    UserIcon,
    EnvelopeIcon,
    CameraIcon,
    LockIcon,
    BellIcon,
    FloppyDiskIcon,
    InfoIcon,
} from "@phosphor-icons/react";
import Button from "@/components/ui/button";
import { mockMembers, mockDesignations } from "@/lib/data";

// TODO: replace with Supabase call in Phase 2 — fetch authenticated member
const MEMBER_ID = "m1";

export default function MemberProfilePage() {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";

    const currentMember = mockMembers.find((m) => m.id === MEMBER_ID)!;
    const designation = mockDesignations.find((d) => d.id === currentMember.designationId);

    // Form state
    const [name, setName] = React.useState(currentMember.name);
    const [email, setEmail] = React.useState(currentMember.email);
    const [bio, setBio] = React.useState(currentMember.bio ?? "");

    // Notification toggles (UI only)
    const [notifyEmail, setNotifyEmail] = React.useState(true);
    const [notifyNewBooking, setNotifyNewBooking] = React.useState(true);
    const [notifyCancel, setNotifyCancel] = React.useState(true);
    const [notifyReminder, setNotifyReminder] = React.useState(false);

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const cardBg = isDark ? "#161616" : "#ffffff";

    const handleSave = () => {
        // TODO: replace with Supabase call in Phase 2
        setSnackbarOpen(true);
    };

    function SectionCard({
        icon,
        title,
        children,
    }: {
        icon: React.ReactNode;
        title: string;
        children: React.ReactNode;
    }) {
        return (
            <Card elevation={0} variant="outlined" sx={{ borderColor: cardBorder, bgcolor: cardBg, borderRadius: 3 }}>
                <CardContent className="p-6">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: isDark ? "rgba(99,102,241,0.12)" : "rgba(29,78,216,0.07)" }}
                        >
                            <span className="text-primary">{icon}</span>
                        </div>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {title}
                        </Typography>
                    </div>
                    {children}
                </CardContent>
            </Card>
        );
    }

    function NotifRow({
        label,
        description,
        value,
        onChange,
    }: {
        label: string;
        description: string;
        value: boolean;
        onChange: (v: boolean) => void;
    }) {
        return (
            <div className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {description}
                    </Typography>
                </div>
                <Switch
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    size="small"
                    color="primary"
                />
            </div>
        );
    }

    return (
        <Box className="flex flex-col gap-6 max-w-2xl">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
                        My Profile
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Update your personal details and notification preferences.
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    startIcon={<FloppyDiskIcon size={18} />}
                    sx={{ borderRadius: 2, flexShrink: 0, alignSelf: "flex-start" }}
                >
                    Save Changes
                </Button>
            </div>

            {/* Avatar section */}
            <SectionCard icon={<CameraIcon size={16} />} title="Profile Photo">
                <div className="flex items-center gap-5">
                    <Avatar
                        src={currentMember.avatarUrl}
                        alt={name}
                        sx={{
                            width: 72, height: 72,
                            bgcolor: isDark ? "rgba(99,102,241,0.25)" : "rgba(29,78,216,0.15)",
                            color: "primary.main",
                            fontWeight: 800, fontSize: "1.5rem",
                        }}
                    >
                        {name.charAt(0)}
                    </Avatar>
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<CameraIcon size={16} />}
                            sx={{ borderRadius: 2 }}
                            disabled
                        >
                            Upload Photo
                        </Button>
                        <Typography variant="caption" color="text.secondary">
                            JPG, PNG up to 2 MB — real upload wired in Phase 2.
                        </Typography>
                    </div>
                </div>
            </SectionCard>

            {/* Personal info */}
            <SectionCard icon={<UserIcon size={16} />} title="Personal Information">
                <div className="flex flex-col gap-4">
                    <TextField
                        fullWidth
                        size="small"
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Bio"
                        multiline
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell clients a bit about yourself and your expertise..."
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />

                    {/* Read-only designation */}
                    <div
                        className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg"
                        style={{
                            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                            border: `1px solid ${cardBorder}`,
                        }}
                    >
                        <div className="min-w-0">
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Designation
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>
                                {designation?.name ?? "—"}
                            </Typography>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Chip
                                icon={<LockIcon size={11} />}
                                label="Admin Only"
                                size="small"
                                sx={{
                                    fontSize: "0.62rem",
                                    fontWeight: 700,
                                    height: 20,
                                    bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                    color: "text.disabled",
                                    border: "none",
                                    "& .MuiChip-icon": { color: "text.disabled", ml: "6px" },
                                }}
                            />
                            <Tooltip title="Only an admin can change your designation." arrow>
                                <span>
                                    <InfoIcon size={14} className="text-zinc-400 cursor-help" />
                                </span>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* Notification preferences */}
            <SectionCard icon={<BellIcon size={16} />} title="Notification Preferences">
                <div className="flex flex-col divide-y" style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}>
                    <Divider sx={{ display: "none" }} />
                    <NotifRow
                        label="Email Notifications"
                        description="Receive summary emails for your account activity."
                        value={notifyEmail}
                        onChange={setNotifyEmail}
                    />
                    <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
                    <NotifRow
                        label="New Booking Alerts"
                        description="Get notified when a client books a new session."
                        value={notifyNewBooking}
                        onChange={setNotifyNewBooking}
                    />
                    <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
                    <NotifRow
                        label="Cancellation Alerts"
                        description="Get notified when a client cancels their appointment."
                        value={notifyCancel}
                        onChange={setNotifyCancel}
                    />
                    <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
                    <NotifRow
                        label="Appointment Reminders"
                        description="Receive reminders 1 hour before each session."
                        value={notifyReminder}
                        onChange={setNotifyReminder}
                    />
                </div>
                <Typography variant="caption" color="text.secondary" className="mt-3 block">
                    Email delivery will be configured in Phase 2 via Supabase Edge Functions.
                </Typography>
            </SectionCard>

            {/* Save button bottom */}
            <div className="flex justify-end pb-2">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    startIcon={<FloppyDiskIcon size={18} />}
                    sx={{ borderRadius: 2 }}
                >
                    Save Changes
                </Button>
            </div>

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
                    Profile updated successfully.
                </Alert>
            </Snackbar>
        </Box>
    );
}
