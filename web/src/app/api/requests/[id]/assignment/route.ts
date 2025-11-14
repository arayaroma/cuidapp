import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET assigned assistant for a request
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const application = await prisma.applicationRequest.findFirst({
      where: {
        user_request_id: id,
        status: 'ACCEPTED',
      },
      include: {
        user_assistant_application: {
          include: {
            user: {
              include: {
                assistant: true,
              },
            },
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'No assigned assistant found' }, { status: 404 })
    }

    // Prisma types here can be complex; use any for transformation to avoid strict type issues
    const user: any = application.user_assistant_application?.user
    const assistantProfile: any = user?.assistant

    const transformed = {
      id: user?.id || null,
      name: user?.full_name || 'Cuidador',
      avatar: user?.photo_url || null,
      rating: assistantProfile?.rating || 0,
      totalReviews: assistantProfile?.rating_count || 0,
      assistantId: assistantProfile?.id || null,
    }

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Error fetching assignment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
