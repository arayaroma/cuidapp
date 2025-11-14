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
  Clock,
  Inbox,
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
      },
      {
        icon: Clock,
        label: "En Progreso",
        href: "/usuarios/in-progress",
        badge: 2,
      },
      {
        icon: Inbox,
        label: "Ofertas Recibidas",
        href: "/usuarios/received-offers",
        badge: 0,
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
        href: "/usuarios/settingsProfile",
      },
      {
        icon: HelpCircle,
        label: "Ayuda y Soporte",
        href: "/usuarios/help",
      },
    ],
  },
];
