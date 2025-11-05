"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Star,
  CheckCircle,
  MessageSquare,
  Loader2
} from "lucide-react";
import { colors, careTypeColors } from "@/config/colors";

interface Service {
  id: string;
  title: string;
  caregiver: {
    id: string;
    name: string;
    avatar: string | null;
    rating: number;
  };
  category: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  progress: number;
  daysCompleted: number;
  totalDays: number;
  nextSession: string;
  hourlyRate: number;
  canComplete: boolean;
}

export default function InProgressServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/users/in-progress");
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handleCompleteService = (serviceId: string) => {
    router.push(`/usuarios/in-progress/${serviceId}/review`);
  };

  const handleViewDetails = (serviceId: string) => {
    console.log("Ver detalles:", serviceId);
  };

  const handleContactCaregiver = (caregiverId: string) => {
    console.log("Contactar cuidador:", caregiverId);
  };

  const getCareTypeInfo = (category: string) => {
    const categoryMap: Record<string, { label: string; colors: any }> = {
      elderly: { label: "Adultos Mayores", colors: careTypeColors.elderly },
      children: { label: "Niños", colors: careTypeColors.children },
      disability: { label: "Discapacidad", colors: careTypeColors.disability },
      hospital: { label: "Hospitalario", colors: careTypeColors.hospital },
      companion: { label: "Compañía", colors: careTypeColors.companion },
      "special-needs": { label: "Cuidado Especial", colors: careTypeColors["special-needs"] },
    };
    return categoryMap[category] || { label: category, colors: careTypeColors.companion };
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-CR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.secondary }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: colors.primary[500] }} />
          <p style={{ color: colors.neutral[600] }}>Cargando servicios...</p>
        </div>
      </div>
    );
  }

  const avgRating = services.length > 0 
    ? (services.reduce((sum, s) => sum + s.caregiver.rating, 0) / services.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen pb-10" style={{ background: colors.background.secondary }}>
      {/* Header */}
      <div className="text-white py-8 px-4 shadow-lg" style={{ background: colors.gradients.warm }}>
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/usuarios/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Servicios en Proceso</h1>
          <p className="mt-2" style={{ color: colors.accent[100] }}>
            Gestiona y da seguimiento a tus servicios activos
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: colors.accent[600] }}>
                  {services.length}
                </p>
                <p className="text-sm" style={{ color: colors.neutral[600] }}>
                  Servicios Activos
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: colors.success[600] }}>
                  {services.filter(s => s.canComplete).length}
                </p>
                <p className="text-sm" style={{ color: colors.neutral[600] }}>
                  Listos para Completar
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <p className="text-3xl font-bold">{avgRating}</p>
                </div>
                <p className="text-sm" style={{ color: colors.neutral[600] }}>
                  Calificación Promedio
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        {services.length === 0 ? (
          <Card className="p-12 text-center border-neutral-200 shadow-sm">
            <Clock className="w-16 h-16 mx-auto mb-4" style={{ color: colors.neutral[400] }} />
            <p style={{ color: colors.neutral[600] }}>No tienes servicios en progreso</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {services.map((service) => {
              const categoryInfo = getCareTypeInfo(service.category);
              
              return (
                <Card key={service.id} className="hover:shadow-xl transition-shadow border-neutral-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="w-16 h-16 border-4" style={{ borderColor: colors.accent[100] }}>
                          {service.caregiver.avatar && (
                            <AvatarImage src={service.caregiver.avatar} />
                          )}
                          <AvatarFallback 
                            className="text-white text-lg"
                            style={{ background: colors.gradients.warm }}
                          >
                            {service.caregiver.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-xl" style={{ color: colors.neutral[900] }}>
                              {service.title}
                            </CardTitle>
                            <Badge 
                              className="border"
                              style={{
                                backgroundColor: colors.warning[50],
                                color: colors.warning[700],
                                borderColor: colors.warning[200],
                              }}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {service.status}
                            </Badge>
                            {service.canComplete && (
                              <Badge 
                                className="border"
                                style={{
                                  backgroundColor: colors.success[50],
                                  color: colors.success[700],
                                  borderColor: colors.success[200],
                                }}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Listo para completar
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm" style={{ color: colors.neutral[600] }}>
                            Cuidador: {service.caregiver.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">
                                {service.caregiver.rating.toFixed(1)}
                              </span>
                            </div>
                            <Badge 
                              variant="outline"
                              style={{
                                backgroundColor: categoryInfo.colors.bg,
                                color: categoryInfo.colors.text,
                                borderColor: categoryInfo.colors.border,
                              }}
                            >
                              {categoryInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ color: colors.neutral[600] }}>Progreso del servicio</span>
                          <span className="font-semibold" style={{ color: colors.accent[600] }}>
                            {service.daysCompleted}/{service.totalDays} días ({service.progress}%)
                          </span>
                        </div>
                        <Progress value={service.progress} className="h-3" />
                      </div>

                      {/* Service Details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm pt-2">
                        <div>
                          <p className="flex items-center gap-1" style={{ color: colors.neutral[600] }}>
                            <Calendar className="w-4 h-4" />
                            Inicio
                          </p>
                          <p className="font-semibold" style={{ color: colors.neutral[900] }}>
                            {formatDate(service.startDate)}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1" style={{ color: colors.neutral[600] }}>
                            <Calendar className="w-4 h-4" />
                            Fin estimado
                          </p>
                          <p className="font-semibold" style={{ color: colors.neutral[900] }}>
                            {service.endDate ? formatDate(service.endDate) : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1" style={{ color: colors.neutral[600] }}>
                            <Clock className="w-4 h-4" />
                            Próxima sesión
                          </p>
                          <p className="font-semibold" style={{ color: colors.neutral[900] }}>
                            {service.nextSession}
                          </p>
                        </div>
                      </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-neutral-200">
                      <Button
                        variant="outline"
                        className="flex-1"
                        style={{
                          borderColor: colors.primary[300],
                          color: colors.primary[700],
                        }}
                        onClick={() => handleViewDetails(service.id)}
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        style={{
                          borderColor: colors.secondary[300],
                          color: colors.secondary[700],
                        }}
                        onClick={() => handleContactCaregiver(service.caregiver.id)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contactar
                      </Button>
                      {service.canComplete && (
                        <Button
                          className="flex-1 text-white font-semibold shadow-md"
                          style={{ background: colors.gradients.secondary }}
                          onClick={() => handleCompleteService(service.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
