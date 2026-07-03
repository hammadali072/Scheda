// app/(client)/client/dashboard/page.tsx
//
// Client dashboard overview page. Shows personal booking counts and lists
// organization members available to consult, matching Phase 1 mock expectations.

import * as React from "react";
import Grid from "@mui/material/Grid"; // Standard MUI Grid
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@/components/ui/button";
import Avatar from "@mui/material/Avatar";
import { mockAppointments, mockMembers, mockDesignations } from "@/lib/data";

export const metadata = {
    title: "Client Dashboard — Scheda",
    description: "Browse members, reserve bookable appointment slots, and view your calendar.",
};

// TODO: replace with Supabase query in Phase 2 (filter by client authenticated user ID)
async function getClientStats(clientId: string) {
    const clientAppointments = mockAppointments.filter((app) => app.clientId === clientId);
    
    return {
        total: clientAppointments.length,
        confirmed: clientAppointments.filter((app) => app.status === "confirmed").length,
        completed: clientAppointments.filter((app) => app.status === "completed").length,
    };
}

export default async function ClientDashboardPage() {
    const clientId = "c1"; // Bilal Ahmed
    const stats = await getClientStats(clientId);

    const statCards = [
        { title: "My Total Bookings", value: stats.total, subtitle: "All reserved slots" },
        { title: "Confirmed Slots", value: stats.confirmed, subtitle: "Upcoming consultations" },
        { title: "Past Sessions", value: stats.completed, subtitle: "Completed meetings" },
    ];

    // Combine members with designations for display
    const browseMembersList = mockMembers.map((member) => {
        const designation = mockDesignations.find((d) => d.id === member.designationId);
        return {
            ...member,
            designationName: designation ? designation.name : "Consultant",
        };
    });

    return (
        <Box className="flex flex-col gap-6">
            <div>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                    Client Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your upcoming consultations and browse available team members.
                </Typography>
            </div>

            <Grid container spacing={3}>
                {statCards.map((card) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={card.title}>
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

            {/* Browse Members section preview */}
            <div className="mt-4">
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
                    Available Consultants
                </Typography>
                
                <Grid container spacing={3}>
                    {browseMembersList.map((member) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={member.id}>
                            <Card
                                elevation={0}
                                variant="outlined"
                                className="border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-[#1a1a1a]"
                            >
                                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                    <Avatar
                                        alt={member.name}
                                        src={member.avatarUrl || ""}
                                        sx={{ width: 60, height: 60, mb: 1, bgcolor: "primary.light" }}
                                    >
                                        {member.name.charAt(0)}
                                    </Avatar>
                                    <div>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            {member.name}
                                        </Typography>
                                        <Typography variant="body2" color="primary" className="font-semibold text-sm">
                                            {member.designationName}
                                        </Typography>
                                    </div>
                                    <Typography variant="body2" color="text.secondary" className="text-sm line-clamp-2 min-h-10">
                                        {member.bio || "No biography provided."}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="w-full mt-2"
                                        disabled
                                    >
                                        Book Session (Phase 2)
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </Box>
    );
}
