"use client";

import { Briefcase, Inbox, CheckCircle2, Clock } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

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
        buttonGradient={{ from: "cyan-500", to: "blue-500" }}
        onClick={onViewAvailable}
      />

      <DashboardCard
        icon={Inbox}
        iconColor="blue-500"
        title="Ofertas Recibidas"
        description={`Tienes ${offersCount} ofertas directas de usuarios que te han seleccionado.`}
        buttonText="Ver Ofertas"
        buttonGradient={{ from: "blue-500", to: "cyan-500" }}
        onClick={onViewOffers}
      />

      <DashboardCard
        icon={Clock}
        iconColor="amber-500"
        title="En Proceso"
        description={`Tienes ${inProgressCount} servicios activos en progreso que debes completar.`}
        buttonText="Ver Servicios"
        buttonGradient={{ from: "amber-500", to: "orange-500" }}
        onClick={onViewInProgress}
      />

      <DashboardCard
        icon={CheckCircle2}
        iconColor="green-500"
        title="Trabajos Aceptados"
        description={`Gestiona tus ${acceptedCount} trabajos activos y próximas citas programadas.`}
        buttonText="Ver Trabajos"
        buttonGradient={{ from: "green-500", to: "emerald-500" }}
        onClick={onViewAccepted}
      />
    </div>
  );
}
