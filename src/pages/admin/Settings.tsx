import { useState } from "react";
import {
    UserIcon,
    LockIcon,
    CheckIcon
} from "@phosphor-icons/react";
import TitleComponent from "@/components/shared/TitleComponent";

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
            <div>
                <h2 className="heading-h2 text-black dark:text-white/90">Admin Settings</h2>
                <TitleComponent size='small' className="text-black/50 dark:text-white/90 md:text-base mt-1">Manage your personal account profile, contact credentials, and security parameters.</TitleComponent>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form
                    onSubmit={handleProfileSubmit}
                    className="lg:col-span-6 bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 p-6 shadow-shadow2-effect dark:shadow-shadow1 space-y-4"
                >
                    <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-3">
                        <span className="p-1 rounded bg-primary/10 text-primary">
                            <UserIcon size={18} weight="bold" />
                        </span>
                        <h2 className="text-black dark:text-white/90 text-base font-bold">Profile Parameters</h2>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1" htmlFor="admin-name">
                            Full Name
                        </label>
                        <input
                            id="admin-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent dark:bg-tint-black/30 px-4 py-2.5 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1" htmlFor="admin-email">
                            Email Address
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent dark:bg-tint-black/30 px-4 py-2.5 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                        />
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-primary-start to-primary-end px-4 py-2.5 text-xs font-semibold text-white transition shadow-inset hover:from-secondary-start hover:to-secondary-end"
                    >
                        <CheckIcon size={14} weight="bold" />
                        <span>Save Profile Changes</span>
                    </button>
                </form>

                {/* Right Form: Security Parameters */}
                <form
                    onSubmit={handlePasswordSubmit}
                    className="lg:col-span-6 bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 p-6 shadow-shadow2-effect dark:shadow-shadow1 space-y-4"
                >
                    <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-3">
                        <span className="p-1 rounded bg-primary/10 text-primary">
                            <LockIcon size={18} weight="bold" />
                        </span>
                        <h2 className="text-base font-bold text-black dark:text-white/90">
                            Change Password
                        </h2>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1" htmlFor="current-password">
                            Current Password
                        </label>
                        <input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent dark:bg-tint-black/30 px-4 py-2.5 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1" htmlFor="new-password">
                            New Password
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent dark:bg-tint-black/30 px-4 py-2.5 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1" htmlFor="confirm-new-password">
                            Confirm New Password
                        </label>
                        <input
                            id="confirm-new-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent dark:bg-tint-black/30 px-4 py-2.5 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-black dark:text-white/90"
                        />
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-primary-start to-primary-end px-4 py-2.5 text-xs font-semibold text-white transition shadow-inset hover:from-secondary-start hover:to-secondary-end"
                    >
                        <CheckIcon size={14} weight="bold" />
                        <span>Update Security Credentials</span>
                    </button>
                </form>

            </div>
        </div>
    );
}



