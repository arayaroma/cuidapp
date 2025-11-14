"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { colors } from "@/config/colors";
import { AssistantDashboardCards } from "@/components/asistentes/AssistantDashboardCards";
import { Briefcase } from "lucide-react";

interface DashboardStats {
  availableRequests: number;
  pendingOffers: number;
  inProgress: number;
  acceptedJobs: number;
  completedJobs: number;
}

export default function AssistantsDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    availableRequests: 0,
    pendingOffers: 0,
    inProgress: 0,
    acceptedJobs: 0,
    completedJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/assistants/dashboard");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleViewAvailable = () => {
    router.push("/asistentes/available-requests");
  };

  const handleViewInProgress = () => {
    router.push("/asistentes/in-progress");
  };

  const handleViewAccepted = () => {
    router.push("/asistentes/accepted-jobs");
  };

  const handleViewHistory = () => {
    router.push("/asistentes/history");
  };

  if (loading) {
    return (
      <DashboardLayout backgroundStyle={{ background: colors.background.secondary }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary[500] }}></div>
            <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout backgroundStyle={{ background: colors.background.secondary }}>
      <DashboardHeader
        icon={Briefcase}
        title="Panel de Asistente"
        subtitle="Gestiona tus solicitudes y oportunidades de trabajo"
        gradient={colors.gradients.primary}
      />
      <AssistantDashboardCards
        onViewAvailable={handleViewAvailable}
        onViewInProgress={handleViewInProgress}
        onViewAccepted={handleViewAccepted}
        onViewHistory={handleViewHistory}
        availableCount={stats.availableRequests}
        inProgressCount={stats.inProgress}
        acceptedCount={stats.acceptedJobs}
        historyCount={stats.completedJobs}
      />
    </DashboardLayout>
  );
}

