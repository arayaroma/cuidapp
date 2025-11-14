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
    // debug: log requester id so we can verify session mapping during local dev
    console.debug("GET /api/assistants/profile requested by userId:", userId);

    const assistant = await prisma.assistant.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        user: {
          include: {
            location: true,
          },
        },
      },
    });

    if (!assistant) {
      // include userId in the response for easier local debugging
      return NextResponse.json({ error: "Assistant profile not found", userId }, { status: 404 });
    }

    // Get ratings count and average
    const ratings = await prisma.serviceRating.findMany({
      where: {
        rated_id: userId,
      },
      select: {
        rating: true,
      },
    });

    const ratingCount = ratings.length;
    const averageRating = ratingCount > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratingCount
      : 0;

    const profileData = {
      name: assistant.user.full_name,
      avatar: assistant.user.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase(),
      experience: `${assistant.years_experience || 0} años de experiencia`,
      rating: Math.round(averageRating * 10) / 10,
      reviews: ratingCount,
      hourlyRate: assistant.hourly_rate || 8500,
      location: assistant.user.location?.address_line1 || "Ubicación no especificada",
      specialties: assistant.specialties || [],
      available: assistant.is_available,
      bio: assistant.bio,
      certifications: assistant.certifications || [],
      languages: assistant.languages || [],
      availabilitySchedule: assistant.availability_schedule,
      availableWeekdays: assistant.available_weekdays || [],
      verified: assistant.verified,
      backgroundCheck: assistant.background_check,
      hasFirstAid: assistant.has_first_aid,
      hasVehicle: assistant.has_vehicle,
      preferredAgeGroups: assistant.preferred_age_groups || [],
      maxDistanceKm: assistant.max_distance_km,
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error fetching assistant profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}