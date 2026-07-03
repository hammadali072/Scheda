// app/(auth)/login/page.tsx
//
// Placeholder login page for Scheda. Contains layout skeletons and redirection hooks.

import * as React from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@/components/ui/button";

export const metadata = {
    title: "Log In — Scheda",
    description: "Access your account to book appointments or manage scheduling options.",
};

export default function LoginPage() {
    return (
        <Card
            elevation={0}
            variant="outlined"
            className="w-full border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-[#1a1a1a]/70"
            sx={{ borderRadius: 4 }}
        >
            <CardContent className="flex flex-col gap-6 p-8">
                <div className="text-center">
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Enter your credentials to access your dashboard.
                    </Typography>
                </div>

                {/* Form placeholder */}
                <div className="flex flex-col gap-4 py-4 border-y border-zinc-200/50 dark:border-zinc-800/50">
                    <div className="h-12 w-full rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center text-xs text-zinc-400">
                        Email input placeholder (Phase 2)
                    </div>
                    <div className="h-12 w-full rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center text-xs text-zinc-400">
                        Password input placeholder (Phase 2)
                    </div>
                    <Button variant="contained" color="primary" disabled className="w-full">
                        Sign In
                    </Button>
                </div>

                <div className="text-center">
                    <Typography variant="body2" color="text.secondary">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-semibold text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
}
