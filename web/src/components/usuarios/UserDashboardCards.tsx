"use client";

import { Search, FileText, History, Clock, Inbox } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { colors } from "@/config/colors";

interface UserDashboardCardsProps {
  onSearchCaregivers?: () => void;
  onViewRequests?: () => void;
  onViewOffers?: () => void;
  onViewInProgress?: () => void;
  onViewHistory?: () => void;
  inProgressCount?: number;
  pendingApplicationsCount?: number;
  isLoading?: boolean;
}

export function UserDashboardCards({
  onSearchCaregivers,
  onViewRequests,
  onViewOffers,
  onViewInProgress,
  onViewHistory,
  inProgressCount = 0,
  pendingApplicationsCount = 0,
  isLoading = false,
}: UserDashboardCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        icon={Inbox}
        iconColor={colors.warning[500]}
        title="Ofertas Recibidas"
        description={`Tienes ${pendingApplicationsCount} postulación${pendingApplicationsCount !== 1 ? 'es' : ''} pendiente${pendingApplicationsCount !== 1 ? 's' : ''} de cuidador${pendingApplicationsCount !== 1 ? 'es' : ''}.`}
        buttonText="Ver Ofertas"
        buttonGradient={colors.gradients.accent}
        onClick={onViewOffers}
        badge={pendingApplicationsCount > 0 ? pendingApplicationsCount : undefined}
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
