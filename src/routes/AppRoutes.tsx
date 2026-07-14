import { Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/landing-page";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";

// Admin dashboard
import AdminLayout from "@/layouts/AdminLayout";
import Overview from "@/pages/admin/Overview";
import Members from "@/pages/admin/Members";
import Clients from "@/pages/admin/Clients";
import Appointments from "@/pages/admin/Appointments";
import Settings from "@/pages/admin/Settings";

// Member dashboard
import MemberLayout from "@/layouts/MemberLayout";
import MemberOverview from "@/pages/member/MemberOverview";
import MemberAvailability from "@/pages/member/MemberAvailability";
import MemberAppointments from "@/pages/member/MemberAppointments";
import MemberSettings from "@/pages/member/MemberSettings";

import NotFoundPage from "@/pages/404";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin dashboard */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Overview />} />
                <Route path="members" element={<Members />} />
                <Route path="clients" element={<Clients />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Member dashboard */}
            <Route path="/member" element={<MemberLayout />}>
                <Route index element={<MemberOverview />} />
                <Route path="availability" element={<MemberAvailability />} />
                <Route path="appointments" element={<MemberAppointments />} />
                <Route path="settings" element={<MemberSettings />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

