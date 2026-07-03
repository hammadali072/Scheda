// app/(admin)/admin/dashboard/page.tsx
//
// Admin dashboard overview page. Displays high-level platform stats using mock data.
// All data points are stubbed out with TODO items for database syncing.

import * as React from "react";
import Grid from "@mui/material/Grid"; // Standard MUI Grid
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
    mockMembers,
    mockClients,
    mockDesignations,
    mockAppointments,
} from "@/lib/data";

export const metadata = {
    title: "Admin Dashboard — Scheda",
    description: "Manage scheduling configurations, members, clients, and appointments.",
};

// TODO: replace with Supabase calls in Phase 2
async function getStats() {
    return {
        memberCount: mockMembers.length,
        clientCount: mockClients.length,
        designationCount: mockDesignations.length,
        appointmentCount: mockAppointments.length,
    };
}

export default async function AdminDashboardPage() {
    const stats = await getStats();

    const statCards = [
        { title: "Total Members", value: stats.memberCount, subtitle: "Registered staff members" },
        { title: "Active Clients", value: stats.clientCount, subtitle: "Users booking sessions" },
        { title: "Designations", value: stats.designationCount, subtitle: "Service categories" },
        { title: "Appointments", value: stats.appointmentCount, subtitle: "Total reserved slots" },
    ];

    return (
        <Box className="flex flex-col gap-6">
            <div>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                    Platform Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Real-time activity and registration stats for Scheda.
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
                        Admin System Status
                    </Typography>
                    <div className="h-24 w-full rounded bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-sm text-zinc-400">
                        Detailed activity feeds and log stream will display here (Phase 2).
                    </div>
                </CardContent>
            </Card>
        </Box>
    );
}
