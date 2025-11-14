import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single request
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const request = await prisma.userRequests.findUnique({
      where: {
        id
      },
      include: {
        user: {
          include: {
            location: true
          }
        },
        applications: true
      }
    })

    if (!request) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    // Transform database format to frontend format
    const transformedRequest = {
      id: request.id,
      title: request.title,
      careType: request.care_type,
      personAge: request.person_age,
      description: request.description,
      location: request.user.location?.district || 'Ubicación no especificada',
      startDate: request.request_date,
      isRecurring: request.is_recurring,
      weekdays: request.weekdays,
      schedule: request.request_time,
      hourlyRate: request.hourly_rate || 0,
      totalHours: request.total_hours || 0,
      requirements: request.requirements,
      urgency: request.urgency,
      createdBy: request.user.full_name,
      createdById: request.user.id,
      createdByAvatar: request.user.photo_url || null,
      createdByRating: request.user.rating || 0,
      createdByRatingCount: request.user.rating_count || 0,
      applicants: request.applications.length,
      status: request.status,
    }

    return NextResponse.json(transformedRequest)
  } catch (error) {
    console.error('Error fetching request:', error)
    return NextResponse.json(
      { error: 'Error al obtener la solicitud' },
      { status: 500 }
    )
  }
}

// PUT update request
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const {
      title,
      description,
      careType,
      personAge,
      requirements,
      urgency,
      requestDate,
      requestTime,
      status,
      hourlyRate,
      totalHours,
      isRecurring,
      weekdays,
    } = body

    console.log('📝 Actualizando solicitud:', id)
    console.log('📅 Weekdays recibidos:', weekdays)
    console.log('🔄 isRecurring:', isRecurring)

    const updatedRequest = await prisma.userRequests.update({
      where: {
        id
      },
      data: {
        title,
        description,
        care_type: careType,
        person_age: personAge,
        requirements: requirements || [],
        urgency,
        hourly_rate: hourlyRate,
        total_hours: totalHours,
        is_recurring: isRecurring,
        weekdays: weekdays || [],
        request_date: new Date(requestDate),
        request_time: requestTime,
        status,
      },
      include: {
        user: {
          include: {
            location: true
          }
        }
      }
    })

    console.log('✅ Solicitud actualizada. Weekdays guardados:', updatedRequest.weekdays)

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Error updating request:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la solicitud' },
      { status: 500 }
    )
  }
}

// DELETE request
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.userRequests.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ message: 'Solicitud eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting request:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la solicitud' },
      { status: 500 }
    )
  }
}
