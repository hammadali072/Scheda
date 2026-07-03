// app/(member)/layout.tsx
//
// Member dashboard layout shell. Renders a responsive drawer sidebar navigation
// matching the style tokens in mui-theme.tsx and utilizing Phosphor icons.
// Personalized for a mock Member (Ayesha Raza) to demonstrate Phase 1 logic.

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
    HouseIcon,
    ClockIcon,
    CalendarIcon,
    UserIcon,
    ListIcon,
    SignOutIcon
} from "@phosphor-icons/react";
import ThemeSwitch from "@/components/ui/theme-switch";
import { mockMembers } from "@/lib/data";

const DRAWER_WIDTH = 280;

interface NavItem {
    text: string;
    href: string;
    icon: React.ComponentType<{ size: number; weight?: "fill" | "regular" }>;
}

const navItems: NavItem[] = [
    { text: "Dashboard", href: "/member/dashboard", icon: HouseIcon },
    { text: "My Availability", href: "/member/availability", icon: ClockIcon },
    { text: "My Appointments", href: "/member/appointments", icon: CalendarIcon },
    { text: "Profile", href: "/member/profile", icon: UserIcon },
];

export default function MemberLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = React.useState(false);

    // Mock authenticated member (Ayesha Raza)
    const currentMember = mockMembers[0];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Find the title corresponding to current page
    const currentNavItem = navItems.find((item) => pathname.startsWith(item.href));
    const pageTitle = currentNavItem ? currentNavItem.text : "Member Panel";

    const sidebarContent = (
        <Box className="flex flex-col h-full bg-paper text-primary-text">
            {/* Sidebar Brand Header */}
            <div className="flex h-16 items-center px-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <Link href="/" className="flex items-center gap-2">
                    <Typography
                        variant="h5"
                        component="span"
                        color="primary"
                        sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}
                    >
                        Scheda
                    </Typography>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/10 text-primary rounded-full">
                        Staff
                    </span>
                </Link>
            </div>

            {/* Navigation List */}
            <List className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <ListItem key={item.text} disablePadding className="block">
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                selected={isActive}
                                onClick={() => isMobile && setMobileOpen(false)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    py: 1.25,
                                    px: 2,
                                    "&.Mui-selected": {
                                        backgroundColor: muiTheme.palette.mode === "dark"
                                            ? "rgba(29, 78, 216, 0.15)"
                                            : "rgba(29, 78, 216, 0.08)",
                                        color: "primary.main",
                                        "& .MuiListItemIcon-root": {
                                            color: "primary.main",
                                        },
                                        "&:hover": {
                                            backgroundColor: muiTheme.palette.mode === "dark"
                                                ? "rgba(29, 78, 216, 0.25)"
                                                : "rgba(29, 78, 216, 0.12)",
                                        }
                                    },
                                    "&:hover": {
                                        borderRadius: 2,
                                    }
                                }}
                            >
                                <ListItemIcon className="min-w-0 mr-4 text-zinc-500 dark:text-zinc-400">
                                    <Icon size={22} weight={isActive ? "fill" : "regular"} />
                                </ListItemIcon>
                                <ListItemText>
                                    <Typography sx={{ fontSize: 14, fontWeight: isActive ? 600 : 500 }}>
                                        {item.text}
                                    </Typography>
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider className="border-zinc-200/50 dark:border-zinc-800/50" />

            {/* Member Profile Section at bottom of Sidebar */}
            <div className="p-4 flex items-center gap-3">
                <Avatar
                    alt={currentMember.name}
                    src={currentMember.avatarUrl || ""}
                    className="bg-primary/10 text-primary font-bold"
                    sx={{ width: 40, height: 40 }}
                >
                    {currentMember.name.charAt(0)}
                </Avatar>
                <div className="flex-1 min-w-0">
                    <Typography variant="subtitle2" noWrap className="font-semibold text-zinc-800 dark:text-zinc-100">
                        {currentMember.name}
                    </Typography>
                    <Typography variant="body2" noWrap className="text-zinc-500 dark:text-zinc-400 text-xs">
                        {currentMember.email}
                    </Typography>
                </div>
                <IconButton
                    title="Log Out"
                    component={Link}
                    href="/"
                    sx={{
                        color: "text.secondary",
                        "&:hover": { color: "error.main" }
                    }}
                >
                    <SignOutIcon size={20} />
                </IconButton>
            </div>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "screen" }} className="bg-zinc-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            {/* Top Navigation Bar */}
            <AppBar
                position="fixed"
                elevation={0}
                variant="outlined"
                sx={{
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { md: `${DRAWER_WIDTH}px` },
                    backgroundColor: muiTheme.palette.mode === "dark" ? "rgba(10, 10, 10, 0.7)" : "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                    borderBottom: `1px solid ${muiTheme.palette.divider}`,
                    borderColor: muiTheme.palette.divider,
                }}
            >
                <Toolbar className="flex justify-between items-center px-6 h-16">
                    <div className="flex items-center gap-2">
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, color: "text.primary" }}
                            >
                                <ListIcon size={24} />
                            </IconButton>
                        )}
                        <Typography variant="h6" noWrap component="div" sx={{ color: "text.primary", fontWeight: 700 }}>
                            {pageTitle}
                        </Typography>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Right Top Bar Area */}
                    </div>
                </Toolbar>
            </AppBar>

            {/* Sidebar drawer containers */}
            <Box
                component="nav"
                sx={{ width: { md: DRAWER_WIDTH }, shrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                {/* Mobile Drawer */}
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: "block", md: "none" },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: DRAWER_WIDTH,
                                borderRight: `1px solid ${muiTheme.palette.divider}`,
                                backgroundImage: "none",
                            },
                        }}
                    >
                        {sidebarContent}
                    </Drawer>
                ) : (
                    /* Desktop Drawer */
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: "none", md: "block" },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: DRAWER_WIDTH,
                                borderRight: `1px solid ${muiTheme.palette.divider}`,
                                backgroundImage: "none",
                            },
                        }}
                        open
                    >
                        {sidebarContent}
                    </Drawer>
                )}
            </Box>

            {/* Main Application Content Window */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    minHeight: "100vh",
                    pt: "80px", // space for sticky app bar
                }}
            >
                {children}
            </Box>

            {/* Floating theme switch widget */}
            <ThemeSwitch />
        </Box>
    );
}
