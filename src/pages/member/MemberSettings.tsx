import { useEffect, useMemo, useState } from "react";
import {
    UserIcon,
    LockKeyIcon,
    CheckIcon,
    IdentificationCardIcon,
} from "@phosphor-icons/react";
import TitleComponent from "@/components/shared/TitleComponent";
import { useAuth } from "@/context/auth-context";
import { getUserProfile, updateUserProfile, updateUserPassword, isReauthRequiredError } from "@/services/userService";

const MAX_BIO = 280;

export default function MemberSettings() {
    const { profile, authUser } = useAuth();
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [passwordPrompt, setPasswordPrompt] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [designation, setDesignation] = useState("");
    const [bio, setBio] = useState("");

    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            if (!profile?.uid) {
                setLoadingProfile(false);
                return;
            }

            try {
                setLoadingProfile(true);
                const nextProfile = await getUserProfile(profile.uid);
                setName(nextProfile.name);
                setEmail(nextProfile.email);
                setPhone(nextProfile.phone ?? "");
                setDesignation(nextProfile.designation ?? "");
                setBio(nextProfile.bio ?? "");
                setProfileError(null);
            } catch (error) {
                setProfileError(error instanceof Error ? error.message : "Unable to load profile.");
            } finally {
                setLoadingProfile(false);
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
            await updateUserProfile(profile.uid, {
                name,
                email,
                phone,
                designation,
                bio,
            });
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

    const inputClass =
        "w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] px-4 py-2.5 text-sm transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-black dark:text-white/90 placeholder:text-black/30 dark:placeholder:text-white/90/30";

    const profileCardName = useMemo(() => profile?.name || authUser?.displayName || "Your account", [profile?.name, authUser?.displayName]);
    const profileCardRole = useMemo(() => profile?.role || "member", [profile?.role]);
    const profileCardInitials = useMemo(() => {
        const initials = profileCardName
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
        return initials || "ME";
    }, [profileCardName]);

    const labelClass = "block text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/90 mb-1.5";

    const saveButtonClass = "inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-b from-primary-start to-primary-end hover:from-secondary-start hover:to-secondary-end text-sm font-semibold text-white shadow-sm shadow-primary/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary/40";

    return (
        <div className="space-y-8">
            <div>
                <h2 className="heading-h2 text-black dark:text-white/90">Account Settings</h2>
                <TitleComponent size="small" className="text-black/50 dark:text-white/90 md:text-base mt-1">Update your personal profile, contact details, and security credentials.</TitleComponent>
            </div>

            <div className="bg-white dark:bg-tint-black/60 rounded-3xl border border-black/10 dark:border-white/5 shadow-shadow2-effect dark:shadow-shadow1 p-6 flex items-center gap-5">
                <div className="size-16 rounded-xl bg-primary/10 border border-primary/50 text-primary flex items-center justify-center font-black text-xl flex-shrink-0">{profileCardInitials}</div>
                <div>
                    <h4 className="text-lg font-extrabold text-black dark:text-white/90">{profileCardName}</h4>
                    <h5 className="capitalize text-sm text-black/50 dark:text-white/90 mt-0.5">{profileCardRole}</h5>
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
                        <h4 className="text-black dark:text-white/90 text-base font-bold">Profile Details</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass} htmlFor="member-name">Full Name</label>
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
                            <label className={labelClass} htmlFor="member-phone">Phone</label>
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

                    <div>
                        <label className={labelClass} htmlFor="member-email">Email Address</label>
                        <input
                            id="member-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="member-designation">
                            Designation <span className="normal-case font-normal text-black/30 dark:text-white/90">(shown to clients)</span>
                        </label>
                        <input
                            id="member-designation"
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="e.g. Corporate Law & Restructuring"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className={labelClass} htmlFor="member-bio">
                                Bio <span className="normal-case font-normal text-black/30 dark:text-white/90">(client-facing)</span>
                            </label>
                            <span
                                className={`text-[10px] font-mono ${bio.length > MAX_BIO ? "text-red-500" : "text-black/30 dark:text-white/90"
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
                        <p className="mt-1 text-[10px] text-black/30 dark:text-white/90">Displayed on your public booking page. Keep it concise and client-focused.</p>
                    </div>

                    {profileError ? <p className="text-sm text-red-500">{profileError}</p> : null}
                    {profileSuccess ? <p className="text-sm text-emerald-600">{profileSuccess}</p> : null}
                    {loadingProfile ? <p className="text-sm text-black/50 dark:text-white/90">Loading profile…</p> : null}

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
                        <h4 className="text-black dark:text-white/90 text-base font-bold">Change Password</h4>
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="current-pw">Current Password</label>
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
                        <label className={labelClass} htmlFor="new-pw">New Password</label>
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
                        <label className={labelClass} htmlFor="confirm-pw">Confirm New Password</label>
                        <input
                            id="confirm-pw"
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



