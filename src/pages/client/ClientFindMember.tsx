import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    MagnifyingGlass as MagnifyingGlassIcon,
    CalendarBlank as CalendarBlankIcon,
    ArrowRight as ArrowRightIcon,
    X as XIcon,
} from "@phosphor-icons/react";
import { BOOKABLE_MEMBERS } from "@/mock/clientMockData";

export default function ClientFindMember() {
    const [query, setQuery] = useState("");

    const filtered = BOOKABLE_MEMBERS.filter((m) => {
        const q = query.toLowerCase();
        return (
            m.name.toLowerCase().includes(q) ||
            m.specialty.toLowerCase().includes(q) ||
            m.role.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                    Client Portal
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-ink dark:text-parchment">
                    Find a Member
                </h1>
                <p className="text-sm text-black/50 dark:text-parchment/50 mt-1">
                    Browse available consultants and book a session that fits your schedule.
                </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-parchment/30 pointer-events-none">
                    <MagnifyingGlassIcon size={18} />
                </span>
                <input
                    id="member-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or specialty…"
                    aria-label="Search members"
                    className="w-full pl-11 pr-10 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-surface dark:bg-card-dark text-sm text-ink dark:text-parchment placeholder:text-black/30 dark:placeholder:text-parchment/30 shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-black/30 dark:text-parchment/30 hover:text-ink dark:hover:text-parchment transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <XIcon size={15} />
                    </button>
                )}
            </div>

            {/* Results count */}
            {query && (
                <p className="text-xs text-black/40 dark:text-parchment/40 -mt-4">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{query}"
                </p>
            )}

            {/* Member grid */}
            {filtered.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-sm font-semibold text-black/50 dark:text-parchment/40">
                        No members match "{query}"
                    </p>
                    <p className="text-xs text-black/30 dark:text-parchment/30 mt-1">
                        Try a different name or specialty.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((member) => (
                        <div
                            key={member.id}
                            className="bg-surface dark:bg-card-dark rounded-3xl border border-black/10 dark:border-white/5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
                        >
                            {/* Card top */}
                            <div className="p-6 flex items-start gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg flex-shrink-0 transition-transform group-hover:scale-105">
                                    {member.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-extrabold text-ink dark:text-parchment text-base leading-tight truncate">
                                        {member.name}
                                    </div>
                                    <div className="text-xs text-black/50 dark:text-parchment/40 mt-0.5">{member.role}</div>
                                    <span className="inline-flex mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                                        {member.specialty}
                                    </span>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="px-6 pb-5 flex-1">
                                <p className="text-xs text-black/55 dark:text-parchment/45 leading-relaxed line-clamp-3">
                                    {member.bio}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5 text-xs text-black/40 dark:text-parchment/40 min-w-0">
                                    <CalendarBlankIcon size={13} className="flex-shrink-0" />
                                    <span className="truncate">
                                        Next:{" "}
                                        <span className="font-semibold text-ink dark:text-parchment">
                                            {member.nextAvailable}
                                        </span>
                                    </span>
                                </div>
                                <Link
                                    to={`/client/book/${member.id}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                >
                                    Book
                                    <ArrowRightIcon size={12} weight="bold" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
