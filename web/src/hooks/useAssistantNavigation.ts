"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAssistantNavigation() {
  const router = useRouter();

  const goToRequests = useCallback(() => {
    console.log("Navegando a solicitudes recibidas...");
    // router.push('/asistentes/solicitudes');
  }, []);

  const goToClients = useCallback(() => {
    console.log("Navegando a clientes...");
    // router.push('/asistentes/clientes');
  }, []);

  const goToProfile = useCallback(() => {
    router.push('/asistentes/profile');
  }, [router]);

  return {
    goToRequests,
    goToClients,
    goToProfile,
  };
}
