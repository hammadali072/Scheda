import * as React from "react";
import { Link } from "react-router-dom";
import TitleComponent from "@/components/shared/TitleComponent";
import { useTheme } from "@/context/theme-provider";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import AvailabilityGridDecor from "@/components/shared/AvailabilityGridDecor";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
    const { dark } = useTheme();
    const logoSrc = dark ? logoLight : logoDark;

    return (
        <main className="min-h-screen bg-parchment dark:bg-ink flex transition-colors duration-300">
            {/* Desktop Two-Column Layout Wrapper */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full">

                {/* Left side: Form Panel */}
                <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
                    {/* Top Logo */}
                    <div className="mb-8">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <img src={logoSrc} alt="Scheda" className="max-w-44 h-full object-contain" />
                        </Link>
                    </div>

                    {/* Form Card */}
                    <div className="my-auto max-w-md w-full mx-auto">
                        <div className="bg-surface dark:bg-card-dark rounded-3xl border border-black/20 dark:border-white/5 p-8 shadow-card">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-ink dark:text-parchment">
                                    {title}
                                </h2>
                                <p className="mt-2 text-sm text-black dark:text-black/40">
                                    {subtitle}
                                </p>
                            </div>
                            <div>
                                {children}
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 text-center lg:text-left">
                        <p className="text-xs text-black dark:text-black/50">
                            &copy; {new Date().getFullYear()} Scheda. Secure paid bookings.
                        </p>
                    </div>
                </div>

                {/* Right side: Decorative Panel (hidden on tablet/mobile) */}
                <div className="hidden lg:col-span-6 lg:flex flex-col justify-center items-center p-12 bg-surface/30 dark:bg-card-dark/30 border-l border-black/10 dark:border-white/5">
                    <div className="max-w-md w-full space-y-8">
                        <div className="space-y-3 text-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                Professional Bookings
                            </span>
                            <h3 className="text-2xl font-bold text-ink dark:text-parchment font-instrument italic">
                                Enterprise-Grade Scheduling
                            </h3>
                            <p className="text-sm text-black dark:text-black/40 max-w-sm mx-auto leading-relaxed">
                                Experience conflict-free booking, auto-timezone adjustments, and instant credit card confirmation.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl -z-10" />
                            <AvailabilityGridDecor />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
