import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/theme-provider";
import { useAuth } from "@/context/auth-context";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import {
    GridFourIcon,
    CalendarBlankIcon,
    ClockIcon,
    GearIcon,
    ListIcon,
    XIcon,
    SignOutIcon,
    BellSimpleIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import TitleComponent from "@/components/shared/TitleComponent";

const NAV_ITEMS = [
    { name: "Overview", path: "/member", icon: GridFourIcon, exact: true },
    { name: "My Availability", path: "/member/availability", icon: ClockIcon },
    { name: "My Appointments", path: "/member/appointments", icon: CalendarBlankIcon },
    { name: "Settings", path: "/member/settings", icon: GearIcon },
];

const NOTIFICATIONS = [
    {
        title: "New booking request",
        description: "A client just requested a consultation for tomorrow afternoon.",
        time: "5m ago",
    },
    {
        title: "Availability updated",
        description: "Your schedule has been refreshed for the upcoming week.",
        time: "1h ago",
    },
    {
        title: "Session confirmed",
        description: "One of your upcoming sessions was confirmed by the client.",
        time: "3h ago",
    },
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
    const navigate = useNavigate();
    const { authUser, profile, logout } = useAuth();

    const isActive = (item: (typeof NAV_ITEMS)[0]) => {
        if (item.exact) return location.pathname === item.path;
        return location.pathname.startsWith(item.path);
    };

    const displayName = profile?.name || authUser?.displayName || "Your account";
    const displayEmail = profile?.email || authUser?.email || "Update your profile";
    const initials = displayName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "A";

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="flex h-full w-full flex-col bg-white/95 backdrop-blur-xl transition-colors duration-300 dark:bg-tint-black">
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-4 dark:border-white/5 lg:px-6">
                <Link to="/" className="flex items-center gap-3">
                    <img src={logoSrc} alt="Scheda" className="h-9 w-auto max-w-32 object-contain" />
                </Link>
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-black/70 transition-colors hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/5"
                        aria-label="Close navigation menu"
                    >
                        <XIcon size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Member navigation">
                <ul className="space-y-1.5">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item);
                        return (
                            <li>
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    end={item.exact}
                                    onClick={() => isMobile && onClose?.()}
                                    className={clsx(
                                        "group relative flex items-center overflow-hidden rounded-full px-4 py-3 text-base font-medium transition-all duration-300",
                                        active
                                            ? "bg-gradient-to-b from-primary-start to-primary-end text-white shadow-inset"
                                            : "text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white/90"
                                    )}
                                    aria-current={active ? "page" : undefined}
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
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="border-t border-black/10 p-4 dark:border-white/5">
                <Link
                    to="/member/settings"
                    className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.02] p-3 transition-colors hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-bold text-primary">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-black dark:text-white/90">
                            {displayName}
                        </div>
                        <div className="truncate text-xs text-black/40 dark:text-white/90">
                            {displayEmail}
                        </div>
                    </div>
                </Link>

                <div className="mt-3 flex items-center gap-2">
                    <Link
                        to="/member/settings"
                        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-3 py-2 text-xs font-semibold text-black/70 transition-colors hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70 dark:hover:bg-white/[0.05]"
                    >
                        <GearIcon size={14} />
                        <span>Update account</span>
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-full border border-red-200 bg-red-50 p-2.5 text-red-500 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20"
                        aria-label="Sign out"
                    >
                        <SignOutIcon size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MemberLayout() {
    const { dark } = useTheme();
    const logoSrc = dark ? logoLight : logoDark;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();

    const pageTitle = NAV_ITEMS.find((item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    })?.name ?? "Dashboard";

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

    return (
        <div className="flex min-h-screen bg-tint-gray text-black transition-colors duration-300 dark:bg-black dark:text-white/90">

            <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-black/10 dark:border-white/5 lg:flex">
                <SidebarContent logoSrc={logoSrc} />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-10 border-b border-black/10 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-white/5 dark:bg-tint-black/80 sm:px-6 lg:px-8">
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
                                className="relative rounded-full border border-black/10 bg-black/[0.03] p-2.5 text-black shadow-inset transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/90 dark:hover:bg-white/10"
                                aria-label="Open notifications"
                            >
                                <BellSimpleIcon size={22} />
                                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                            </button>

                            {notificationsOpen && (
                                <div className="absolute right-0 z-[60] mt-3 w-80 rounded-xl border border-black/10 bg-white p-3 shadow-shadow2-effect dark:border-white/10 dark:bg-tint-black dark:shadow-shadow2">
                                    <div className="flex items-center justify-between px-2 py-1">
                                        <TitleComponent size="small-semibold" className="text-black dark:text-white/90">
                                            Notifications
                                        </TitleComponent>
                                        <button className="text-xs font-medium text-primary">Mark all read</button>
                                    </div>
                                    <ul className="mt-2 space-y-2">
                                        {NOTIFICATIONS.map((item) => (
                                            <li key={item.title} className="rounded-2xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-black dark:text-white/90">{item.title}</p>
                                                        <p className="mt-1 text-xs leading-5 text-black/50 dark:text-white/90">{item.description}</p>
                                                    </div>
                                                    <span className="shrink-0 text-[11px] font-medium text-black/40 dark:text-white/90">{item.time}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="mt-3 w-full rounded-full bg-gradient-to-b from-primary-start to-primary-end px-3 py-2 text-sm font-semibold text-white shadow-inset transition-all duration-300 hover:from-secondary-start hover:to-secondary-end">
                                        View all activity
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className={clsx("fixed inset-0 z-50 flex lg:hidden", mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none")}>
                    <div
                        className={clsx(
                            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ease-out",
                            mobileMenuOpen ? "opacity-100" : "opacity-0"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <aside
                        className={clsx(
                            "relative z-10 h-full w-72 max-w-[85vw] shadow-2xl transition-transform duration-300 ease-out",
                            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                        )}
                    >
                        <SidebarContent isMobile logoSrc={logoSrc} onClose={() => setMobileMenuOpen(false)} />
                    </aside>
                </div>

                <main className="relative flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
                    <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px] duration-300 dark:bg-[#2f2f2f]/50" />
                    <div className="relative mx-auto w-full max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}



