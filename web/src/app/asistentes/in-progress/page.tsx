"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { colors } from "@/config/colors";
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
  MessageSquare,
  CheckCircle,
  XCircle
} from "lucide-react";

interface InProgressJob {
  id: string;
  title: string;
  client: {
    name: string;
    avatar: string;
    phone: string;
  };
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
  daysCompleted: number;
  totalDays: number;
  location: string;
  nextSession: string;
  hourlyRate: string;
  totalEarned: string;
  description: string;
  requirements: string[];
  urgency: string;
}

export default function AssistantInProgressPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<InProgressJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInProgressJobs = async () => {
      try {
        const response = await fetch("/api/assistants/in-progress");
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Error fetching in-progress jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressJobs();
  }, []);

  const handleViewDetails = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      Swal.fire({
        title: '📋 Detalles del Trabajo',
        html: `
          <div style="text-align: left; padding: 10px;">
            <p><strong>Título:</strong> ${job.title}</p>
            <p><strong>Cliente:</strong> ${job.client.name}</p>
            <p><strong>Progreso:</strong> ${job.progress}%</p>
            <p><strong>Ubicación:</strong> ${job.location}</p>
            <p><strong>Próxima sesión:</strong> ${job.nextSession}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonColor: '#f59e0b',
      });
    }
  };

  const handleContactClient = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      Swal.fire({
        title: `📞 Contactar a ${job.client.name}`,
        text: '¿Deseas contactar al cliente?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Contactar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f59e0b',
      });
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const result = await Swal.fire({
      title: '¿Finalizar trabajo?',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p>¿Estás seguro de que deseas marcar este trabajo como completado?</p>
          <br/>
          <p><strong>Trabajo:</strong> ${job.title}</p>
          <p><strong>Cliente:</strong> ${job.client.name}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/assistants/in-progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId: jobId, status: "COMPLETED" }),
        });

        if (response.ok) {
          // Redirect assistant to review page to rate the client
          router.push(`/asistentes/in-progress/${jobId}/review`);
        } else {
          throw new Error('Error al finalizar');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo finalizar el trabajo.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      }
    }
  };

  const handleCancelJob = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const result = await Swal.fire({
      title: '¿Cancelar trabajo?',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p>¿Estás seguro de que deseas cancelar este trabajo?</p>
          <br/>
          <p><strong>Trabajo:</strong> ${job.title}</p>
          <p style="color: #ef4444; font-size: 14px;">⚠️ Esta acción no se puede deshacer.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/assistants/in-progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId: jobId, status: "CANCELLED" }),
        });

        if (response.ok) {
          setJobs(prev => prev.filter(j => j.id !== jobId));
          Swal.fire({
            title: 'Trabajo cancelado',
            text: 'El trabajo ha sido cancelado.',
            icon: 'info',
            confirmButtonColor: '#f59e0b',
          });
        } else {
          throw new Error('Error al cancelar');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cancelar el trabajo.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      }
    }
  };

  const totalEarned = jobs.reduce((sum, job) => {
    const amount = parseInt(job.totalEarned.replace(/[₡,]/g, ""));
    return sum + amount;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen pb-10" style={{ background: colors.background.secondary }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary[500] }}></div>
            <p className="mt-4 text-gray-600">Cargando trabajos en progreso...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: colors.background.secondary }}>
      {/* Header */}
      <div className="text-white py-6 sm:py-8 px-4 shadow-lg" style={{ background: colors.gradients.primary }}>
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 mb-3 sm:mb-4 h-9"
            onClick={() => router.push("/asistentes/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Trabajos en Proceso</h1>
          <p className="mt-2 text-sm sm:text-base" style={{ color: colors.accent[100] }}>
            Gestiona tus trabajos activos y próximas sesiones
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Summary */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 mb-6 sm:mb-8">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-amber-600">{jobs.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Trabajos Activos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  ₡{totalEarned.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Ganado (Mes Actual)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                  {jobs.reduce((sum, j) => sum + j.totalDays - j.daysCompleted, 0)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Días Restantes (Total)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <Card className="p-6 sm:p-8 text-center">
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">No tienes trabajos en progreso</p>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-xl transition-shadow">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                      <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                        {job.client.avatar && (
                          <AvatarImage src={job.client.avatar} />
                        )}
                        <AvatarFallback className="text-white text-base sm:text-lg" style={{ background: colors.gradients.primary }}>
                          {job.client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-base sm:text-xl line-clamp-2">{job.title}</CardTitle>
                          <Badge className="bg-amber-100 text-amber-800 text-xs whitespace-nowrap">
                            <Clock className="w-3 h-3 mr-1" />
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Cliente: {job.client.name}
                        </p>
                        <Badge className="bg-sky-100 text-sky-800 text-xs">
                          {job.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <p className="text-xs sm:text-sm text-muted-foreground">Ganancia total</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">{job.totalEarned}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Progreso del trabajo</span>
                        <span className="font-semibold text-amber-600">
                          {job.daysCompleted}/{job.totalDays} días ({job.progress}%)
                        </span>
                      </div>
                      <Progress value={job.progress} className="h-2 sm:h-3" />
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm pt-2">
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
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Tarifa por hora</p>
                          <p className="text-base sm:text-lg font-bold text-green-700">{job.hourlyRate}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs sm:text-sm text-muted-foreground">Total ganado hasta ahora</p>
                          <p className="text-base sm:text-lg font-bold text-green-700">{job.totalEarned}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-9"
                          onClick={() => handleViewDetails(job.id)}
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 h-9 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-md"
                          onClick={() => handleContactClient(job.client.name)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contactar Cliente
                        </Button>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-9 border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => handleCompleteJob(job.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Finalizar Trabajo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-9 border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleCancelJob(job.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancelar Trabajo
                        </Button>
                      </div>
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
