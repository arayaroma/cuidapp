"use client";

import { Heart, Briefcase, Users } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

interface AssistantDashboardCardsProps {
  onViewRequests?: () => void;
  onViewClients?: () => void;
  onEditProfile?: () => void;
}

export function AssistantDashboardCards({
  onViewRequests,
  onViewClients,
  onEditProfile,
}: AssistantDashboardCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        icon={Briefcase}
        iconColor="cyan-500"
        title="Mis Solicitudes"
        description="Revisa las ofertas disponibles y gestiona tus postulaciones."
        buttonText="Ver Solicitudes"
        buttonGradient={{ from: "cyan-500", to: "blue-500" }}
        onClick={onViewRequests}
      />

      <DashboardCard
        icon={Users}
        iconColor="blue-500"
        title="Mis Clientes"
        description="Administra tu cartera de clientes y servicios activos."
        buttonText="Ver Clientes"
        buttonGradient={{ from: "blue-500", to: "sky-500" }}
        onClick={onViewClients}
      />

      <DashboardCard
        icon={Heart}
        iconColor="sky-500"
        title="Mi Perfil Profesional"
        description="Actualiza tu perfil, experiencia y disponibilidad."
        buttonText="Editar Perfil"
        buttonGradient={{ from: "sky-500", to: "cyan-500" }}
        onClick={onEditProfile}
      />
    </div>
  );
}
