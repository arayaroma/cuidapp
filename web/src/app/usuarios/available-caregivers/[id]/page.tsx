"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar,
  Award,
  CheckCircle2,
  MessageSquare,
  Heart
} from "lucide-react";

// Mock data de cuidador individual
const mockCaregiver = {
  id: "1",
  name: "María González",
  avatar: "",
  specialty: "Cuidado de Adultos Mayores",
  rating: 4.8,
  reviewCount: 24,
  experience: "5 años",
  location: "San José Centro",
  hourlyRate: "₡5,000",
  description: "Especialista en cuidado de adultos mayores con certificación en enfermería. Tengo amplia experiencia trabajando con personas mayores, brindando cuidados personalizados y atención médica básica.",
  availability: "Disponible",
  certifications: [
    "Certificación en Enfermería",
    "Primeros Auxilios",
    "Cuidado Geriátrico",
    "RCP Certificado"
  ],
  services: [
    "Acompañamiento diario",
    "Administración de medicamentos",
    "Asistencia en movilidad",
    "Cuidado personal",
    "Preparación de alimentos"
  ],
  reviews: [
    {
      id: "1",
      userName: "Ana Pérez",
      rating: 5,
      date: "Hace 2 semanas",
      comment: "Excelente profesional, muy cariñosa y responsable con mi madre. La recomiendo ampliamente."
    },
    {
      id: "2",
      userName: "Carlos Mora",
      rating: 5,
      date: "Hace 1 mes",
      comment: "María ha sido un ángel para nuestra familia. Muy profesional y atenta."
    },
    {
      id: "3",
      userName: "Laura Sánchez",
      rating: 4,
      date: "Hace 2 meses",
      comment: "Muy buena atención, puntual y dedicada. Mi padre está muy contento con su cuidado."
    }
  ]
};

export default function CaregiverProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const caregiver = mockCaregiver;

  const handleContact = () => {
    // Lógica para contactar
    console.log("Contactando cuidador");
  };

  const handleHire = () => {
    // Lógica para contratar
    console.log("Contratando cuidador");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/20 mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-24 h-24">
                      {caregiver.avatar && <AvatarImage src={caregiver.avatar} />}
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-2xl">
                        {caregiver.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h1 className="text-2xl font-bold">{caregiver.name}</h1>
                      <Badge className="bg-cyan-100 text-cyan-800">
                        {caregiver.specialty}
                      </Badge>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{caregiver.rating}</span>
                          <span className="text-muted-foreground">({caregiver.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Briefcase className="w-4 h-4" />
                          <span>{caregiver.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{caregiver.location}</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-cyan-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{caregiver.hourlyRate}/hora</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Sobre mí</h3>
                  <p className="text-muted-foreground">{caregiver.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-600" />
                  Certificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {caregiver.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Servicios que ofrezco</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {caregiver.services.map((service, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                      {service}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-600" />
                  Reseñas ({caregiver.reviewCount})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {caregiver.reviews.map((review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-200 text-xs">
                            {review.userName.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{review.userName}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    <Separator />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contactar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  onClick={handleHire}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Solicitar Servicio
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={handleContact}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disponibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-green-100 text-green-800">
                  {caregiver.availability}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Responde en menos de 2 horas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
