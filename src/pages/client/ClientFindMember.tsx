import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    MagnifyingGlassIcon,
    ArrowRightIcon,
    XIcon,
} from "@phosphor-icons/react";
import TitleComponent from "@/components/shared/TitleComponent";
import { getAllMembers, type MemberDirectoryEntry } from "@/services/memberDirectoryService";

export default function ClientFindMember() {
    const [query, setQuery] = useState("");
    const [members, setMembers] = useState<MemberDirectoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadMembers = async () => {
            try {
                const allMembers = await getAllMembers();
                if (active) setMembers(allMembers);
            } catch (error) {
                console.warn("Unable to load members:", error);
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadMembers();
        return () => {
            active = false;
        };
    }, []);

    const filtered = members.filter((m) => {
        const q = query.toLowerCase();
        return (
            m.memberName.toLowerCase().includes(q) ||
            m.memberDesignation.toLowerCase().includes(q)
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
                    placeholder="Search by name or designation..."
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

            {query && !loading && (
                <TitleComponent size='extra-small' className="text-black/40 dark:text-white/90 -mt-4">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{query}"
                </TitleComponent>
            )}

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={`member-skeleton-${index}`}
                            className="animate-pulse bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 overflow-hidden"
                        >
                            <div className="p-6 space-y-4">
                                <div className="h-4 w-3/4 rounded-full bg-black/10 dark:bg-white/10" />
                                <div className="h-3 w-1/2 rounded-full bg-black/10 dark:bg-white/10" />
                                <div className="h-8 w-24 rounded-full bg-primary/10 dark:bg-primary/20" />
                            </div>
                            <div className="px-6 py-4 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.03] flex justify-end">
                                <div className="h-9 w-20 rounded-full bg-black/10 dark:bg-white/10" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : members.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="text-4xl mb-4">•</div>
                    <TitleComponent size='small-semibold' className="text-black/50 dark:text-white/90">No members are available yet.</TitleComponent>
                    <TitleComponent size='extra-small' className="text-black/30 dark:text-white/90 mt-1">Check back later when consultants have published their availability.</TitleComponent>
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="text-4xl mb-4">•</div>
                    <TitleComponent size='small-semibold' className="text-black/50 dark:text-white/90">No members match "{query}"</TitleComponent>
                    <TitleComponent size='extra-small' className="text-black/30 dark:text-white/90 mt-1">Try a different name or designation.</TitleComponent>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((member) => (
                        <div
                            key={member.uid}
                            className="group bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 hover:shadow-shadow2-effect hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="font-extrabold text-black dark:text-white/90 text-base leading-tight truncate">
                                    {member.memberName}
                                </div>
                                <span className="inline-flex mt-3 px-2.5 py-1.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                                    {member.memberDesignation}
                                </span>
                            </div>

                            <div className="px-6 py-4 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.03] flex justify-end">
                                <Link
                                    to={`/client/book/${member.uid}`}
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



