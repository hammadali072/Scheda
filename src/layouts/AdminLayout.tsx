import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@/context/theme-provider";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import faviconDark from "@/assets/fav-icon-dark.svg";
import faviconLight from "@/assets/fav-icon-light.svg";
import {
    GridFourIcon,
    UsersIcon,
    IdentificationCardIcon,
    CalendarBlankIcon,
    GearIcon,
    ListIcon,
    XIcon,
    SignOutIcon,
    BellSimpleIcon
} from "@phosphor-icons/react";
import clsx from "clsx";

import TitleComponent from "@/components/shared/TitleComponent";

export default function AdminLayout() {
    const { dark } = useTheme();
    const logoSrc = dark ? logoLight : logoDark;
    const faviconSrc = dark ? faviconLight : faviconDark;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();

    const adminUser = {
        name: "Devon Lane",
        email: "devon.lane@scheda.com",
        avatar: "DL"
    };

    const navigationItems = [
        { name: "Overview", path: "/admin", icon: GridFourIcon, exact: true },
        { name: "Members", path: "/admin/members", icon: UsersIcon },
        { name: "Clients", path: "/admin/clients", icon: IdentificationCardIcon },
        { name: "Appointments", path: "/admin/appointments", icon: CalendarBlankIcon },
        { name: "Settings", path: "/admin/settings", icon: GearIcon }
    ];

    const notifications = [
        {
            title: "New appointment request",
            description: "A client requested a consultation for Friday at 2:00 PM.",
            time: "5m ago"
        },
        {
            title: "Availability updated",
            description: "Your team schedule was refreshed for next week.",
            time: "1h ago"
        },
        {
            title: "Payment confirmed",
            description: "The latest session payment has been recorded successfully.",
            time: "3h ago"
        }
    ];

    const pageTitle = navigationItems.find((item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    })?.name ?? "Dashboard";

    const isActive = (item: typeof navigationItems[0]) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    };

    useEffect(() => {
        setMobileMenuOpen(false);
        setNotificationsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="flex w-full h-full flex-col bg-surface/95 dark:bg-tint-black backdrop-blur-xl transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-4 dark:border-white/5 lg:px-6">
                <Link to="/" className="flex items-center gap-3">
                    <img src={faviconSrc} alt="Scheda" className="h-10 w-10 object-contain lg:hidden" />
                    <img src={logoSrc} alt="Scheda" className="hidden h-full max-w-32 object-contain lg:block" />
                </Link>
                {isMobile && (
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg p-1.5 text-black/70 transition-colors hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/5"
                    >
                        <XIcon size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-6">
                {navigationItems.map((item) => {
                    const active = isActive(item);
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.exact}
                            onClick={() => isMobile && setMobileMenuOpen(false)}
                            className={clsx(
                                "group relative flex items-center overflow-hidden rounded-full px-4 py-3 text-base font-medium transition-all duration-300",
                                active
                                    ? "bg-gradient-to-b from-primary-start to-primary-end text-white shadow-inset"
                                    : "text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white/90"
                            )}
                        >
                            <item.icon
                                size={22}
                                weight={active ? "bold" : "regular"}
                                className={clsx(
                                    "mr-3 shrink-0 transition-colors",
                                    active ? "text-white" : "text-black/40 group-hover:text-black dark:text-white/90 dark:group-hover:text-white/90"
                                )}
                            />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="border-t border-black/10 p-4 dark:border-white/5">
                <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-bold text-primary">
                        {adminUser.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-black dark:text-white/90">
                            {adminUser.name}
                        </div>
                        <div className="truncate text-xs text-black/40 dark:text-white/90">
                            {adminUser.email}
                        </div>
                    </div>
                </div>
                <Link
                    to="/login"
                    className="mt-3 flex items-center gap-3 rounded-full px-4 py-2.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/5"
                >
                    <SignOutIcon size={16} />
                    <span>Sign Out</span>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-tint-gray text-black transition-colors duration-300 dark:bg-black dark:text-white/90">
            <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-black/10 dark:border-white/5 lg:flex">
                <SidebarContent />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-50 border-b border-black/10 bg-surface/80 px-4 py-4 backdrop-blur-xl dark:border-white/5 dark:bg-tint-black/80 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="rounded-full border border-black/10 bg-black/[0.03] p-2.5 text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/90 dark:hover:bg-white/10 lg:hidden"
                                aria-label="Open navigation menu"
                            >
                                <ListIcon size={20} />
                            </button>
                            <div className="min-w-0">
                                <h3 className="heading-h3 truncate font-semibold text-black dark:text-white/90">{pageTitle}</h3>
                            </div>
                        </div>

                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setNotificationsOpen((prev) => !prev)}
                                className="relative rounded-full border border-black/10 bg-black/[0.03] p-2.5 text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/90 dark:hover:bg-white/10"
                                aria-label="Open notifications"
                            >
                                <BellSimpleIcon size={22} />
                                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                            </button>

                            {notificationsOpen && (
                                <div className="absolute right-0 z-[60] mt-3 w-80 rounded-3xl border border-black/10 bg-white p-3 shadow-shadow1 dark:border-white/10 dark:bg-tint-black/60">
                                    <div className="flex items-center justify-between px-2 py-1">
                                        <TitleComponent size='small-semibold' className="text-black dark:text-white/90">Notifications</TitleComponent>
                                        <button className="text-xs font-medium text-primary">Mark all read</button>
                                    </div>
                                    <ul className="mt-2 space-y-2">
                                        {notifications.map((item) => (
                                            <li key={item.title} className="rounded-2xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-black dark:text-white/90">{item.title}</p>
                                                        <p className="mt-1 text-xs leading-5 text-black/50 dark:text-white/90">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                    <span className="shrink-0 text-[11px] font-medium text-black/40 dark:text-white/90">
                                                        {item.time}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="mt-3 w-full rounded-full bg-gradient-to-b from-primary-start to-primary-end px-3 py-2 text-sm font-semibold text-white shadow-inset">
                                        View all activity
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 flex lg:hidden">
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                        <aside className="relative z-10 h-full w-72 max-w-[85vw] shadow-2xl">
                            <SidebarContent isMobile />
                        </aside>
                    </div>
                )}

                <main className="relative flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
                    <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px] duration-300 dark:bg-[#2f2f2f]/50" />
                    <div className="relative z-10 mx-auto w-full max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}


