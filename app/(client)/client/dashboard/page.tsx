// app/(client)/client/dashboard/page.tsx
//
// Client dashboard browse & book page.
// Allows searching, filtering by designation, and booking mock appointments
// using a dynamic client-side availability engine that prevents double-booking.

"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@/components/ui/button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
    MagnifyingGlassIcon,
    CalendarIcon,
    ClockIcon,
    FunnelIcon,
    UserIcon,
    ChatCircleTextIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    InfoIcon,
} from "@phosphor-icons/react";
import {
    mockMembers,
    mockDesignations,
    mockAvailabilityRules,
    mockAvailabilityExceptions,
    mockAppointments,
} from "@/lib/data";

// Set base date matching the mock appointment timeline (July 8, 2026)
const CALENDAR_START_DATE = "2026-07-08";

/** Helper: Parse "09:00" to minutes from midnight */
function timeToMinutes(t: string): number {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

/** Helper: Format minutes from midnight to "09:30" */
function minutesToTime(m: number): string {
    const h = Math.floor(m / 60);
    const mins = m % 60;
    return `${String(h).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/** Format "09:00" → "9:00 AM" */
function formatTime(t: string): string {
    const [hStr, mStr] = t.split(":");
    const h = parseInt(hStr, 10);
    const period = h >= 12 ? "PM" : "AM";
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}:${mStr} ${period}`;
}

/** Generate list of 7 consecutive dates starting from target date */
function getNext7Days(startDateStr: string) {
    const dates = [];
    const baseDate = new Date(startDateStr + "T12:00:00Z");
    for (let i = 0; i < 7; i++) {
        const next = new Date(baseDate);
        next.setDate(baseDate.getDate() + i);
        dates.push(next.toISOString().split("T")[0]);
    }
    return dates;
}

/**
 * Availability Engine: Generates open slots for a member on a specific date,
 * filtering out slots that conflict with existing appointments or exceptions.
 */
function getAvailableSlots(memberId: string, dateStr: string): string[] {
    const dateObj = new Date(dateStr + "T12:00:00Z");
    const dayOfWeek = dateObj.getDay();

    // 1. Check for Full Day Off / Leaves
    const leaveException = mockAvailabilityExceptions.find(
        (e) => e.memberId === memberId && e.date === dateStr && e.type === "leave"
    );
    if (leaveException) return [];

    // 2. Check for Holiday exceptions
    const holidayException = mockAvailabilityExceptions.find(
        (e) => e.memberId === memberId && e.date === dateStr && e.type === "holiday"
    );
    if (holidayException) return [];

    // 3. Check for custom hours override
    const customHours = mockAvailabilityExceptions.find(
        (e) => e.memberId === memberId && e.date === dateStr && e.type === "custom-hours"
    );

    // 4. Retrieve weekly rule
    const rule = mockAvailabilityRules.find(
        (r) => r.memberId === memberId && r.dayOfWeek === dayOfWeek
    );
    if (!rule && !customHours) return [];

    const startTime = customHours?.overrideStart || rule?.startTime || "09:00";
    const endTime = customHours?.overrideEnd || rule?.endTime || "17:00";
    const slotDuration = rule?.slotDurationMinutes || 30;

    const allSlots: string[] = [];
    let current = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    while (current + slotDuration <= end) {
        allSlots.push(minutesToTime(current));
        current += slotDuration;
    }

    // 5. Filter out already booked slots on this day
    const bookedTimes = mockAppointments
        .filter((app) => app.memberId === memberId && app.status !== "cancelled")
        .map((app) => {
            const apptDate = new Date(app.startTime);
            const apptDateStr = apptDate.toISOString().split("T")[0];
            if (apptDateStr !== dateStr) return null;
            return apptDate.toISOString().split("T")[1].slice(0, 5); // "10:00"
        })
        .filter(Boolean) as string[];

    return allSlots.filter((slot) => !bookedTimes.includes(slot));
}

export default function BrowseMembersPage() {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";

    // Filter states
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedDesignation, setSelectedDesignation] = React.useState("all");

    // Booking Modal states
    const [selectedMember, setSelectedMember] = React.useState<typeof mockMembers[0] | null>(null);
    const [selectedDate, setSelectedDate] = React.useState("");
    const [selectedSlot, setSelectedSlot] = React.useState("");
    const [notes, setNotes] = React.useState("");
    const [bookingSuccess, setBookingSuccess] = React.useState(false);

    // Filter members list (only active ones are browseable)
    const activeMembers = mockMembers.filter((m) => m.isActive);

    const filteredMembers = activeMembers.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.bio?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDesignation =
            selectedDesignation === "all" || member.designationId === selectedDesignation;
        return matchesSearch && matchesDesignation;
    });

    const datesList = getNext7Days(CALENDAR_START_DATE);
    const availableSlots = selectedMember && selectedDate ? getAvailableSlots(selectedMember.id, selectedDate) : [];

    const handleOpenBooking = (member: typeof mockMembers[0]) => {
        setSelectedMember(member);
        setSelectedDate(datesList[0]); // default to first available date
        setSelectedSlot("");
        setNotes("");
        setBookingSuccess(false);
    };

    const handleConfirmBooking = () => {
        // TODO: replace with Supabase call in Phase 2
        setBookingSuccess(true);
    };

    const handleCloseBooking = () => {
        setSelectedMember(null);
    };

    return (
        <Box className="flex flex-col gap-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
                        Browse Advisors
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Find a consultant, select an open time slot, and book your session instantly.
                    </Typography>
                </div>
            </div>

            {/* Filter controls row */}
            <Card
                elevation={0}
                variant="outlined"
                sx={{
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                    bgcolor: isDark ? "#161616" : "#ffffff",
                    borderRadius: 3,
                }}
            >
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                    {/* Search Field */}
                    <Box className="flex-1">
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by name or specialty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <MagnifyingGlassIcon size={18} className="text-zinc-400 mr-2" />
                                    ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Box>

                    {/* Designation Dropdown Filter */}
                    <Box className="w-full sm:w-64">
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={selectedDesignation}
                            onChange={(e) => setSelectedDesignation(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        >
                            <MenuItem value="all">All Specialties</MenuItem>
                            {mockDesignations.map((des) => (
                                <MenuItem key={des.id} value={des.id}>
                                    {des.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </CardContent>
            </Card>

            {/* Members grid list */}
            {filteredMembers.length === 0 ? (
                <Card
                    elevation={0}
                    variant="outlined"
                    className="py-16 text-center border-dashed"
                    sx={{ borderRadius: 3 }}
                >
                    <Typography color="text.secondary" variant="body1">
                        No advisors match your search criteria.
                    </Typography>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {filteredMembers.map((member) => {
                        const designation = mockDesignations.find((d) => d.id === member.designationId);
                        return (
                            <Grid size={{ xs: 12, md: 6 }} key={member.id}>
                                <Card
                                    elevation={0}
                                    variant="outlined"
                                    sx={{
                                        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                                        bgcolor: isDark ? "#161616" : "#ffffff",
                                        borderRadius: 3,
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: isDark
                                                ? "0 8px 30px rgba(0,0,0,0.4)"
                                                : "0 8px 30px rgba(0,0,0,0.05)",
                                        },
                                    }}
                                >
                                    <CardContent className="p-6 flex gap-4">
                                        <Avatar
                                            src={member.avatarUrl}
                                            alt={member.name}
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                bgcolor: "primary.main",
                                                fontWeight: 800,
                                            }}
                                        >
                                            {member.name.charAt(0)}
                                        </Avatar>

                                        <Box className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Typography variant="h6" className="font-bold text-zinc-900 dark:text-zinc-100" noWrap>
                                                    {member.name}
                                                </Typography>
                                                <Chip
                                                    label="Verified"
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                    sx={{ fontSize: "0.6rem", height: 18, fontWeight: 700 }}
                                                />
                                            </div>

                                            <Typography variant="body2" color="primary" className="font-semibold mb-3">
                                                {designation?.name}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" className="line-clamp-2 mb-4 text-sm leading-relaxed">
                                                {member.bio || "No summary profile provided."}
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleOpenBooking(member)}
                                                className="w-full sm:w-auto"
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Book Consultation
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Interactive Booking Modal dialog */}
            <Dialog
                open={!!selectedMember}
                onClose={handleCloseBooking}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: isDark ? "#121212" : "#ffffff",
                            backgroundImage: "none",
                            borderRadius: 3,
                            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "none",
                        },
                    },
                }}
            >
                {selectedMember && (
                    <>
                        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
                            {bookingSuccess ? "Booking Confirmed" : "Configure Consultation"}
                        </DialogTitle>
                        <DialogContent dividers sx={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
                            {bookingSuccess ? (
                                <Box className="py-6 flex flex-col items-center gap-4 text-center">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                                        <CheckCircleIcon size={44} weight="fill" />
                                    </div>
                                    <div>
                                        <Typography variant="h6" className="font-bold">
                                            Appointment Scheduled Successfully!
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" className="mt-2 max-w-sm">
                                            Your appointment with <strong>{selectedMember.name}</strong> on <strong>{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong> at <strong>{formatTime(selectedSlot)}</strong> is confirmed.
                                        </Typography>
                                    </div>
                                    <Alert severity="info" className="mt-4 w-full text-left" icon={<InfoIcon size={18} />}>
                                        This is a Phase 1 mock reservation. The entry has been dynamically cross-checked for conflicts. Real database sync will be wired in Phase 2.
                                    </Alert>
                                </Box>
                            ) : (
                                <Box className="flex flex-col gap-6 py-2">
                                    {/* Advisor header details */}
                                    <Box className="flex items-center gap-3">
                                        <Avatar src={selectedMember.avatarUrl} sx={{ width: 44, height: 44 }} />
                                        <div>
                                            <Typography variant="subtitle1" className="font-bold">
                                                {selectedMember.name}
                                            </Typography>
                                            <Typography variant="caption" color="primary" className="font-semibold">
                                                {mockDesignations.find((d) => d.id === selectedMember.designationId)?.name}
                                            </Typography>
                                        </div>
                                    </Box>

                                    {/* Date selector grid */}
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }} className="flex items-center gap-1.5">
                                            <CalendarIcon size={16} /> Select Date
                                        </Typography>
                                        <Box className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                                            {datesList.map((date) => {
                                                const dateObj = new Date(date + "T12:00:00Z");
                                                const isSelected = selectedDate === date;
                                                const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                                                const dayNum = dateObj.getDate();

                                                return (
                                                    <button
                                                        key={date}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedDate(date);
                                                            setSelectedSlot("");
                                                        }}
                                                        className={`flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center border cursor-pointer transition-all ${isSelected
                                                                ? "bg-primary border-primary text-white"
                                                                : isDark
                                                                    ? "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-300"
                                                                    : "border-zinc-200 hover:border-zinc-300 bg-zinc-50 text-zinc-700"
                                                            }`}
                                                    >
                                                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{weekday}</span>
                                                        <span className="text-lg font-extrabold mt-0.5">{dayNum}</span>
                                                    </button>
                                                );
                                            })}
                                        </Box>
                                    </Box>

                                    {/* Available slots picker */}
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }} className="flex items-center gap-1.5">
                                            <ClockIcon size={16} /> Available Slots
                                        </Typography>
                                        {availableSlots.length === 0 ? (
                                            <Alert severity="warning" className="w-full text-xs font-semibold py-1">
                                                No remaining conflict-free hours available on this date.
                                            </Alert>
                                        ) : (
                                            <div className="grid grid-cols-4 gap-2">
                                                {availableSlots.map((slot) => {
                                                    const isSelected = selectedSlot === slot;
                                                    return (
                                                        <button
                                                            key={slot}
                                                            type="button"
                                                            onClick={() => setSelectedSlot(slot)}
                                                            className={`py-2 rounded-lg text-xs font-bold border cursor-pointer transition-all ${isSelected
                                                                    ? "bg-primary border-primary text-white"
                                                                    : isDark
                                                                        ? "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 text-zinc-300"
                                                                        : "border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700"
                                                                }`}
                                                        >
                                                            {formatTime(slot)}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </Box>

                                    {/* Appointment details notes input */}
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }} className="flex items-center gap-1.5">
                                            <ChatCircleTextIcon size={16} /> Message / Notes
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Provide any details about what you want to consult or review..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            {bookingSuccess ? (
                                <Button onClick={handleCloseBooking} variant="contained" color="primary">
                                    Close Window
                                </Button>
                            ) : (
                                <>
                                    <Button onClick={handleCloseBooking} variant="text" sx={{ color: "text.secondary" }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleConfirmBooking}
                                        variant="contained"
                                        color="primary"
                                        disabled={!selectedSlot}
                                    >
                                        Confirm Reservation
                                    </Button>
                                </>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
