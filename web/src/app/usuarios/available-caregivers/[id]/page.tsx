"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Assistant } from "@/types/assistant";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Award,
  Calendar,
  ShieldCheck,
  Car,
  Heart,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export default function AssistantProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/assistants/${encodeURIComponent(id)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAssistant(data);
      })
      .catch((err) => {
        console.error("Failed to load assistant:", err);
        setError("No se pudo cargar el perfil. Intenta nuevamente más tarde.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                ID no encontrado en la URL.
              </p>
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Perfil no encontrado.
              </p>
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = assistant.name
    .split(" ")
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const specialtyColors: Record<string, string> = {
    elderly: "bg-blue-100 text-blue-800 border-blue-200",
    children: "bg-pink-100 text-pink-800 border-pink-200",
    disability: "bg-purple-100 text-purple-800 border-purple-200",
    hospital: "bg-green-100 text-green-800 border-green-200",
    companion: "bg-orange-100 text-orange-800 border-orange-200",
    "special-needs": "bg-indigo-100 text-indigo-800 border-indigo-200",
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la búsqueda
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                {/* Avatar and Name */}
                <div className="text-center">
                  <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white shadow-lg">
                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-sky-400 to-blue-600 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold mb-2">{assistant.name}</h1>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {assistant.verified ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-800 border-yellow-200"
                      >
                        No verificado
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Rating */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Calificación
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">
                        {(assistant.rating ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {renderStars(assistant.rating ?? 0)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({assistant.ratingCount ?? 0} reseñas)
                    </span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Hourly Rate */}
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Tarifa por hora
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-sky-600">
                      ${assistant.hourlyRate ?? "—"}
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
                  <Clock className="w-5 h-5 text-sky-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Experiencia</p>
                    <p className="font-semibold">
                      {assistant.yearsExperience ?? 0} años
                    </p>
                  </div>
                </div>

                {/* Special Features */}
                <div className="space-y-2 mb-6">
                  {assistant.backgroundCheck && (
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span>Verificación de antecedentes</span>
                    </div>
                  )}
                  {assistant.hasFirstAid && (
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-red-600" />
                      <span>Primeros auxilios</span>
                    </div>
                  )}
                  {assistant.hasVehicle && (
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4 text-blue-600" />
                      <span>Vehículo propio</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold mb-3">
                    Información de contacto
                  </h3>
                  {assistant.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={`mailto:${assistant.email}`}
                        className="text-sky-600 hover:underline"
                      >
                        {assistant.email}
                      </a>
                    </div>
                  )}
                  {assistant.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={`tel:${assistant.phone}`}
                        className="text-sky-600 hover:underline"
                      >
                        {assistant.phone}
                      </a>
                    </div>
                  )}
                  {assistant.maxDistanceKm && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>Hasta {assistant.maxDistanceKm} km</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* CTA Button */}
                <Button
                  className="w-full bg-sky-600 hover:bg-sky-700"
                  size="lg"
                >
                  Contactar ahora
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Tabs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(assistant.specialties) &&
                    assistant.specialties.length > 0 &&
                    assistant.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="outline"
                        className={`${
                          specialtyColors[specialty] ||
                          "bg-slate-100 text-slate-800"
                        } border`}
                      >
                        {specialty}
                      </Badge>
                    ))}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="about">Sobre mí</TabsTrigger>
                    <TabsTrigger value="skills">Habilidades</TabsTrigger>
                    <TabsTrigger value="availability">
                      Disponibilidad
                    </TabsTrigger>
                    <TabsTrigger value="reviews">Reseñas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-sky-600" />
                          Sobre {assistant.name.split(" ")[0]}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {assistant.bio ?? "Sin información adicional."}
                        </p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Años de experiencia
                          </p>
                          <p className="text-2xl font-bold text-sky-600">
                            {assistant.yearsExperience ?? "—"}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Estado
                          </p>
                          <p className="text-lg font-semibold">
                            {assistant.isAvailable ? (
                              <span className="text-green-600">Disponible</span>
                            ) : (
                              <span className="text-orange-600">
                                No disponible
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {assistant.preferredAgeGroups &&
                        assistant.preferredAgeGroups.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">
                              Grupos de edad preferidos
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {assistant.preferredAgeGroups.map((age) => (
                                <Badge key={age} variant="secondary">
                                  {age}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-sky-600" />
                          Idiomas
                        </h3>
                        {Array.isArray(assistant.languages) &&
                        assistant.languages.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {assistant.languages.map((lang) => (
                              <Badge key={lang} variant="outline">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            No especificados
                          </p>
                        )}
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-sky-600" />
                          Certificaciones
                        </h3>
                        {Array.isArray(assistant.certifications) &&
                        assistant.certifications.length > 0 ? (
                          <ul className="space-y-2">
                            {assistant.certifications.map((cert) => (
                              <li key={cert} className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{cert}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">
                            Sin certificaciones registradas
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="availability" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-sky-600" />
                          Días disponibles
                        </h3>
                        {Array.isArray(assistant.availableWeekdays) &&
                        assistant.availableWeekdays.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {[
                              { es: "Lunes", en: "monday" },
                              { es: "Martes", en: "tuesday" },
                              { es: "Miércoles", en: "wednesday" },
                              { es: "Jueves", en: "thursday" },
                              { es: "Viernes", en: "friday" },
                              { es: "Sábado", en: "saturday" },
                              { es: "Domingo", en: "sunday" },
                            ].map(({ es, en }) => {
                              const isAvailable =
                                assistant.availableWeekdays?.includes(
                                  en as any
                                );
                              return (
                                <div
                                  key={es}
                                  className={`p-3 rounded-lg text-center font-medium ${
                                    isAvailable
                                      ? "bg-green-100 text-green-800 border-2 border-green-200"
                                      : "bg-slate-100 text-slate-400"
                                  }`}
                                >
                                  {es}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            Disponibilidad no especificada
                          </p>
                        )}
                      </div>

                      {assistant.maxDistanceKm && (
                        <>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-sky-600" />
                              Área de servicio
                            </h3>
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <p className="text-lg">
                                Hasta{" "}
                                <span className="font-bold text-sky-600">
                                  {assistant.maxDistanceKm} km
                                </span>{" "}
                                de distancia
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6">
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Aún no hay reseñas públicas
                      </h3>
                      <p className="text-muted-foreground">
                        Este cuidador aún no ha recibido reseñas de usuarios.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
