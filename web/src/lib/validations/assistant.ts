import { z } from "zod";

/**
 * Esquema de validación para el perfil de asistente/cuidador
 */
export const assistantProfileSchema = z.object({
  bio: z
    .string()
    .min(50, "La biografía debe tener al menos 50 caracteres")
    .max(1000, "La biografía no puede exceder 1000 caracteres")
    .optional(),
  
  specialties: z
    .array(
      z.enum(["elderly", "children", "disability", "hospital", "companion", "special-needs"])
    )
    .min(1, "Debe seleccionar al menos una especialidad")
    .max(6, "No puede seleccionar más de 6 especialidades"),
  
  yearsExperience: z
    .number()
    .int("Los años de experiencia deben ser un número entero")
    .min(0, "Los años de experiencia no pueden ser negativos")
    .max(50, "Años de experiencia inválidos"),
  
  certifications: z
    .array(z.string().min(1, "La certificación no puede estar vacía"))
    .max(10, "No puede agregar más de 10 certificaciones")
    .default([]),
  
  languages: z
    .array(z.string().min(1, "El idioma no puede estar vacío"))
    .min(1, "Debe especificar al menos un idioma")
    .max(10, "No puede agregar más de 10 idiomas"),
  
  availabilitySchedule: z
    .string()
    .max(200, "El horario no puede exceder 200 caracteres")
    .optional(),
  
  availableWeekdays: z
    .array(
      z.enum(["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"])
    )
    .min(1, "Debe seleccionar al menos un día disponible")
    .max(7, "Selección de días inválida"),
  
  hourlyRate: z
    .number()
    .positive("La tarifa por hora debe ser mayor a 0")
    .max(100000, "Tarifa por hora inválida")
    .optional()
    .nullable(),
  
  isAvailable: z.boolean().default(true),
  
  preferredAgeGroups: z
    .array(z.string())
    .max(10, "No puede agregar más de 10 rangos de edad")
    .default([]),
  
  maxDistanceKm: z
    .number()
    .int("La distancia debe ser un número entero")
    .positive("La distancia debe ser mayor a 0")
    .max(500, "Distancia inválida")
    .optional()
    .nullable(),
  
  hasVehicle: z.boolean().default(false),
  hasFirstAid: z.boolean().default(false),
});

/**
 * Esquema de validación para actualización de perfil de asistente
 */
export const updateAssistantProfileSchema = assistantProfileSchema.partial();

/**
 * Tipo TypeScript inferido del esquema de creación
 */
export type AssistantProfileInput = z.infer<typeof assistantProfileSchema>;

/**
 * Tipo TypeScript inferido del esquema de actualización
 */
export type UpdateAssistantProfileInput = z.infer<typeof updateAssistantProfileSchema>;

/**
 * Esquema para filtros de búsqueda de asistentes
 */
export const assistantFiltersSchema = z.object({
  specialty: z.enum(["all", "elderly", "children", "disability", "hospital", "companion", "special-needs"]).optional(),
  availability: z.enum(["all", "available", "unavailable"]).optional(),
  verified: z.enum(["all", "verified", "unverified"]).optional(),
  minExperience: z.number().int().min(0).optional(),
  maxHourlyRate: z.number().positive().optional(),
  weekday: z.enum(["all", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]).optional(),
  hasFirstAid: z.boolean().optional(),
  hasVehicle: z.boolean().optional(),
  searchQuery: z.string().optional(),
});

export type AssistantFilters = z.infer<typeof assistantFiltersSchema>;

/**
 * Textos legibles para especialidades
 */
export const specialtyLabels: Record<string, string> = {
  elderly: "Adulto Mayor",
  children: "Niños y Bebés",
  disability: "Discapacidad",
  hospital: "Hospitalario",
  companion: "Compañía",
  "special-needs": "Necesidades Especiales",
};

/**
 * Idiomas disponibles
 */
export const availableLanguages = [
  "Español",
  "Inglés",
  "Francés",
  "Portugués",
  "Italiano",
  "Alemán",
  "Mandarín",
  "Japonés",
  "Coreano",
  "Árabe",
] as const;

/**
 * Certificaciones comunes
 */
export const commonCertifications = [
  "Primeros Auxilios",
  "RCP Básico",
  "RCP Avanzado",
  "Enfermería Técnica",
  "Cuidado Geriátrico",
  "Cuidado Infantil",
  "Atención a Personas con Discapacidad",
  "Nutrición y Dietética",
  "Administración de Medicamentos",
  "Manejo de Emergencias",
] as const;

/**
 * Rangos de edad comunes
 */
export const ageGroups = [
  "0-2 años (Bebés)",
  "3-5 años (Preescolar)",
  "6-12 años (Niños)",
  "13-17 años (Adolescentes)",
  "18-59 años (Adultos)",
  "60-74 años (Adultos Mayores)",
  "75+ años (Tercera Edad)",
] as const;
