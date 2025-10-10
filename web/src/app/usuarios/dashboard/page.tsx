"use client";

import { User } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UserDashboardCards } from "@/components/usuarios/UserDashboardCards";
import { useAuth } from "@/hooks/useAuth";
import { useUserNavigation } from "@/hooks/useUserNavigation";

export default function UsersDashboardPage() {
  const { logout } = useAuth();
  const { goToSearchCaregivers, goToRequests, goToProfile } = useUserNavigation();

  return (
    <DashboardLayout backgroundColor="from-blue-100 via-purple-50 to-pink-100">
      <DashboardHeader
        icon={User}
        title="Panel de Usuario"
        subtitle="Encuentra el cuidador perfecto para ti"
        onLogout={logout}
        gradientFrom="blue-500"
        gradientTo="purple-500"
      />
      <UserDashboardCards
        onSearchCaregivers={goToSearchCaregivers}
        onViewRequests={goToRequests}
        onEditProfile={goToProfile}
      />
    </DashboardLayout>
  );
}
