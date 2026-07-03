import { Member } from "@/types";

export const mockMembers: Member[] = [
    {
        id: "m1",
        role: "member",
        name: "Ayesha Raza",
        email: "ayesha@example.com",
        designationId: "d1",
        bio: "8 years of consulting experience across SaaS and retail.",
        isActive: true,
        createdAt: "2026-01-10T09:00:00Z",
    },
    {
        id: "m2",
        role: "member",
        name: "Hamid Sheikh",
        email: "hamid@example.com",
        designationId: "d2",
        bio: "Certified financial planner, specializes in small business finance.",
        isActive: true,
        createdAt: "2026-02-02T09:00:00Z",
    },
    {
        id: "m3",
        role: "member",
        name: "Sara Malik",
        email: "sara@example.com",
        designationId: "d3",
        bio: "Ex-recruiter turned career coach.",
        isActive: false, // deactivated by admin — useful for testing that UI state
        createdAt: "2026-01-20T09:00:00Z",
    },
];