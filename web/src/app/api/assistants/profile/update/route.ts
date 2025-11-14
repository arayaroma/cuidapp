import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();

    // Basic validation (name is required)
    if (!body.fullName || body.fullName.trim().length === 0) {
      return NextResponse.json({ error: "El nombre completo es requerido" }, { status: 400 });
    }

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        full_name: body.fullName.trim(),
        phone_number: body.phone?.trim() || null,
      },
    });

    // Update or create location if provided
    if (body.location && Object.values(body.location).some((v: any) => v)) {
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

    // Prepare assistant payload
    const assistantData: any = {};
    if (typeof body.bio === "string") assistantData.bio = body.bio;
    if (typeof body.hourlyRate !== "undefined") assistantData.hourly_rate = Number(body.hourlyRate) || null;
    if (typeof body.available !== "undefined") assistantData.is_available = Boolean(body.available);
    if (typeof body.yearsExperience !== "undefined") assistantData.years_experience = parseInt(String(body.yearsExperience)) || 0;
    // specialties and services -> merge and dedupe
    const incomingSpecialties = Array.isArray(body.specialties) ? body.specialties : [];
    const incomingServices = Array.isArray(body.services) ? body.services : [];
    const merged = Array.from(new Set([...incomingSpecialties, ...incomingServices])).map((s) => String(s));
    assistantData.specialties = merged;
    if (Array.isArray(body.certifications)) assistantData.certifications = body.certifications.map((c: any) => String(c.title ?? c));
    if (Array.isArray(body.languages)) assistantData.languages = body.languages.map((l: any) => String(l));
    if (body.availabilitySchedule) assistantData.availability_schedule = body.availabilitySchedule;
    if (Array.isArray(body.availableWeekdays)) assistantData.available_weekdays = body.availableWeekdays;
    if (Array.isArray(body.preferredAgeGroups)) assistantData.preferred_age_groups = body.preferredAgeGroups;
    if (typeof body.maxDistanceKm !== "undefined") assistantData.max_distance_km = Number(body.maxDistanceKm) || null;
    if (typeof body.hasVehicle !== "undefined") assistantData.has_vehicle = Boolean(body.hasVehicle);
    if (typeof body.hasFirstAid !== "undefined") assistantData.has_first_aid = Boolean(body.hasFirstAid);

    // Upsert assistant record by user_id
    const existing = await prisma.assistant.findUnique({ where: { user_id: userId } });

    let assistantRecord;
    if (existing) {
      assistantRecord = await prisma.assistant.update({
        where: { user_id: userId },
        data: assistantData,
      });
    } else {
      assistantRecord = await prisma.assistant.create({
        data: {
          user_id: userId,
          ...assistantData,
        },
      });
    }

    return NextResponse.json({ success: true, assistant: assistantRecord, user: { id: updatedUser.id, name: updatedUser.full_name } });
  } catch (error) {
    console.error("Error updating assistant profile:", error);
    return NextResponse.json({ error: "Error al actualizar el perfil del asistente" }, { status: 500 });
  }
}
