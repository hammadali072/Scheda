import { Link } from "react-router-dom";
import { useTheme } from "@/context/theme-provider";
import ThemeButton from "@/components/shared/ThemeButton";
import AvailabilityGridDecor from "@/components/shared/AvailabilityGridDecor";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import { ShieldCheckIcon, CalendarCheckIcon, CreditCardIcon } from "@phosphor-icons/react";
import TitleComponent from "@/components/shared/TitleComponent";

export default function LandingPage() {
    const { dark } = useTheme();
    const logoSrc = dark ? logoLight : logoDark;

    return (
        <div className="relative min-h-screen flex flex-col bg-tint-gray dark:bg-black transition-colors duration-300">
            {/* Header */}
            <header className="w-full p-6 flex items-center justify-between z-20">
                <div className="container">
                    <div className="flex justify-between">
                        <Link to="/" className="flex items-center gap-3">
                            <img className="max-w-44 h-full object-contain" src={logoSrc} alt="Scheda" />
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-slate dark:text-white/50 duration-300 hover:text-black dark:hover:text-white/90"
                            >
                                Sign In
                            </Link>
                            <ThemeButton as="link" to="/signup">Create Account</ThemeButton>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex flex-col justify-center flex-1 py-12 lg:py-20 z-20">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        {/* Left Column */}
                        <div className="lg:col-span-6 flex flex-col items-start text-left">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-6">
                                <span className="size-1.5 rounded-full bg-primary" />
                                Direct Advisory Booking
                            </span>

                            <h1 className="heading-h1 text-black dark:text-white/90 mb-6">
                                Book dedicated consultation time, <span className="italic font-normal text-black dark:text-white/60">instantly.</span>
                            </h1>

                            <TitleComponent size='base' className="sm:text-lg text-black dark:text-white/50 leading-relaxed mb-8">
                                Connect directly with our advisory team for dedicated 1-on-1 strategy sessions. Check verified live availability, choose a slot, and secure your appointment instantly.
                            </TitleComponent>

                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <ThemeButton as="link" to="/login" variant="primary">
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
                </div>
            </main>

            <footer className="relative border-t border-slate/10 dark:border-white/5 py-8 bg-surface/50 dark:bg-tint-black transition-colors duration-300 z-20">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                <CreditCardIcon className="text-primary" size={24} />
                            </span>
                            <div>
                                <h3 className="text-xs font-bold text-black dark:text-white/90 uppercase tracking-wider">Secure Bookings</h3>
                                <TitleComponent size='small' className="text-black dark:text-white/50 mt-0.5">Seamless confirmation with direct secure transactions.</TitleComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/20 dark:bg-[#2f2f2f]/50 w-[500px] h-[500px] rounded-full blur-[150px] z-[1] duration-300" />
        </div>
    );
}

