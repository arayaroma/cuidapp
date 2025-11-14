import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MyRequest } from '@/types/request'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as any).id

  // Get pending applications for this assistant
  const applications = await prisma.applicationRequest.findMany({
    where: {
      status: 'PENDING',
      user_assistant_application: {
        user_assistant: {
          assistant_id: userId
        }
      }
    },
    include: {
      user_request: {
        include: {
          user: {
            include: {
              location: true
            }
          }
        }
      }
    }
  })

  const myRequests: MyRequest[] = await Promise.all(applications.map(async (app: any) => {
    const req = app.user_request
    const lines = req.description.split('\n')
    const title = lines[0] || 'Sin título'
    const description = lines[1] || ''
    const typeLine = lines[2] || 'Tipo: elderly'
    const ageLine = lines[3] || 'Edad: 0'
    const reqLine = lines[4] || 'Requisitos: '
    const urgLine = lines[5] || 'Urgencia: medium'

    const careType = (typeLine.split(': ')[1] as 'children' | 'elderly' | 'disability' | 'hospital') || 'elderly'
    const personAge = parseInt(ageLine.split(': ')[1]) || 0
    const requirements = reqLine.split(': ')[1]?.split(', ') || []
    const urgency = (urgLine.split(': ')[1] as 'low' | 'medium' | 'high') || 'medium'
    const location = req.user.location?.address_line1 || 'Sin ubicación'

    // Count applicants
    const applicants = await prisma.applicationRequest.count({
      where: { user_request_id: req.id }
    })

    return {
      id: req.id,
      title,
      careType,
      personAge,
      description,
      location,
      startDate: req.request_date,
      isRecurring: true,
      schedule: req.request_time,
      hourlyRate: 25,
      totalHours: 8,
      requirements,
      urgency,
      createdBy: req.user.full_name,
      applicants,
      status: req.status as any,
      clientName: req.user.full_name,
      clientAvatar: req.user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      appliedDate: new Date(),
    }
  }))

  return NextResponse.json(myRequests)
}