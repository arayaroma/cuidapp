import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Find all completed jobs for this assistant
    const completedJobs = await prisma.applicationRequest.findMany({
      where: {
        status: "ACCEPTED",
        user_request: {
          status: "COMPLETED", // Only completed requests
        },
        user_assistant_application: {
          user: {
            assistant_id: userId,
          },
        },
      },
      include: {
        user_request: {
          include: {
            user: {
              include: {
                location: true,
                disability: true,
              },
            },
          },
        },
        user_assistant_application: {
          include: {
            user: {
              select: {
                user_id: true,
                start_date: true,
                end_date: true,
              },
            },
          },
        },
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    const formattedHistory = completedJobs.map((job: any) => {
      const req = job.user_request;
      const userAssistant = job.user_assistant_application.user;
      
      // Calculate duration
      const startDate = new Date(userAssistant.start_date);
      const endDate = userAssistant.end_date ? new Date(userAssistant.end_date) : new Date();
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const duration = durationDays >= 30 
        ? `${Math.round(durationDays / 30)} mes${durationDays >= 60 ? 'es' : ''}`
        : `${durationDays} día${durationDays !== 1 ? 's' : ''}`;

      // Calculate total cost
      const hourlyRate = req.hourly_rate || 0;
      const totalHours = req.total_hours || durationDays * 8;
      const totalCost = hourlyRate * totalHours;

      return {
        id: job.id,
        requestId: req.id,
        title: req.title,
        client: {
          id: req.user.id,
          name: req.user.full_name,
          avatar: req.user.photo_url,
          phone: req.user.phone_number,
          emergencyContact: req.user.emergency_number,
        },
        category: req.care_type,
        description: req.description,
        location: req.user.location?.address_line1 || "Sin ubicación",
        startDate: startDate,
        endDate: endDate,
        duration: duration,
        totalCost: totalCost,
        hourlyRate: hourlyRate,
        totalHours: totalHours,
        status: "Completado",
        personAge: req.person_age,
        requirements: req.requirements || [],
        urgency: req.urgency,
        isRecurring: req.is_recurring,
        weekdays: req.weekdays || [],
        myRating: 0, // TODO: Get from service_ratings table
        clientRating: 0, // TODO: Get from service_ratings table
        acceptedDate: job.created_at,
        completedDate: job.updated_at,
      };
    });

    return NextResponse.json(formattedHistory);
  } catch (error) {
    console.error("Error fetching assistant history:", error);
    return NextResponse.json(
      { error: "Error al cargar el historial" },
      { status: 500 }
    );
  }
}
