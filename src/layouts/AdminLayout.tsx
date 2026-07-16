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
    CaretDoubleLeftIcon,
    CaretDoubleRightIcon
} from "@phosphor-icons/react";
import clsx from "clsx";

export default function AdminLayout() {
    const { dark } = useTheme();
    const logoSrc = dark ? logoLight : logoDark;
    const faviconSrc = dark ? faviconLight : faviconDark;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();

    useEffect(() => {
        const node = sidebarRef.current;
        if (!node) return;

        node.style.width = sidebarCollapsed ? "96px" : "296px";
    }, [sidebarCollapsed]);

    // Mock Admin Profile
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

    const isActive = (item: typeof navigationItems[0]) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    };

    const SidebarContent = ({ isMobile = false, collapsed = false }: { isMobile?: boolean; collapsed?: boolean }) => (
        <div className="flex flex-col h-full bg-surface dark:bg-card-dark transition-colors duration-300">
            <div className="p-4 lg:p-6 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
                <Link to="/" className={clsx("flex items-center", collapsed ? "justify-center w-full" : "gap-3")}>
                    <img
                        src={collapsed ? faviconSrc : logoSrc}
                        alt="Scheda"
                        className={clsx(
                            "h-full object-contain transition-all duration-300",
                            collapsed ? "max-w-10" : "max-w-32"
                        )}
                    />
                </Link>
                {!isMobile && (
                    <button
                        onClick={() => setSidebarCollapsed((prev) => !prev)}
                        className="ml-2 p-1.5 rounded-lg text-black/70 dark:text-parchment/70 hover:bg-black/5 dark:hover:bg-white/5"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <CaretDoubleRightIcon size={18} /> : <CaretDoubleLeftIcon size={18} />}
                    </button>
                )}
                {isMobile && (
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-1 rounded-lg text-black dark:text-parchment hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <XIcon size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                {navigationItems.map((item) => {
                    const active = isActive(item);
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.exact}
                            onClick={() => isMobile && setMobileMenuOpen(false)}
                            className={clsx(
                                "flex items-center rounded-lg text-base font-medium transition-all duration-300 group relative overflow-hidden",
                                collapsed ? "justify-center px-2 py-3" : "gap-3.5 px-4 py-3",
                                active
                                    ? "bg-gradient-to-b from-primary-start to-primary-end text-white shadow-sm shadow-primary/10 shadow-shadow2"
                                    : "text-black/60 dark:text-white/60 hover:text-ink dark:hover:text-parchment hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                            title={collapsed ? item.name : undefined}
                        >
                            <item.icon
                                size={24}
                                weight={active ? "bold" : "regular"}
                                className={clsx(
                                    "transition-colors shrink-0",
                                    active ? "text-white" : "text-black/40 dark:text-parchment/40 group-hover:text-ink dark:group-hover:text-parchment"
                                )}
                            />
                            <span className={clsx("transition-all duration-300 whitespace-nowrap", collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100")}>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Admin profile / bottom action */}
            <div className="p-4 border-t border-black/10 dark:border-white/5">
                <div className={clsx("flex items-center rounded-xl", collapsed ? "justify-center" : "gap-3 p-2")}>
                    <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {adminUser.avatar}
                    </div>
                    <div className={clsx("flex-1 min-w-0 overflow-hidden transition-all duration-300", collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100")}>
                        <div className="text-sm font-bold text-ink dark:text-parchment truncate">
                            {adminUser.name}
                        </div>
                        <div className="text-xs text-black/40 dark:text-parchment/40 truncate">
                            {adminUser.email}
                        </div>
                    </div>
                </div>
                {!collapsed && (
                    <Link
                        to="/login"
                        className="mt-2 flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/5 transition-colors"
                    >
                        <SignOutIcon size={16} />
                        <span>Sign Out</span>
                    </Link>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-parchment dark:bg-ink transition-colors duration-300 text-ink dark:text-parchment">

            {/* Desktop Sidebar (Left side, fixed width) */}
            <aside
                ref={sidebarRef}
                className="hidden lg:block border-r border-black/10 dark:border-white/5 flex-shrink-0 h-screen sticky top-0 overflow-hidden transition-[width] duration-300 ease-out"
            >
                <SidebarContent collapsed={sidebarCollapsed} />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Mobile Topbar header */}
                <header className="lg:hidden h-16 border-b border-black/10 dark:border-white/5 px-6 flex items-center justify-between bg-surface dark:bg-card-dark z-20">
                    <Link to="/">
                        <img src={logoSrc} alt="Scheda" className="max-w-28 h-full object-contain" />
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-black dark:text-parchment"
                        aria-label="Open navigation menu"
                    >
                        <ListIcon size={20} />
                    </button>
                </header>

                {/* Mobile Menu Drawer Overlay */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden flex">
                        {/* Backdrop overlay */}
                        <div
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        {/* Drawer body */}
                        <aside className="relative w-64 max-w-[80vw] h-full flex flex-col z-10 shadow-2xl">
                            <SidebarContent isMobile />
                        </aside>
                    </div>
                )}

                {/* Sub-page content view wrapper */}
                <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
