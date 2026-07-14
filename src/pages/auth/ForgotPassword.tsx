import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import AuthLayout from "@/pages/auth/AuthLayout";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid email address.");
            return;
        }

        setError("");
        setSubmitted(true);
    };

    return (
        <AuthLayout title="Reset password" subtitle="Enter your email and we will help you get back in.">
            {submitted ? (
                <div className="space-y-4 rounded-xl border border-black/10 dark:border-white/5 bg-parchment/30 dark:bg-ink/30 p-5 text-sm text-black dark:text-black/40">
                    <p className="font-semibold text-ink dark:text-parchment">If an account exists for this email, a reset link has been sent.</p>
                    <Link to="/login" className="inline-flex font-semibold text-primary hover:underline">
                        Back to login
                    </Link>
                </div>
            ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-black dark:text-black/40" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className={clsx(
                                "w-full rounded-xl border px-4 py-3 text-sm transition outline-none",
                                "bg-parchment/30 dark:bg-ink/30 text-ink dark:text-parchment",
                                error
                                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                    : "border-black/20 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            )}
                            placeholder="you@example.com"
                        />
                        {error ? <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p> : null}
                    </div>

                    <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-xl bg-primary hover:bg-primary/90 px-4 py-3.5 text-sm font-semibold text-white transition focus:ring-2 focus:ring-primary/30 outline-none shadow-md shadow-primary/10"
                    >
                        Send reset link
                    </button>
                </form>
            )}

            <p className="mt-6 text-center text-xs text-black dark:text-black/50">
                Remembered your password?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
}
