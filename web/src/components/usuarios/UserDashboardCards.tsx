"use client";

import { Search, FileText, History, Clock } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { colors } from "@/config/colors";

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
        iconColor={colors.primary[500]}
        title="Buscar Cuidadores"
        description="Explora perfiles de cuidadores profesionales disponibles en tu área."
        buttonText="Ver Cuidadores"
        buttonGradient={colors.gradients.trust}
        onClick={onSearchCaregivers}
      />

      <DashboardCard
        icon={FileText}
        iconColor={colors.secondary[500]}
        title="Mis Solicitudes"
        description="Gestiona tus solicitudes activas y revisa quiénes se han postulado."
        buttonText="Ver Solicitudes"
        buttonGradient={colors.gradients.primary}
        onClick={onViewRequests}
      />

      <DashboardCard
        icon={Clock}
        iconColor={colors.accent[500]}
        title="En Proceso"
        description={`Tienes ${inProgressCount} servicio${inProgressCount !== 1 ? 's' : ''} activo${inProgressCount !== 1 ? 's' : ''} en progreso que requiere${inProgressCount !== 1 ? 'n' : ''} tu atención.`}
        buttonText="Ver Servicios"
        buttonGradient={colors.gradients.warm}
        onClick={onViewInProgress}
      />

      <DashboardCard
        icon={History}
        iconColor={colors.primary[600]}
        title="Historial"
        description="Revisa el historial de tus servicios completados."
        buttonText="Ver Historial"
        buttonGradient={colors.gradients.secondary}
        onClick={onViewHistory}
      />
    </div>
  );
}
