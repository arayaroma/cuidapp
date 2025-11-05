"use client";

import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UserDashboardCards } from "@/components/usuarios/UserDashboardCards";
import { colors } from "@/config/colors";

export default function UsersDashboardPage() {
  const router = useRouter();

  const handleSearchCaregivers = () => {
    router.push("/usuarios/available-caregivers");
  };

  const handleViewRequests = () => {
    router.push("/usuarios/my-requests");
  };

  const handleViewInProgress = () => {
    router.push("/usuarios/in-progress");
  };

  const handleViewHistory = () => {
    router.push("/usuarios/history");
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        icon={User}
        title="Panel de Usuario"
        subtitle="Encuentra el cuidador perfecto para ti"
        gradient={colors.gradients.trust}
      />
      <UserDashboardCards
        onSearchCaregivers={handleSearchCaregivers}
        onViewRequests={handleViewRequests}
        onViewInProgress={handleViewInProgress}
        onViewHistory={handleViewHistory}
        inProgressCount={3}
      />
    </DashboardLayout>
  );
}
