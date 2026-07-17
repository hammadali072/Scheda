import React, { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
    ArrowLeftIcon,
    CalendarBlankIcon,
    ClockIcon,
    ChatCenteredTextIcon,
    CheckCircleIcon,
    SparkleIcon,
    ArrowRightIcon,
    CheckIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import {
    BOOKABLE_MEMBERS,
    MEMBER_AVAILABILITY_MAP,
    APPOINTMENT_PURPOSES,
    type ClientAppointment,
    type AppointmentPurpose,
} from "@/mock/clientMockData";
import { useClientAppointments } from "@/context/client-appointments-context";
import { type DaySchedule, type TimeRange } from "@/mock/memberMockData";

// â”€â”€â”€ Mock today â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MOCK_TODAY = "2026-07-15";

// â”€â”€â”€ Utilities â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Returns available YYYY-MM-DD dates for the next `daysAhead` days given a member schedule. */
function getAvailableDates(schedule: DaySchedule[], daysAhead = 28): string[] {
    const dates: string[] = [];
    const base = new Date(MOCK_TODAY + "T00:00:00");
    for (let i = 0; i < daysAhead; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const dayName = d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
        const day = schedule.find((s) => s.day === dayName);
        if (day?.enabled && day.ranges.length > 0) {
            dates.push(d.toISOString().split("T")[0]);
        }
    }
    return dates;
}

/** Generates 60-minute slot strings ("9:00 AM", "10:00 AM", â€¦) from TimeRanges. */
function generateSlots(ranges: TimeRange[]): string[] {
    const slots: string[] = [];
    for (const range of ranges) {
        const [sh, sm] = range.start.split(":").map(Number);
        const [eh, em] = range.end.split(":").map(Number);
        let cur = sh * 60 + sm;
        const end = eh * 60 + em;
        while (cur + 60 <= end) {
            const h = Math.floor(cur / 60);
            const m = cur % 60;
            const ampm = h >= 12 ? "PM" : "AM";
            const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
            slots.push(`${dh}:${m.toString().padStart(2, "0")} ${ampm}`);
            cur += 60;
        }
    }
    return slots;
}

/** Pretty-prints YYYY-MM-DD â†’ e.g. "Thu, Jul 17" */
function fmtDateShort(d: string) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

/** Pretty-prints YYYY-MM-DD â†’ e.g. "Thursday, July 17, 2026" */
function fmtDateLong(d: string) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

// â”€â”€â”€ Step indicator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STEPS = ["Select a time", "Your details", "Confirm"] as const;
type Step = 0 | 1 | 2 | 3; // 3 = success

function StepBar({ current }: { current: Step }) {
    return (
        <div className="flex items-center gap-0" role="list" aria-label="Booking steps">
            {STEPS.map((label, i) => {
                const done = current > i;
                const active = current === i;
                return (
                    <React.Fragment key={label}>
                        <div role="listitem" className="flex items-center gap-2">
                            <div
                                className={clsx(
                                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                    done
                                        ? "bg-primary text-white"
                                        : active
                                            ? "bg-primary text-white ring-4 ring-primary/20"
                                            : "bg-black/10 dark:bg-white/10 text-black/40 dark:text-white/90"
                                )}
                                aria-current={active ? "step" : undefined}
                            >
                                {done ? <CheckIcon size={13} weight="bold" /> : i + 1}
                            </div>
                            <span
                                className={clsx(
                                    "text-xs font-semibold hidden sm:block",
                                    active
                                        ? "text-black dark:text-white/90"
                                        : done
                                            ? "text-primary"
                                            : "text-black/40 dark:text-white/90"
                                )}
                            >
                                {label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div
                                className={clsx(
                                    "flex-1 h-px mx-3 transition-colors",
                                    current > i ? "bg-primary" : "bg-black/10 dark:bg-white/10"
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

// â”€â”€â”€ Date chip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DateChip({
    date,
    selected,
    onSelect,
}: {
    date: string;
    selected: boolean;
    onSelect: () => void;
}) {
    const d = new Date(date + "T00:00:00");
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    const num = d.getDate();
    const mon = d.toLocaleDateString("en-US", { month: "short" });

    return (
        <button
            type="button"
            onClick={onSelect}
            className={clsx(
                "flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border text-xs font-semibold transition-all duration-150 min-w-[64px]",
                "focus: focus-visible:ring-2 focus-visible:ring-primary/40",
                selected
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                    : "bg-surface dark:bg-tint-black/60 border-black/10 dark:border-white/10 text-black dark:text-white/90 hover:border-primary/40 hover:bg-primary/5"
            )}
            aria-pressed={selected}
            aria-label={`Select ${fmtDateShort(date)}`}
        >
            <span className={clsx("text-[10px] uppercase tracking-wider", selected ? "text-white/70" : "text-black/40 dark:text-white/90")}>
                {day}
            </span>
            <span className="text-lg font-black leading-tight">{num}</span>
            <span className={clsx("text-[10px]", selected ? "text-white/70" : "text-black/40 dark:text-white/90")}>
                {mon}
            </span>
        </button>
    );
}

// â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ClientBookAppointment() {
    const { memberId } = useParams<{ memberId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { addAppointment, cancelAppointment } = useClientAppointments();

    // Reschedule support: navigate here with state { reschedule: ClientAppointment }
    const reschedule: ClientAppointment | undefined = (location.state as { reschedule?: ClientAppointment })?.reschedule;

    const member = BOOKABLE_MEMBERS.find((m) => m.id === memberId);
    const schedule = memberId ? MEMBER_AVAILABILITY_MAP[memberId] ?? [] : [];

    // â”€â”€ Booking state â”€â”€
    const [step, setStep] = useState<Step>(0);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [purpose, setPurpose] = useState<AppointmentPurpose | "">(
        reschedule ? (reschedule.purpose as AppointmentPurpose) : ""
    );
    const [purposeOther, setPurposeOther] = useState(
        reschedule && !APPOINTMENT_PURPOSES.slice(0, -1).includes(reschedule.purpose as AppointmentPurpose)
            ? reschedule.purpose
            : ""
    );
    const [notes, setNotes] = useState(reschedule?.notes ?? "");

    // â”€â”€ Computed â”€â”€
    const availableDates = useMemo(() => getAvailableDates(schedule), [schedule]);

    const slotsForDate = useMemo(() => {
        if (!selectedDate) return [];
        const d = new Date(selectedDate + "T00:00:00");
        const dayName = d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
        const day = schedule.find((s) => s.day === dayName);
        return day ? generateSlots(day.ranges) : [];
    }, [selectedDate, schedule]);

    // Effective purpose string (resolves "Other" â†’ free text)
    const effectivePurpose = purpose === "Other" ? purposeOther.trim() : purpose;

    const step0Valid = !!selectedDate && !!selectedSlot;
    const step1Valid = !!effectivePurpose;

    // â”€â”€ Handlers â”€â”€
    const handleSubmit = () => {
        if (!member || !selectedDate || !selectedSlot || !effectivePurpose) return;

        const newAppt: ClientAppointment = {
            id: `ca-${Date.now()}`,
            memberId: member.id,
            memberName: member.name,
            memberRole: member.role,
            date: selectedDate,
            time: selectedSlot,
            purpose: effectivePurpose,
            notes: notes.trim(),
            status: "pending",
        };

        // If rescheduling, cancel the original first
        if (reschedule) {
            cancelAppointment(reschedule.id);
        }

        addAppointment(newAppt);
        setStep(3);
    };

    // â”€â”€ Guard: unknown member â”€â”€
    if (!member) {
        return (
            <div className="py-24 text-center space-y-4">
                <div className="text-4xl">ðŸ”</div>
                <h1 className="text-xl font-bold text-black dark:text-white/90">Member not found</h1>
                <p className="text-sm text-black/50 dark:text-white/90">
                    The member you're looking for doesn't exist or is no longer available.
                </p>
                <Link
                    to="/client/find"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    <ArrowLeftIcon size={15} weight="bold" />
                    Browse members
                </Link>
            </div>
        );
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Step 3 â€” Success
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (step === 3) {
        return (
            <div className="max-w-lg mx-auto py-12 space-y-6">
                {/* Success badge */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center motion-safe:animate-bounce">
                        <CheckCircleIcon size={48} weight="fill" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-black dark:text-white/90">Booking request sent!</h1>
                        <p className="text-sm text-black/50 dark:text-white/90 mt-2 max-w-sm">
                            {reschedule ? "Your original appointment has been cancelled and a new request has been submitted." : "Your appointment request has been submitted."} You'll be notified once {member.name} confirms.
                        </p>
                    </div>
                </div>

                {/* Summary card */}
                <div className="bg-surface dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 overflow-hidden">
                    <div className="bg-primary/5 border-b border-primary/10 px-6 py-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm flex-shrink-0">
                            {member.avatar}
                        </div>
                        <div>
                            <div className="font-bold text-black dark:text-white/90 text-sm">{member.name}</div>
                            <div className="text-xs text-black/40 dark:text-white/90">{member.role}</div>
                        </div>
                        <span className="ml-auto inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Pending
                        </span>
                    </div>
                    <div className="p-6 space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <CalendarBlankIcon size={16} className="text-primary mt-0.5 flex-shrink-0" weight="bold" />
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-0.5">Date & Time</div>
                                <div className="font-semibold text-black dark:text-white/90">{fmtDateLong(selectedDate!)}</div>
                                <div className="text-xs text-black/50 dark:text-white/90">{selectedSlot}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <SparkleIcon size={16} className="text-primary mt-0.5 flex-shrink-0" weight="bold" />
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-0.5">Purpose</div>
                                <div className="font-semibold text-black dark:text-white/90">{effectivePurpose}</div>
                            </div>
                        </div>
                        {notes.trim() && (
                            <div className="flex items-start gap-3">
                                <ChatCenteredTextIcon size={16} className="text-primary mt-0.5 flex-shrink-0" weight="bold" />
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-0.5">Notes</div>
                                    <div className="text-xs text-black/70 dark:text-white/90 leading-relaxed">{notes.trim()}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/client/appointments")}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-sm font-bold text-white shadow-sm shadow-primary/20 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        View My Appointments
                        <ArrowRightIcon size={15} weight="bold" />
                    </button>
                    <Link
                        to="/client/find"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-surface dark:bg-tint-black/60 text-sm font-semibold text-black dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        Book Another
                    </Link>
                </div>
            </div>
        );
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Steps 0â€“2
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    return (
        <div className="space-y-8">

            {/* Back link */}
            <div className="flex items-center gap-2">
                <Link
                    to="/client/find"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-black/50 dark:text-white/90 hover:text-black dark:hover:text-white/90 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                >
                    <ArrowLeftIcon size={15} weight="bold" />
                    Find a Member
                </Link>
                <span className="text-black/20 dark:text-white/90">/</span>
                <span className="text-sm font-semibold text-black dark:text-white/90 truncate">{member.name}</span>
            </div>

            {/* Member header card */}
            <div className="bg-surface dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 p-6 flex items-start gap-5">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl flex-shrink-0">
                    {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-xl font-extrabold text-black dark:text-white/90 leading-tight">{member.name}</div>
                    <div className="text-sm text-black/50 dark:text-white/90 mt-0.5">{member.role}</div>
                    <span className="inline-flex mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                        {member.specialty}
                    </span>
                    <p className="mt-3 text-sm text-black/60 dark:text-white/90 leading-relaxed line-clamp-2">
                        {member.bio}
                    </p>
                </div>
            </div>

            {/* Booking form card */}
            <div className="bg-surface dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 overflow-hidden">

                {/* Step bar */}
                <div className="px-6 py-5 border-b border-black/5 dark:border-white/5">
                    {reschedule && (
                        <div className="mb-4 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            Rescheduling: {reschedule.purpose} on {fmtDateShort(reschedule.date)} Â· {reschedule.time}
                        </div>
                    )}
                    <StepBar current={step} />
                </div>

                {/* â”€â”€ Step 0: Pick date & time â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                {step === 0 && (
                    <div className="p-6 space-y-7">

                        {/* Date picker */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <CalendarBlankIcon size={16} weight="bold" />
                                </span>
                                <h2 className="text-base font-bold text-black dark:text-white/90">
                                    Select a date
                                </h2>
                            </div>

                            {availableDates.length === 0 ? (
                                <p className="text-sm text-black/50 dark:text-white/90 py-4">
                                    No available dates in the next 28 days.
                                </p>
                            ) : (
                                <div className="flex gap-2.5 overflow-x-auto pb-2 snap-x snap-mandatory">
                                    {availableDates.map((date) => (
                                        <div key={date} className="snap-start">
                                            <DateChip
                                                date={date}
                                                selected={selectedDate === date}
                                                onSelect={() => {
                                                    setSelectedDate(date);
                                                    setSelectedSlot(null);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Time slot picker */}
                        {selectedDate && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                        <ClockIcon size={16} weight="bold" />
                                    </span>
                                    <h2 className="text-base font-bold text-black dark:text-white/90">
                                        Select a time
                                    </h2>
                                    <span className="text-xs text-black/40 dark:text-white/90">
                                        â€” {fmtDateShort(selectedDate)}
                                    </span>
                                </div>

                                {slotsForDate.length === 0 ? (
                                    <p className="text-sm text-black/50 dark:text-white/90">
                                        No slots available for this day.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                                        {slotsForDate.map((slot) => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot)}
                                                aria-pressed={selectedSlot === slot}
                                                className={clsx(
                                                    "px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all duration-150",
                                                    "focus: focus-visible:ring-2 focus-visible:ring-primary/40",
                                                    selectedSlot === slot
                                                        ? "bg-primary border-primary text-white shadow-sm shadow-primary/20"
                                                        : "bg-parchment/30 dark:bg-black/30 border-black/10 dark:border-white/10 text-black dark:text-white/90 hover:border-primary/40 hover:bg-primary/5"
                                                )}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex justify-end pt-2 border-t border-black/5 dark:border-white/5">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                disabled={!step0Valid}
                                className={clsx(
                                    "inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all",
                                    "focus: focus-visible:ring-2 focus-visible:ring-primary/40",
                                    step0Valid
                                        ? "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
                                        : "bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/90 cursor-not-allowed"
                                )}
                            >
                                Continue
                                <ArrowRightIcon size={15} weight="bold" />
                            </button>
                        </div>
                    </div>
                )}

                {/* â”€â”€ Step 1: Purpose & notes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                {step === 1 && (
                    <div className="p-6 space-y-6">

                        {/* Purpose */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <SparkleIcon size={16} weight="bold" />
                                </span>
                                <h2 className="text-base font-bold text-black dark:text-white/90">
                                    What's the purpose of this appointment?
                                </h2>
                                <span className="text-[10px] font-bold text-red-500 ml-auto">Required</span>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {APPOINTMENT_PURPOSES.map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPurpose(p)}
                                            aria-pressed={purpose === p}
                                            className={clsx(
                                                "px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-all duration-150",
                                                "focus: focus-visible:ring-2 focus-visible:ring-primary/40",
                                                purpose === p
                                                    ? "bg-primary/10 border-primary text-primary"
                                                    : "bg-parchment/30 dark:bg-black/30 border-black/10 dark:border-white/10 text-black dark:text-white/90 hover:border-primary/30 hover:bg-primary/5"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                {/* "Other" free text */}
                                {purpose === "Other" && (
                                    <div>
                                        <label
                                            htmlFor="purpose-other"
                                            className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1.5"
                                        >
                                            Describe the purpose
                                        </label>
                                        <input
                                            id="purpose-other"
                                            type="text"
                                            value={purposeOther}
                                            onChange={(e) => setPurposeOther(e.target.value)}
                                            placeholder="e.g. Estate planning for a family trust"
                                            maxLength={120}
                                            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-black/30 px-4 py-2.5 text-sm text-black dark:text-white/90 placeholder:text-black/30 dark:placeholder:text-white/90/30 focus: focus-visible:ring-2 focus-visible:ring-primary/40 transition"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <ChatCenteredTextIcon size={16} weight="bold" />
                                </span>
                                <h2 className="text-base font-bold text-black dark:text-white/90">
                                    Additional notes
                                </h2>
                                <span className="text-[10px] font-semibold text-black/30 dark:text-white/90 ml-auto">Optional</span>
                            </div>
                            <textarea
                                id="booking-notes"
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any context that would help the member prepare â€” documents to review, specific questions, background informationâ€¦"
                                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-black/30 px-4 py-3 text-sm text-black dark:text-white/90 placeholder:text-black/30 dark:placeholder:text-white/90/30 focus: focus-visible:ring-2 focus-visible:ring-primary/40 transition resize-none"
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                            <button
                                type="button"
                                onClick={() => setStep(0)}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-black/50 dark:text-white/90 hover:text-black dark:hover:text-white/90 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                                <ArrowLeftIcon size={14} weight="bold" />
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!step1Valid}
                                className={clsx(
                                    "inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all",
                                    "focus: focus-visible:ring-2 focus-visible:ring-primary/40",
                                    step1Valid
                                        ? "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
                                        : "bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/90 cursor-not-allowed"
                                )}
                            >
                                Review booking
                                <ArrowRightIcon size={15} weight="bold" />
                            </button>
                        </div>
                    </div>
                )}

                {/* â”€â”€ Step 2: Confirm â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                {step === 2 && (
                    <div className="p-6 space-y-6">
                        <div>
                            <h2 className="text-lg font-extrabold text-black dark:text-white/90">
                                Review your booking
                            </h2>
                            <p className="text-sm text-black/50 dark:text-white/90 mt-1">
                                Take a moment to confirm everything looks right before submitting.
                            </p>
                        </div>

                        {/* Summary card */}
                        <div className="rounded-2xl border-2 border-primary/20 bg-primary/[0.03] dark:bg-primary/[0.04] overflow-hidden">

                            {/* Member strip */}
                            <div className="px-6 py-5 border-b border-primary/10 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-base flex-shrink-0">
                                    {member.avatar}
                                </div>
                                <div>
                                    <div className="font-extrabold text-black dark:text-white/90 text-base leading-tight">{member.name}</div>
                                    <div className="text-xs text-black/50 dark:text-white/90 mt-0.5">{member.role}</div>
                                </div>
                            </div>

                            {/* Detail rows */}
                            <div className="px-6 py-5 space-y-5 text-sm">
                                <div className="flex items-start gap-4">
                                    <CalendarBlankIcon size={18} className="text-primary mt-0.5 flex-shrink-0" weight="bold" />
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-1">
                                            Date & Time
                                        </div>
                                        <div className="font-semibold text-black dark:text-white/90">{fmtDateLong(selectedDate!)}</div>
                                        <div className="text-xs text-black/50 dark:text-white/90 flex items-center gap-1 mt-0.5">
                                            <ClockIcon size={11} />
                                            {selectedSlot} Â· 60 minutes
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-primary/10 pt-5 flex items-start gap-4">
                                    <SparkleIcon size={18} className="text-primary mt-0.5 flex-shrink-0" weight="bold" />
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-1">
                                            Purpose
                                        </div>
                                        <div className="font-semibold text-black dark:text-white/90">{effectivePurpose}</div>
                                    </div>
                                </div>

                                {notes.trim() && (
                                    <div className="border-t border-primary/10 pt-5 flex items-start gap-4">
                                        <ChatCenteredTextIcon size={18} className="text-primary mt-0.5 flex-shrink-0" weight="bold" />
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-1">
                                                Your notes
                                            </div>
                                            <p className="text-xs text-black/70 dark:text-white/90 leading-relaxed bg-black/[0.03] dark:bg-white/[0.03] rounded-xl p-3 border border-black/5 dark:border-white/5">
                                                {notes.trim()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notice */}
                        <p className="text-xs text-black/40 dark:text-white/90 text-center leading-relaxed">
                            Your request will be sent to {member.name}. The appointment is confirmed once they accept.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-black/5 dark:border-white/5">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="order-2 sm:order-1 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-black/50 dark:text-white/90 hover:text-black dark:hover:text-white/90 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                                <ArrowLeftIcon size={14} weight="bold" />
                                Go back
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="order-1 sm:order-2 flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/35 hover:-translate-y-0.5 focus: focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                            >
                                <CheckCircleIcon size={17} weight="bold" />
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}



