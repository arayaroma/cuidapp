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

    const requests = await prisma.userRequests.findMany({
      where: {
        user_id: userId,
      },
      include: {
        applications: {
          include: {
            user_assistant_application: {
              include: {
                user: {
                  include: {
                    assistant: {
                      select: {
                        id: true,
                        full_name: true,
                        photo_url: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            full_name: true,
            location: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Format requests
    const formattedRequests = requests.map((request) => ({
      id: request.id,
      title: request.title,
      careType: request.care_type,
      personAge: request.person_age,
      description: request.description,
      location: request.user.location ? [
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
      createdBy: request.user.full_name,
      applicants: request.applications.map((app) => ({
        id: app.user_assistant_application.user.assistant.id,
        fullName: app.user_assistant_application.user.assistant.full_name,
        photoUrl: app.user_assistant_application.user.assistant.photo_url,
      })),
      status: request.status,
      createdAt: request.created_at,
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Error al cargar las solicitudes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const newRequest = await prisma.userRequests.create({
      data: {
        user_id: userId,
        title: body.title,
        description: body.description,
        care_type: body.careType,
        person_age: body.personAge || 0,
        requirements: body.requirements || [],
        urgency: body.urgency || "medium",
        hourly_rate: body.hourlyRate,
        total_hours: body.totalHours,
        is_recurring: body.isRecurring || false,
        weekdays: body.weekdays || [],
        request_date: new Date(body.requestDate),
        request_time: body.requestTime,
        status: "NOT_STARTED",
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Error al crear la solicitud" },
      { status: 500 }
    );
  }
}
