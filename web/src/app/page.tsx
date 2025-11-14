import { redirect } from "next/navigation";

export default function Home() {
  // The middleware will handle the redirect based on user role
  redirect("/login");
}
