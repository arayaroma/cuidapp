"use client";

import { signOut, useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const logout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return {
    logout,
    session,
    status,
    user: session?.user,
    isAuthenticated: !!session,
  };
}
