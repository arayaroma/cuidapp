"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppNavBar } from "@/components/shared/AppNavBar";
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppNavBar
        title="CuidApp"
        userName={session.user?.name || "Usuario"}
        userEmail={session.user?.email || ""}
        avatarGradient={colors.gradients.primary}
        userRole="user"
      />
      {children}
    </div>
  );
}
