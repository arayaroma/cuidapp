"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AppNavBar, NavBarMenuItem } from "@/components/shared/AppNavBar";
import { User, Settings, LogOut } from "lucide-react";
import { userNavSections } from "@/config/userNavConfig";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Si está cargando, mostrar loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // Si no hay sesión, redirigir al login (aunque el middleware debería manejar esto)
  if (!session?.user) {
    router.push("/login");
    return null;
  }

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
      onClick: () => handleLogout(),
      variant: "destructive",
    },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Determinar el rol para mostrar
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'USER':
        return 'Panel de Usuario';
      case 'ASSISTANT':
        return 'Panel de Asistente';
      case 'ADMIN':
        return 'Panel de Administrador';
      default:
        return 'Panel de Usuario';
    }
  };

  return (
    <div className="min-h-screen">
      <AppNavBar
        userName={session.user.name || 'Usuario'}
        menuItems={menuItems}
        navSections={userNavSections}
        onLogout={handleLogout}
        avatarGradient="from-blue-500 to-cyan-500"
      />
      {children}
    </div>
  );
}
