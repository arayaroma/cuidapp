import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { requestId, message } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    // Verify the user is an assistant
    const assistant = await prisma.assistant.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!assistant) {
      return NextResponse.json(
        { error: "User is not an assistant" },
        { status: 403 }
      );
    }

    // Check if the request exists and is available
    const userRequest = await prisma.userRequests.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!userRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    if (userRequest.status !== "NOT_STARTED") {
      return NextResponse.json(
        { error: "Request is no longer available" },
        { status: 400 }
      );
    }

    // Check if assistant already applied - find UserAssistantApplication for this assistant first
    const usersAssistantForCheck = await prisma.usersAssistant.findFirst({
      where: {
        assistant_id: userId,
      },
      include: {
        user_assistant_applications: {
          include: {
            requests: {
              where: {
                user_request_id: requestId,
              },
            },
          },
        },
      },
    });

    const alreadyApplied = usersAssistantForCheck?.user_assistant_applications.some(
      app => app.requests.length > 0
    );

    if (alreadyApplied) {
      return NextResponse.json(
        { error: "You have already applied to this request" },
        { status: 400 }
      );
    }

    // Get or create UsersAssistant record
    let usersAssistant = await prisma.usersAssistant.findFirst({
      where: {
        assistant_id: userId,
      },
    });

    if (!usersAssistant) {
      // Create a new UsersAssistant record
      usersAssistant = await prisma.usersAssistant.create({
        data: {
          user_id: userId, // The user who is the assistant
          assistant_id: userId, // The assistant user
          start_date: new Date(),
        },
      });
    }

    // Get or create UserAssistantApplication
    let userAssistantApp = await prisma.userAssistantApplication.findFirst({
      where: {
        user_assistant_id: usersAssistant.id,
      },
    });

    if (!userAssistantApp) {
      // Create a new UserAssistantApplication
      userAssistantApp = await prisma.userAssistantApplication.create({
        data: {
          user_assistant_id: usersAssistant.id,
          description: "Application profile",
          status: "ACTIVE", // or whatever default status makes sense
        },
      });
    }

    // Create the application request
    const application = await prisma.applicationRequest.create({
      data: {
        user_assistant_application_id: userAssistantApp.id,
        user_request_id: requestId,
        status: "PENDING",
        notes: message || null,
      },
    });

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        status: application.status,
        createdAt: application.created_at,
      },
    });
  } catch (error) {
    console.error("Error applying to request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}