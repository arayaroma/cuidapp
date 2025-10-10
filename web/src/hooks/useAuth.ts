"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
  const router = useRouter();

  const logout = useCallback(() => {
    // Aquí puedes agregar lógica adicional como limpiar localStorage, cookies, etc.
    // Por ejemplo: localStorage.removeItem('token');
    router.push('/login');
  }, [router]);

  return {
    logout,
  };
}
