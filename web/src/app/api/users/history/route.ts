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
                      include: {
                        assistant: true, // El User que es assistant
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
      const usersAssistantRelation = acceptedApplication?.user_assistant_application?.user;
      const assistantUser = usersAssistantRelation?.assistant; // El User que es el asistente
      const assistantData = assistantUser?.assistant; // Los datos del Assistant
      
      console.log("🔍 Debug - Assistant ID:", assistantData?.id);
      console.log("🔍 Debug - Assistant User:", assistantUser?.full_name);
      
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
        caregiver: assistantUser && assistantData ? {
          id: assistantData.id, // ← ID del Assistant
          name: assistantUser.full_name, // ← Datos del User que es asistente
          avatar: assistantUser.photo_url,
          rating: assistantData.rating || 0,
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
        caregiverRating: assistantData?.rating || 0,
      };
    });

    return NextResponse.json(formattedHistory);
  } catch (error) {
    console.error("Error fetching history:", error);
    // Devolver un array vacío en caso de error para evitar problemas en el frontend
    return NextResponse.json([]);
  }
}
