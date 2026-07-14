import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import AuthLayout from "@/pages/auth/AuthLayout";
import { User, Briefcase } from "@phosphor-icons/react";

interface SignupFormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "client" | "member";
}

interface SignupErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
}

export default function Signup() {
    const [form, setForm] = useState<SignupFormState>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "client",
    });
    const [errors, setErrors] = useState<SignupErrors>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof SignupFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: SignupErrors = {};
        if (!form.name.trim()) {
            nextErrors.name = "Name is required.";
        }

        if (!form.email.trim()) {
            nextErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!form.password.trim()) {
            nextErrors.password = "Password is required.";
        } else if (form.password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters.";
        }

        if (!form.confirmPassword.trim()) {
            nextErrors.confirmPassword = "Please confirm your password.";
        } else if (form.confirmPassword !== form.password) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        if (!form.role) {
            nextErrors.role = "Please select a role.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        window.setTimeout(() => {
            console.log("Signup submit", form);
            setLoading(false);
        }, 800);
    };

    return (
        <AuthLayout title="Create your account" subtitle="Sign up to start scheduling or hosting consultations.">
            <form className="space-y-4" onSubmit={handleSubmit}>

                {/* Role Selection Cards */}
                <div>
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-black dark:text-black/40">
                        I am joining as
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Client Role Option */}
                        <button
                            type="button"
                            onClick={() => handleChange("role", "client")}
                            className={clsx(
                                "flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                                form.role === "client"
                                    ? "border-primary bg-primary/[0.03] dark:bg-primary/[0.02] shadow-sm"
                                    : "border-black/10 dark:border-white/5 bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            <span className={clsx(
                                "p-1.5 rounded-lg mb-2 inline-flex",
                                form.role === "client" ? "bg-primary/10 text-primary" : "bg-black/10 text-black"
                            )}>
                                <User size={18} weight="bold" />
                            </span>
                            <span className="text-sm font-semibold text-ink dark:text-parchment">Client</span>
                            <span className="text-[10px] text-black dark:text-black/50 mt-0.5 leading-normal">
                                Book consultation calls with our specialized team members.
                            </span>
                        </button>

                        {/* Member Role Option */}
                        <button
                            type="button"
                            onClick={() => handleChange("role", "member")}
                            className={clsx(
                                "flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                                form.role === "member"
                                    ? "border-primary bg-primary/[0.03] dark:bg-primary/[0.02] shadow-sm"
                                    : "border-black/10 dark:border-white/5 bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            <span className={clsx(
                                "p-1.5 rounded-lg mb-2 inline-flex",
                                form.role === "member" ? "bg-primary/10 text-primary" : "bg-black/10 text-black"
                            )}>
                                <Briefcase size={18} weight="bold" />
                            </span>
                            <span className="text-sm font-semibold text-ink dark:text-parchment">Team Member</span>
                            <span className="text-[10px] text-black dark:text-black/50 mt-0.5 leading-normal">
                                Host paid advisory calls and manage availability.
                            </span>
                        </button>
                    </div>
                    {errors.role ? <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.role}</p> : null}
                </div>

                {/* Full Name */}
                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-black dark:text-black/40" htmlFor="name">
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(event) => handleChange("name", event.target.value)}
                        className={clsx(
                            "w-full rounded-xl border px-4 py-2.5 text-sm transition outline-none",
                            "bg-parchment/30 dark:bg-ink/30 text-ink dark:text-parchment",
                            errors.name
                                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-black/20 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        )}
                        placeholder="Your name"
                    />
                    {errors.name ? <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p> : null}
                </div>

                {/* Email Address */}
                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-black dark:text-black/40" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(event) => handleChange("email", event.target.value)}
                        className={clsx(
                            "w-full rounded-xl border px-4 py-2.5 text-sm transition outline-none",
                            "bg-parchment/30 dark:bg-ink/30 text-ink dark:text-parchment",
                            errors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-black/20 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        )}
                        placeholder="you@example.com"
                    />
                    {errors.email ? <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p> : null}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-black dark:text-black/40" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={(event) => handleChange("password", event.target.value)}
                            className={clsx(
                                "w-full rounded-xl border px-4 py-2.5 text-sm transition outline-none",
                                "bg-parchment/30 dark:bg-ink/30 text-ink dark:text-parchment",
                                errors.password
                                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                    : "border-black/20 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            )}
                            placeholder="At least 8 chars"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-black dark:text-black/40" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={(event) => handleChange("confirmPassword", event.target.value)}
                            className={clsx(
                                "w-full rounded-xl border px-4 py-2.5 text-sm transition outline-none",
                                "bg-parchment/30 dark:bg-ink/30 text-ink dark:text-parchment",
                                errors.confirmPassword
                                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                    : "border-black/20 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            )}
                            placeholder="Re-enter password"
                        />
                    </div>
                </div>
                {(errors.password || errors.confirmPassword) && (
                    <div className="space-y-1 mt-1">
                        {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                        {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-primary hover:bg-primary/90 px-4 py-3 text-sm font-semibold text-white transition focus:ring-2 focus:ring-primary/30 outline-none disabled:cursor-not-allowed disabled:opacity-75 shadow-md shadow-primary/10 mt-2"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Creating Account...
                        </span>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            <p className="mt-5 text-center text-xs text-black dark:text-black/50">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
}
