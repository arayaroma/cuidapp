"use client";

import { Search, FileText, History, Clock } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

interface UserDashboardCardsProps {
  onSearchCaregivers?: () => void;
  onViewRequests?: () => void;
  onViewInProgress?: () => void;
  onViewHistory?: () => void;
  inProgressCount?: number;
}

export function UserDashboardCards({
  onSearchCaregivers,
  onViewRequests,
  onViewInProgress,
  onViewHistory,
  inProgressCount = 0,
}: UserDashboardCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        icon={Search}
        iconColor="cyan-500"
        title="Buscar Cuidadores"
        description="Explora perfiles de cuidadores profesionales disponibles en tu área."
        buttonText="Ver Cuidadores"
        buttonGradient={{ from: "cyan-500", to: "blue-500" }}
        onClick={onSearchCaregivers}
      />

      <DashboardCard
        icon={FileText}
        iconColor="cyan-500"
        title="Mis Solicitudes"
        description="Gestiona tus solicitudes activas y revisa quiénes se han postulado."
        buttonText="Ver Solicitudes"
        buttonGradient={{ from: "cyan-500", to: "blue-500" }}
        onClick={onViewRequests}
      />

      <DashboardCard
        icon={Clock}
        iconColor="amber-500"
        title="En Proceso"
        description={`Tienes ${inProgressCount} servicios activos en progreso que requieren tu atención.`}
        buttonText="Ver Servicios"
        buttonGradient={{ from: "amber-500", to: "orange-500" }}
        onClick={onViewInProgress}
      />

      <DashboardCard
        icon={History}
        iconColor="blue-500"
        title="Historial"
        description="Revisa el historial de tus servicios completados."
        buttonText="Ver Historial"
        buttonGradient={{ from: "blue-500", to: "blue-600" }}
        onClick={onViewHistory}
      />
    </div>
  );
}
