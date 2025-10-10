"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppNavBar, NavBarMenuItem } from "@/components/shared/AppNavBar";
import { User, Settings, LogOut } from "lucide-react";

interface AssistantLayoutProps {
  children: ReactNode;
}

export default function AssistantLayout({ children }: AssistantLayoutProps) {
  const router = useRouter();

  const menuItems: NavBarMenuItem[] = [
    {
      icon: User,
      label: "Ver Perfil",
      onClick: () => router.push("/asistentes/profile"),
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
        userName="María González"
        userRole="Panel de Asistente"
        menuItems={menuItems}
      />
      {children}
    </div>
  );
}
