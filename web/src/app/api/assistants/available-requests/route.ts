import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Get all active requests
    const requests = await prisma.userRequests.findMany({
      where: {
        status: "NOT_STARTED",
        user_id: {
          not: userId, // Not their own requests
        },
      },
      include: {
        user: {
          select: {
            full_name: true,
            location: true,
          },
        },
        applications: {
          include: {
            user_assistant_application: {
              include: {
                user: {
                  select: {
                    assistant: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Format requests
    const formattedRequests = requests.map((request) => {
      const hasApplied = request.applications.some((app) =>
        app.user_assistant_application.user.assistant?.id === userId
      );
      return {
        id: request.id,
        title: request.title,
        careType: request.care_type,
        personAge: request.person_age,
        description: request.description,
        location: request.user?.location ? [
          request.user.location.district,
          request.user.location.canton,
        ].filter(Boolean).join(", ") : "Sin ubicación",
        startDate: request.request_date,
        isRecurring: request.is_recurring,
        schedule: request.request_time,
        weekdays: request.weekdays,
        hourlyRate: request.hourly_rate,
        totalHours: request.total_hours,
        requirements: request.requirements,
        urgency: request.urgency,
        createdBy: request.user?.full_name || "Desconocido",
        applicants: request.applications.length,
        status: request.status,
        hasApplied, // Add hasApplied field
      };
    });

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching available requests:", error);
    return NextResponse.json(
      { error: "Error al cargar las solicitudes disponibles" },
      { status: 500 }
    );
  }
}
