"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowLeft,
  Clock,
  Calendar,
  DollarSign,
  Loader2,
  FileText,
  Trash2,
  Edit2,
  Users,
  Filter,
  X,
  Plus,
} from "lucide-react";
import { CareRequest } from "@/types/request";
import { confirmAlert, successAlert, errorAlert } from "@/lib/alerts";
import { colors, careTypeColors, urgencyColors, statusColors } from "@/config/colors";

export default function MisSolicitudesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [userRequests, setUserRequests] = useState<CareRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/requests/available")
      .then((res) => res.json())
      .then((data: CareRequest[]) => {
        console.log("📅 Solicitudes cargadas:", data);
        data.forEach(req => {
          if (req.isRecurring) {
            console.log(`${req.title} - isRecurring: ${req.isRecurring}, weekdays:`, req.weekdays);
          }
        });
        setUserRequests(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        errorAlert.loading("las solicitudes");
        setIsLoading(false);
      });
  }, []);

  const filteredRequests = useMemo(() => {
    if (!userRequests) return [];
    const q = searchQuery.toLowerCase();

    let filtered = userRequests.filter(
      (request: CareRequest) =>
        (request.title?.toLowerCase().includes(q) || false) ||
        (request.description?.toLowerCase().includes(q) || false) ||
        (request.careType?.toLowerCase().includes(q) || false)
    );

    if (selectedFilter !== "all") {
      filtered = filtered.filter((req) => req.status === selectedFilter);
    }

    return filtered;
  }, [searchQuery, userRequests, selectedFilter]);

  const handleEditRequest = (id: string) => {
    router.push(`/usuarios/my-requests/${id}/edit`);
  };

  const handleDeleteRequest = async (id: string, title: string) => {
    const result = await confirmAlert.delete(`la solicitud "${title}"`);
    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }

      await successAlert.deleted("La solicitud");
      setUserRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Error:", error);
      errorAlert.deleting("la solicitud");
    }
  };

  const getCareTypeInfo = (careType: string) => {
    const typeMap: Record<string, { label: string; colors: any }> = {
      elderly: { label: "Adulto Mayor", colors: careTypeColors.elderly },
      children: { label: "Niños y Bebés", colors: careTypeColors.children },
      disability: { label: "Discapacidad", colors: careTypeColors.disability },
      hospital: { label: "Hospitalario", colors: careTypeColors.hospital },
      companion: { label: "Compañía", colors: careTypeColors.companion },
      "special-needs": { label: "Necesidades Especiales", colors: careTypeColors["special-needs"] },
    };
    return typeMap[careType] || { label: careType, colors: careTypeColors.companion };
  };

  const getUrgencyInfo = (urgency: string) => {
    const urgencyMap: Record<string, { label: string; colors: any }> = {
      high: { label: "Alta", colors: urgencyColors.high },
      medium: { label: "Media", colors: urgencyColors.medium },
      low: { label: "Baja", colors: urgencyColors.low },
    };
    return urgencyMap[urgency] || { label: urgency, colors: urgencyColors.medium };
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; colors: any }> = {
      active: { label: "Activa", colors: statusColors.active },
      "in-progress": { label: "En Progreso", colors: statusColors["in-progress"] },
      completed: { label: "Completada", colors: statusColors.completed },
      paused: { label: "Pausada", colors: statusColors.paused },
      cancelled: { label: "Cancelada", colors: statusColors.cancelled },
    };
    return statusMap[status] || { label: status, colors: statusColors.active };
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-CR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statsCards = [
    {
      label: "Total",
      count: userRequests.length,
      color: colors.neutral[600],
      bg: colors.neutral[50],
    },
    {
      label: "Activas",
      count: userRequests.filter((r) => r.status === "active").length,
      color: statusColors.active.color,
      bg: statusColors.active.bg,
    },
    {
      label: "Completadas",
      count: userRequests.filter((r) => r.status === "completed").length,
      color: statusColors.completed.color,
      bg: statusColors.completed.bg,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-10">
      {/* Header */}
      <div className="text-white py-10" style={{ background: colors.gradients.trust }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/usuarios/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mis Solicitudes</h1>
              <p className="text-blue-100">
                Gestiona tus solicitudes de cuidado
              </p>
            </div>
            
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              onClick={() => router.push("/usuarios/my-requests/create")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Solicitud
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {statsCards.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <p className="text-blue-100 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search & Filters Card */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, descripción o tipo..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activas</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="paused">Pausadas</option>
                  <option value="completed">Completadas</option>
                  <option value="cancelled">Canceladas</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            {(searchQuery || selectedFilter !== "all") && (
              <div className="mt-3 text-sm text-muted-foreground">
                {filteredRequests.length} resultado{filteredRequests.length !== 1 ? "s" : ""} encontrado
                {filteredRequests.length !== 1 ? "s" : ""}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading ? (
          <Card className="p-16 text-center shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin" style={{ color: colors.primary[500] }} />
              <p className="text-muted-foreground">Cargando solicitudes...</p>
            </div>
          </Card>
        ) : filteredRequests.length === 0 ? (
          /* Empty State */
          <Card className="p-16 text-center shadow-lg">
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <FileText className="w-10 h-10" style={{ color: colors.primary[500] }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery || selectedFilter !== "all"
                    ? "No se encontraron solicitudes"
                    : "No tienes solicitudes aún"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || selectedFilter !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Crea tu primera solicitud para encontrar cuidadores profesionales"}
                </p>
                {!searchQuery && selectedFilter === "all" && (
                  <Button
                    size="lg"
                    style={{ background: colors.gradients.trust }}
                    className="text-white"
                    onClick={() => router.push("/usuarios/my-requests/create")}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Crear Primera Solicitud
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          /* Requests List */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRequests.map((request) => {
              const statusInfo = getStatusInfo(request.status);
              const careTypeInfo = getCareTypeInfo(request.careType);
              const urgencyInfo = request.urgency ? getUrgencyInfo(request.urgency) : null;

              return (
                <Card
                  key={request.id}
                  className="hover:shadow-xl transition-all duration-200 border-l-4 flex flex-col"
                  style={{ borderLeftColor: statusInfo.colors.color }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold mb-2 line-clamp-1">
                          {request.title || "Sin título"}
                        </CardTitle>
                        
                        {/* Main Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <Badge
                            className="text-xs border"
                            style={{
                              backgroundColor: statusInfo.colors.bg,
                              color: statusInfo.colors.text,
                              borderColor: statusInfo.colors.border,
                            }}
                          >
                            {statusInfo.label}
                          </Badge>
                          
                          <Badge
                            className="text-xs"
                            variant="outline"
                            style={{
                              backgroundColor: careTypeInfo.colors.bg,
                              color: careTypeInfo.colors.text,
                              borderColor: careTypeInfo.colors.border,
                            }}
                          >
                            {careTypeInfo.label}
                          </Badge>

                          {urgencyInfo && (
                            <Badge
                              className="text-xs"
                              variant="outline"
                              style={{
                                backgroundColor: urgencyInfo.colors.bg,
                                color: urgencyInfo.colors.text,
                                borderColor: urgencyInfo.colors.border,
                              }}
                            >
                              {urgencyInfo.label}
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {request.description || "Sin descripción"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 flex-1 flex flex-col">
                    {/* Info Compacta */}
                    <div className="space-y-2 text-sm">
                      {request.startDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: colors.secondary[600] }} />
                          <span className="text-muted-foreground">{formatDate(request.startDate)}</span>
                        </div>
                      )}

                      {request.schedule && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary[600] }} />
                          <span className="text-muted-foreground">{request.schedule}</span>
                        </div>
                      )}

                      {request.hourlyRate && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 flex-shrink-0" style={{ color: colors.success[600] }} />
                          <span className="font-semibold" style={{ color: colors.success[700] }}>
                            ₡{request.hourlyRate.toLocaleString()}/hora
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary[600] }} />
                        <span className="text-muted-foreground">
                          {request.applicants || 0} postulante{request.applicants !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Días de la semana - DESTACADO */}
                    {request.isRecurring && request.weekdays && request.weekdays.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs font-semibold mb-2" style={{ color: colors.secondary[700] }}>
                          Días de servicio
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {request.weekdays.map((day, idx) => {
                            const dayAbbr: Record<string, string> = {
                              lunes: 'LUN',
                              martes: 'MAR',
                              miercoles: 'MIÉ',
                              jueves: 'JUE',
                              viernes: 'VIE',
                              sabado: 'SÁB',
                              domingo: 'DOM'
                            };
                            return (
                              <span
                                key={idx}
                                className="text-xs font-bold px-2.5 py-1.5 rounded-md border-2"
                                style={{
                                  backgroundColor: colors.secondary[100],
                                  color: colors.secondary[800],
                                  borderColor: colors.secondary[400],
                                }}
                              >
                                {dayAbbr[day.toLowerCase()] || day.slice(0, 3).toUpperCase()}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Requirements Compactos */}
                    {request.requirements && request.requirements.length > 0 && (
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1.5 text-muted-foreground">Requisitos</p>
                        <div className="flex flex-wrap gap-1">
                          {request.requirements.slice(0, 3).map((req, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-md"
                              style={{
                                backgroundColor: colors.primary[50],
                                color: colors.primary[700],
                              }}
                            >
                              {req}
                            </span>
                          ))}
                          {request.requirements.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{request.requirements.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions - Siempre al final */}
                    <div className="grid grid-cols-2 gap-2 pt-3 mt-auto border-t">
                      <Button
                        size="sm"
                        className="font-semibold"
                        onClick={() => handleEditRequest(request.id)}
                        style={{
                          background: colors.gradients.primary,
                          color: 'white',
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                        Editar
                      </Button>
                      
                      <Button
                        size="sm"
                        className="font-semibold"
                        variant="outline"
                        onClick={() =>
                          handleDeleteRequest(request.id, request.title || "Sin título")
                        }
                        style={{
                          borderColor: colors.error[500],
                          color: colors.error[700],
                          borderWidth: '2px',
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Eliminar
                      </Button>
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
