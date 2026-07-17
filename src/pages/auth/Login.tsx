import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import AuthLayout from "@/pages/auth/AuthLayout";
import TitleComponent from "@/components/shared/TitleComponent";

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
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-black dark:text-white/40" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(event) => handleChange("email", event.target.value)}
                        className={clsx(
                            "w-full rounded-xl border px-4 py-3 text-sm transition ",
                            "bg-parchment/30 dark:bg-black/30 text-black dark:text-white/90",
                            errors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-black/20 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        )}
                        placeholder="you@example.com"
                    />
                    {errors.email ? <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p> : null}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black dark:text-white/40" htmlFor="password">
                            Password
                        </label>
                        <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                            Forgot?
                        </Link>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={(event) => handleChange("password", event.target.value)}
                        className={clsx(
                            "w-full rounded-xl border px-4 py-3 text-sm transition ",
                            "bg-parchment/30 dark:bg-black/30 text-black dark:text-white/90",
                            errors.password
                                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-black/20 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        )}
                        placeholder="••••••••"
                    />
                    {errors.password ? <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p> : null}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-primary hover:bg-primary/90 px-4 py-3.5 text-sm font-semibold text-white transition focus:ring-2 focus:ring-primary/30  disabled:cursor-not-allowed disabled:opacity-75 shadow-md shadow-primary/10"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Signing In...
                        </span>
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>

            <TitleComponent size="small" className="mt-6 text-center text-black dark:text-white/50">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="font-semibold text-primary hover:underline">
                    Sign up
                </Link>
            </TitleComponent>
        </AuthLayout>
    );
}


