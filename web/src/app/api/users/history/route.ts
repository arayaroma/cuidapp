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

    // Get completed requests for this user
    const completedRequests = await prisma.userRequests.findMany({
      where: {
        user_id: userId,
        status: "COMPLETED",
      },
      include: {
        applications: {
          where: {
            status: "ACCEPTED",
          },
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
                        rating: true,
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
        updated_at: 'desc',
      },
    });

    // Format history
    const formattedHistory = completedRequests.map((request) => {
      const acceptedApplication = request.applications[0];
      const assistantUser = acceptedApplication?.user_assistant_application?.user?.assistant;
      
      const startDate = new Date(request.request_date);
      const endDate = new Date(request.updated_at); // Use updated_at as completion date
      
      // Calculate duration
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const duration = durationDays >= 30 
        ? `${Math.round(durationDays / 30)} mes${durationDays >= 60 ? 'es' : ''}`
        : `${durationDays} día${durationDays !== 1 ? 's' : ''}`;

      // Calculate total cost
      const hourlyRate = request.hourly_rate || 0;
      const totalHours = request.total_hours || durationDays * 8; // Assume 8 hours per day
      const totalCost = hourlyRate * totalHours;

      return {
        id: request.id,
        requestId: request.id,
        title: request.title,
        caregiver: assistantUser ? {
          id: assistantUser.id,
          name: assistantUser.full_name,
          avatar: assistantUser.photo_url,
          rating: assistantUser.rating || 0,
        } : {
          id: "unknown",
          name: "Cuidador asignado",
          avatar: null,
          rating: 0,
        },
        category: request.care_type,
        startDate: startDate,
        endDate: endDate,
        duration: duration,
        totalCost: totalCost,
        status: "Completado",
        myRating: 0, // TODO: Get from service_ratings table
        caregiverRating: assistantUser?.rating || 0,
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
