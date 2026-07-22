import { useState } from "react";
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilSimpleIcon,
    TrashIcon,
    ShieldCheckIcon,
    UserIcon,
    BriefcaseIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";

import { INITIAL_MEMBERS, Member } from "@/mock/adminMockData";

import TitleComponent from "@/components/shared/TitleComponent";

export default function Members() {
    const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [editRole, setEditRole] = useState("Member");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

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

    const deleteMember = (id: string) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const openEditModal = (member: Member) => {
        setSelectedMember(member);
        setEditRole(member.role);
        setIsEditModalOpen(true);
    };

    const handleEditMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember) return;

        setMembers((currentMembers) =>
            currentMembers.map((member) =>
                member.id === selectedMember.id ? { ...member, role: editRole } : member
            )
        );

        setIsEditModalOpen(false);
        setSelectedMember(null);
        setEditRole("Member");
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="heading-h2 font-extrabold tracking-tight text-black dark:text-white/90">Team Members</h2>
                    <TitleComponent size='small' className="text-black/50 dark:text-white/90 md:text-base mt-1">Configure and manage company advisors, specialities, and status.</TitleComponent>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-b from-primary-start to-primary-end hover:bg-primary/90 px-4 py-2.5 sm:text-base text-sm font-semibold text-white transition shadow-inset hover:from-secondary-start hover:to-secondary-end"
                >
                    <PlusIcon size={16} weight="bold" />
                    <span>Add Member</span>
                </button>
            </div>

            <div className="bg-white dark:bg-tint-black/60 rounded-2xl border border-black/10 dark:border-white/5 p-4 shadow-shadow2-effect dark:shadow-shadow1 flex items-center">
                <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate dark:text-slate/60">
                        <MagnifyingGlassIcon size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search members by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-transparent dark:bg-tint-black/30 text-base transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 overflow-hidden">
                <div className="overflow-x-auto">
                    {filteredMembers.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-sm font-semibold text-black/40 dark:text-white/90">
                                No members found matching your search.
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/90">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                                {filteredMembers.map((member) => {
                                    const roleBadge = (() => {
                                        if (member.role.toLowerCase().includes("admin")) {
                                            return {
                                                label: "Admin",
                                                icon: ShieldCheckIcon,
                                                className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
                                            };
                                        }
                                        if (member.role.toLowerCase().includes("client")) {
                                            return {
                                                label: "Client",
                                                icon: UserIcon,
                                                className: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
                                            };
                                        }
                                        return {
                                            label: "Member",
                                            icon: BriefcaseIcon,
                                            className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                                        };
                                    })();

                                    const RoleIcon = roleBadge.icon;

                                    return (
                                        <tr
                                            key={member.id}
                                            className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-black dark:text-white/90">
                                                    {member.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-black/80 dark:text-white/90">
                                                {member.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={clsx(
                                                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                                                    roleBadge.className
                                                )}>
                                                    <RoleIcon size={14} weight="bold" />
                                                    {roleBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(member)}
                                                        className="rounded-full border border-black/10 p-2 text-black/70 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
                                                        aria-label="Edit member"
                                                    >
                                                        <PencilSimpleIcon size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteMember(member.id)}
                                                        className="rounded-full border border-red-200 p-2 text-red-500 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                                                        aria-label="Delete member"
                                                    >
                                                        <TrashIcon size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Edit Member Modal */}
            {isEditModalOpen && selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={() => {
                            setIsEditModalOpen(false);
                            setSelectedMember(null);
                            setEditRole("Member");
                        }}
                    />

                    <div className="bg-white dark:bg-tint-black shadow-shadow1 rounded-3xl border border-black/20 dark:border-white/5 max-w-md w-full p-6 shadow-2xl z-10 relative">
                        <h5 className="heading-h5 font-semibold text-black dark:text-white/90 mb-4">
                            Edit Role
                        </h5>

                        <form onSubmit={handleEditMember} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1">
                                    Member
                                </label>
                                <div className="rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] px-4 py-3 text-sm text-black dark:text-white/90">
                                    {selectedMember.name}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1">
                                    Role
                                </label>
                                <select
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Member">Member</option>
                                    <option value="Client">Client</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setSelectedMember(null);
                                        setEditRole("Member");
                                    }}
                                    className="px-4 py-2 rounded-full text-sm font-semibold text-slate hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 rounded-full bg-gradient-to-b from-primary-start to-primary-end hover:bg-primary/90 text-sm font-semibold text-white shadow-md shadow-primary/10 transition-colors hover:from-secondary-start hover:to-secondary-end"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Member Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={() => setIsAddModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="bg-white dark:bg-tint-black shadow-shadow1 rounded-3xl border border-black/20 dark:border-white/5 max-w-md w-full p-6 shadow-2xl z-10 relative">
                        <h5 className="heading-h5 font-semibold text-black dark:text-white/90 mb-4">
                            Add New Advisor
                        </h5>

                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="enter@company.com"
                                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-4 py-2.5 text-sm  transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1">
                                    Role / Designation
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. Legal Consultant"
                                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-4 py-2.5 text-sm  transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 rounded-full text-sm font-semibold text-slate hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 rounded-full bg-gradient-to-b from-primary-start to-primary-end hover:bg-primary/90 text-sm font-semibold text-white shadow-md shadow-primary/10 transition-colors hover:from-secondary-start hover:to-secondary-end"
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


