import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import AuthLayout from "@/pages/auth/AuthLayout";

interface LoginFormState {
    email: string;
    password: string;
}

interface LoginErrors {
    email?: string;
    password?: string;
}

export default function Login() {
    const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
    const [errors, setErrors] = useState<LoginErrors>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof LoginFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: LoginErrors = {};
        if (!form.email.trim()) {
            nextErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!form.password.trim()) {
            nextErrors.password = "Password is required.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        window.setTimeout(() => {
            console.log("Login submit", form);
            setLoading(false);
        }, 800);
    };

    return (
        <AuthLayout title="Welcome back" subtitle="Log in to continue with your Scheda account.">
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                        placeholder="Enter your password"
                    />
                    {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password}</p> : null}
                </div>

                <div className="flex items-center justify-between text-sm">
                    <Link to="/forgot-password" className="font-medium text-primary transition hover:text-primary/80">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Submitting...
                        </span>
                    ) : (
                        "Log in"
                    )}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-black/70">
                Don&apos;t have an account? <Link to="/signup" className="font-semibold text-primary">Sign up</Link>
            </p>
        </AuthLayout>
    );
}
