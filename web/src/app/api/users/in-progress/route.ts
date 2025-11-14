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

    // Get requests in progress for this user
    const inProgressRequests = await prisma.userRequests.findMany({
      where: {
        user_id: userId,
        status: "IN_PROGRESS",
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
                        rating_count: true,
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

    // Format requests
    const formattedServices = inProgressRequests.map((request) => {
      const acceptedApplication = request.applications[0];
      const assistant = acceptedApplication?.user_assistant_application?.user?.assistant;
      
      const startDate = new Date(request.request_date);
      const now = new Date();
      
      // Calculate progress based on time elapsed (simplified)
      const daysSinceStart = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const estimatedTotalDays = request.total_hours ? Math.ceil(request.total_hours / 8) : 30; // Assume 8 hours/day
      const progress = Math.min(Math.round((daysSinceStart / estimatedTotalDays) * 100), 100);
      const canComplete = progress >= 80; // Can complete if 80% done

      return {
        id: request.id,
        title: request.title,
        caregiver: assistant ? {
          id: assistant.id,
          name: assistant.full_name,
          avatar: assistant.photo_url,
          rating: assistant.rating || 0,
        } : {
          id: "unknown",
          name: "Cuidador asignado",
          avatar: null,
          rating: 0,
        },
        category: request.care_type,
        status: "En Progreso",
        startDate: request.request_date,
        endDate: null, // Calculate based on total_hours
        progress: progress,
        daysCompleted: daysSinceStart,
        totalDays: estimatedTotalDays,
        nextSession: request.request_time || "Por confirmar",
        hourlyRate: request.hourly_rate || 0,
        canComplete: canComplete,
        progressNotes: "", // Notes are stored in frontend session/localStorage
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

export async function PUT(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const { requestId, progress, status } = await req.json();

    if (!requestId) {
      return NextResponse.json(
        { error: "ID de solicitud requerido" },
        { status: 400 }
      );
    }

    // Verify the request belongs to the user
    const request = await prisma.userRequests.findFirst({
      where: {
        id: requestId,
        user_id: userId,
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    // Update the request status only (notes are stored in frontend for now)
    const updateData: any = {};
    if (status !== undefined) {
      updateData.status = status;
    }

    const updatedRequest = await prisma.userRequests.update({
      where: {
        id: requestId,
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      request: updatedRequest,
      // Return the progress note back (not stored in DB for now)
      progressNotes: progress,
    });
  } catch (error) {
    console.error("Error updating request progress:", error);
    return NextResponse.json(
      { error: "Error al actualizar el progreso" },
      { status: 500 }
    );
  }
}