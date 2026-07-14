import React, { useState } from "react";
import { User as UserIcon, LockKey as LockIcon, Check as CheckIcon } from "@phosphor-icons/react";

export default function Settings() {
    const [name, setName] = useState("Devon Lane");
    const [email, setEmail] = useState("devon.lane@scheda.com");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Visual feedback / mock confirmation
        alert("Profile settings mock-updated successfully.");
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Password change requested (Mock).");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-ink dark:text-parchment">
                    Admin Settings
                </h1>
                <p className="text-sm text-black/50 dark:text-parchment/50 mt-1">
                    Manage your personal account profile, contact credentials, and security parameters.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Form: Profile Details */}
                <form
                    onSubmit={handleProfileSubmit}
                    className="lg:col-span-6 bg-surface dark:bg-card-dark rounded-3xl border border-black/10 dark:border-white/5 p-6 shadow-card space-y-4"
                >
                    <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-3">
                        <span className="p-1 rounded bg-primary/10 text-primary">
                            <UserIcon size={18} weight="bold" />
                        </span>
                        <h2 className="text-base font-bold text-ink dark:text-parchment">
                            Profile Parameters
                        </h2>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-parchment/40 mb-1" htmlFor="admin-name">
                            Full Name
                        </label>
                        <input
                            id="admin-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-parchment/40 mb-1" htmlFor="admin-email">
                            Email Address
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                        />
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2.5 text-xs font-semibold text-white transition focus:ring-2 focus:ring-primary/30 outline-none shadow-md shadow-primary/10"
                    >
                        <CheckIcon size={14} weight="bold" />
                        <span>Save Profile Changes</span>
                    </button>
                </form>

                {/* Right Form: Security Parameters */}
                <form
                    onSubmit={handlePasswordSubmit}
                    className="lg:col-span-6 bg-surface dark:bg-card-dark rounded-3xl border border-black/10 dark:border-white/5 p-6 shadow-card space-y-4"
                >
                    <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-3">
                        <span className="p-1 rounded bg-primary/10 text-primary">
                            <LockIcon size={18} weight="bold" />
                        </span>
                        <h2 className="text-base font-bold text-ink dark:text-parchment">
                            Change Password
                        </h2>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-parchment/40 mb-1" htmlFor="current-password">
                            Current Password
                        </label>
                        <input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-parchment/40 mb-1" htmlFor="new-password">
                            New Password
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-parchment/40 mb-1" htmlFor="confirm-new-password">
                            Confirm New Password
                        </label>
                        <input
                            id="confirm-new-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                        />
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2.5 text-xs font-semibold text-white transition focus:ring-2 focus:ring-primary/30 outline-none shadow-md shadow-primary/10"
                    >
                        <CheckIcon size={14} weight="bold" />
                        <span>Update Security Credentials</span>
                    </button>
                </form>

            </div>
        </div>
    );
}
