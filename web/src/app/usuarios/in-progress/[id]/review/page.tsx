"use client";

import { useState } from "react";
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
  MessageSquare
} from "lucide-react";

export default function ServiceReviewPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data del servicio
  const service = {
    id: serviceId,
    title: "Cuidado Infantil",
    caregiver: {
      name: "Ana Rodríguez",
      avatar: "",
      rating: 5.0,
      totalReviews: 45,
    },
    startDate: "05/10/2025",
    endDate: "12/10/2025",
    totalDays: 7,
    totalCost: "₡294,000",
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }

    setIsSubmitting(true);

    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Aquí iría la lógica para enviar la reseña al backend
    console.log({
      serviceId,
      rating,
      review,
      wouldRecommend,
    });

    setIsSubmitting(false);
    
    // Redirigir al historial
    router.push("/usuarios/history");
  };

  const handleSkipReview = () => {
    router.push("/usuarios/in-progress");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/usuarios/in-progress")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Servicios en Proceso
          </Button>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">¡Servicio Completado!</h1>
              <p className="text-green-100 mt-1">
                Comparte tu experiencia con otros usuarios
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Summary */}
        <Card className="mb-6 border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Resumen del Servicio
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20">
                {service.caregiver.avatar && (
                  <AvatarImage src={service.caregiver.avatar} />
                )}
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xl">
                  {service.caregiver.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="text-muted-foreground">
                  Cuidador: {service.caregiver.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{service.caregiver.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({service.caregiver.totalReviews} reseñas)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Inicio</p>
                    <p className="font-semibold">{service.startDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fin</p>
                    <p className="font-semibold">{service.endDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Costo Total</p>
                    <p className="font-semibold text-green-600">{service.totalCost}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Califica el Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Star Rating */}
              <div>
                <Label className="text-base mb-3 block">
                  ¿Cómo calificarías tu experiencia? *
                </Label>
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
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-4 text-2xl font-bold text-yellow-600">
                      {rating}.0
                    </span>
                  )}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {rating === 5 && "¡Excelente! El servicio fue excepcional"}
                    {rating === 4 && "Muy bueno, una gran experiencia"}
                    {rating === 3 && "Bueno, cumplió las expectativas"}
                    {rating === 2 && "Regular, hubo algunos inconvenientes"}
                    {rating === 1 && "Necesita mejorar significativamente"}
                  </p>
                )}
              </div>

              <Separator />

              {/* Recommendation */}
              <div>
                <Label className="text-base mb-3 block">
                  ¿Recomendarías a este cuidador?
                </Label>
                <div className="flex gap-4">
                  <Button
                    variant={wouldRecommend === true ? "default" : "outline"}
                    className={
                      wouldRecommend === true
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-md"
                        : ""
                    }
                    onClick={() => setWouldRecommend(true)}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Sí, lo recomendaría
                  </Button>
                  <Button
                    variant={wouldRecommend === false ? "default" : "outline"}
                    className={
                      wouldRecommend === false
                        ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white"
                        : ""
                    }
                    onClick={() => setWouldRecommend(false)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    No lo recomendaría
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Written Review (Optional) */}
              <div>
                <Label htmlFor="review" className="text-base mb-3 block">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Escribe una reseña (Opcional)
                </Label>
                <Textarea
                  id="review"
                  placeholder="Comparte los detalles de tu experiencia, qué te gustó, qué podría mejorar, etc. Esto ayudará a otros usuarios a tomar mejores decisiones..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {review.length} caracteres {review.length >= 50 && "✓"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleSkipReview}
            disabled={isSubmitting}
          >
            Omitir Reseña
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-md"
            onClick={handleSubmitReview}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? (
              <>Enviando...</>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Enviar Reseña y Finalizar
              </>
            )}
          </Button>
        </div>

        {rating === 0 && (
          <p className="text-center text-sm text-red-500 mt-4">
            * La calificación es obligatoria para completar el servicio
          </p>
        )}
      </div>
    </div>
  );
}
