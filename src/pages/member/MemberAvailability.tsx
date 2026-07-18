import { useState, useEffect, useCallback } from "react";
import {
    PlusIcon,
    XIcon,
    CheckIcon,
    FloppyDiskIcon,
    WarningIcon,
    CalendarBlankIcon,
    LockIcon,
    ClockIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import {
    type DaySchedule,
    type DateOverride,
    type TimeRange,
    MEMBER_WEEKLY_AVAILABILITY,
    MEMBER_DATE_OVERRIDES,
} from "@/mock/memberMockData";
import TitleComponent from "@/components/shared/TitleComponent";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={`Toggle ${label} availability`}
            onClick={onChange}
            className={clsx(
                "relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200",
                "focus: focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-card-dark",
                checked ? "bg-gradient-to-b from-primary-start to-primary-end" : "bg-black/15 dark:bg-white/15"
            )}
        >
            <span
                className={clsx(
                    "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                    "motion-safe:transition-transform motion-safe:duration-200",
                    checked ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
    );
}

function TimeChip({
    range,
    onRemove,
    disabled,
}: {
    range: TimeRange;
    onRemove: () => void;
    disabled: boolean;
}) {
    return (
        <div
            className={clsx(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors",
                disabled
                    ? "border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-black/30 dark:text-white/90"
                    : "border-primary/20 bg-primary/5 text-primary"
            )}
        >
            <ClockIcon size={11} weight="bold" />
            <span>
                {range.start} - {range.end}
            </span>
            {!disabled && (
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={`Remove ${range.start}-${range.end} slot`}
                    className="text-primary/50 hover:text-red-500 transition-colors focus: focus-visible:ring-1 focus-visible:ring-red-500 rounded"
                >
                    <XIcon size={11} weight="bold" />
                </button>
            )}
        </div>
    );
}

function AddSlotForm({
    onConfirm,
    onCancel,
}: {
    onConfirm: (range: TimeRange) => void;
    onCancel: () => void;
}) {
    const [start, setStart] = useState("09:00");
    const [end, setEnd] = useState("17:00");

    const handleConfirm = () => {
        if (start && end && start < end) {
            onConfirm({ start, end });
        }
    };

    return (
        <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
            <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                aria-label="Start time"
                placeholder="Start"
                className="text-xs   text-black dark:text-white/90 bg-transparent focus-visible:ring-1 focus-visible:ring-primary/50 rounded"
            />
            <span className="text-[10px] text-black/40 dark:text-white/90 font-semibold">to</span>
            <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                aria-label="End time"
                placeholder="End"
                className="text-xs   text-black dark:text-white/90 bg-transparent focus-visible:ring-1 focus-visible:ring-primary/50 rounded"
            />
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!start || !end || start >= end}
                    aria-label="Confirm add slot"
                    className="p-1 rounded text-emerald-500 hover:bg-emerald-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus: focus-visible:ring-1 focus-visible:ring-emerald-500"
                >
                    <CheckIcon size={13} weight="bold" />
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    aria-label="Cancel"
                    className="p-1 rounded text-black/40 dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus: focus-visible:ring-1 focus-visible:ring-black/20"
                >
                    <XIcon size={13} weight="bold" />
                </button>
            </div>
        </div>
    );
}

export default function MemberAvailability() {
    const [schedule, setSchedule] = useState<DaySchedule[]>(() =>
        MEMBER_WEEKLY_AVAILABILITY.map((d) => ({ ...d, ranges: d.ranges.map((r) => ({ ...r })) }))
    );
    const [overrides, setOverrides] = useState<DateOverride[]>(() =>
        MEMBER_DATE_OVERRIDES.map((o) => ({ ...o, ranges: o.ranges.map((r) => ({ ...r })) }))
    );

    const [addingSlotForDay, setAddingSlotForDay] = useState<string | null>(null);

    const [hasUnsaved, setHasUnsaved] = useState(false);
    const [justSaved, setJustSaved] = useState(false);

    const [addingOverride, setAddingOverride] = useState(false);
    const [newOverrideDate, setNewOverrideDate] = useState("");
    const [newOverrideType, setNewOverrideType] = useState<"blocked" | "custom">("blocked");
    const [newOverrideRanges, setNewOverrideRanges] = useState<TimeRange[]>([{ start: "09:00", end: "17:00" }]);
    const [newOverrideNote, setNewOverrideNote] = useState("");

    const markUnsaved = useCallback(() => {
        setHasUnsaved(true);
        setJustSaved(false);
    }, []);

    const toggleDay = (day: string) => {
        setSchedule((prev) =>
            prev.map((d) => (d.day === day ? { ...d, enabled: !d.enabled } : d))
        );
        markUnsaved();
    };

    const addSlot = (day: string, range: TimeRange) => {
        setSchedule((prev) =>
            prev.map((d) => (d.day === day ? { ...d, ranges: [...d.ranges, range] } : d))
        );
        setAddingSlotForDay(null);
        markUnsaved();
    };

    const removeSlot = (day: string, index: number) => {
        setSchedule((prev) =>
            prev.map((d) =>
                d.day === day ? { ...d, ranges: d.ranges.filter((_, i) => i !== index) } : d
            )
        );
        markUnsaved();
    };

    const addOverride = () => {
        if (!newOverrideDate) return;
        const id = `do_${Date.now()}`;
        const override: DateOverride = {
            id,
            date: newOverrideDate,
            type: newOverrideType,
            ranges: newOverrideType === "custom" ? newOverrideRanges.map((r) => ({ ...r })) : [],
            note: newOverrideNote,
        };
        setOverrides((prev) => [...prev, override].sort((a, b) => a.date.localeCompare(b.date)));
        setAddingOverride(false);
        setNewOverrideDate("");
        setNewOverrideType("blocked");
        setNewOverrideRanges([{ start: "09:00", end: "17:00" }]);
        setNewOverrideNote("");
        markUnsaved();
    };

    const removeOverride = (id: string) => {
        setOverrides((prev) => prev.filter((o) => o.id !== id));
        markUnsaved();
    };

    const handleSave = () => {
        setHasUnsaved(false);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2500);
    };

    const handleDiscard = () => {
        setSchedule(
            MEMBER_WEEKLY_AVAILABILITY.map((d) => ({ ...d, ranges: d.ranges.map((r) => ({ ...r })) }))
        );
        setOverrides(
            MEMBER_DATE_OVERRIDES.map((o) => ({ ...o, ranges: o.ranges.map((r) => ({ ...r })) }))
        );
        setAddingSlotForDay(null);
        setHasUnsaved(false);
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setAddingSlotForDay(null);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="space-y-8 pb-24">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="heading-h2 text-black dark:text-white/90">My Availability</h2>
                    <TitleComponent size='small' className="text-black/50 dark:text-white/90 md:text-base mt-1">Configure recurring weekly hours and block specific dates.</TitleComponent>
                </div>
            </div>

            <div className="bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 overflow-hidden">
                <div className="px-6 py-5 border-b border-black/10 dark:border-white/5 flex items-center gap-2.5">
                    <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                        <ClockIcon size={18} weight="bold" />
                    </span>
                    <div>
                        <h2 className="text-base font-bold text-black dark:text-white/90">Weekly Recurring Hours</h2>
                        <TitleComponent size="extra-small" className="text-black/40 dark:text-white/90 mt-0.5">Your default availability - applied to every week unless overridden below.</TitleComponent>
                    </div>
                </div>

                <div className="divide-y divide-black/5 dark:divide-white/5">
                    {schedule.map((day) => (
                        <div
                            key={day.day}
                            className={clsx(
                                "px-5 py-4 flex flex-wrap items-center gap-3 transition-colors",
                                !day.enabled && "opacity-60"
                            )}
                        >
                            <div className="flex items-center gap-3 w-36 flex-shrink-0">
                                <Toggle
                                    checked={day.enabled}
                                    onChange={() => toggleDay(day.day)}
                                    label={day.label}
                                />
                                <span
                                    className={clsx(
                                        "text-sm font-bold transition-colors",
                                        day.enabled
                                            ? "text-black dark:text-white/90"
                                            : "text-black/40 dark:text-white/90"
                                    )}
                                >
                                    {day.label}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                                {day.enabled ? (
                                    <>
                                        {day.ranges.map((range, i) => (
                                            <TimeChip
                                                key={i}
                                                range={range}
                                                onRemove={() => removeSlot(day.day, i)}
                                                disabled={false}
                                            />
                                        ))}

                                        {addingSlotForDay === day.day ? (
                                            <AddSlotForm
                                                onConfirm={(range) => addSlot(day.day, range)}
                                                onCancel={() => setAddingSlotForDay(null)}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setAddingSlotForDay(day.day)}
                                                aria-label={`Add time slot for ${day.label}`}
                                                className={clsx(
                                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed text-xs font-semibold transition-colors",
                                                    "border-black/15 dark:border-white/15 text-black/50 dark:text-white/90",
                                                    "hover:border-primary/50 hover:text-primary",
                                                    "focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                                                )}
                                            >
                                                <PlusIcon size={11} weight="bold" />
                                                Add slot
                                            </button>
                                        )}

                                        {day.ranges.length === 0 && addingSlotForDay !== day.day && (
                                            <span className="text-xs text-black/30 dark:text-white/90 italic">No slots - add one to accept bookings</span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-xs font-medium text-black/35 dark:text-white/90 italic">Unavailable</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 overflow-hidden">
                <div className="px-6 py-5 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <CalendarBlankIcon size={18} weight="bold" />
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-black dark:text-white/90">Date Overrides</h2>
                            <p className="text-xs text-black/40 dark:text-white/90 mt-0.5">Block a specific date or set custom hours - overrides your weekly pattern.</p>
                        </div>
                    </div>
                    {!addingOverride && (
                        <button
                            type="button"
                            onClick={() => setAddingOverride(true)}
                            className={clsx(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                                "bg-primary/10 text-primary hover:bg-primary/15",
                                "focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                            )}
                        >
                            <PlusIcon size={13} weight="bold" />
                            Add Override
                        </button>
                    )}
                </div>

                <div className="divide-y divide-black/5 dark:divide-white/5">
                    {overrides.length === 0 && !addingOverride && (
                        <div className="px-6 py-10 text-center">
                            <TitleComponent size='small-semibold' className="text-black/40 dark:text-white/90">No date overrides set.</TitleComponent>
                            <TitleComponent size='extra-small' className="text-black/30 dark:text-white/90 mt-1">Use overrides for vacations, holidays, or one-off availability changes.</TitleComponent>
                        </div>
                    )}

                    {overrides.map((override) => (
                        <div
                            key={override.id}
                            className="px-6 py-4 flex items-center gap-4"
                        >
                            <span
                                className={clsx(
                                    "p-2 rounded-xl flex-shrink-0",
                                    override.type === "blocked"
                                        ? "bg-red-500/10 text-red-500"
                                        : "bg-amber-500/10 text-amber-500"
                                )}
                            >
                                {override.type === "blocked" ? (
                                    <LockIcon size={16} weight="bold" />
                                ) : (
                                    <ClockIcon size={16} weight="bold" />
                                )}
                            </span>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-bold text-black dark:text-white/90">
                                        {formatDate(override.date)}
                                    </span>
                                    <span
                                        className={clsx(
                                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                                            override.type === "blocked"
                                                ? "bg-red-500/10 text-red-500"
                                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                        )}
                                    >
                                        {override.type === "blocked" ? "Blocked" : "Custom hours"}
                                    </span>
                                    {override.type === "custom" &&
                                        override.ranges.map((r, i) => (
                                            <span
                                                key={i}
                                                className="text-xs font-semibold text-primary bg-primary/5 border border-primary/15 px-2 py-0.5 rounded"
                                            >
                                                {r.start} - {r.end}
                                            </span>
                                        ))}
                                </div>
                                {override.note && (
                                    <p className="text-xs text-black/40 dark:text-white/90 mt-0.5">
                                        {override.note}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => removeOverride(override.id)}
                                aria-label={`Remove override for ${override.date}`}
                                className="p-1.5 rounded-lg text-black/30 dark:text-white/90 hover:text-red-500 hover:bg-red-500/5 transition-colors focus: focus-visible:ring-2 focus-visible:ring-red-500/30"
                            >
                                <XIcon size={15} weight="bold" />
                            </button>
                        </div>
                    ))}

                    {addingOverride && (
                        <div className="px-6 py-5 bg-black/[0.01] dark:bg-white/[0.01] space-y-4">
                            <TitleComponent size='extra-small-bold' className="uppercase tracking-wider text-black/50 dark:text-white/90">New Date Override</TitleComponent>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-1.5">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={newOverrideDate}
                                        onChange={(e) => setNewOverrideDate(e.target.value)}
                                        className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.025] dark:bg-white/[0.04] px-4 py-2.5 text-sm transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-black dark:text-white/90"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-1.5">Override Type</label>
                                    <div className="flex gap-2">
                                        {(["blocked", "custom"] as const).map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setNewOverrideType(t)}
                                                className={clsx(
                                                    "flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40",
                                                    newOverrideType === t
                                                        ? "bg-primary border-primary text-white"
                                                        : "border-black/10 dark:border-white/10 text-black dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/5"
                                                )}
                                            >
                                                {t === "blocked" ? "Blocked" : "Custom hours"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {newOverrideType === "custom" && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90">Hours:</label>
                                    {newOverrideRanges.map((r, i) => (
                                        <div
                                            key={i}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]"
                                        >
                                            <input
                                                type="time"
                                                value={r.start}
                                                onChange={(e) =>
                                                    setNewOverrideRanges((prev) =>
                                                        prev.map((rng, ri) =>
                                                            ri === i ? { ...rng, start: e.target.value } : rng
                                                        )
                                                    )
                                                }
                                                className="text-xs bg-transparent text-black dark:text-white/90"
                                            />
                                            <span className="text-[10px] text-black/40">to</span>
                                            <input
                                                type="time"
                                                value={r.end}
                                                onChange={(e) =>
                                                    setNewOverrideRanges((prev) =>
                                                        prev.map((rng, ri) =>
                                                            ri === i ? { ...rng, end: e.target.value } : rng
                                                        )
                                                    )
                                                }
                                                className="text-xs bg-transparent text-black dark:text-white/90"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/90 mb-1.5">
                                    Note (optional)
                                </label>
                                <input
                                    type="text"
                                    value={newOverrideNote}
                                    onChange={(e) => setNewOverrideNote(e.target.value)}
                                    placeholder="e.g. Vacation, Conference, Public holiday..."
                                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.025] dark:bg-white/[0.04] px-4 py-2.5 text-sm transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-black dark:text-white/90 placeholder:text-black/30 dark:placeholder:text-white/90/30"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={addOverride}
                                    disabled={!newOverrideDate}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-xs font-semibold text-white shadow-sm shadow-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                                >
                                    <CheckIcon size={13} weight="bold" />
                                    Add Override
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAddingOverride(false)}
                                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-black/50 dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus: focus-visible:ring-2 focus-visible:ring-black/20"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {hasUnsaved && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-5 py-3 rounded-2xl shadow-2xl motion-safe:animate-fade-in bg-black dark:bg-white border border-white/10 dark:border-black/10 text-parchment dark:text-black">
                    <WarningIcon size={18} weight="bold" className="text-amber-400 flex-shrink-0" />
                    <span className="text-sm font-semibold whitespace-nowrap">Unsaved changes</span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleDiscard}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-parchment/60 dark:text-black/60 hover:bg-white/10 dark:hover:bg-black/10 transition-colors focus: focus-visible:ring-2 focus-visible:ring-white/30"
                        >
                            Discard
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold transition-colors hover:bg-primary/90 focus: focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                            <FloppyDiskIcon size={13} weight="bold" />
                            Save changes
                        </button>
                    </div>
                </div>
            )}

            {justSaved && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 motion-safe:animate-fade-in">
                    <CheckIcon size={16} weight="bold" />
                    <span className="text-sm font-semibold">Availability saved</span>
                </div>
            )}
        </div>
    );
}



