"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Star,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Languages,
  User,
  Loader2,
} from "lucide-react";
import { colors } from "@/config/colors";

interface Application {
  id: string;
  requestId: string;
  requestTitle: string;
  assistant: {
    id: string;
    name: string;
    avatar: string | null;
    rating: number;
    ratingCount: number;
    bio: string | null;
    specialties: string[];
    yearsExperience: number;
    certifications: string[];
    languages: string[];
    hourlyRate: number | null;
  };
  message: string | null;
  appliedAt: string;
  status: string;
}

export default function ReceivedOffersPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users/applications");
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      setProcessingId(applicationId);
      const response = await fetch("/api/users/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          action: "ACCEPT",
        }),
      });

      if (response.ok) {
        // Remove accepted application from list and refresh
        await fetchApplications();
      } else {
        console.error("Error accepting application");
      }
    } catch (error) {
      console.error("Error accepting application:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      setProcessingId(applicationId);
      const response = await fetch("/api/users/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          action: "REJECT",
        }),
      });

      if (response.ok) {
        // Remove rejected application from list
        setApplications(prev => prev.filter(app => app.id !== applicationId));
      } else {
        console.error("Error rejecting application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.secondary }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: colors.primary[500] }} />
          <p style={{ color: colors.neutral[600] }}>Cargando postulaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: colors.background.secondary }}>
      {/* Header */}
      <div className="text-white py-8 px-4 shadow-lg" style={{ background: colors.gradients.primary }}>
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/usuarios/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Postulaciones Recibidas</h1>
          <p className="mt-2" style={{ color: colors.accent[100] }}>
            Revisa y gestiona las postulaciones de cuidadores para tus solicitudes
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: colors.primary[600] }}>
                  {applications.length}
                </p>
                <p className="text-sm" style={{ color: colors.neutral[600] }}>
                  Postulaciones Pendientes
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: colors.success[600] }}>
                  {(applications.reduce((sum, app) => sum + (app.assistant.rating || 0), 0) / Math.max(applications.length, 1)).toFixed(1)}
                </p>
                <p className="text-sm" style={{ color: colors.neutral[600] }}>
                  Calificación Promedio
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <Card className="p-12 text-center border-neutral-200 shadow-sm">
            <Clock className="w-16 h-16 mx-auto mb-4" style={{ color: colors.neutral[400] }} />
            <p style={{ color: colors.neutral[600] }}>No tienes postulaciones pendientes</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-xl transition-shadow border-neutral-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-16 h-16 border-4" style={{ borderColor: colors.accent[100] }}>
                        {application.assistant.avatar && (
                          <AvatarImage src={application.assistant.avatar} />
                        )}
                        <AvatarFallback
                          className="text-white text-lg"
                          style={{ background: colors.gradients.primary }}
                        >
                          {application.assistant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-xl" style={{ color: colors.neutral[900] }}>
                            {application.assistant.name}
                          </CardTitle>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">
                              {application.assistant.rating.toFixed(1)}
                            </span>
                            <span className="text-sm" style={{ color: colors.neutral[600] }}>
                              ({application.assistant.ratingCount} reseñas)
                            </span>
                          </div>
                        </div>
                        <p className="text-sm" style={{ color: colors.neutral[600] }}>
                          Solicitud: {application.requestTitle}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            style={{
                              backgroundColor: colors.primary[50],
                              color: colors.primary[700],
                              borderColor: colors.primary[200],
                            }}
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            Postulado: {formatDate(application.appliedAt)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Assistant Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {application.assistant.yearsExperience > 0 && (
                        <div>
                          <p className="flex items-center gap-1" style={{ color: colors.neutral[600] }}>
                            <Award className="w-4 h-4" />
                            Experiencia
                          </p>
                          <p className="font-semibold" style={{ color: colors.neutral[900] }}>
                            {application.assistant.yearsExperience} años
                          </p>
                        </div>
                      )}
                      {application.assistant.hourlyRate && (
                        <div>
                          <p className="flex items-center gap-1" style={{ color: colors.neutral[600] }}>
                            <User className="w-4 h-4" />
                            Tarifa
                          </p>
                          <p className="font-semibold" style={{ color: colors.neutral[900] }}>
                            ₡{application.assistant.hourlyRate.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {application.assistant.languages.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1" style={{ color: colors.neutral[600] }}>
                            <Languages className="w-4 h-4" />
                            Idiomas
                          </p>
                          <p className="font-semibold" style={{ color: colors.neutral[900] }}>
                            {application.assistant.languages.join(", ")}
                          </p>
                        </div>
                      )}
                      {application.assistant.specialties.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1" style={{ color: colors.neutral[600] }}>
                            <Star className="w-4 h-4" />
                            Especialidades
                          </p>
                          <p className="font-semibold" style={{ color: colors.neutral[900] }}>
                            {application.assistant.specialties.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    {application.message && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Mensaje del cuidador
                            </p>
                            <p className="text-sm text-gray-700">{application.message}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {application.assistant.bio && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-900 mb-2">Sobre mí</p>
                        <p className="text-sm text-blue-800">{application.assistant.bio}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-neutral-200">
                      <Button
                        className="flex-1 text-white font-semibold shadow-md"
                        style={{ background: colors.gradients.secondary }}
                        onClick={() => handleAcceptApplication(application.id)}
                        disabled={processingId === application.id}
                      >
                        {processingId === application.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Aceptar Postulación
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        style={{
                          borderColor: colors.warning[200],
                          color: colors.warning[700],
                        }}
                        onClick={() => handleRejectApplication(application.id)}
                        disabled={processingId === application.id}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rechazar
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