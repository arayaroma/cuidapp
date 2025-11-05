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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        location: true,
        disability: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Format the response
    const profileData = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      phone: user.phone_number || null,
      emergencyContact: user.emergency_number || null,
      photoUrl: user.photo_url || null,
      location: user.location ? {
        province: user.location.province,
        canton: user.location.canton,
        district: user.location.district,
        fullAddress: [
          user.location.district,
          user.location.canton,
          user.location.province,
        ].filter(Boolean).join(", "),
      } : null,
      disability: user.disability ? {
        id: user.disability.id,
        name: user.disability.name,
        description: user.disability.description,
      } : null,
      hasSafeguard: user.has_safeguard,
      notes: user.notes,
      memberSince: user.created_at,
      verified: user.is_active,
      role: user.role.code,
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Error al cargar el perfil" },
      { status: 500 }
    );
  }
}
