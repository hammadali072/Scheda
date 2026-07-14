import React, { useState } from "react";
import { INITIAL_MEMBERS, Member } from "@/mock/adminMockData";
import { Plus as PlusIcon, MagnifyingGlass as MagnifyingGlassIcon, DotsThreeVertical as DotsThreeVerticalIcon } from "@phosphor-icons/react";
import clsx from "clsx";

export default function Members() {
    const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Add Member form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    // Active dropdown row state
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !role) return;

        const newMember: Member = {
            id: `m${members.length + 1}`,
            name,
            email,
            role,
            status: "active",
            appointmentCount: 0
        };

        setMembers([...members, newMember]);
        setIsAddModalOpen(false);
        setName("");
        setEmail("");
        setRole("");
    };

    const toggleStatus = (id: string) => {
        setMembers(members.map(member => {
            if (member.id === id) {
                return {
                    ...member,
                    status: member.status === "active" ? "inactive" : "active"
                };
            }
            return member;
        }));
        setActiveDropdown(null);
    };

    const deleteMember = (id: string) => {
        setMembers(members.filter(m => m.id !== id));
        setActiveDropdown(null);
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink dark:text-parchment">
                        Team Members
                    </h1>
                    <p className="text-sm text-black/50 dark:text-parchment/50 mt-1">
                        Configure and manage company advisors, specialities, and status.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 self-start rounded-xl bg-primary hover:bg-primary/90 px-4 py-2.5 text-sm font-semibold text-white transition focus:ring-2 focus:ring-primary/30 outline-none shadow-md shadow-primary/10"
                >
                    <PlusIcon size={16} weight="bold" />
                    <span>Add Member</span>
                </button>
            </div>

            {/* Filters / Search Bar */}
            <div className="bg-surface dark:bg-card-dark rounded-2xl border border-black/10 dark:border-white/5 p-4 shadow-card flex items-center">
                <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate dark:text-slate/60">
                        <MagnifyingGlassIcon size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search members by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                    />
                </div>
            </div>

            {/* Members Table */}
            <div className="bg-surface dark:bg-card-dark rounded-3xl border border-black/10 dark:border-white/5 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    {filteredMembers.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-sm font-semibold text-black/40 dark:text-parchment/40">
                                No members found matching your search.
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] text-xs font-bold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                    <th className="px-6 py-4">Name / Role</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Appointments</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                                {filteredMembers.map((member) => (
                                    <tr
                                        key={member.id}
                                        className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-ink dark:text-parchment">
                                                {member.name}
                                            </div>
                                            <div className="text-xs text-black/40 dark:text-parchment/40 mt-0.5">
                                                {member.role}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-black/80 dark:text-parchment/80">
                                            {member.email}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-ink dark:text-parchment">
                                            {member.appointmentCount} bookings
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "inline-flex px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider",
                                                member.status === "active"
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                    : "bg-red-500/10 text-red-500"
                                            )}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === member.id ? null : member.id)}
                                                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate"
                                                aria-label="Toggle action menu"
                                            >
                                                <DotsThreeVerticalIcon size={20} weight="bold" />
                                            </button>

                                            {activeDropdown === member.id && (
                                                <>
                                                    {/* Backdrop to close */}
                                                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                                                    <div className="absolute right-6 top-12 z-20 w-44 bg-surface dark:bg-card-dark rounded-xl border border-black/10 dark:border-white/10 shadow-lg py-1.5 text-left text-xs">
                                                        <button
                                                            onClick={() => toggleStatus(member.id)}
                                                            className="w-full px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 font-semibold text-ink dark:text-parchment text-left"
                                                        >
                                                            {member.status === "active" ? "Deactivate" : "Activate"}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteMember(member.id)}
                                                            className="w-full px-4 py-2 hover:bg-red-500/5 text-red-500 font-semibold text-left"
                                                        >
                                                            Remove Member
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Member Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={() => setIsAddModalOpen(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="bg-surface dark:bg-card-dark rounded-3xl border border-black/20 dark:border-white/5 max-w-md w-full p-6 shadow-2xl z-10 relative">
                        <h2 className="text-xl font-bold text-ink dark:text-parchment mb-4">
                            Add New Advisor
                        </h2>
                        
                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-parchment/40 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-parchment/40 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="enter@company.com"
                                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-parchment/40 mb-1">
                                    Role / Specialty
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. Legal Consultant"
                                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-sm font-semibold text-white shadow-md shadow-primary/10 transition-colors"
                                >
                                    Create Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
