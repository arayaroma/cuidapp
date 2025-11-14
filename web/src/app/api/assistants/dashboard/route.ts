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
    // Get available requests count (requests that are still open)
    const availableRequestsCount = await prisma.userRequests.count({
      where: {
        status: "NOT_STARTED",
      },
    });

    // Get pending offers count (applications made by this assistant that are pending)
    const pendingOffersCount = await prisma.applicationRequest.count({
      where: {
        status: "PENDING",
        user_assistant_application: {
          user: {
            assistant_id: userId,
          },
        },
      },
    });

    // Get in-progress jobs count (accepted applications where request is in progress)
    const inProgressCount = await prisma.applicationRequest.count({
      where: {
        status: "ACCEPTED",
        user_assistant_application: {
          user: {
            assistant_id: userId,
          },
        },
        user_request: {
          status: "IN_PROGRESS",
        },
      },
    });

    // Get accepted jobs count (accepted applications where request is not yet in progress or completed)
    const acceptedJobsCount = await prisma.applicationRequest.count({
      where: {
        status: "ACCEPTED",
        user_assistant_application: {
          user: {
            assistant_id: userId,
          },
        },
        user_request: {
          status: {
            notIn: ["IN_PROGRESS", "COMPLETED"],
          },
        },
      },
    });

    // Get completed jobs count (accepted applications where request is completed)
    const completedJobsCount = await prisma.applicationRequest.count({
      where: {
        status: "ACCEPTED",
        user_assistant_application: {
          user: {
            assistant_id: userId,
          },
        },
        user_request: {
          status: "COMPLETED",
        },
      },
    });

    return NextResponse.json({
      availableRequests: availableRequestsCount,
      pendingOffers: pendingOffersCount,
      inProgress: inProgressCount,
      acceptedJobs: acceptedJobsCount,
      completedJobs: completedJobsCount,
    });
  } catch (error) {
    console.error("Error fetching assistant dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}