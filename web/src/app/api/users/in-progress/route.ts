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

    // Get services in progress for this user
    const inProgressServices = await prisma.usersAssistant.findMany({
      where: {
        user_id: userId,
        end_date: {
          gte: new Date(), // Services not yet ended
        },
        start_date: {
          lte: new Date(), // Services already started
        },
      },
      include: {
        assistant: {
          select: {
            id: true,
            full_name: true,
            photo_url: true,
            rating: true,
          },
        },
        user_assistant_applications: {
          include: {
            requests: {
              include: {
                user_request: {
                  select: {
                    title: true,
                    description: true,
                    care_type: true,
                    request_date: true,
                    request_time: true,
                    hourly_rate: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        start_date: 'asc',
      },
    });

    // Format services
    const formattedServices = inProgressServices.map((service) => {
      const request = service.user_assistant_applications[0]?.requests[0]?.user_request;
      const startDate = new Date(service.start_date);
      const endDate = service.end_date ? new Date(service.end_date) : null;
      const now = new Date();

      // Calculate progress
      const totalDays = endDate 
        ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        : 30; // Default 30 days if no end date
      
      const daysCompleted = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const progress = Math.min(Math.round((daysCompleted / totalDays) * 100), 100);
      const canComplete = progress >= 80; // Can complete if 80% done

      return {
        id: service.id,
        title: request?.title || "Servicio de cuidado",
        caregiver: {
          id: service.assistant.id,
          name: service.assistant.full_name,
          avatar: service.assistant.photo_url,
          rating: service.assistant.rating || 0,
        },
        category: request?.care_type || "general",
        status: "En Progreso",
        startDate: service.start_date,
        endDate: service.end_date,
        progress: progress,
        daysCompleted: daysCompleted,
        totalDays: totalDays,
        nextSession: request?.request_time || "Por confirmar",
        hourlyRate: request?.hourly_rate || 0,
        canComplete: canComplete,
      };
    });

    return NextResponse.json(formattedServices);
  } catch (error) {
    console.error("Error fetching in-progress services:", error);
    return NextResponse.json(
      { error: "Error al cargar los servicios en progreso" },
      { status: 500 }
    );
  }
}
