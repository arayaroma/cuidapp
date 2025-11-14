"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User, Inbox } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UserDashboardCards } from "@/components/usuarios/UserDashboardCards";
import { colors } from "@/config/colors";

export default function UsersDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    inProgressCount: 0,
    pendingApplicationsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch in-progress services count
        const inProgressResponse = await fetch("/api/users/in-progress");
        const inProgressData = inProgressResponse.ok ? await inProgressResponse.json() : [];
        
        // Fetch pending applications count
        const applicationsResponse = await fetch("/api/users/applications");
        const applicationsData = applicationsResponse.ok ? await applicationsResponse.json() : [];

        setStats({
          inProgressCount: inProgressData.length,
          pendingApplicationsCount: applicationsData.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSearchCaregivers = () => {
    router.push("/usuarios/available-caregivers");
  };

  const handleViewRequests = () => {
    router.push("/usuarios/my-requests");
  };

  const handleViewOffers = () => {
    router.push("/usuarios/received-offers");
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
        onViewOffers={handleViewOffers}
        onViewInProgress={handleViewInProgress}
        onViewHistory={handleViewHistory}
        inProgressCount={stats.inProgressCount}
        pendingApplicationsCount={stats.pendingApplicationsCount}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
}
