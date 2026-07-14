import React, { useState } from "react";
import {
    User as UserIcon,
    LockKey as LockKeyIcon,
    Check as CheckIcon,
    IdentificationCard as IdentificationCardIcon,
} from "@phosphor-icons/react";
import { LOGGED_IN_MEMBER } from "@/mock/memberMockData";

const MAX_BIO = 280;

export default function MemberSettings() {
    // Profile state
    const [name, setName] = useState(LOGGED_IN_MEMBER.name);
    const [email, setEmail] = useState(LOGGED_IN_MEMBER.email);
    const [phone, setPhone] = useState(LOGGED_IN_MEMBER.phone);
    const [specialty, setSpecialty] = useState(LOGGED_IN_MEMBER.specialty);
    const [bio, setBio] = useState(LOGGED_IN_MEMBER.bio);

    // Security state
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Wire to Firestore: update member document
        alert("Profile updated (mock — no persistence yet).");
    };

    const handlePasswordSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPw !== confirmPw) {
            alert("Passwords do not match.");
            return;
        }
        alert("Password change requested (mock).");
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
    };

    const inputClass =
        "w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment placeholder:text-black/30 dark:placeholder:text-parchment/30";

    const labelClass =
        "block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-parchment/40 mb-1.5";

    const saveButtonClass =
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-xs font-semibold text-white shadow-sm shadow-primary/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-ink dark:text-parchment">
                    Account Settings
                </h1>
                <p className="text-sm text-black/50 dark:text-parchment/50 mt-1">
                    Update your personal profile, contact details, and security credentials.
                </p>
            </div>

            {/* Avatar / identity strip */}
            <div className="bg-surface dark:bg-card-dark rounded-3xl border border-black/10 dark:border-white/5 shadow-card p-6 flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl flex-shrink-0">
                    {LOGGED_IN_MEMBER.avatar}
                </div>
                <div>
                    <div className="text-lg font-extrabold text-ink dark:text-parchment">
                        {LOGGED_IN_MEMBER.name}
                    </div>
                    <div className="text-xs text-black/50 dark:text-parchment/40 mt-0.5">
                        {LOGGED_IN_MEMBER.role}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        <IdentificationCardIcon size={12} weight="bold" />
                        Member Portal
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left: Profile form */}
                <form
                    onSubmit={handleProfileSave}
                    className="lg:col-span-7 bg-surface dark:bg-card-dark rounded-3xl border border-black/10 dark:border-white/5 shadow-card p-6 space-y-5"
                >
                    <div className="flex items-center gap-2.5 pb-3 border-b border-black/5 dark:border-white/5">
                        <span className="p-1 rounded bg-primary/10 text-primary">
                            <UserIcon size={16} weight="bold" />
                        </span>
                        <h2 className="text-base font-bold text-ink dark:text-parchment">
                            Profile Details
                        </h2>
                    </div>

                    {/* Name / Phone row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass} htmlFor="member-name">
                                Full Name
                            </label>
                            <input
                                id="member-name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass} htmlFor="member-phone">
                                Phone
                            </label>
                            <input
                                id="member-phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClass} htmlFor="member-email">
                            Email Address
                        </label>
                        <input
                            id="member-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Specialty */}
                    <div>
                        <label className={labelClass} htmlFor="member-specialty">
                            Specialty <span className="normal-case font-normal text-black/30 dark:text-parchment/30">(shown to clients)</span>
                        </label>
                        <input
                            id="member-specialty"
                            type="text"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            placeholder="e.g. Corporate Law & Restructuring"
                            className={inputClass}
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className={labelClass} htmlFor="member-bio">
                                Bio <span className="normal-case font-normal text-black/30 dark:text-parchment/30">(client-facing)</span>
                            </label>
                            <span
                                className={`text-[10px] font-mono ${
                                    bio.length > MAX_BIO ? "text-red-500" : "text-black/30 dark:text-parchment/30"
                                }`}
                            >
                                {bio.length}/{MAX_BIO}
                            </span>
                        </div>
                        <textarea
                            id="member-bio"
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={MAX_BIO}
                            placeholder="A brief description of your background and expertise..."
                            className={`${inputClass} resize-none`}
                        />
                        <p className="mt-1 text-[10px] text-black/30 dark:text-parchment/30">
                            Displayed on your public booking page. Keep it concise and client-focused.
                        </p>
                    </div>

                    <button type="submit" className={saveButtonClass}>
                        <CheckIcon size={13} weight="bold" />
                        Save Profile
                    </button>
                </form>

                {/* Right: Security form */}
                <form
                    onSubmit={handlePasswordSave}
                    className="lg:col-span-5 bg-surface dark:bg-card-dark rounded-3xl border border-black/10 dark:border-white/5 shadow-card p-6 space-y-5"
                >
                    <div className="flex items-center gap-2.5 pb-3 border-b border-black/5 dark:border-white/5">
                        <span className="p-1 rounded bg-primary/10 text-primary">
                            <LockKeyIcon size={16} weight="bold" />
                        </span>
                        <h2 className="text-base font-bold text-ink dark:text-parchment">
                            Change Password
                        </h2>
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="current-pw">
                            Current Password
                        </label>
                        <input
                            id="current-pw"
                            type="password"
                            value={currentPw}
                            onChange={(e) => setCurrentPw(e.target.value)}
                            placeholder="••••••••"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="new-pw">
                            New Password
                        </label>
                        <input
                            id="new-pw"
                            type="password"
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)}
                            placeholder="At least 8 characters"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="confirm-pw">
                            Confirm New Password
                        </label>
                        <input
                            id="confirm-pw"
                            type="password"
                            value={confirmPw}
                            onChange={(e) => setConfirmPw(e.target.value)}
                            placeholder="Re-enter new password"
                            className={inputClass}
                        />
                    </div>

                    <button type="submit" className={saveButtonClass}>
                        <CheckIcon size={13} weight="bold" />
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}
