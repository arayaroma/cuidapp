import { specialtyLabels } from "@/lib/validations/assistant";
import { careTypeColors } from "@/config/colors";

export const specialtyOptions = [
  {
    value: "elderly",
    label: specialtyLabels.elderly,
    description: "Cuidado de adultos mayores",
    icon: "👴",
    colors: careTypeColors.elderly,
  },
  {
    value: "children",
    label: specialtyLabels.children,
    description: "Cuidado de niños y bebés",
    icon: "👶",
    colors: careTypeColors.children,
  },
  {
    value: "disability",
    label: specialtyLabels.disability,
    description: "Atención a personas con discapacidad",
    icon: "♿",
    colors: careTypeColors.disability,
  },
  {
    value: "hospital",
    label: specialtyLabels.hospital,
    description: "Cuidado hospitalario o postoperatorio",
    icon: "🏥",
    colors: careTypeColors.hospital,
  },
  {
    value: "companion",
    label: specialtyLabels.companion,
    description: "Compañía y asistencia general",
    icon: "🤝",
    colors: careTypeColors.companion,
  },
  {
    value: "special-needs",
    label: specialtyLabels["special-needs"],
    description: "Necesidades especiales",
    icon: "⭐",
    colors: careTypeColors["special-needs"],
  },
] as const;

export const experienceLevels = [
  { value: "0", label: "Sin experiencia", description: "Comenzando en el cuidado" },
  { value: "1", label: "1 año", description: "Experiencia inicial" },
  { value: "2", label: "2 años", description: "Experiencia básica" },
  { value: "3", label: "3-5 años", description: "Experiencia intermedia" },
  { value: "5", label: "5-10 años", description: "Experiencia avanzada" },
  { value: "10", label: "10+ años", description: "Experto" },
] as const;

export const availabilityOptions = [
  { value: "available", label: "Disponible", description: "Aceptando nuevos trabajos" },
  { value: "unavailable", label: "No disponible", description: "No acepto nuevos trabajos" },
] as const;
