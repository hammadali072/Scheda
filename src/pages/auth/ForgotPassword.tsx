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
                <div className="space-y-3 rounded-2xl border border-black/10 bg-white/80 p-4 text-sm text-black/70">
                    <p className="font-semibold text-black">If an account exists for this email, a reset link has been sent.</p>
                    <Link to="/login" className="inline-flex font-semibold text-primary">
                        Back to login
                    </Link>
                </div>
            ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-black/80" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className={clsx(
                                "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
                                error ? "border-red-500" : "border-black/10 bg-white/80"
                            )}
                            placeholder="you@example.com"
                        />
                        {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
                    </div>

                    <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                    >
                        Send reset link
                    </button>
                </form>
            )}

            <p className="mt-4 text-center text-sm text-black/70">
                Remembered your password? <Link to="/login" className="font-semibold text-primary">Log in</Link>
            </p>
        </AuthLayout>
    );
}
