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

    // Get completed services for this user
    const completedServices = await prisma.usersAssistant.findMany({
      where: {
        user_id: userId,
        end_date: {
          lt: new Date(), // Services that have ended
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
                    care_type: true,
                    hourly_rate: true,
                    total_hours: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        end_date: 'desc',
      },
    });

    // Format history
    const formattedHistory = completedServices.map((service) => {
      const request = service.user_assistant_applications[0]?.requests[0]?.user_request;
      const startDate = new Date(service.start_date);
      const endDate = service.end_date ? new Date(service.end_date) : new Date();
      
      // Calculate duration
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const duration = durationDays >= 30 
        ? `${Math.round(durationDays / 30)} mes${durationDays >= 60 ? 'es' : ''}`
        : `${durationDays} día${durationDays !== 1 ? 's' : ''}`;

      // Calculate total cost
      const hourlyRate = request?.hourly_rate || 0;
      const totalHours = request?.total_hours || durationDays * 8; // Assume 8 hours per day
      const totalCost = hourlyRate * totalHours;

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
        startDate: startDate,
        endDate: endDate,
        duration: duration,
        totalCost: totalCost,
        status: "Completado",
        myRating: 0, // TODO: Get from reviews table when implemented
        caregiverRating: service.assistant.rating || 0,
      };
    });

    return NextResponse.json(formattedHistory);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Error al cargar el historial" },
      { status: 500 }
    );
  }
}
