import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Assistant } from '@/types/assistant'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log(`🔍 Buscando asistente con ID: ${id}`)
    
    const assistant = await prisma.assistant.findUnique({
      where: {
        id: id
      },
      include: {
        user: true
      }
    })

    if (!assistant) {
      console.log(`❌ Asistente no encontrado: ${id}`)
      return NextResponse.json({ error: 'Asistente no encontrado' }, { status: 404 })
    }

    // Obtener location por separado
    const location = await prisma.location.findFirst({
      where: {
        user_id: assistant.user_id
      }
    })

    const formattedAssistant: Assistant = {
      id: assistant.id,
      userId: assistant.user_id,
      name: assistant.user.full_name,
      email: assistant.user.email,
      phone: assistant.user.phone_number || undefined,
      photoUrl: assistant.user.photo_url || undefined,
      bio: assistant.bio || undefined,
      specialties: assistant.specialties as any,
      yearsExperience: assistant.years_experience,
      certifications: assistant.certifications,
      languages: assistant.languages,
      availabilitySchedule: assistant.availability_schedule || undefined,
      availableWeekdays: assistant.available_weekdays as any,
      hourlyRate: assistant.hourly_rate || undefined,
      isAvailable: assistant.is_available,
      verified: assistant.verified,
      backgroundCheck: assistant.background_check,
      preferredAgeGroups: assistant.preferred_age_groups,
      maxDistanceKm: assistant.max_distance_km || undefined,
      hasVehicle: assistant.has_vehicle,
      hasFirstAid: assistant.has_first_aid,
      rating: assistant.rating || undefined,
      ratingCount: assistant.rating_count,
      location: location?.address_line1 || undefined,
      createdAt: assistant.created_at,
      updatedAt: assistant.updated_at,
    }

    console.log(`✅ Asistente ${assistant.user.full_name} encontrado`)
    return NextResponse.json(formattedAssistant)
  } catch (error) {
    console.error('❌ Error fetching assistant:', error)
    return NextResponse.json({ error: 'Error al cargar asistente' }, { status: 500 })
  }
}
