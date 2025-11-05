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

    // Get accepted applications for this user
    const appointments = await prisma.usersAssistant.findMany({
      where: {
        user_id: userId,
        end_date: {
          gte: new Date(), // Only future appointments
        },
      },
      include: {
        assistant: {
          select: {
            id: true,
            full_name: true,
            photo_url: true,
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

    // Format appointments
    const formattedAppointments = appointments.map((appointment) => {
      const request = appointment.user_assistant_applications[0]?.requests[0]?.user_request;
      
      return {
        id: appointment.id,
        assistant: {
          id: appointment.assistant.id,
          name: appointment.assistant.full_name,
          avatar: appointment.assistant.photo_url,
        },
        date: appointment.start_date,
        endDate: appointment.end_date,
        service: request?.title || "Servicio de cuidado",
        description: request?.description,
        careType: request?.care_type,
        time: request?.request_time || "Por confirmar",
      };
    });

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Error al cargar las citas" },
      { status: 500 }
    );
  }
}
