import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import AuthLayout from "@/pages/auth/AuthLayout";

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
        <AuthLayout title="Create your account" subtitle="Sign up as a client or member to get started.">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-1 block text-sm font-medium text-black/80" htmlFor="name">
                        Full name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(event) => handleChange("name", event.target.value)}
                        className={clsx(
                            "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
                            errors.name ? "border-red-500" : "border-black/10 bg-white/80"
                        )}
                        placeholder="Your name"
                    />
                    {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-black/80" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(event) => handleChange("email", event.target.value)}
                        className={clsx(
                            "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
                            errors.email ? "border-red-500" : "border-black/10 bg-white/80"
                        )}
                        placeholder="you@example.com"
                    />
                    {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-black/80" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={(event) => handleChange("password", event.target.value)}
                        className={clsx(
                            "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
                            errors.password ? "border-red-500" : "border-black/10 bg-white/80"
                        )}
                        placeholder="At least 8 characters"
                    />
                    {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password}</p> : null}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-black/80" htmlFor="confirmPassword">
                        Confirm password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={(event) => handleChange("confirmPassword", event.target.value)}
                        className={clsx(
                            "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
                            errors.confirmPassword ? "border-red-500" : "border-black/10 bg-white/80"
                        )}
                        placeholder="Re-enter password"
                    />
                    {errors.confirmPassword ? <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p> : null}
                </div>

                <div>
                    <span className="mb-2 block text-sm font-medium text-black/80">I am joining as</span>
                    <div className="flex gap-3">
                        {(["client", "member"] as const).map((option) => (
                            <label key={option} className="flex flex-1 items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-3 text-sm text-black/80">
                                <input
                                    type="radio"
                                    name="role"
                                    value={option}
                                    checked={form.role === option}
                                    onChange={() => handleChange("role", option)}
                                    className="accent-primary"
                                />
                                {option === "client" ? "Client" : "Member"}
                            </label>
                        ))}
                    </div>
                    {errors.role ? <p className="mt-1 text-sm text-red-600">{errors.role}</p> : null}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Creating account...
                        </span>
                    ) : (
                        "Create account"
                    )}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-black/70">
                Already have an account? <Link to="/login" className="font-semibold text-primary">Log in</Link>
            </p>
        </AuthLayout>
    );
}
