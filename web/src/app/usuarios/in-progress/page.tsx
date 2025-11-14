"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
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
  Loader2,
  Edit3,
  Save,
  X
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
  progressNotes?: string;
}

export default function InProgressServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProgress, setEditingProgress] = useState<string | null>(null);
  const [progressText, setProgressText] = useState("");
  const [updatingProgress, setUpdatingProgress] = useState(false);

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

  const handleCompleteService = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    // If service is not yet ready to complete, show stronger confirmation
    const earlyFinish = !service.canComplete;

    const result = await Swal.fire({
      title: earlyFinish ? '¿Finalizar servicio antes de tiempo?' : '¿Finalizar servicio?',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p>${earlyFinish ? 'Estás a punto de marcar el servicio como completado antes de su finalización estimada.' : '¿Estás seguro de que deseas finalizar el servicio?'} </p>
          <br/>
          <p><strong>Servicio:</strong> ${service.title}</p>
          <p><strong>Cuidador:</strong> ${service.caregiver.name}</p>
          <br/>
          <p style="color: #6b7280; font-size: 14px;">
            Esta acción marcará el servicio como completado y lo removerá de la lista de servicios en progreso.
          </p>
        </div>
      `,
      icon: earlyFinish ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/users/in-progress", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId: serviceId,
            status: "COMPLETED",
          }),
        });

        if (response.ok) {
          // Redirect to review page so user can rate the assistant
          router.push(`/usuarios/in-progress/${serviceId}/review`);
        } else {
          throw new Error('Error al finalizar servicio');
        }
      } catch (error) {
        console.error("Error completing service:", error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo finalizar el servicio. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      }
    }
  };

  const handleCancelService = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const result = await Swal.fire({
      title: '¿Cancelar servicio?',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p>¿Estás seguro de que deseas cancelar este servicio?</p>
          <br/>
          <p><strong>Servicio:</strong> ${service.title}</p>
          <p><strong>Cuidador:</strong> ${service.caregiver.name}</p>
          <br/>
          <p style="color: #6b7280; font-size: 14px;">
            Esta acción marcará el servicio como cancelado y notificará al cuidador.
          </p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Mantener',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/users/in-progress", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId: serviceId,
            status: "CANCELLED",
          }),
        });

        if (response.ok) {
          setServices(prev => prev.filter(s => s.id !== serviceId));
          Swal.fire({
            title: 'Servicio cancelado',
            text: 'El servicio ha sido cancelado y el cuidador ha sido notificado.',
            icon: 'success',
            confirmButtonColor: '#0ea5e9',
          });
        } else {
          throw new Error('Error al cancelar servicio');
        }
      } catch (error) {
        console.error('Error cancelling service:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cancelar el servicio. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      }
    }
  };

  const handleViewDetails = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      Swal.fire({
        title: '📋 Detalles del Servicio',
        html: `
          <div style="text-align: left; padding: 10px;">
            <p><strong>Título:</strong> ${service.title}</p>
            <p><strong>Cuidador:</strong> ${service.caregiver.name}</p>
            <p><strong>Progreso:</strong> ${service.progress}%</p>
            <p><strong>Tarifa:</strong> ₡${service.hourlyRate.toLocaleString()}/hora</p>
            <p><strong>Próxima sesión:</strong> ${service.nextSession}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#0ea5e9',
      });
    }
  };

  const handleContact = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      Swal.fire({
        title: `📞 Contactar a ${service.caregiver.name}`,
        text: '¿Deseas contactar al cuidador? Puedes llamar o enviar un mensaje para coordinar detalles del servicio.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Contactar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#0ea5e9',
        cancelButtonColor: '#6b7280',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: '¡Contacto iniciado!',
            text: 'Pronto podrás comunicarte con el cuidador.',
            icon: 'success',
            confirmButtonColor: '#0ea5e9',
          });
        }
      });
    }
  };

  const handleEditProgress = (serviceId: string, currentProgress: string) => {
    setEditingProgress(serviceId);
    setProgressText(currentProgress || "");
  };

  const handleCancelEdit = () => {
    setEditingProgress(null);
    setProgressText("");
  };

  const handleSaveProgress = async (serviceId: string) => {
    try {
      setUpdatingProgress(true);
      const response = await fetch("/api/users/in-progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: serviceId,
          progress: progressText,
        }),
      });

      if (response.ok) {
        // Update local state
        setServices(prev => prev.map(service => 
          service.id === serviceId 
            ? { ...service, progressNotes: progressText }
            : service
        ));
        setEditingProgress(null);
        setProgressText("");
      } else {
        console.error("Error updating progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setUpdatingProgress(false);
    }
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

  const formatDate = (date: Date | string) => {
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

                      {/* Progress Notes */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium" style={{ color: colors.neutral[700] }}>
                            Notas de progreso
                          </p>
                          {editingProgress === service.id ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSaveProgress(service.id)}
                                disabled={updatingProgress}
                                className="h-6 w-6 p-0"
                              >
                                {updatingProgress ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Save className="w-3 h-3" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                                className="h-6 w-6 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditProgress(service.id, service.progressNotes || "")}
                              className="h-6 w-6 p-0"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        {editingProgress === service.id ? (
                          <textarea
                            value={progressText}
                            onChange={(e) => setProgressText(e.target.value)}
                            placeholder="Agregar notas sobre el progreso del servicio..."
                            className="w-full p-2 text-sm border rounded-md resize-none"
                            rows={3}
                            style={{ borderColor: colors.neutral[300] }}
                          />
                        ) : (
                          <p className="text-sm" style={{ color: colors.neutral[600] }}>
                            {service.progressNotes || "Sin notas de progreso"}
                          </p>
                        )}
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
                        onClick={() => handleContact(service.id)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contactar
                      </Button>
                      <Button
                        className="flex-1 text-white font-semibold shadow-md"
                        style={{ background: colors.gradients.secondary }}
                        onClick={() => handleCompleteService(service.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completar
                      </Button>

                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleCancelService(service.id)}
                        style={{ borderColor: colors.error[500] }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
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
