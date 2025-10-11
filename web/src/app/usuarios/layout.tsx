"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppNavBar, NavBarMenuItem } from "@/components/shared/AppNavBar";
import { User, Settings, LogOut } from "lucide-react";
import { userNavSections } from "@/config/userNavConfig";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();

  const menuItems: NavBarMenuItem[] = [
    {
      icon: User,
      label: "Ver Perfil",
      onClick: () => router.push("/usuarios/profile"),
    },
    {
      icon: Settings,
      label: "Configuración",
      onClick: () => router.push("/usuarios/settings"),
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
        userName="Juan Pérez"
        userRole="Panel de Usuario"
        menuItems={menuItems}
        navSections={userNavSections}
        onLogout={handleLogout}
        avatarGradient="from-blue-500 to-cyan-500"
      />
      {children}
    </div>
  );
}
