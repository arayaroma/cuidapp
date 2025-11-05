import { z } from "zod";

/**
 * Esquema de validación para la creación de solicitudes de cuidado
 */
export const createRequestSchema = z.object({
  title: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(100, "El título no puede exceder 100 caracteres"),
  
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(1000, "La descripción no puede exceder 1000 caracteres"),
  
  careType: z.enum(["elderly", "children", "disability", "hospital", "companion", "special-needs"], {
    message: "Tipo de cuidado inválido",
  }),
  
  personAge: z
    .number()
    .int("La edad debe ser un número entero")
    .min(0, "La edad no puede ser negativa")
    .max(120, "Edad inválida"),
  
  requirements: z
    .array(z.string().min(1, "El requisito no puede estar vacío"))
    .min(1, "Debe especificar al menos un requisito")
    .max(10, "No puede especificar más de 10 requisitos"),
  
  urgency: z.enum(["low", "medium", "high"], {
    message: "Nivel de urgencia inválido",
  }),
  
  hourlyRate: z
    .number()
    .positive("La tarifa por hora debe ser mayor a 0")
    .optional()
    .nullable(),
  
  totalHours: z
    .number()
    .int("Las horas totales deben ser un número entero")
    .positive("Las horas totales deben ser mayor a 0")
    .optional()
    .nullable(),
  
  isRecurring: z.boolean().default(false),
  
  weekdays: z
    .array(
      z.enum(["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"])
    )
    .optional()
    .default([]),
  
  requestDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha inválida",
    })
    .refine(
      (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
      {
        message: "La fecha no puede ser anterior a hoy",
      }
    ),
  
  requestTime: z
    .string()
    .min(1, "El horario es requerido")
    .max(100, "El horario no puede exceder 100 caracteres"),
});

/**
 * Esquema de validación para la actualización de solicitudes de cuidado
 */
export const updateRequestSchema = createRequestSchema.extend({
  status: z.enum(["active", "in-progress", "completed", "paused", "cancelled"], {
    message: "Estado inválido",
  }),
});

/**
 * Tipo TypeScript inferido del esquema de creación
 */
export type CreateRequestInput = z.infer<typeof createRequestSchema>;

/**
 * Tipo TypeScript inferido del esquema de actualización
 */
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;

/**
 * Esquema para validar el ID de una solicitud
 */
export const requestIdSchema = z.object({
  id: z.string().cuid("ID de solicitud inválido"),
});

/**
 * Esquema para filtros de búsqueda
 */
export const requestFiltersSchema = z.object({
  status: z.enum(["all", "active", "in-progress", "completed", "paused", "cancelled"]).optional(),
  careType: z.enum(["all", "children", "elderly", "disability", "hospital"]).optional(),
  urgency: z.enum(["all", "low", "medium", "high"]).optional(),
  searchQuery: z.string().optional(),
});

export type RequestFilters = z.infer<typeof requestFiltersSchema>;

/**
 * Textos legibles para tipos de cuidado
 */
export const careTypeLabels: Record<string, string> = {
  elderly: "Adulto Mayor (60+ años)",
  children: "Niños y Bebés (0-12 años)",
  disability: "Persona con Discapacidad",
  hospital: "Cuidado Hospitalario o Postoperatorio",
  companion: "Compañía y Asistencia General",
  "special-needs": "Necesidades Especiales",
};

/**
 * Textos legibles para niveles de urgencia
 */
export const urgencyLabels: Record<string, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

/**
 * Textos legibles para estados
 */
export const statusLabels: Record<string, string> = {
  active: "Activa",
  "in-progress": "En Proceso",
  completed: "Completada",
  paused: "Pausada",
  cancelled: "Cancelada",
};
