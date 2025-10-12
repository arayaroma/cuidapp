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
  MessageSquare
} from "lucide-react";

// Mock data para servicios en proceso (desde la perspectiva del asistente)
const mockInProgressJobs = [
  {
    id: "job-001",
    title: "Cuidado de Adulto Mayor",
    client: {
      name: "Carlos Méndez",
      avatar: "",
      phone: "+506 8888-9999",
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
    totalEarned: "₡1,224,000",
  },
  {
    id: "job-002",
    title: "Cuidado Post-Operatorio",
    client: {
      name: "Laura Vargas",
      avatar: "",
      phone: "+506 7777-6666",
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
    totalEarned: "₡240,000",
  },
];

export default function AssistantInProgressPage() {
  const router = useRouter();
  const [jobs] = useState(mockInProgressJobs);

  const handleViewDetails = (jobId: string) => {
    console.log("Ver detalles:", jobId);
  };

  const handleContactClient = (clientId: string) => {
    console.log("Contactar cliente:", clientId);
  };

  const totalEarned = jobs.reduce((sum, job) => {
    const amount = parseInt(job.totalEarned.replace(/[₡,]/g, ""));
    return sum + amount;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-cyan-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/asistentes/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Trabajos en Proceso</h1>
          <p className="text-amber-100 mt-2">
            Gestiona tus trabajos activos y próximas sesiones
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
                <p className="text-3xl font-bold text-amber-600">{jobs.length}</p>
                <p className="text-sm text-muted-foreground">Trabajos Activos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  ₡{totalEarned.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Ganado (Mes Actual)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {jobs.reduce((sum, j) => sum + j.totalDays - j.daysCompleted, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Días Restantes (Total)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tienes trabajos en progreso</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-16 h-16">
                        {job.client.avatar && (
                          <AvatarImage src={job.client.avatar} />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-lg">
                          {job.client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <Badge className="bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 mr-1" />
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Cliente: {job.client.name}
                        </p>
                        <Badge className="bg-sky-100 text-sky-800">
                          {job.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Ganancia total</p>
                      <p className="text-2xl font-bold text-green-600">{job.totalEarned}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso del trabajo</span>
                        <span className="font-semibold text-amber-600">
                          {job.daysCompleted}/{job.totalDays} días ({job.progress}%)
                        </span>
                      </div>
                      <Progress value={job.progress} className="h-3" />
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-2">
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Inicio
                        </p>
                        <p className="font-semibold">{job.startDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Fin estimado
                        </p>
                        <p className="font-semibold">{job.endDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Próxima sesión
                        </p>
                        <p className="font-semibold">{job.nextSession}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Ubicación
                        </p>
                        <p className="font-semibold">{job.location}</p>
                      </div>
                    </div>

                    {/* Earnings */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Tarifa por hora</p>
                          <p className="text-lg font-bold text-green-700">{job.hourlyRate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total ganado hasta ahora</p>
                          <p className="text-lg font-bold text-green-700">{job.totalEarned}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewDetails(job.id)}
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-md"
                        onClick={() => handleContactClient(job.client.name)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contactar Cliente
                      </Button>
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
