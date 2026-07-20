import { Link } from "react-router-dom";
import { ArrowLeftIcon, HouseIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import TitleComponent from "@/components/shared/TitleComponent";
import ThemeButton from "@/components/shared/ThemeButton";

export default function NotFoundPage() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-tint-gray px-4 py-12 text-black transition-colors duration-300 dark:bg-black dark:text-white/90">
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px] dark:bg-[#2f2f2f]/50" />

            <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-black/10 bg-white/70 shadow-shadow2-effect backdrop-blur-xl dark:border-white/10 dark:bg-tint-black/80">
                <div className="grid items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-16">
                    <div className="text-center lg:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            <MagnifyingGlassIcon size={14} weight="bold" />
                            Error 404
                        </span>

                        <TitleComponent size="extra-large-bold" className="mt-6 text-black dark:text-white/90">
                            We lost the page you were looking for.
                        </TitleComponent>

                        <TitleComponent size="base" className="mt-4 text-black/60 dark:text-white/50">
                            The page may have moved, been removed, or the URL might be incorrect. Let’s get you back on track.
                        </TitleComponent>

                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
                            <ThemeButton as="link" to="/" variant="primary" className="w-full sm:w-auto">
                                <span className="flex items-center gap-2">
                                    <HouseIcon size={18} weight="bold" />
                                    Back to Home
                                </span>
                            </ThemeButton>
                            <Link
                                to="/login"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-black/[0.03] dark:border-white/10 dark:text-white/90 dark:hover:bg-white/[0.06] sm:w-auto"
                            >
                                <ArrowLeftIcon size={16} weight="bold" />
                                Go to Login
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-black/10 bg-gradient-to-br from-primary/15 via-white/80 to-primary/10 p-8 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)] backdrop-blur dark:border-white/10 dark:from-primary/20 dark:via-tint-black dark:to-primary/10">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/70 bg-white/80 text-5xl font-black text-primary shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/70">
                            404
                        </div>
                        <div className="mt-6 rounded-2xl border border-black/10 bg-white/70 p-5 text-sm leading-7 text-black/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-white/60">
                            If you were trying to book an appointment, sign in and continue from your dashboard.
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
