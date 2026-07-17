import { useState } from "react";
import {
    UserIcon,
    LockKeyIcon,
    CheckIcon,
    IdentificationCardIcon,
} from "@phosphor-icons/react";
import { LOGGED_IN_CLIENT } from "@/mock/clientMockData";

export default function ClientSettings() {
    // Profile state
    const [name, setName] = useState(LOGGED_IN_CLIENT.name);
    const [email, setEmail] = useState(LOGGED_IN_CLIENT.email);
    const [phone, setPhone] = useState(LOGGED_IN_CLIENT.phone);

    // Security state
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Wire to Firestore: update client document
        alert("Profile updated (mock â€” no persistence yet).");
    };

    const handlePasswordSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPw !== confirmPw) {
            alert("Passwords do not match.");
            return;
        }
        if (newPw.length < 8) {
            alert("New password must be at least 8 characters.");
            return;
        }
        alert("Password change requested (mock).");
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
    };

    const inputClass =
        "w-full rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-black/30 px-4 py-2.5 text-sm  transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-black dark:text-white/90 placeholder:text-black/30 dark:placeholder:text-white/90/30";

    const labelClass =
        "block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1.5";

    const saveButtonClass =
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-xs font-semibold text-white shadow-sm shadow-primary/10 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40";

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white/90">
                    Account Settings
                </h1>
                <p className="text-sm text-black/50 dark:text-white/90 mt-1">
                    Update your contact details and security credentials.
                </p>
            </div>

            {/* Identity strip */}
            <div className="bg-surface dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 p-6 flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xl flex-shrink-0">
                    {LOGGED_IN_CLIENT.avatar}
                </div>
                <div>
                    <div className="text-lg font-extrabold text-black dark:text-white/90">{LOGGED_IN_CLIENT.name}</div>
                    <div className="text-xs text-black/50 dark:text-white/90 mt-0.5">{LOGGED_IN_CLIENT.email}</div>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        <IdentificationCardIcon size={12} weight="bold" />
                        Client Portal
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Profile form */}
                <form
                    onSubmit={handleProfileSave}
                    className="lg:col-span-7 bg-surface dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 p-6 space-y-5"
                >
                    <div className="flex items-center gap-2.5 pb-3 border-b border-black/5 dark:border-white/5">
                        <span className="p-1 rounded bg-primary/10 text-primary">
                            <UserIcon size={16} weight="bold" />
                        </span>
                        <h2 className="text-base font-bold text-black dark:text-white/90">Profile Details</h2>
                    </div>

                    {/* Name / Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass} htmlFor="client-name">Full Name</label>
                            <input
                                id="client-name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass} htmlFor="client-phone">Phone</label>
                            <input
                                id="client-phone"
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
                        <label className={labelClass} htmlFor="client-email">Email Address</label>
                        <input
                            id="client-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <button type="submit" className={saveButtonClass}>
                        <CheckIcon size={13} weight="bold" />
                        Save Profile
                    </button>
                </form>

                {/* Password form */}
                <form
                    onSubmit={handlePasswordSave}
                    className="lg:col-span-5 bg-surface dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 p-6 space-y-5"
                >
                    <div className="flex items-center gap-2.5 pb-3 border-b border-black/5 dark:border-white/5">
                        <span className="p-1 rounded bg-primary/10 text-primary">
                            <LockKeyIcon size={16} weight="bold" />
                        </span>
                        <h2 className="text-base font-bold text-black dark:text-white/90">Change Password</h2>
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="client-current-pw">Current Password</label>
                        <input
                            id="client-current-pw"
                            type="password"
                            value={currentPw}
                            onChange={(e) => setCurrentPw(e.target.value)}
                            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="client-new-pw">New Password</label>
                        <input
                            id="client-new-pw"
                            type="password"
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)}
                            placeholder="At least 8 characters"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="client-confirm-pw">Confirm New Password</label>
                        <input
                            id="client-confirm-pw"
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



