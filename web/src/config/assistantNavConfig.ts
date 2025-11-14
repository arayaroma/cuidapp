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
  Clock,
  History,
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
        icon: Clock,
        label: "En Progreso",
        href: "/asistentes/in-progress",
        badge: 2,
      },
      {
        icon: CheckCircle2,
        label: "Trabajos Aceptados",
        href: "/asistentes/accepted-jobs",
      },
      {
        icon: History,
        label: "Historial",
        href: "/asistentes/history",
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
        href: "/asistentes/settingsProfile",
      },
      {
        icon: HelpCircle,
        label: "Ayuda y Soporte",
        href: "/asistentes/help",
      },
    ],
  },
];
