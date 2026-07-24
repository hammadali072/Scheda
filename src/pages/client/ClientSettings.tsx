import { useEffect, useMemo, useState } from "react";
import {
    UserIcon,
    LockKeyIcon,
    CheckIcon,
    IdentificationCardIcon,
} from "@phosphor-icons/react";
import TitleComponent from "@/components/shared/TitleComponent";
import { useAuth } from "@/context/auth-context";
import {
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    isReauthRequiredError,
} from "@/services/userService";

export default function ClientSettings() {
    const { profile, authUser } = useAuth();
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [passwordPrompt, setPasswordPrompt] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            if (!profile?.uid) {
                return;
            }

            try {
                const nextProfile = await getUserProfile(profile.uid);
                setName(nextProfile.name);
                setEmail(nextProfile.email);
                setPhone(nextProfile.phone ?? "");
                setProfileError(null);
            } catch (error) {
                setProfileError(error instanceof Error ? error.message : "Unable to load profile.");
            }
        };

        void loadProfile();
    }, [profile?.uid]);

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.uid) return;

        try {
            setProfileError(null);
            setProfileSuccess(null);
            await updateUserProfile(profile.uid, { name, email, phone });
            setProfileSuccess("Profile updated successfully.");
        } catch (error) {
            setProfileError(error instanceof Error ? error.message : "Unable to update profile.");
        }
    };

    const handlePasswordSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPw !== confirmPw) {
            setPasswordError("Passwords do not match.");
            setPasswordSuccess(null);
            return;
        }

        if (!newPw || newPw.length < 8) {
            setPasswordError("New password must be at least 8 characters.");
            setPasswordSuccess(null);
            return;
        }

        try {
            setPasswordError(null);
            setPasswordSuccess(null);
            await updateUserPassword(newPw, passwordPrompt ? currentPw : undefined);
            setPasswordSuccess("Password updated successfully.");
            setCurrentPw("");
            setNewPw("");
            setConfirmPw("");
            setPasswordPrompt(false);
        } catch (error) {
            if (isReauthRequiredError(error)) {
                setPasswordError("Please re-enter your current password to continue.");
                setPasswordPrompt(true);
            } else {
                setPasswordError(error instanceof Error ? error.message : "Unable to update password.");
            }
        }
    };

    const profileCardName = useMemo(
        () => profile?.name || authUser?.displayName || "Your account",
        [profile?.name, authUser?.displayName]
    );

    const profileCardRole = useMemo(() => profile?.role ?? "client", [profile?.role]);

    const profileCardInitials = useMemo(() => {
        const initials = profileCardName
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
        return initials || "CL";
    }, [profileCardName]);

    const inputClass =
        "w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] px-4 py-2.5 text-sm transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-black dark:text-white/90 placeholder:text-black/30 dark:placeholder:text-white/90/30";

    const labelClass =
        "block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1.5";

    const saveButtonClass =
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-b from-primary-start to-primary-end hover:bg-primary/90 text-xs font-semibold text-white shadow-sm shadow-primary/10 transition-colors focus: focus-visible:ring-2 focus-visible:ring-primary/40 hover:from-secondary-start hover:to-secondary-end";

    return (
        <div className="space-y-8">

            <div>
                <h2 className="heading-h2 text-black dark:text-white/90">Account Settings</h2>
                <TitleComponent size='small' className="text-black/50 dark:text-white/90 mt-1">Update your contact details and security credentials.</TitleComponent>
            </div>

            <div className="bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 p-6 flex items-center gap-5">
                <div className="size-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xl flex-shrink-0">
                    {profileCardInitials}
                </div>
                <div>
                    <div className="text-lg font-extrabold text-black dark:text-white/90">{profileCardName}</div>
                    <div className="text-xs text-black/50 dark:text-white/90 mt-0.5">{email}</div>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        <IdentificationCardIcon size={12} weight="bold" />
                        {profileCardRole}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form
                    onSubmit={handleProfileSave}
                    className="lg:col-span-7 bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 p-6 space-y-5"
                >
                    <div className="flex items-center gap-2.5 pb-3 border-b border-black/5 dark:border-white/5">
                        <span className="p-1 rounded bg-primary/10 text-primary">
                            <UserIcon size={16} weight="bold" />
                        </span>
                        <h2 className="text-base font-bold text-black dark:text-white/90">Profile Details</h2>
                    </div>

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

                    {profileError ? <p className="text-sm text-red-500">{profileError}</p> : null}
                    {profileSuccess ? <p className="text-sm text-emerald-600">{profileSuccess}</p> : null}

                    <button type="submit" className={saveButtonClass}>
                        <CheckIcon size={13} weight="bold" />
                        Save Profile
                    </button>
                </form>

                <form
                    onSubmit={handlePasswordSave}
                    className="lg:col-span-5 bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 p-6 space-y-5"
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
                            placeholder="••••••••"
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

                    {passwordError ? <p className="text-sm text-red-500">{passwordError}</p> : null}
                    {passwordSuccess ? <p className="text-sm text-emerald-600">{passwordSuccess}</p> : null}

                    <button type="submit" className={saveButtonClass}>
                        <CheckIcon size={13} weight="bold" />
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}



