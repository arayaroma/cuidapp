"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Star,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";
import Swal from 'sweetalert2'

export default function AssistantReviewPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data; the real flow could fetch the job details server-side if desired
  const [job, setJob] = useState<any | null>(null);

  // Fetch real job/request data (useEffect, not useState)
  useEffect(() => {
    if (!serviceId) return;
    const controller = new AbortController();

    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/requests/${serviceId}`, { signal: controller.signal });
        if (!res.ok) {
          console.error("Error fetching job details", res.statusText);
          return;
        }
        const data = await res.json();
        if (!controller.signal.aborted) {
          setJob({
            id: data.id,
            title: data.title,
            client: {
              id: data.createdById,
              name: data.createdBy,
              avatar: data.createdByAvatar,
              rating: data.createdByRating || 0,
              totalReviews: data.createdByRatingCount || 0,
            },
          });
        }
      } catch (e: any) {
        if (e.name === "AbortError") return;
        console.error("Error fetching job details", e);
      }
    };

    fetchJob();
    return () => controller.abort();
  }, [serviceId]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Swal.fire({ icon: 'warning', title: 'Calificación requerida', text: 'Por favor selecciona una calificación', confirmButtonText: 'OK' })
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/service-ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: serviceId,
          rating: rating,
          comment: review.trim() || null,
          wouldRecommend: wouldRecommend,
        }),
      });

      if (response.ok) {
        router.push("/asistentes/in-progress");
      } else {
        console.error("Error submitting review");
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al enviar la reseña. Inténtalo de nuevo.' })
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al enviar la reseña. Inténtalo de nuevo.' })
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipReview = () => {
    router.push("/asistentes/in-progress");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pb-10">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/asistentes/in-progress")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Trabajos en Proceso
          </Button>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">Trabajo Finalizado</h1>
              <p className="text-blue-100 mt-1">Califica al cliente por este servicio</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6 border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Resumen del Trabajo
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20">
                {job?.client?.avatar && <AvatarImage src={job.client.avatar} />}
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl">
                  {job?.client?.name
                    ? job.client.name.split(" ").map((n: string) => n[0]).join("")
                    : "C"
                  }
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{job?.title || 'Servicio'}</h3>
                <p className="text-muted-foreground">Cliente: {job?.client?.name || 'Cliente'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{job?.client?.rating?.toFixed ? job.client.rating.toFixed(1) : job?.client?.rating || '0.0'}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({job?.client?.totalReviews || 0} reseñas)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Califica al Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label className="text-base mb-3 block">¿Cómo calificarías tu experiencia? *</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`w-12 h-12 ${
                          star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-4 text-2xl font-bold text-yellow-600">{rating}.0</span>
                  )}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {rating === 5 && "Excelente cliente"}
                    {rating === 4 && "Muy buena experiencia"}
                    {rating === 3 && "Cumplió expectativas"}
                    {rating === 2 && "Algunos inconvenientes"}
                    {rating === 1 && "Necesita mejorar"}
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <Label className="text-base mb-3 block">¿Recomendarías a este cliente?</Label>
                <div className="flex gap-4">
                  <Button
                    variant={wouldRecommend === true ? "default" : "outline"}
                    className={wouldRecommend === true ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" : ""}
                    onClick={() => setWouldRecommend(true)}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" /> Sí, lo recomendaría
                  </Button>
                  <Button
                    variant={wouldRecommend === false ? "default" : "outline"}
                    className={wouldRecommend === false ? "bg-gradient-to-r from-red-500 to-rose-500 text-white" : ""}
                    onClick={() => setWouldRecommend(false)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" /> No lo recomendaría
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="review" className="text-base mb-3 block">
                  <MessageSquare className="w-4 h-4 inline mr-2" />Escribe una reseña (Opcional)
                </Label>
                <Textarea
                  id="review"
                  placeholder="Comparte detalles sobre la experiencia con el cliente..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground mt-2">{review.length} caracteres</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={handleSkipReview} disabled={isSubmitting}>
            Omitir Reseña
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold"
            onClick={handleSubmitReview}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? 'Enviando...' : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" /> Enviar Reseña y Finalizar
              </>
            )}
          </Button>
        </div>

        {rating === 0 && (
          <p className="text-center text-sm text-red-500 mt-4">* La calificación es obligatoria para completar el flujo</p>
        )}
      </div>
    </div>
  );
}
