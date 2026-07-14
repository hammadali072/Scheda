import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/theme-provider";
import ThemeButton from "@/components/shared/ThemeButton";
import AvailabilityGridDecor from "@/components/shared/AvailabilityGridDecor";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import { ShieldCheck, CalendarCheck, CreditCard } from "@phosphor-icons/react";

export default function LandingPage() {
    const { dark } = useTheme();
    const logoSrc = dark ? logoLight : logoDark;

    return (
        <div className="min-h-screen flex flex-col bg-parchment dark:bg-ink transition-colors duration-300">
            {/* Header */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20">
                <Link to="/" className="flex items-center gap-3">
                    <img className="max-w-44 h-full object-contain" src={logoSrc} alt="Scheda" />
                </Link>
                <div className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-slate hover:text-ink dark:hover:text-parchment transition-colors"
                    >
                        Sign In
                    </Link>
                    <ThemeButton as="link" to="/signup" primary2 className="!px-4 !py-2 !text-xs">
                        Create Account
                    </ThemeButton>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 lg:py-20 flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Left Column */}
                    <div className="lg:col-span-6 flex flex-col items-start text-left">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-6">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Direct Advisory Booking
                        </span>

                        <h1 className="font-instrument text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-ink dark:text-parchment mb-6">
                            Book dedicated consultation time, <span className="italic font-normal text-slate dark:text-slate/60">instantly.</span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate dark:text-slate/40 leading-relaxed mb-8 max-w-xl">
                            Connect directly with our advisory team for dedicated 1-on-1 strategy sessions. Check verified live availability, choose a slot, and secure your appointment instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <ThemeButton as="link" to="/login" variant="primary" className="shadow-lg shadow-primary/20">
                                Book a Session
                            </ThemeButton>
                            <ThemeButton as="link" to="/signup" variant="secondary" className="border border-slate/20 dark:border-white/10">
                                Join as Client
                            </ThemeButton>
                        </div>
                    </div>

                    {/* Right Column (Signature Element) */}
                    <div className="lg:col-span-6 w-full max-w-md lg:max-w-none mx-auto lg:pl-8">
                        <div className="relative">
                            {/* Decorative background visual framing the grid */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-3xl blur-2xl -z-10" />
                            <AvailabilityGridDecor />
                        </div>
                    </div>
                </div>
            </main>

            {/* Minimal Proof / Value Strip */}
            <footer className="border-t border-slate/10 dark:border-white/5 py-8 bg-surface/50 dark:bg-card-dark/20 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CalendarCheck size={20} />
                        </span>
                        <div>
                            <h3 className="text-xs font-bold text-ink dark:text-parchment uppercase tracking-wider">Direct Access</h3>
                            <p className="text-xs text-slate dark:text-slate/50 mt-0.5">Book directly with our specialized team members.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ShieldCheck size={20} />
                        </span>
                        <div>
                            <h3 className="text-xs font-bold text-ink dark:text-parchment uppercase tracking-wider">Verified Time</h3>
                            <p className="text-xs text-slate dark:text-slate/50 mt-0.5">Zero double-bookings, conflict-free scheduling.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CreditCard size={20} />
                        </span>
                        <div>
                            <h3 className="text-xs font-bold text-ink dark:text-parchment uppercase tracking-wider">Secure Bookings</h3>
                            <p className="text-xs text-slate dark:text-slate/50 mt-0.5">Seamless confirmation with direct secure transactions.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
