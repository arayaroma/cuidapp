"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useUserNavigation() {
  const router = useRouter();

  const goToSearchCaregivers = useCallback(() => {
    // Aquí puedes navegar a la ruta de búsqueda cuando la crees
    console.log("Navegando a buscar cuidadores...");
    // router.push('/usuarios/cuidadores');
  }, []);

  const goToRequests = useCallback(() => {
    console.log("Navegando a solicitudes...");
    // router.push('/usuarios/solicitudes');
  }, []);

  const goToProfile = useCallback(() => {
    router.push('/usuarios/profile');
  }, [router]);

  return {
    goToSearchCaregivers,
    goToRequests,
    goToProfile,
  };
}
