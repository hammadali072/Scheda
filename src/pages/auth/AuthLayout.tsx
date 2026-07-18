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
        <main className="relative bg-tint-gray dark:bg-black transition-colors duration-300">
            <div className="container">
                <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-12 z-[999]">
                    <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
                        <div className="mb-8">
                            <Link to="/" className="inline-flex items-center gap-3">
                                <img src={logoSrc} alt="Scheda" className="max-w-44 h-full object-contain" />
                            </Link>
                        </div>

                        <div>
                            <div className="bg-black/5 dark:bg-white/5 rounded-3xl border border-black/20 dark:border-white/5 p-8 shadow-shadow2-effect dark:shadow-shadow1">
                                <div className="mb-6">
                                    <h2 className="heading-h2 text-black dark:text-white/90">{title}</h2>
                                    <TitleComponent size='small' className="mt-2 text-black dark:text-white/50">{subtitle}</TitleComponent>
                                </div>
                                <div>
                                    {children}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center lg:text-left">
                            <TitleComponent size='small' className="text-black dark:text-white/50">
                                &copy; {new Date().getFullYear()} Scheda. All rights reserved.
                            </TitleComponent>
                        </div>
                    </div>
                    <div className="hidden lg:col-span-6 lg:flex flex-col justify-center items-center p-12 border-l border-black/10 dark:border-white/5">
                        <div className="max-w-md w-full space-y-8">
                            <div className="space-y-3 text-center">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                    Professional Bookings
                                </span>
                                <h3 className="text-2xl font-bold text-black dark:text-white/90 font-instrument italic">Enterprise-Grade Scheduling</h3>
                                <TitleComponent size='small' className="text-sm text-black dark:text-black/40 max-w-sm mx-auto leading-relaxed">Experience conflict-free booking, auto-timezone adjustments, and instant credit card confirmation.</TitleComponent>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl -z-10" />
                                <AvailabilityGridDecor />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 top-1/2 w-[clamp(200px,50%,500px)] h-[clamp(200px,50%,500px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px] duration-300 dark:bg-[#2f2f2f]/50" />
        </main>
    );
}
