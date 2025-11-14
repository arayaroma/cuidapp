import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma'
import { CareRequest, Weekday } from '@/types/request'

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  const assistantId = session?.user?.id;

  try {
    const requests = await prisma.userRequests.findMany({
      where: {
        status: 'NOT_STARTED'
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
    });

  const careRequests: CareRequest[] = await Promise.all(requests.map(async (req) => {
      const location = req.user.location?.address_line1 || 'Sin ubicación';

      // Check if current assistant has applied
      let hasApplied = false;
      if (assistantId) {
        const existingApplication = await prisma.applicationRequest.findFirst({
          where: {
            user_request_id: req.id,
            user_assistant_application: {
              user: {
                assistant_id: assistantId,
              },
            },
          },
        });
        hasApplied = !!existingApplication;
      }

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
        hasApplied,
      };
    }));

    // Exclude requests that this assistant already applied to, or that are completed
    // (user asked that once an assistant applied and the job is finalized it should not appear)
    const filtered = careRequests.filter((r) => {
      // Exclude if assistant already applied OR the request is completed
      return !(r.hasApplied || r.status === 'COMPLETED');
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error fetching available requests:', error);
    return NextResponse.json(
      { error: 'Error al obtener las solicitudes disponibles' },
      { status: 500 }
    );
  }
}