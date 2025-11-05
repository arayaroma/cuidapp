import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getSession() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as any;
  return session;
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.id || null;
}
