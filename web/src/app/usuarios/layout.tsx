"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AppNavBar, NavBarMenuItem } from "@/components/shared/AppNavBar";
import { User, Settings, LogOut } from "lucide-react";
import { userNavSections } from "@/config/userNavConfig";
import { colors } from "@/config/colors";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  // Si está cargando, mostrar loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div 
          className="animate-spin rounded-full h-32 w-32 border-b-2"
          style={{ borderColor: colors.primary[500] }}
        ></div>
      </div>
    );
  }

  // Si no hay sesión, redirigir al login
  if (!session) {
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
      onClick: () => router.push("/usuarios/settingsProfile"),
    },
    {
      icon: LogOut,
      label: "Cerrar Sesión",
      onClick: () => signOut({ callbackUrl: "/login" }),
      variant: "destructive",
    },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppNavBar
        title="CuidApp"
        userName={session.user?.name || "Usuario"}
        userEmail={session.user?.email || ""}
        avatarGradient={colors.gradients.primary}
        menuItems={menuItems}
        navSections={userNavSections}
        onLogout={handleLogout}
      />
      {children}
    </div>
  );
}
