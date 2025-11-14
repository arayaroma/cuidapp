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

    // Verify request exists and is available
    const userRequest = await prisma.userRequests.findFirst({
      where: {
        id: requestId,
        status: "NOT_STARTED",
      },
    });

    if (!userRequest) {
      return NextResponse.json(
        { error: "Request not found or not available" },
        { status: 404 }
      );
    }

    // Check if already applied - find UsersAssistant first
    const usersAssistantCheck = await prisma.usersAssistant.findFirst({
      where: {
        user_id: userRequest.user_id,
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

    if (usersAssistantCheck?.user_assistant_applications.some(app => app.requests.length > 0)) {
      return NextResponse.json(
        { error: "You have already applied to this request" },
        { status: 400 }
      );
    }

    // Create or get UsersAssistant relationship
    let usersAssistant = await prisma.usersAssistant.findFirst({
      where: {
        user_id: userRequest.user_id,
        assistant_id: userId,
      },
    });

    if (!usersAssistant) {
      usersAssistant = await prisma.usersAssistant.create({
        data: {
          user_id: userRequest.user_id,
          assistant_id: userId,
          start_date: new Date(),
        },
      });
    }

    // Create UserAssistantApplication
    const application = await prisma.userAssistantApplication.create({
      data: {
        user_assistant_id: usersAssistant.id,
        description: message || "Solicitud de trabajo",
        status: "PENDING",
      },
    });

    // Create ApplicationRequest
    await prisma.applicationRequest.create({
      data: {
        user_assistant_application_id: application.id,
        user_request_id: requestId,
        status: "PENDING",
        notes: message,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Error applying to request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
