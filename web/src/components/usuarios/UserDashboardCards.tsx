"use client";

import { Heart } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

interface UserDashboardCardsProps {
  onSearchCaregivers?: () => void;
  onViewRequests?: () => void;
  onEditProfile?: () => void;
}

export function UserDashboardCards({
  onSearchCaregivers,
  onViewRequests,
  onEditProfile,
}: UserDashboardCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        icon={Heart}
        iconColor="cyan-500"
        title="Buscar Cuidadores"
        description="Explora perfiles de cuidadores profesionales disponibles en tu área."
        buttonText="Ver Cuidadores"
        buttonGradient={{ from: "cyan-500", to: "blue-500" }}
        onClick={onSearchCaregivers}
      />

      <DashboardCard
        icon={Heart}
        iconColor="blue-500"
        title="Mis Solicitudes"
        description="Gestiona tus solicitudes de cuidado y revisa el estado."
        buttonText="Ver Solicitudes"
        buttonGradient={{ from: "blue-500", to: "cyan-500" }}
        onClick={onViewRequests}
      />

      <DashboardCard
        icon={Heart}
        iconColor="sky-500"
        title="Mi Perfil"
        description="Actualiza tu información y preferencias de cuidado."
        buttonText="Editar Perfil"
        buttonGradient={{ from: "sky-500", to: "cyan-500" }}
        onClick={onEditProfile}
      />
    </div>
  );
}
