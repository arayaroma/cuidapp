import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MyRequest } from "@/types/request";

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // First, find all UsersAssistant records where this user is the assistant
    const usersAssistants = await prisma.usersAssistant.findMany({
      where: {
        assistant_id: userId,
      },
      include: {
        user_assistant_applications: {
          include: {
            requests: {
              where: {
                status: "ACCEPTED",
              },
              include: {
                user_request: {
                  include: {
                    user: {
                      include: {
                        location: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Flatten the applications
    const applications = usersAssistants.flatMap(ua => 
      ua.user_assistant_applications.flatMap(uaa => uaa.requests)
    );

    const myRequests: MyRequest[] = applications.map((app: any) => {
      const req = app.user_request;

      return {
        id: req.id,
        title: req.title,
        careType: req.care_type,
        personAge: req.person_age,
        description: req.description,
        location: req.user.location?.address_line1 || "Sin ubicación",
        startDate: req.request_date,
        isRecurring: req.is_recurring,
        schedule: req.request_time,
        hourlyRate: req.hourly_rate || 0,
        totalHours: req.total_hours || 0,
        requirements: req.requirements || [],
        urgency: req.urgency,
        createdBy: req.user.full_name,
        applicants: 0,
        status: "IN_PROGRESS" as any,
        clientName: req.user.full_name,
        clientAvatar: req.user.full_name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase(),
        appliedDate: app.created_at,
        acceptedDate: app.updated_at,
      };
    });

    return NextResponse.json(myRequests);
  } catch (error) {
    console.error("Error fetching accepted jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
