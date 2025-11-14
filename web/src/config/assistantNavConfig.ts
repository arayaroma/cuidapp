import {
  Home,
  Briefcase,
  MessageSquare,
  Calendar,
  User,
  Settings,
  HelpCircle,
  Inbox,
  CheckCircle2,
} from "lucide-react";
import { NavSection } from "@/components/shared/NavigationDrawer";

export const assistantNavSections: NavSection[] = [
  {
    title: "Principal",
    items: [
      {
        icon: Home,
        label: "Inicio",
        href: "/asistentes/dashboard",
      },
      {
        icon: Briefcase,
        label: "Solicitudes Disponibles",
        href: "/asistentes/available-requests",
      },
      
      {
        icon: CheckCircle2,
        label: "Trabajos Finalizados",
        href: "/asistentes/accepted-jobs",
      },
      {
        icon: Calendar,
        label: "Calendario",
        href: "/asistentes/calendar",
      },
      {
        icon: MessageSquare,
        label: "Mensajes",
        href: "/asistentes/messages",
        badge: 5,
      },
    ],
  },
  {
    title: "Cuenta",
    items: [
      {
        icon: User,
        label: "Mi Perfil",
        href: "/asistentes/profile",
      },
      {
        icon: Settings,
        label: "Configuración",
        href: "/asistentes/settings",
      },
      {
        icon: HelpCircle,
        label: "Ayuda y Soporte",
        href: "/asistentes/help",
      },
    ],
  },
];
