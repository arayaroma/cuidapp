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
    // Get accepted applications where request is in progress
    // First get the user_assistant_applications for this assistant
    const userAssistantApps = await prisma.userAssistantApplication.findMany({
      where: {
        user: {
          assistant_id: userId,
        },
      },
      select: {
        id: true,
      },
    });

    const applicationIds = userAssistantApps.map(app => app.id);

    const applications = await prisma.applicationRequest.findMany({
      where: {
        status: "ACCEPTED",
        user_assistant_application_id: {
          in: applicationIds,
        },
        user_request: {
          status: "IN_PROGRESS",
        },
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
    });

    const inProgressJobs = await Promise.all(
      applications.map(async (app: any) => {
        const req = app.user_request;
        const lines = req.description.split("\n");
        const title = lines[0] || "Sin título";
        const description = lines[1] || "";
        const typeLine = lines[2] || "Tipo: elderly";
        const ageLine = lines[3] || "Edad: 0";
        const reqLine = lines[4] || "Requisitos: ";
        const urgLine = lines[5] || "Urgencia: medium";

        const careType =
          (typeLine.split(": ")[1] as
            | "children"
            | "elderly"
            | "disability"
            | "hospital") || "elderly";
        const personAge = parseInt(ageLine.split(": ")[1]) || 0;
        const requirements = reqLine.split(": ")[1]?.split(", ") || [];
        const urgency =
          (urgLine.split(": ")[1] as "low" | "medium" | "high") || "medium";
        const location = req.user.location?.address_line1 || "Sin ubicación";

        // Calculate progress based on dates
        const startDate = new Date(req.request_date);
        const now = new Date();
        const totalDays = req.total_hours ? Math.ceil(req.total_hours / 8) : 30; // Default 30 days if no total hours
        const daysElapsed = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const progress = Math.min(100, Math.round((daysElapsed / totalDays) * 100));

        // Calculate earnings
        const hourlyRate = req.hourly_rate || 8500; // Default rate
        const totalHours = req.total_hours || (totalDays * 8); // Default 8 hours per day
        const totalEarned = Math.round((hourlyRate * totalHours * progress) / 100);

        return {
          id: req.id,
          title,
          client: {
            name: req.user.full_name,
            avatar: "",
            phone: req.user.phone_number || "",
          },
          category: careType === "elderly" ? "Adultos Mayores" :
                   careType === "children" ? "Cuidado Infantil" :
                   careType === "disability" ? "Discapacidad" : "Hospitalario",
          status: "En Progreso",
          startDate: startDate.toLocaleDateString("es-ES"),
          endDate: new Date(startDate.getTime() + (totalDays * 24 * 60 * 60 * 1000)).toLocaleDateString("es-ES"),
          progress,
          daysCompleted: daysElapsed,
          totalDays,
          location,
          nextSession: "Próxima sesión programada",
          hourlyRate: `₡${hourlyRate.toLocaleString()}`,
          totalEarned: `₡${totalEarned.toLocaleString()}`,
          description,
          requirements,
          urgency,
        };
      })
    );

    return NextResponse.json(inProgressJobs);
  } catch (error) {
    console.error("Error fetching assistant in-progress jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { requestId, status } = body;

    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate status
    if (!["COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Verify the request belongs to this assistant's accepted jobs
    const userAssistantApps = await prisma.userAssistantApplication.findMany({
      where: {
        user: {
          assistant_id: userId,
        },
      },
      select: {
        id: true,
      },
    });

    const applicationIds = userAssistantApps.map(app => app.id);

    // Allow updating requests that are either IN_PROGRESS or still marked as ACCEPTED
    // (some flows may keep the request as ACCEPTED while work begins). This lets
    // assistants mark a job as COMPLETED even if the request record hasn't been
    // transitioned to IN_PROGRESS in the DB.
    const application = await prisma.applicationRequest.findFirst({
      where: {
        status: "ACCEPTED",
        user_assistant_application_id: {
          in: applicationIds,
        },
        user_request: {
          id: requestId,
          status: {
            in: ["IN_PROGRESS", "ACCEPTED"],
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Request not found or not authorized" },
        { status: 404 }
      );
    }

    // Update the request status
    await prisma.userRequests.update({
      where: { id: requestId },
      data: { status },
    });

    return NextResponse.json({
      message: "Request status updated successfully",
      status,
    });
  } catch (error) {
    console.error("Error updating assistant job status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}