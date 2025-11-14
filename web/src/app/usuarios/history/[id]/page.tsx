"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  CheckCircle2,
  Loader2,
  Phone,
  Mail
} from "lucide-react";
import { colors, careTypeColors } from "@/config/colors";

const getCareTypeInfo = (category: string) => {
  const careTypes = {
    elderly: { label: "Adultos Mayores", colors: careTypeColors.elderly },
    children: { label: "Niños", colors: careTypeColors.children },
    disability: { label: "Discapacidad", colors: careTypeColors.disability },
    hospital: { label: "Cuidado Hospitalario", colors: careTypeColors.hospital },
    companion: { label: "Acompañamiento", colors: careTypeColors.companion },
    "special-needs": { label: "Necesidades Especiales", colors: careTypeColors["special-needs"] },
  };
  return careTypes[category as keyof typeof careTypes] || careTypes.companion;
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  hourlyRate: number;
  totalHours: number;
  totalCost: number;
  status: string;
  caregiver: {
    id: string;
    name: string;
    avatar: string | null;
    rating: number;
    email: string;
    phone: string;
  };
  location: {
    province: string;
    canton: string;
    district: string;
    address: string;
  };
}

export default function HistoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;
  
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      fetch(`/api/users/history/${requestId}`)
        .then(res => res.json())
        .then(data => {
          setService(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching service details:", error);
          setIsLoading(false);
        });
    }
  }, [requestId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Servicio no encontrado</p>
          <Button 
            onClick={() => router.push("/usuarios/history")}
            className="mt-4 bg-sky-600 hover:bg-sky-700"
          >
            Volver al Historial
          </Button>
        </Card>
      </div>
    );
  }

  const categoryInfo = getCareTypeInfo(service.category);

  return (
    <div className="min-h-screen pb-10" style={{ background: colors.background.secondary }}>
      {/* Header */}
      <div className="text-white py-6 px-4 sm:py-8 shadow-lg" style={{ background: colors.gradients.primary }}>
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/usuarios/history")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Historial
          </Button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{service.title}</h1>
              <p className="mt-2" style={{ color: colors.accent[100] }}>
                Detalles del servicio completado
              </p>
            </div>
            <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 text-sm">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Completado
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Caregiver Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Información del Cuidador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                {service.caregiver.avatar && <AvatarImage src={service.caregiver.avatar} />}
                <AvatarFallback className="bg-sky-100 text-sky-700 text-xl">
                  {service.caregiver.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">{service.caregiver.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{service.caregiver.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">calificación</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{service.caregiver.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{service.caregiver.phone}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white"
                    onClick={() => router.push(`/usuarios/available-caregivers?assistantId=${service.caregiver.id}`)}
                  >
                    Contratar de Nuevo
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => router.push(`/usuarios/available-caregivers`)}
                  >
                    Ver Otros Cuidadores
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Detalles del Servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Badge */}
            <Badge 
              variant="outline"
              className="w-fit"
              style={{
                backgroundColor: categoryInfo.colors.bg,
                color: categoryInfo.colors.text,
                borderColor: categoryInfo.colors.border,
              }}
            >
              {categoryInfo.label}
            </Badge>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Descripción</h4>
              <p className="text-muted-foreground">{service.description}</p>
            </div>

            {/* Dates and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-sky-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Fecha de inicio</p>
                  <p className="text-sm text-muted-foreground">{formatDate(service.startDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-sky-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Fecha de finalización</p>
                  <p className="text-sm text-muted-foreground">{formatDate(service.endDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-sky-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Duración</p>
                  <p className="text-sm text-muted-foreground">{service.duration}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 pt-4 border-t">
              <MapPin className="w-5 h-5 text-sky-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Ubicación del servicio</p>
                <p className="text-sm text-muted-foreground">
                  {service.location.province}, {service.location.canton}, {service.location.district}
                </p>
                <p className="text-sm text-muted-foreground">{service.location.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Detalles de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tarifa por hora</p>
                  <p className="text-lg font-semibold">₡{service.hourlyRate.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de horas</p>
                  <p className="text-lg font-semibold">{service.totalHours} hrs</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Costo total</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₡{service.totalCost.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
