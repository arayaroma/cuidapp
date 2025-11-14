import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const { requestId, rating, comment, wouldRecommend } = await req.json();

    if (!requestId || !rating) {
      return NextResponse.json(
        { error: "ID de solicitud y calificación son requeridos" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La calificación debe estar entre 1 y 5" },
        { status: 400 }
      );
    }

    // Verify request exists and is completed
    const userRequest = await prisma.userRequests.findUnique({
      where: { id: requestId },
      include: {
        applications: {
          where: { status: 'ACCEPTED' },
          include: {
            user_assistant_application: {
              include: {
                user: { include: { assistant: true } }
              }
            }
          }
        }
      }
    });

    if (!userRequest || userRequest.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Solicitud no encontrada o no completada' }, { status: 404 });
    }

    let acceptedApplication: any = userRequest.applications[0];

    // Fallback: if not present in the include, try a direct query for the accepted application
    if (!acceptedApplication) {
      const fallback = await prisma.applicationRequest.findFirst({
        where: { user_request_id: requestId, status: 'ACCEPTED' },
        include: { user_assistant_application: { include: { user: { include: { assistant: true } } } } }
      });
      if (fallback) acceptedApplication = fallback as any;
    }

    // The include shape here uses a UsersAssistant record as `user` under user_assistant_application.
    // That record contains assistant_id (the User.id of the assistant). Extract it reliably.
    const usersAssistantRecord: any = acceptedApplication?.user_assistant_application?.user;
    const assistantUserId: string | null = usersAssistantRecord?.assistant_id || usersAssistantRecord?.assistant?.id || null;

    // Determine who is rating whom
    const raterId = userId;
    let ratedId: string | null = null;

    if (raterId === userRequest.user_id) {
      // The request owner (user) is rating the assistant
      ratedId = assistantUserId;
    } else if (assistantUserId && raterId === assistantUserId) {
      // The assistant (as user) is rating the request owner
      ratedId = userRequest.user_id;
    } else {
      // Helpful debug info for development: show why the rater is not authorized
      console.warn('Unauthorized rating attempt', { raterId, requestOwner: userRequest.user_id, assistantUserId, usersAssistantRecord });
      return NextResponse.json({ error: 'No autorizado para calificar esta solicitud' }, { status: 403 });
    }

    if (!ratedId) {
      return NextResponse.json({ error: 'No se pudo determinar a quién calificar' }, { status: 400 });
    }

    // Ensure the Prisma client includes the ServiceRating model
    if (typeof (prisma as any).serviceRating === 'undefined') {
      console.error('Prisma client does not expose serviceRating model. Did you run `npx prisma generate` and apply migrations?');
      return NextResponse.json({ error: 'Servicio no disponible en el servidor: modelo serviceRating ausente en Prisma Client. Ejecuta `npx prisma generate`, aplica la migración y reinicia el servidor.' }, { status: 500 });
    }

    // Check if rating already exists for this request and rater
    const existingRating = await (prisma as any).serviceRating.findFirst({
      where: { request_id: requestId, rater_id: raterId }
    });

    if (existingRating) {
      return NextResponse.json({ error: 'Ya has calificado este servicio' }, { status: 400 });
    }

    // Create rating
    const newRating = await (prisma as any).serviceRating.create({
      data: {
        request_id: requestId,
        rater_id: raterId,
        rated_id: ratedId,
        rating: rating,
        comment: comment || null,
        would_recommend: wouldRecommend === undefined ? null : Boolean(wouldRecommend),
      }
    });

    // Recalculate aggregate for rated entity: try Assistant (by user_id) first
    const assistantRecord = await prisma.assistant.findFirst({ where: { user_id: ratedId } });
  const ratingsForRated = await (prisma as any).serviceRating.findMany({ where: { rated_id: ratedId }, select: { rating: true } });
  const avg = ratingsForRated.length ? ratingsForRated.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / ratingsForRated.length : 0;

    if (assistantRecord) {
      await prisma.assistant.update({ where: { id: assistantRecord.id }, data: { rating: avg, rating_count: ratingsForRated.length } });
    } else {
      // Update User aggregate (if present)
      try {
        await prisma.user.update({ where: { id: ratedId }, data: { rating: avg } });
      } catch (e) {
        // ignore
      }
    }

    return NextResponse.json({ success: true, rating: newRating, message: 'Calificación enviada exitosamente' });
  } catch (error) {
    console.error("Error creating service rating:", error);
    return NextResponse.json(
      { error: "Error al crear la calificación" },
      { status: 500 }
    );
  }
}