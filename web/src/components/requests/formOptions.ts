import { careTypeColors, urgencyColors, statusColors } from "@/config/colors";
import type { RadioOption } from "./EnhancedRadioGroup";

export const careTypeOptions: RadioOption[] = [
  {
    value: "children",
    label: "Niños y Bebés",
    description: "Cuidado de niños de 0 a 12 años, niñeras, babysitters",
    color: "orange",
    customColors: careTypeColors.children,
  },
  {
    value: "elderly",
    label: "Adulto Mayor",
    description: "Cuidado de personas de 60 años o más",
    color: "blue",
    customColors: careTypeColors.elderly,
  },
  {
    value: "disability",
    label: "Persona con Discapacidad",
    description: "Cuidado especializado para personas con discapacidad física o cognitiva",
    color: "green",
    customColors: careTypeColors.disability,
  },
  {
    value: "hospital",
    label: "Cuidado Hospitalario",
    description: "Acompañamiento en hospital o cuidados postoperatorios",
    color: "blue",
    customColors: careTypeColors.hospital,
  },
  {
    value: "companion",
    label: "Compañía General",
    description: "Acompañamiento, ayuda con tareas del hogar, asistencia básica",
    color: "yellow",
    customColors: careTypeColors.companion,
  },
  {
    value: "special-needs",
    label: "Necesidades Especiales",
    description: "Cuidado especializado para condiciones específicas (autismo, Alzheimer, etc.)",
    color: "purple",
    customColors: careTypeColors["special-needs"],
  },
];

export const urgencyOptions: RadioOption[] = [
  {
    value: "low",
    label: "Baja",
    description: "Puedo esperar varias semanas o más",
    color: "green",
    customColors: urgencyColors.low,
  },
  {
    value: "medium",
    label: "Media",
    description: "Necesito el servicio en 1-2 semanas",
    color: "yellow",
    customColors: urgencyColors.medium,
  },
  {
    value: "high",
    label: "Alta - Urgente",
    description: "Necesito el servicio lo antes posible (menos de 1 semana)",
    color: "red",
    customColors: urgencyColors.high,
  },
];

export const statusOptions: RadioOption[] = [
  {
    value: "active",
    label: "Activa",
    description: "Solicitud publicada y disponible para asistentes",
    color: "green",
    customColors: statusColors.active,
  },
  {
    value: "in-progress",
    label: "En Progreso",
    description: "Asistente asignado, servicio en curso",
    color: "blue",
    customColors: statusColors["in-progress"],
  },
  {
    value: "paused",
    label: "Pausada",
    description: "Servicio temporalmente detenido",
    color: "yellow",
    customColors: statusColors.paused,
  },
  {
    value: "completed",
    label: "Completada",
    description: "Servicio finalizado exitosamente",
    color: "gray",
    customColors: statusColors.completed,
  },
  {
    value: "cancelled",
    label: "Cancelada",
    description: "Solicitud cancelada por el usuario",
    color: "red",
    customColors: statusColors.cancelled,
  },
];
