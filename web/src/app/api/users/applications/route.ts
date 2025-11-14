import { NextRequest, NextResponse } from "next/server";
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
    // Get user's requests
    const userRequests = await prisma.userRequests.findMany({
      where: {
        user_id: userId,
        status: "NOT_STARTED",
      },
    });

    const requestIds = userRequests.map(r => r.id);

    // Get pending applications for these requests
    const applications = await prisma.applicationRequest.findMany({
      where: {
        user_request_id: { in: requestIds },
        status: "PENDING",
      },
      include: {
        user_request: true,
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
      orderBy: {
        created_at: "desc",
      },
    });

    // Format applications
    const formattedApplications = await Promise.all(applications.map(async (app: any) => {
      const usersAssistant = app.user_assistant_application.user;
      const assistantProfile = usersAssistant.assistant;
      const request = app.user_request;
      
      console.log("Debug - usersAssistant:", usersAssistant);
      console.log("Debug - assistantProfile:", assistantProfile);
      
      // Get the full User record for the assistant
      const assistantUserData = await prisma.user.findUnique({
        where: { id: usersAssistant.assistant_id },
      });

      return {
        id: app.id,
        requestId: request.id,
        requestTitle: request.title,
        assistant: {
          id: assistantProfile?.id || usersAssistant.assistant_id,
          name: assistantUserData?.full_name || "Sin nombre",
          avatar: assistantUserData?.photo_url || null,
          rating: assistantProfile?.rating || 0,
          ratingCount: assistantProfile?.rating_count || 0,
          bio: assistantProfile?.bio || null,
          specialties: assistantProfile?.specialties || [],
          yearsExperience: assistantProfile?.years_experience || 0,
          certifications: assistantProfile?.certifications || [],
          languages: assistantProfile?.languages || [],
          hourlyRate: assistantProfile?.hourly_rate || null,
        },
        message: app.notes,
        appliedAt: app.created_at,
        status: app.status,
      };
    }));

    return NextResponse.json(formattedApplications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { applicationId, action } = await request.json();

    if (!applicationId || !action) {
      return NextResponse.json(
        { error: "Application ID and action are required" },
        { status: 400 }
      );
    }

    if (!["ACCEPT", "REJECT"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be ACCEPT or REJECT" },
        { status: 400 }
      );
    }

    // Find the application and verify ownership
    const application = await prisma.applicationRequest.findFirst({
      where: {
        id: applicationId,
        user_request: {
          user_id: userId,
          status: "NOT_STARTED", // Only allow actions on pending requests
        },
        status: "PENDING",
      },
      include: {
        user_request: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or not authorized" },
        { status: 404 }
      );
    }

    const newStatus = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";

    // Update application status
    await prisma.applicationRequest.update({
      where: {
        id: applicationId,
      },
      data: {
        status: newStatus,
      },
    });

    // If accepting, update request status to IN_PROGRESS and reject all other applications
    if (action === "ACCEPT") {
      // Update request status
      await prisma.userRequests.update({
        where: {
          id: application.user_request.id,
        },
        data: {
          status: "IN_PROGRESS",
        },
      });

      // Reject all other pending applications for this request
      await prisma.applicationRequest.updateMany({
        where: {
          user_request_id: application.user_request.id,
          status: "PENDING",
          id: {
            not: applicationId,
          },
        },
        data: {
          status: "REJECTED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Application ${newStatus.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}