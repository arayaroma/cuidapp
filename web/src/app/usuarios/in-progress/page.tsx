"use client";

import { useState } from "react";
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
  MapPin, 
  Star,
  CheckCircle,
  MessageSquare
} from "lucide-react";

// Mock data para servicios en proceso
const mockInProgressServices = [
  {
    id: "serv-001",
    title: "Cuidado de Adulto Mayor",
    caregiver: {
      name: "María González",
      avatar: "",
      rating: 4.9,
    },
    category: "Adultos Mayores",
    status: "En Progreso",
    startDate: "01/10/2025",
    endDate: "31/10/2025",
    progress: 60,
    daysCompleted: 18,
    totalDays: 30,
    location: "San José, Costa Rica",
    nextSession: "12/10/2025 - 9:00 AM",
    hourlyRate: "₡8,500",
    canComplete: false,
  },
  {
    id: "serv-002",
    title: "Cuidado Infantil",
    caregiver: {
      name: "Ana Rodríguez",
      avatar: "",
      rating: 5.0,
    },
    category: "Niños",
    status: "En Progreso",
    startDate: "05/10/2025",
    endDate: "12/10/2025",
    progress: 85,
    daysCompleted: 6,
    totalDays: 7,
    location: "Heredia, Costa Rica",
    nextSession: "11/10/2025 - 2:00 PM",
    hourlyRate: "₡7,000",
    canComplete: true,
  },
  {
    id: "serv-003",
    title: "Cuidado Post-Operatorio",
    caregiver: {
      name: "Carmen Jiménez",
      avatar: "",
      rating: 4.8,
    },
    category: "Cuidado Especial",
    status: "En Progreso",
    startDate: "08/10/2025",
    endDate: "22/10/2025",
    progress: 20,
    daysCompleted: 3,
    totalDays: 14,
    location: "Alajuela, Costa Rica",
    nextSession: "11/10/2025 - 10:00 AM",
    hourlyRate: "₡10,000",
    canComplete: false,
  },
];

export default function InProgressServicesPage() {
  const router = useRouter();
  const [services] = useState(mockInProgressServices);

  const handleCompleteService = (serviceId: string) => {
    router.push(`/usuarios/in-progress/${serviceId}/review`);
  };

  const handleViewDetails = (serviceId: string) => {
    // Navegar a detalles del servicio
    console.log("Ver detalles:", serviceId);
  };

  const handleContactCaregiver = (caregiverId: string) => {
    // Abrir chat o contacto
    console.log("Contactar cuidador:", caregiverId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-cyan-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-8 px-4 shadow-lg">
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
          <p className="text-amber-100 mt-2">
            Gestiona y da seguimiento a tus servicios activos
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600">{services.length}</p>
                <p className="text-sm text-muted-foreground">Servicios Activos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {services.filter(s => s.canComplete).length}
                </p>
                <p className="text-sm text-muted-foreground">Listos para Completar</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <p className="text-3xl font-bold">4.9</p>
                </div>
                <p className="text-sm text-muted-foreground">Calificación Promedio</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        {services.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tienes servicios en progreso</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-16 h-16">
                        {service.caregiver.avatar && (
                          <AvatarImage src={service.caregiver.avatar} />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-lg">
                          {service.caregiver.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-xl">{service.title}</CardTitle>
                          <Badge className="bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 mr-1" />
                            {service.status}
                          </Badge>
                          {service.canComplete && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Listo para completar
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Cuidador: {service.caregiver.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">
                              {service.caregiver.rating}
                            </span>
                          </div>
                          <Badge className="bg-sky-100 text-sky-800">
                            {service.category}
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
                        <span className="text-muted-foreground">Progreso del servicio</span>
                        <span className="font-semibold text-amber-600">
                          {service.daysCompleted}/{service.totalDays} días ({service.progress}%)
                        </span>
                      </div>
                      <Progress value={service.progress} className="h-3" />
                    </div>

                    {/* Service Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-2">
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Inicio
                        </p>
                        <p className="font-semibold">{service.startDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Fin estimado
                        </p>
                        <p className="font-semibold">{service.endDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Próxima sesión
                        </p>
                        <p className="font-semibold">{service.nextSession}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Ubicación
                        </p>
                        <p className="font-semibold">{service.location}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewDetails(service.id)}
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleContactCaregiver(service.caregiver.name)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contactar
                      </Button>
                      {service.canComplete && (
                        <Button
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-md"
                          onClick={() => handleCompleteService(service.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completar Servicio
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
