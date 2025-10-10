"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppNavBar, NavBarMenuItem } from "@/components/shared/AppNavBar";
import { User, Settings, LogOut, Search, Calendar } from "lucide-react";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();

  // Configurar menú items para usuario
  const menuItems: NavBarMenuItem[] = [
    {
      icon: User,
      label: "Ver Perfil",
      onClick: () => router.push("/usuarios/profile"),
    },
    {
      icon: Search,
      label: "Buscar Cuidadores",
      onClick: () => console.log("Buscar cuidadores"),
    },
    {
      icon: Calendar,
      label: "Mis Solicitudes",
      onClick: () => console.log("Mis solicitudes"),
    },
    {
      icon: Settings,
      label: "Configuración",
      onClick: () => console.log("Ir a configuración"),
    },
    {
      icon: LogOut,
      label: "Cerrar Sesión",
      onClick: () => router.push("/login"),
      variant: "destructive",
    },
  ];

  const handleNotificationClick = () => {
    console.log("Abrir notificaciones");
    // TODO: Implementar panel de notificaciones
  };

  return (
    <div className="min-h-screen">
      <AppNavBar
        userName="Juan Pérez"
        userRole="Panel de Usuario"
        menuItems={menuItems}
      />
      {children}
    </div>
  );
}
