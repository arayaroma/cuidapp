/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "./prisma";

/**
 * Helpers para trabajar con Prisma mientras los tipos se sincronizan
 */

export interface UserWithRelations {
  id: string;
  full_name: string;
  username: string;
  email: string;
  photo_url: string | null;
  phone_number: string | null;
  emergency_number: string | null;
  has_safeguard: boolean;
  notes: string | null;
  rating: number | null;
  rating_count: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  role?: {
    code: string;
    display_name: string;
  };
  disability?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  user_disabilities?: Array<{
    disability: {
      id: string;
      name: string;
      description: string | null;
    };
  }>;
  location?: {
    label: string | null;
    address_line1: string | null;
    address_line2: string | null;
    district: string | null;
    canton: string | null;
    province: string | null;
    country: string | null;
    postal_code: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
  assistant?: {
    bio: string | null;
    years_experience: number;
    hourly_rate: number | null;
    specialties: string[];
    certifications: string[];
    languages: string[];
    available_weekdays: string[];
  } | null;
}

/**
 * Obtener usuario con todas sus relaciones incluyendo discapacidades múltiples
 */
export async function getUserWithRelations(userId: string): Promise<UserWithRelations | null> {
  const user = await (prisma.user.findUnique as any)({
    where: { id: userId },
    include: {
      role: true,
      disability: true,
      location: true,
      assistant: true,
      user_disabilities: {
        include: {
          disability: true,
        },
      },
    },
  });

  return user;
}

/**
 * Actualizar las discapacidades de un usuario
 */
export async function updateUserDisabilities(userId: string, disabilityIds: string[]): Promise<void> {
  // Eliminar las relaciones actuales
  await (prisma as any).userDisability.deleteMany({
    where: { user_id: userId },
  });

  // Crear las nuevas relaciones
  if (disabilityIds.length > 0) {
    await (prisma as any).userDisability.createMany({
      data: disabilityIds.map((disabilityId: string) => ({
        user_id: userId,
        disability_id: disabilityId,
      })),
    });
  }
}

/**
 * Formatear un usuario con relaciones para la respuesta de la API
 */
export function formatUserProfile(user: UserWithRelations) {
  return {
    id: user.id,
    fullName: user.full_name,
    username: user.username,
    email: user.email,
    photoUrl: user.photo_url,
    phoneNumber: user.phone_number,
    emergencyNumber: user.emergency_number,
    hasSafeguard: user.has_safeguard,
    notes: user.notes,
    rating: user.rating,
    ratingCount: user.rating_count,
    isActive: user.is_active,
    role: user.role?.code || null,
    roleDisplayName: user.role?.display_name || null,
    // Discapacidad principal (compatibilidad con versión anterior)
    disability: user.disability ? {
      id: user.disability.id,
      name: user.disability.name,
      description: user.disability.description,
    } : null,
    // Múltiples discapacidades
    disabilities: user.user_disabilities?.map((ud) => ({
      id: ud.disability.id,
      name: ud.disability.name,
      description: ud.disability.description,
    })) || [],
    location: user.location ? {
      label: user.location.label,
      addressLine1: user.location.address_line1,
      addressLine2: user.location.address_line2,
      district: user.location.district,
      canton: user.location.canton,
      province: user.location.province,
      country: user.location.country,
      postalCode: user.location.postal_code,
      latitude: user.location.latitude,
      longitude: user.location.longitude,
    } : null,
    assistant: user.assistant ? {
      bio: user.assistant.bio,
      yearsExperience: user.assistant.years_experience,
      hourlyRate: user.assistant.hourly_rate,
      specialties: user.assistant.specialties,
      certifications: user.assistant.certifications,
      languages: user.assistant.languages,
      availableWeekdays: user.assistant.available_weekdays,
    } : null,
    createdAt: user.created_at.toISOString(),
    updatedAt: user.updated_at.toISOString(),
  };
}
