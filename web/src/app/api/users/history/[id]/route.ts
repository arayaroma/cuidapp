import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const requestId = params.id;

    // Get the specific completed request
    const request = await prisma.userRequests.findFirst({
      where: {
        id: requestId,
        user_id: userId,
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
                    assistant: true,
                  },
                },
              },
            },
          },
        },
        user: {
          include: {
            location: true,
          },
        },
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    const acceptedApplication = request.applications[0];
    const usersAssistant = acceptedApplication?.user_assistant_application?.user;
    const assistantUser = usersAssistant?.assistant;
    
    console.log("🔍 Debug Detail - UsersAssistant:", usersAssistant?.id);
    console.log("🔍 Debug Detail - Assistant ID in UsersAssistant:", usersAssistant?.assistant_id);
    
    // Get the actual assistant user from the assistant relation
    const assistantUserData = assistantUser ? await prisma.user.findUnique({
      where: { id: usersAssistant.assistant_id },
      include: { assistant: true },
    }) : null;
    
    console.log("🔍 Debug Detail - Assistant User Data:", assistantUserData?.full_name);
    console.log("🔍 Debug Detail - Assistant ID:", assistantUserData?.assistant?.id);

    const startDate = new Date(request.request_date);
    const endDate = new Date(request.updated_at);

    // Calculate duration
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = durationDays >= 30 
      ? `${Math.round(durationDays / 30)} mes${durationDays >= 60 ? 'es' : ''}`
      : `${durationDays} día${durationDays !== 1 ? 's' : ''}`;

    // Calculate total cost
    const hourlyRate = request.hourly_rate || 0;
    const totalHours = request.total_hours || durationDays * 8;
    const totalCost = hourlyRate * totalHours;

    const serviceDetail = {
      id: request.id,
      title: request.title,
      description: request.description || "Sin descripción disponible",
      category: request.care_type,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      hourlyRate: hourlyRate,
      totalHours: totalHours,
      totalCost: totalCost,
      status: request.status,
      caregiver: assistantUserData?.assistant ? {
        id: assistantUserData.assistant.id, // ← ID del Assistant, no del User
        name: assistantUserData.full_name,
        avatar: assistantUserData.photo_url,
        rating: assistantUserData.assistant.rating || 0,
        email: assistantUserData.email || "No disponible",
        phone: assistantUserData.phone_number || "No disponible",
      } : {
        id: "unknown",
        name: "Cuidador asignado",
        avatar: null,
        rating: 0,
        email: "No disponible",
        phone: "No disponible",
      },
      location: request.user?.location ? {
        province: request.user.location.province || "No especificada",
        canton: request.user.location.canton || "No especificado",
        district: request.user.location.district || "No especificado",
        address: request.user.location.address_line1 || "",
      } : {
        province: "No especificada",
        canton: "No especificado",
        district: "No especificado",
        address: "",
      },
    };

    return NextResponse.json(serviceDetail);
  } catch (error) {
    console.error("Error fetching service details:", error);
    return NextResponse.json(
      { error: "Error al obtener detalles del servicio" },
      { status: 500 }
    );
  }
}
