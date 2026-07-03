// app/(auth)/signup/page.tsx
//
// Placeholder signup page for Scheda. Contains layout skeletons and redirection hooks.

import * as React from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@/components/ui/button";

export const metadata = {
    title: "Create Account — Scheda",
    description: "Sign up for a Scheda account to book appointments or manage availability.",
};

export default function SignupPage() {
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
                        Create an Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sign up to begin scheduling conflict-free sessions.
                    </Typography>
                </div>

                {/* Form placeholder */}
                <div className="flex flex-col gap-4 py-4 border-y border-zinc-200/50 dark:border-zinc-800/50">
                    <div className="h-12 w-full rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center text-xs text-zinc-400">
                        Full Name input placeholder (Phase 2)
                    </div>
                    <div className="h-12 w-full rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center text-xs text-zinc-400">
                        Email input placeholder (Phase 2)
                    </div>
                    <div className="h-12 w-full rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center text-xs text-zinc-400">
                        Password input placeholder (Phase 2)
                    </div>
                    <Button variant="contained" color="primary" disabled className="w-full">
                        Sign Up
                    </Button>
                </div>

                <div className="text-center">
                    <Typography variant="body2" color="text.secondary">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-primary hover:underline"
                        >
                            Log in
                        </Link>
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
}
