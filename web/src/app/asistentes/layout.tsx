"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppNavBar, NavBarMenuItem } from "@/components/shared/AppNavBar";
import { User, Settings, LogOut } from "lucide-react";
import { assistantNavSections } from "@/config/assistantNavConfig";

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
      onClick: () => router.push("/asistentes/settings"),
    },
    {
      icon: LogOut,
      label: "Cerrar Sesión",
      onClick: () => router.push("/login"),
      variant: "destructive",
    },
  ];

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    router.push("/login");
  };

  return (
    <div className="min-h-screen">
      <AppNavBar
        userName="María González"
        userRole="Panel de Asistente"
        menuItems={menuItems}
        navSections={assistantNavSections}
        onLogout={handleLogout}
      />
      {children}
    </div>
  );
}
