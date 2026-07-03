// app/(member)/member/dashboard/page.tsx
//
// Associated Member dashboard overview page. Displays schedule stats for the logged-in member.
// Fetches data from the mock appointments list, using ID 'm1' as a stub.

import * as React from "react";
import Grid from "@mui/material/Grid"; // Standard MUI Grid
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { mockAppointments } from "@/lib/data";

export const metadata = {
    title: "Member Dashboard — Scheda",
    description: "Manage your availability, check upcoming appointments, and edit your consultant profile.",
};

// TODO: replace with Supabase query in Phase 2 (filter by authenticated user ID)
async function getMemberStats(memberId: string) {
    const memberAppointments = mockAppointments.filter((app) => app.memberId === memberId);
    
    return {
        total: memberAppointments.length,
        pending: memberAppointments.filter((app) => app.status === "pending").length,
        confirmed: memberAppointments.filter((app) => app.status === "confirmed").length,
        completed: memberAppointments.filter((app) => app.status === "completed").length,
    };
}

export default async function MemberDashboardPage() {
    const memberId = "m1"; // Ayesha Raza
    const stats = await getMemberStats(memberId);

    const statCards = [
        { title: "Total Bookings", value: stats.total, subtitle: "All-time sessions" },
        { title: "Confirmed", value: stats.confirmed, subtitle: "Upcoming verified slots" },
        { title: "Pending Review", value: stats.pending, subtitle: "Requires approval" },
        { title: "Completed", value: stats.completed, subtitle: "Finished consultations" },
    ];

    return (
        <Box className="flex flex-col gap-6">
            <div>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                    Staff Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Overview of your appointments and incoming scheduling requests.
                </Typography>
            </div>

            <Grid container spacing={3}>
                {statCards.map((card) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.title}>
                        <Card
                            elevation={0}
                            variant="outlined"
                            className="border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-[#1a1a1a]"
                        >
                            <CardContent className="p-6">
                                <Typography variant="subtitle2" color="text.secondary" className="font-semibold uppercase tracking-wider text-xs">
                                    {card.title}
                                </Typography>
                                <Typography variant="h3" component="p" sx={{ fontWeight: 800, my: 1.5, color: "primary.main" }}>
                                    {card.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" className="text-xs">
                                    {card.subtitle}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions / Recent Activity Skeleton */}
            <Card
                elevation={0}
                variant="outlined"
                className="mt-4 border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-[#1a1a1a]"
            >
                <CardContent className="p-6 flex flex-col gap-4">
                    <Typography variant="h6" className="font-bold text-zinc-800 dark:text-zinc-100">
                        Upcoming Schedule
                    </Typography>
                    <div className="h-24 w-full rounded bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-sm text-zinc-400">
                        Your calendar agendas and timing intervals will display here (Phase 2).
                    </div>
                </CardContent>
            </Card>
        </Box>
    );
}
