import { useState } from "react";
import { Link } from "react-router-dom";
import {
    MagnifyingGlassIcon,
    CalendarBlankIcon,
    ArrowRightIcon,
    XIcon,
} from "@phosphor-icons/react";
import { BOOKABLE_MEMBERS } from "@/mock/clientMockData";
import TitleComponent from "@/components/shared/TitleComponent";

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
            <div>
                <h2 className="heading-h2 text-black dark:text-white/90">Find a Member</h2>
                <TitleComponent size='small' className="text-black/50 dark:text-white/90 md:text-base mt-1">Browse available consultants and book a session that fits your schedule.</TitleComponent>
            </div>

            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/90 pointer-events-none">
                    <MagnifyingGlassIcon size={18} />
                </span>
                <input
                    id="member-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or specialty..."
                    aria-label="Search members"
                    className="w-full pl-11 pr-10 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-tint-black/60 text-sm text-black dark:text-white/90 placeholder:text-black/30 dark:placeholder:text-white/90/30 shadow-shadow2-effect dark:shadow-shadow1 focus: focus-visible:ring-2 focus-visible:ring-primary/40 transition"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-black/30 dark:text-white/90 hover:text-black dark:hover:text-white/90 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <XIcon size={15} />
                    </button>
                )}
            </div>

            {query && (
                <TitleComponent size='extra-small' className="text-black/40 dark:text-white/90 -mt-4">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{query}"
                </TitleComponent>
            )}

            {/* Member grid */}
            {filtered.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="text-4xl mb-4">•</div>
                    <TitleComponent size='small-semibold' className="text-black/50 dark:text-white/90">No members match "{query}"</TitleComponent>
                    <TitleComponent size='extra-small' className="text-black/30 dark:text-white/90 mt-1">Try a different name or specialty.</TitleComponent>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((member) => (
                        <div
                            key={member.id}
                            className="group bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 hover:shadow-shadow2-effect hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
                        >
                            <div className="p-6 flex items-start gap-4">
                                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg flex-shrink-0 transition-transform group-hover:scale-105">
                                    {member.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-extrabold text-black dark:text-white/90 text-base leading-tight truncate">
                                        {member.name}
                                    </div>
                                    <div className="text-xs text-black/50 dark:text-white/90 mt-0.5">{member.role}</div>
                                    <span className="inline-flex mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                                        {member.specialty}
                                    </span>
                                </div>
                            </div>

                            <div className="px-6 pb-5 flex-1">
                                <TitleComponent size='extra-small' className="text-black/55 dark:text-white/90 leading-relaxed line-clamp-3">{member.bio}</TitleComponent>
                            </div>

                            <div className="px-6 py-4 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5 text-xs text-black/40 dark:text-white/90 min-w-0">
                                    <CalendarBlankIcon size={13} className="flex-shrink-0" />
                                    <span className="truncate">
                                        Next:{" "}
                                        <span className="font-semibold text-black dark:text-white/90">
                                            {member.nextAvailable}
                                        </span>
                                    </span>
                                </div>
                                <Link
                                    to={`/client/book/${member.id}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-b from-primary-start to-primary-end text-white text-xs font-bold hover:bg-primary/90 transition-colors flex-shrink-0 focus: focus-visible:ring-2 focus-visible:ring-primary/40 hover:from-secondary-start hover:to-secondary-end"
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



