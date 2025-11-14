"use client";

import { Briefcase, CheckCircle2, Clock, History } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { colors } from "@/config/colors";

interface AssistantDashboardCardsProps {
  onViewAvailable?: () => void;
  onViewOffers?: () => void;
  onViewInProgress?: () => void;
  onViewAccepted?: () => void;
  onViewHistory?: () => void;
  availableCount?: number;
  offersCount?: number;
  inProgressCount?: number;
  acceptedCount?: number;
  historyCount?: number;
}

export function AssistantDashboardCards({
  onViewAvailable,
  onViewOffers,
  onViewInProgress,
  onViewAccepted,
  onViewHistory,
  availableCount = 0,
  offersCount = 0,
  inProgressCount = 0,
  acceptedCount = 0,
  historyCount = 0,
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
        iconColor="blue-500"
        title="Trabajos Aceptados"
        description={`Revisa tus ${acceptedCount} trabajos aceptados actualmente en curso.`}
        buttonText="Ver Trabajos"
        buttonGradient={colors.gradients.secondary}
        onClick={onViewAccepted}
      />

      <DashboardCard
        icon={History}
        iconColor="green-500"
        title="Historial"
        description={`Consulta tus ${historyCount} trabajos completados y estadísticas.`}
        buttonText="Ver Historial"
        buttonGradient={colors.gradients.cool}
        onClick={onViewHistory}
      />
    </div>
  );
}
