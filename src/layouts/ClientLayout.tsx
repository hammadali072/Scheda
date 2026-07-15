import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@/context/theme-provider";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import {
    GridFour as GridFourIcon,
    MagnifyingGlass as MagnifyingGlassIcon,
    CalendarBlank as CalendarBlankIcon,
    Gear as GearIcon,
    List as ListIcon,
    X as XIcon,
    SignOut as SignOutIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { LOGGED_IN_CLIENT } from "@/mock/clientMockData";
import { ClientAppointmentsProvider } from "@/context/client-appointments-context";

const NAV_ITEMS = [
    { name: "Overview",         path: "/client",              icon: GridFourIcon,         exact: true },
    { name: "Find a Member",    path: "/client/find",         icon: MagnifyingGlassIcon,  exact: false },
    { name: "My Appointments",  path: "/client/appointments", icon: CalendarBlankIcon,    exact: false },
    { name: "Settings",         path: "/client/settings",     icon: GearIcon,             exact: false },
];

function SidebarContent({
    isMobile = false,
    onClose,
    logoSrc,
}: {
    isMobile?: boolean;
    onClose?: () => void;
    logoSrc: string;
}) {
    const location = useLocation();

    const isActive = (item: (typeof NAV_ITEMS)[0]) => {
        if (item.exact) return location.pathname === item.path;
        return location.pathname.startsWith(item.path);
    };

    return (
        <div className="flex flex-col h-full bg-surface dark:bg-card-dark transition-colors duration-300">

            {/* Logo */}
            <div className="p-6 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                <Link to="/">
                    <img src={logoSrc} alt="Scheda" className="max-w-32 h-full object-contain" />
                </Link>
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-black dark:text-parchment hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        aria-label="Close navigation menu"
                    >
                        <XIcon size={20} />
                    </button>
                )}
            </div>

            {/* Role badge */}
            <div className="px-6 pt-4 pb-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Client Portal
                </span>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto" aria-label="Client navigation">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item);
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.exact}
                            onClick={() => isMobile && onClose?.()}
                            className={clsx(
                                "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                                active
                                    ? "bg-primary text-white shadow-sm shadow-primary/10"
                                    : "text-black/60 dark:text-parchment/60 hover:text-ink dark:hover:text-parchment hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                            aria-current={active ? "page" : undefined}
                        >
                            <item.icon
                                size={20}
                                weight={active ? "bold" : "regular"}
                                className={clsx(
                                    "transition-colors flex-shrink-0",
                                    active
                                        ? "text-white"
                                        : "text-black/40 dark:text-parchment/40 group-hover:text-ink dark:group-hover:text-parchment"
                                )}
                            />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Profile footer */}
            <div className="p-4 border-t border-black/10 dark:border-white/5">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {LOGGED_IN_CLIENT.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-ink dark:text-parchment truncate">
                            {LOGGED_IN_CLIENT.name}
                        </div>
                        <div className="text-[10px] text-black/40 dark:text-parchment/40 truncate">
                            {LOGGED_IN_CLIENT.email}
                        </div>
                    </div>
                </div>
                <Link
                    to="/login"
                    className="mt-2 flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30"
                >
                    <SignOutIcon size={16} />
                    <span>Sign Out</span>
                </Link>
            </div>
        </div>
    );
}

export default function ClientLayout() {
    const { dark } = useTheme();
    const logoSrc = dark ? logoLight : logoDark;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <ClientAppointmentsProvider>
            <div className="min-h-screen flex bg-parchment dark:bg-ink transition-colors duration-300 text-ink dark:text-parchment">

                {/* Desktop sidebar — fixed, sticky */}
                <aside className="hidden lg:block w-64 border-r border-black/10 dark:border-white/5 flex-shrink-0 h-screen sticky top-0">
                    <SidebarContent logoSrc={logoSrc} />
                </aside>

                {/* Main content column */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Mobile topbar */}
                    <header className="lg:hidden h-16 border-b border-black/10 dark:border-white/5 px-6 flex items-center justify-between bg-surface dark:bg-card-dark z-20">
                        <Link to="/">
                            <img src={logoSrc} alt="Scheda" className="max-w-28 h-full object-contain" />
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 rounded-xl border border-black/10 dark:border-white/10 text-black dark:text-parchment focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            aria-label="Open navigation menu"
                        >
                            <ListIcon size={20} />
                        </button>
                    </header>

                    {/* Mobile drawer overlay */}
                    {mobileMenuOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden flex motion-safe:animate-fade-in">
                            <div
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-hidden="true"
                            />
                            <aside className="relative w-64 max-w-[80vw] h-full flex flex-col z-10 shadow-2xl">
                                <SidebarContent
                                    isMobile
                                    logoSrc={logoSrc}
                                    onClose={() => setMobileMenuOpen(false)}
                                />
                            </aside>
                        </div>
                    )}

                    {/* Page content */}
                    <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto overflow-x-hidden">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ClientAppointmentsProvider>
    );
}
