import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.fullName || body.fullName.trim().length === 0) {
      return NextResponse.json(
        { error: "El nombre completo es requerido" },
        { status: 400 }
      );
    }

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        full_name: body.fullName.trim(),
        phone_number: body.phone?.trim() || null,
        emergency_number: body.emergencyPhone?.trim() || null,
        notes: body.notes?.trim() || null,
      },
    });

    // Update or create location if provided
    if (body.location && Object.values(body.location).some(v => v)) {
      await prisma.location.upsert({
        where: { user_id: userId },
        create: {
          user_id: userId,
          province: body.location.province?.trim() || null,
          canton: body.location.canton?.trim() || null,
          district: body.location.district?.trim() || null,
          address_line1: body.location.addressLine1?.trim() || null,
          is_primary: true,
        },
        update: {
          province: body.location.province?.trim() || null,
          canton: body.location.canton?.trim() || null,
          district: body.location.district?.trim() || null,
          address_line1: body.location.addressLine1?.trim() || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado exitosamente",
      user: {
        id: updatedUser.id,
        name: updatedUser.full_name,
        phone: updatedUser.phone_number,
        emergencyPhone: updatedUser.emergency_number,
        notes: updatedUser.notes,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil" },
      { status: 500 }
    );
  }
}
