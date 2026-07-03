// app/(auth)/layout.tsx
//
// Centered layout container for all auth-related pages (login, signup, password reset).
// Does not show the main dashboard sidebar or app navigation.

import * as React from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import ThemeSwitch from "@/components/ui/theme-switch";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-[#0a0a0a] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            {/* Soft background glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none dark:bg-blue-600/5" />

            <div className="w-full max-w-md z-10 flex flex-col items-center gap-6">
                {/* Logo Link */}
                <Link href="/" className="mb-4">
                    <Typography
                        variant="h4"
                        component="span"
                        color="primary"
                        sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}
                    >
                        Scheda
                    </Typography>
                </Link>

                {/* Inner Content (Login or Signup Box) */}
                <div className="w-full">
                    {children}
                </div>
            </div>

            {/* Floating theme switch widget */}
            <ThemeSwitch />
        </div>
    );
}
