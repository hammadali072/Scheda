// app/(public)/layout.tsx
//
// Public layout shell providing standard header and footer for non-authenticated pages.
// Includes the ThemeSwitch for client-side theme selection.

import * as React from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import ThemeButton from "@/components/ui/theme-button";
import ThemeSwitch from "@/components/ui/theme-switch";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-[#0a0a0a] dark:text-zinc-50">
            {/* Glass Header */}
            <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-md dark:border-zinc-800/50 dark:bg-[#0a0a0a]/70">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Typography
                            variant="h5"
                            component="span"
                            color="primary"
                            className="font-extrabold tracking-tight"
                            sx={{ fontWeight: 800 }}
                        >
                            Scheda
                        </Typography>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <ThemeButton
                            as="link"
                            to="/login"
                            variant="secondary"
                            primary2
                            className="text-zinc-900 dark:text-zinc-100 hover:text-white"
                        >
                            Log In
                        </ThemeButton>
                        <ThemeButton
                            as="link"
                            to="/signup"
                            variant="primary"
                            primary2
                        >
                            Sign Up
                        </ThemeButton>
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-[#0a0a0a]">
                <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
                    <Typography variant="body2" className="text-zinc-500 dark:text-zinc-400">
                        &copy; {new Date().getFullYear()} Scheda. All rights reserved.
                    </Typography>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                            Privacy Policy
                        </Link>
                        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Floating theme switch widget */}
            <ThemeSwitch />
        </div>
    );
}
