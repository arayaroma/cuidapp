"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AppNavBar } from "@/components/shared/AppNavBar";
import { User, Settings, LogOut } from "lucide-react";
import { assistantNavSections } from "@/config/assistantNavConfig";
import { colors } from "@/config/colors";
import { NavBarMenuItem } from "@/components/asistentes/AssistantNavBar";

interface AssistantLayoutProps {
  children: ReactNode;
}

export default function AssistantLayout({ children }: AssistantLayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div 
          className="animate-spin rounded-full h-32 w-32 border-b-2"
          style={{ borderColor: colors.secondary[500] }}
        ></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const menuItems: NavBarMenuItem[] = [
    {
      icon: User,
      label: "Ver Perfil",
      onClick: () => router.push("/asistentes/profile"),
    },
    {
      icon: Settings,
      label: "Configuración",
      onClick: () => router.push("/asistentes/settingsProfile"),
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
        title="CuidApp Pro"
        userName={session.user?.name || "Asistente"}
        userEmail={session.user?.email || ""}
        avatarGradient={colors.gradients.trust}
        menuItems={menuItems}
        navSections={assistantNavSections}
        onLogout={handleLogout}
      />
      {children}
    </div>
  );
}
