import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserWithRelations, formatUserProfile, updateUserDisabilities } from "@/lib/prismaHelpers";
import { Session } from "next-auth";

// GET - Obtener perfil del usuario actual
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const user = await getUserWithRelations(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const profileData = formatUserProfile(user);

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Error al obtener el perfil" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar perfil del usuario
export async function PUT(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      fullName,
      phoneNumber,
      emergencyNumber,
      photoUrl,
      notes,
      hasSafeguard,
      disabilityId,
      disabilityIds, // Array de IDs de discapacidades
      location,
      assistant,
    } = body;

    // Actualizar usuario
    const updateData: Record<string, unknown> = {};
    if (fullName !== undefined) updateData.full_name = fullName;
    if (phoneNumber !== undefined) updateData.phone_number = phoneNumber;
    if (emergencyNumber !== undefined) updateData.emergency_number = emergencyNumber;
    if (photoUrl !== undefined) updateData.photo_url = photoUrl;
    if (notes !== undefined) updateData.notes = notes;
    if (hasSafeguard !== undefined) updateData.has_safeguard = hasSafeguard;
    if (disabilityId !== undefined) updateData.disability_id = disabilityId || null;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      include: {
        role: true,
        disability: true,
        location: true,
      },
    });

    // Actualizar múltiples discapacidades si se proporcionan
    if (disabilityIds !== undefined && Array.isArray(disabilityIds)) {
      await updateUserDisabilities(session.user.id, disabilityIds);
    }

    // Actualizar ubicación si se proporciona
    if (location) {
      const updateData: Record<string, unknown> = {};
      
      if (location.label !== undefined) updateData.label = location.label;
      if (location.addressLine1 !== undefined) updateData.address_line1 = location.addressLine1;
      if (location.addressLine2 !== undefined) updateData.address_line2 = location.addressLine2;
      if (location.district !== undefined) updateData.district = location.district;
      if (location.canton !== undefined) updateData.canton = location.canton;
      if (location.province !== undefined) updateData.province = location.province;
      if (location.country !== undefined) updateData.country = location.country;
      if (location.postalCode !== undefined) updateData.postal_code = location.postalCode;

      await prisma.location.upsert({
        where: { user_id: session.user.id },
        update: updateData,
        create: {
          user_id: session.user.id,
          label: location.label || null,
          address_line1: location.addressLine1 || null,
          address_line2: location.addressLine2 || null,
          district: location.district || null,
          canton: location.canton || null,
          province: location.province || null,
          country: location.country || null,
          postal_code: location.postalCode || null,
        },
      });
    }

    // Actualizar datos de asistente si se proporcionan y el usuario es asistente
    if (assistant && (updatedUser.role.code === "ASSISTANT" || updatedUser.role.code === "asistente")) {
      const updateData: Record<string, unknown> = {};
      
      if (assistant.bio !== undefined) updateData.bio = assistant.bio;
      if (assistant.yearsExperience !== undefined) updateData.years_experience = Number(assistant.yearsExperience);
      if (assistant.hourlyRate !== undefined) updateData.hourly_rate = Number(assistant.hourlyRate);
      if (assistant.specialties !== undefined) updateData.specialties = assistant.specialties;
      if (assistant.certifications !== undefined) updateData.certifications = assistant.certifications;
      if (assistant.languages !== undefined) updateData.languages = assistant.languages;
      if (assistant.availableWeekdays !== undefined) updateData.available_weekdays = assistant.availableWeekdays;

      await prisma.assistant.upsert({
        where: { user_id: session.user.id },
        update: updateData,
        create: {
          user_id: session.user.id,
          bio: assistant.bio || null,
          years_experience: assistant.yearsExperience ? Number(assistant.yearsExperience) : undefined,
          hourly_rate: assistant.hourlyRate ? Number(assistant.hourlyRate) : null,
          specialties: assistant.specialties || [],
          certifications: assistant.certifications || [],
          languages: assistant.languages || [],
          available_weekdays: assistant.availableWeekdays || [],
        },
      });
    }

    return NextResponse.json({ 
      message: "Perfil actualizado exitosamente",
      user: {
        id: updatedUser.id,
        fullName: updatedUser.full_name,
        email: updatedUser.email,
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil" },
      { status: 500 }
    );
  }
}
