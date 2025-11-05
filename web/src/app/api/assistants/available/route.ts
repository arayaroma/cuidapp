import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Assistant } from '@/types/assistant'

export async function GET() {
  try {
    console.log('🔍 Buscando asistentes disponibles...')
    
    const assistants = await prisma.assistant.findMany({
      where: {
        is_available: true
      },
      include: {
        user: true
      }
    })

    console.log(`📊 Encontrados ${assistants.length} asistentes en la BD`)

    const formattedAssistants: Assistant[] = []
    
    for (const assistant of assistants) {
      // Obtener location por separado
      const location = await prisma.location.findFirst({
        where: {
          user_id: assistant.user_id
        }
      })

      formattedAssistants.push({
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
      })
    }

    console.log(`✅ ${formattedAssistants.length} asistentes formateados`)
    return NextResponse.json(formattedAssistants)
  } catch (error) {
    console.error('❌ Error fetching assistants:', error)
    // Retornar array vacío en caso de error para mantener consistencia
    return NextResponse.json([], { status: 500 })
  }
}