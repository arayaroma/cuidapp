import {
  Home,
  Search,
  MessageSquare,
  Calendar,
  User,
  Heart,
  Settings,
  HelpCircle,
  FileText,
  History,
} from "lucide-react";
import { NavSection } from "@/components/shared/NavigationDrawer";

export const userNavSections: NavSection[] = [
  {
    title: "Principal",
    items: [
      {
        icon: Home,
        label: "Inicio",
        href: "/usuarios/dashboard",
      },
      {
        icon: Search,
        label: "Buscar Cuidadores",
        href: "/usuarios/available-caregivers",
      },
      {
        icon: FileText,
        label: "Mis Solicitudes",
        href: "/usuarios/my-requests",
        badge: 2,
      },
      {
        icon: History,
        label: "Historial",
        href: "/usuarios/history",
      },
      {
        icon: Calendar,
        label: "Calendario",
        href: "/usuarios/calendar",
      },
      {
        icon: MessageSquare,
        label: "Mensajes",
        href: "/usuarios/messages",
        badge: 3,
      },
    ],
  },
  {
    title: "Personal",
    items: [
      {
        icon: User,
        label: "Mi Perfil",
        href: "/usuarios/profile",
      },
      {
        icon: Heart,
        label: "Favoritos",
        href: "/usuarios/favorites",
      },
      {
        icon: Settings,
        label: "Configuración",
        href: "/usuarios/settings",
      },
      {
        icon: HelpCircle,
        label: "Ayuda y Soporte",
        href: "/usuarios/help",
      },
    ],
  },
];
