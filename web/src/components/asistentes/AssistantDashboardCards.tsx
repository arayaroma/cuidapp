"use client";

import { Briefcase, CheckCircle2, Clock } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { colors } from "@/config/colors";

interface AssistantDashboardCardsProps {
  onViewAvailable?: () => void;
  onViewOffers?: () => void;
  onViewInProgress?: () => void;
  onViewAccepted?: () => void;
  availableCount?: number;
  offersCount?: number;
  inProgressCount?: number;
  acceptedCount?: number;
}

export function AssistantDashboardCards({
  onViewAvailable,
  onViewOffers,
  onViewInProgress,
  onViewAccepted,
  availableCount = 0,
  offersCount = 0,
  inProgressCount = 0,
  acceptedCount = 0,
}: AssistantDashboardCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        icon={Briefcase}
        iconColor="cyan-500"
        title="Solicitudes Disponibles"
        description={`Encuentra y postula a ${availableCount} solicitudes de cuidado disponibles en tu área.`}
        buttonText="Ver Solicitudes"
        buttonGradient={colors.gradients.primary}
        onClick={onViewAvailable}
      />

      {/* Ofertas Recibidas removed from assistant dashboard per UX request */}

      <DashboardCard
        icon={Clock}
        iconColor="amber-500"
        title="En Proceso"
        description={`Tienes ${inProgressCount} servicios activos en progreso que debes completar.`}
        buttonText="Ver Servicios"
        buttonGradient={colors.gradients.warm}
        onClick={onViewInProgress}
      />

      <DashboardCard
        icon={CheckCircle2}
        iconColor="green-500"
        title="Trabajos Finalizados"
        description={`Revisa tus ${acceptedCount} trabajos finalizados y el historial de servicios.`}
        buttonText="Ver Trabajos"
        buttonGradient={colors.gradients.secondary}
        onClick={onViewAccepted}
      />
    </div>
  );
}
