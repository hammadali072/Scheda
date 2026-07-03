// app/(public)/page.tsx
//
// Landing Page for Scheda scheduling platform.
// Showcases high-end typography, glassmorphism, and a direct "Book Now" CTA.

import * as React from "react";
import Typography from "@mui/material/Typography";
import GlassCard from "@/components/ui/glass-card";
import ThemeButton from "@/components/ui/theme-button";

export const metadata = {
    title: "Scheda — Effortless Appointment Booking",
    description: "Book appointments with members, staff, or advisors. Real-time slot reservation made easy.",
};

export default function LandingPage() {
    return (
        <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden py-20 px-4">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/20 blur-3xl pointer-events-none dark:bg-blue-600/10" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-3xl pointer-events-none dark:bg-indigo-600/10" />

            <div className="w-full max-w-4xl z-10 flex flex-col items-center">
                {/* Hero section inside an effect GlassCard */}
                <GlassCard
                    glassVariant="effect"
                    className="w-full flex flex-col items-center text-center p-8 sm:p-16 border border-zinc-200/20 dark:border-zinc-800/20"
                    sx={{
                        borderRadius: 8,
                        paddingInline: { xs: 3, sm: 8 },
                        paddingBlock: { xs: 6, sm: 10 },
                    }}
                >
                    <Typography
                        variant="h1"
                        component="h1"
                        className="mb-6 font-extrabold tracking-tight text-white"
                        sx={{
                            fontSize: { xs: "2.5rem", sm: "4rem" },
                            lineHeight: 1.1,
                        }}
                    >
                        Schedule Your Next Appointment Effortlessly
                    </Typography>

                    <Typography
                        variant="h5"
                        component="p"
                        className="max-w-2xl mx-auto mb-10 text-zinc-300 font-medium"
                        sx={{
                            fontSize: { xs: "1.1rem", sm: "1.35rem" },
                            fontWeight: 400,
                            lineHeight: 1.5,
                        }}
                    >
                        Scheda bridges clients with organization members for real-time, conflict-free scheduling. Discover providers, explore open slots, and confirm bookings instantly.
                    </Typography>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <ThemeButton
                            as="link"
                            to="/login"
                            variant="primary"
                            className="w-full sm:w-auto"
                        >
                            Book Now
                        </ThemeButton>
                        <ThemeButton
                            as="link"
                            to="/signup"
                            variant="secondary"
                            className="w-full sm:w-auto text-zinc-200 border border-white/20 hover:border-white/50"
                        >
                            Create Account
                        </ThemeButton>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
