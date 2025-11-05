import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CareRequest, Weekday } from '@/types/request'

export async function GET() {
  try {
    const requests = await prisma.userRequests.findMany({
      where: {
        status: 'active'
      },
      include: {
        user: {
          include: {
            location: true
          }
        },
        applications: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    const careRequests: CareRequest[] = requests.map(req => {
      const location = req.user.location?.address_line1 || 'Sin ubicación'

      return {
        id: req.id,
        title: req.title,
        careType: req.care_type as 'children' | 'elderly' | 'disability' | 'hospital',
        personAge: req.person_age,
        description: req.description,
        location,
        startDate: req.request_date,
        isRecurring: req.is_recurring,
        weekdays: (req.weekdays || []) as Weekday[],
        schedule: req.request_time,
        hourlyRate: req.hourly_rate || 25,
        totalHours: req.total_hours || 8,
        requirements: req.requirements,
        urgency: req.urgency as 'low' | 'medium' | 'high',
        createdBy: req.user.full_name,
        applicants: req.applications?.length || 0,
        status: req.status as any,
      }
    })

    return NextResponse.json(careRequests)
  } catch (error) {
    console.error('Error fetching available requests:', error)
    return NextResponse.json(
      { error: 'Error al obtener las solicitudes disponibles' },
      { status: 500 }
    )
  }
}