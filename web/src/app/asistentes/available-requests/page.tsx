"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RequestCard } from "@/components/asistentes/RequestCard";
import { CareRequest } from "@/types/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAvailableRequests } from "@/data/mockRequests";
import { Briefcase, Search, ArrowLeft } from "lucide-react";

export default function SolicitudesDisponiblesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [availableRequests] = useState(mockAvailableRequests);

  const handleViewDetails = (request: CareRequest) => {
    router.push(`/asistentes/request-details/${request.id}`);
  };

  const handleApply = (requestId: string, message: string) => {
    console.log("Aplicando a solicitud:", requestId, "con mensaje:", message);
    // Lógica para postularse
  };

  const handleApplyClick = (request: CareRequest) => {
    // Aquí podrías abrir un modal para ingresar el mensaje
    handleApply(request.id, "Mensaje de aplicación por defecto");
  };  // Filtrar solicitudes disponibles
  const filteredAvailable = useMemo(() => {
    return availableRequests.filter((request) =>
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableRequests, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/asistentes/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Solicitudes Disponibles</h1>
              <p className="text-cyan-100 mt-2">
                Explora y postúlate a oportunidades de trabajo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar solicitudes..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Solicitudes Generales</h2>
          <div className="flex gap-2">
            <Badge variant="outline">Todos</Badge>
            <Badge variant="outline">Adultos Mayores</Badge>
            <Badge variant="outline">Niños</Badge>
          </div>
        </div>

        {/* Results */}
        {filteredAvailable.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No se encontraron solicitudes disponibles</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAvailable.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
                actionButton={{
                  label: "Postularme",
                  onClick: () => handleApplyClick(request),
                  variant: "default",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
