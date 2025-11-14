"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppNavBar } from "@/components/shared/AppNavBar";

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
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <AppNavBar
        userName={session.user?.name || "Asistente"}
        userRole="assistant"
        onProfileClick={() => router.push("/asistentes/profile")}
      />
      {children}
    </div>
  );
}
