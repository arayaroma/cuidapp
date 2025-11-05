"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AppNavBar } from "@/components/shared/AppNavBar";
import { colors } from "@/config/colors";

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
        <div 
          className="animate-spin rounded-full h-32 w-32 border-b-2"
          style={{ borderColor: colors.primary[500] }}
        ></div>
      </div>
    );
  }

  // Si no hay sesión, redirigir al login (aunque el middleware debería manejar esto)
  if (!session?.user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen">
      <AppNavBar
        userName={session?.user?.name || "Usuario"}
        userEmail={session?.user?.email || ""}
        onProfileClick={() => router.push("/usuarios/profile")}
      />
      {children}
    </div>
  );
}
