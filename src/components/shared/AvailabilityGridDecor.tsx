
import React from "react";
import { ClockIcon } from "@phosphor-icons/react";

interface Slot {
    dayIndex: number; // 0: Mon, 1: Tue, etc.
    timeIndex: number;
    status: "available" | "booked" | "selected";
    avatarUrl?: string;
    initials?: string;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
];

const STATIC_SLOTS: Slot[] = [
    { dayIndex: 0, timeIndex: 0, status: "booked", initials: "JD" },
    { dayIndex: 0, timeIndex: 1, status: "available" },
    { dayIndex: 0, timeIndex: 2, status: "available" },
    { dayIndex: 0, timeIndex: 3, status: "booked", initials: "AM" },
    { dayIndex: 0, timeIndex: 4, status: "available" },
    { dayIndex: 0, timeIndex: 5, status: "available" },
    { dayIndex: 0, timeIndex: 6, status: "booked", initials: "EL" },
    { dayIndex: 0, timeIndex: 7, status: "available" },

    { dayIndex: 1, timeIndex: 0, status: "available" },
    { dayIndex: 1, timeIndex: 1, status: "booked", initials: "SK" },
    { dayIndex: 1, timeIndex: 2, status: "available" },
    { dayIndex: 1, timeIndex: 3, status: "available" },
    { dayIndex: 1, timeIndex: 4, status: "selected" }, // Pulsing selected slot
    { dayIndex: 1, timeIndex: 5, status: "available" },
    { dayIndex: 1, timeIndex: 6, status: "available" },
    { dayIndex: 1, timeIndex: 7, status: "booked", initials: "TH" },

    { dayIndex: 2, timeIndex: 0, status: "booked", initials: "RB" },
    { dayIndex: 2, timeIndex: 1, status: "available" },
    { dayIndex: 2, timeIndex: 2, status: "booked", initials: "CP" },
    { dayIndex: 2, timeIndex: 3, status: "available" },
    { dayIndex: 2, timeIndex: 4, status: "available" },
    { dayIndex: 2, timeIndex: 5, status: "available" },
    { dayIndex: 2, timeIndex: 6, status: "available" },
    { dayIndex: 2, timeIndex: 7, status: "available" },

    { dayIndex: 3, timeIndex: 0, status: "available" },
    { dayIndex: 3, timeIndex: 1, status: "available" },
    { dayIndex: 3, timeIndex: 2, status: "available" },
    { dayIndex: 3, timeIndex: 3, status: "booked", initials: "NW" },
    { dayIndex: 3, timeIndex: 4, status: "available" },
    { dayIndex: 3, timeIndex: 5, status: "booked", initials: "HW" },
    { dayIndex: 3, timeIndex: 6, status: "available" },
    { dayIndex: 3, timeIndex: 7, status: "available" },

    { dayIndex: 4, timeIndex: 0, status: "available" },
    { dayIndex: 4, timeIndex: 1, status: "booked", initials: "MK" },
    { dayIndex: 4, timeIndex: 2, status: "available" },
    { dayIndex: 4, timeIndex: 3, status: "available" },
    { dayIndex: 4, timeIndex: 4, status: "available" },
    { dayIndex: 4, timeIndex: 5, status: "available" },
    { dayIndex: 4, timeIndex: 6, status: "booked", initials: "YJ" },
    { dayIndex: 4, timeIndex: 7, status: "available" },
];

export default function AvailabilityGridDecor() {
    return (
        <div
            aria-hidden="true"
            className="w-full select-none rounded-3xl border border-slate/10 bg-white p-5 shadow-shadow2-effect dark:shadow-shadow1 dark:border-white/5 dark:bg-tint-black/60"
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ClockIcon size={18} weight="bold" />
                    </span>
                    <div>
                        <div className="text-xs font-semibold text-black dark:text-white/90">
                            Consultation Weekly Schedule
                        </div>
                        <div className="text-[10px] text-slate dark:text-slate/60">
                            Dr. Adrian Thorne (GMT-5)
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] font-medium text-slate dark:text-slate/60">
                        Live Booking View
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-1.5">
                {/* Empty corner */}
                <div />

                {/* Day Headers */}
                {DAYS.map((day) => (
                    <div
                        key={day}
                        className="text-center text-[10px] font-bold tracking-wider uppercase text-slate dark:text-slate/50 pb-1"
                    >
                        {day}
                    </div>
                ))}

                {/* Time Rows */}
                {TIMES.map((time, timeIdx) => (
                    <React.Fragment key={time}>
                        {/* Time Label */}
                        <div className="pr-2 text-right align-middle text-[9px] font-medium text-slate/75 dark:text-slate/40 flex items-center justify-end h-8">
                            {time.replace(" :00", "").replace(" AM", "").replace(" PM", "")}
                        </div>

                        {/* Grid cells */}
                        {DAYS.map((_, dayIdx) => {
                            const slot = STATIC_SLOTS.find(
                                (s) => s.dayIndex === dayIdx && s.timeIndex === timeIdx
                            );

                            if (slot?.status === "booked") {
                                return (
                                    <div
                                        key={dayIdx}
                                        className="h-8 rounded-lg bg-slate/5 dark:bg-white/5 border border-slate/5 dark:border-white/5 flex items-center justify-center relative group"
                                    >
                                        <span className="text-[9px] font-bold text-slate/60 dark:text-slate/40 tracking-wider">
                                            {slot.initials}
                                        </span>
                                    </div>
                                );
                            }

                            if (slot?.status === "selected") {
                                return (
                                    <div
                                        key={dayIdx}
                                        className="h-8 rounded-lg bg-accent text-white border border-accent/20 flex items-center justify-center relative motion-safe:animate-pulse shadow-md shadow-accent/25"
                                    >
                                        <span className="text-[9px] font-extrabold tracking-wider">
                                            10:00
                                        </span>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={dayIdx}
                                    className="h-8 rounded-lg bg-primary/[0.02] dark:bg-primary/[0.01] border border-primary/5 dark:border-primary/5 hover:border-primary/20 dark:hover:border-primary/30 transition-colors flex items-center justify-center"
                                />
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-slate/5 dark:border-white/5 flex items-center justify-between text-[9px] text-slate dark:text-slate/50">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-primary/10 border border-primary/10" />
                    <span>Open slots</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-slate/5 border border-slate/5" />
                    <span>Booked</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-accent" />
                    <span>Selected</span>
                </div>
            </div>
        </div>
    );
}


