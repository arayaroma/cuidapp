import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // TODO: Add authentication check when auth is properly configured
    // For now, we'll use a user_id from the request body
    const body = await req.json()
    const {
      userId,
      title,
      description,
      careType,
      personAge,
      requirements,
      urgency,
      requestDate,
      requestTime,
      hourlyRate,
      totalHours,
      isRecurring,
      weekdays,
    } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    const userRequest = await prisma.userRequests.create({
      data: {
        user_id: userId,
        title,
        description,
        care_type: careType,
        person_age: personAge,
        requirements: requirements || [],
        urgency,
        hourly_rate: hourlyRate || 25,
        total_hours: totalHours || 8,
        is_recurring: isRecurring !== undefined ? isRecurring : true,
        weekdays: weekdays || [],
        request_date: new Date(requestDate),
        request_time: requestTime,
        status: 'active',
      },
      include: {
        user: {
          include: {
            location: true
          }
        }
      }
    })

    return NextResponse.json(userRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating request:', error)
    return NextResponse.json(
      { error: 'Error al crear la solicitud' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get userId from query params for now
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    // Get user's own requests
    const requests = await prisma.userRequests.findMany({
      where: {
        user_id: userId
      },
      include: {
        user: {
          include: {
            location: true
          }
        },
        applications: {
          include: {
            user_assistant_application: {
              include: {
                user: {
                  include: {
                    assistant: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching user requests:', error)
    return NextResponse.json(
      { error: 'Error al obtener las solicitudes' },
      { status: 500 }
    )
  }
}
