import { Link } from "react-router-dom";
import { useTheme } from "@/context/theme-provider";
import ThemeButton from "@/components/shared/ThemeButton";
import AvailabilityGridDecor from "@/components/shared/AvailabilityGridDecor";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import { ShieldCheckIcon, CalendarCheckIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import clsx from "clsx";
import TitleComponent from "@/components/shared/TitleComponent";

export default function LandingPage() {
    const { dark } = useTheme();
    const logoSrc = dark ? logoLight : logoDark;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="relative min-h-screen flex flex-col bg-tint-gray dark:bg-black transition-colors duration-300">
            <header className="w-full z-30 border-b border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/60 lg:border-none lg:bg-transparent lg:backdrop-blur-none">
                <div className="container py-3.5 lg:py-6">
                    <div className="flex items-center justify-between gap-3">
                        <Link to="/" className="flex items-center gap-3">
                            <img className="h-full max-w-36 object-contain lg:max-w-44" src={logoSrc} alt="Scheda" />
                        </Link>

                        <div className="hidden items-center gap-4 md:flex">
                            <Link
                                to="/login"
                                className="text-slate dark:text-white/50 duration-300 hover:text-black dark:hover:text-white/90"
                            >
                                Sign In
                            </Link>
                            <ThemeButton as="link" to="/signup">Create Account</ThemeButton>
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 p-2.5 text-black shadow-sm transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/90 dark:hover:bg-white/10 md:hidden"
                            aria-label="Open navigation menu"
                        >
                            <ListIcon size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <div className={clsx("fixed inset-0 z-40 flex md:hidden", mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none")}>
                <div
                    className={clsx(
                        "absolute inset-0 bg-black/45 backdrop-blur-sm transition-all duration-300 ease-out",
                        mobileMenuOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                />
                <aside
                    className={clsx(
                        "relative z-10 h-full w-72 max-w-[85vw] border-r border-black/10 bg-white/95 p-4 shadow-2xl transition-transform duration-300 ease-out dark:border-white/10 dark:bg-tint-black",
                        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                            <img className="h-full max-w-28 object-contain" src={logoSrc} alt="Scheda" />
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-full p-2 text-black/70 transition-colors hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/5"
                            aria-label="Close navigation menu"
                        >
                            <XIcon size={18} />
                        </button>
                    </div>

                    <nav className="mt-8 flex flex-col gap-2">
                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-2xl px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-2xl px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10"
                        >
                            Create Account
                        </Link>
                    </nav>
                </aside>
            </div>

            <main className="flex flex-col justify-center flex-1 py-10 sm:py-12 lg:py-20 z-20">
                <div className="container">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 lg:items-center">
                        <div className="flex flex-col items-start text-left lg:col-span-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-6">
                                <span className="size-1.5 rounded-full bg-primary" />
                                Direct Advisory Booking
                            </span>

                            <h1 className="heading-h1 mb-6 text-black dark:text-white/90">Book dedicated consultation time, <span className="italic font-normal text-black dark:text-white/60">instantly.</span></h1>

                            <TitleComponent size='base' className="mb-8 text-black leading-relaxed dark:text-white/50 sm:text-lg">Connect directly with our advisory team for dedicated 1-on-1 strategy sessions. Check verified live availability, choose a slot, and secure your appointment instantly.</TitleComponent>

                            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                                <ThemeButton as="link" to="/login" variant="primary">Book a Session</ThemeButton>
                                <ThemeButton as="link" to="/signup" variant="secondary" className="border border-slate/20 dark:border-white/10">Join as Client</ThemeButton>
                            </div>
                        </div>

                        <div className="mx-auto w-full lg:col-span-6 lg:pl-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-3xl blur-2xl -z-10" />
                                <AvailabilityGridDecor />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="relative z-20 border-t border-slate/10 bg-white/50 py-8 transition-colors duration-300 dark:border-white/5 dark:bg-tint-black">
                <div className="container">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <span className="size-10 flex items-center justify-center rounded-md bg-primary/10">
                                <CalendarCheckIcon className="text-primary" size={24} />
                            </span>
                            <div>
                                <h3 className="text-xs font-bold text-black dark:text-white/90 uppercase tracking-wider">Direct Access</h3>
                                <TitleComponent size='small' className="text-black dark:text-white/50 mt-0.5">Book directly with our specialized team members.</TitleComponent>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="size-10 flex items-center justify-center rounded-md bg-primary/10">
                                <ShieldCheckIcon className="text-primary" size={24} />
                            </span>
                            <div>
                                <h3 className="text-xs font-bold text-black dark:text-white/90 uppercase tracking-wider">Verified Time</h3>
                                <TitleComponent size='small' className="text-black dark:text-white/50 mt-0.5">Zero double-bookings, conflict-free scheduling.</TitleComponent>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="size-10 flex items-center justify-center rounded-md bg-primary/10">
                                <CalendarCheckIcon className="text-primary" size={24} />
                            </span>
                            <div>
                                <h3 className="text-xs font-bold text-black dark:text-white/90 uppercase tracking-wider">Instant Confirmation</h3>
                                <TitleComponent size='small' className="text-black dark:text-white/50 mt-0.5">Seamless confirmation with direct scheduling and no extra steps.</TitleComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/20 dark:bg-[#2f2f2f]/50 w-[clamp(200px,50%,500px)] h-[clamp(200px,50%,500px)] rounded-full blur-[150px] z-[1] duration-300" />
        </div>
    );
}

