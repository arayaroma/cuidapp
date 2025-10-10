"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RequestCard } from "@/components/asistentes/RequestCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Briefcase, Inbox, CheckCircle2 } from "lucide-react";
import { mockAvailableRequests, mockMyOffers, mockAcceptedJobs } from "@/data/mockRequests";
import { CareRequest } from "@/types/request";

export default function AssistantsDashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [availableRequests] = useState(mockAvailableRequests);
  const [myOffers] = useState(mockMyOffers);
  const [acceptedJobs] = useState(mockAcceptedJobs);

  // Filtrar solicitudes según búsqueda
  const filteredAvailable = availableRequests.filter(
    (req) =>
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOffers = myOffers.filter(
    (req) =>
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobs = acceptedJobs.filter(
    (req) =>
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (request: CareRequest) => {
    console.log("Ver detalles de:", request);
    router.push(`/asistentes/appointmentsDetails?id=${request.id}`);
  };

  const handleApply = (requestId: string, message: string) => {
    console.log(`Postular a solicitud ${requestId} con mensaje:`, message);
    // TODO: Implementar lógica de postulación real
    // - Enviar datos al backend
    // - Actualizar estado local
    // - Mostrar notificación de éxito
  };

  const handleWithdraw = (request: CareRequest) => {
    console.log("Retirar postulación:", request);
    // TODO: Implementar lógica de retiro
  };

  return (
    <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header con estadísticas */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Briefcase className="w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">{availableRequests.length}</p>
                  <p className="text-sm opacity-90">Solicitudes Disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Inbox className="w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">{myOffers.length}</p>
                  <p className="text-sm opacity-90">Ofertas que me Llegaron</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">{acceptedJobs.length}</p>
                  <p className="text-sm opacity-90">Trabajos Aceptados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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

        {/* Tabs */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="available">
              <Briefcase className="w-4 h-4 mr-2" />
              Disponibles ({filteredAvailable.length})
            </TabsTrigger>
            <TabsTrigger value="offers">
              <Inbox className="w-4 h-4 mr-2" />
              Mis Ofertas ({filteredOffers.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Aceptados ({filteredJobs.length})
            </TabsTrigger>
          </TabsList>

          {/* Solicitudes Disponibles */}
          <TabsContent value="available" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Solicitudes Generales</h2>
              <div className="flex gap-2">
                <Badge variant="outline">Todos</Badge>
                <Badge variant="outline">Adultos Mayores</Badge>
                <Badge variant="outline">Niños</Badge>
              </div>
            </div>

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
                      onClick: () => {}, // No se usa, onApply maneja esto
                      variant: "default",
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Ofertas que me Llegaron */}
          <TabsContent value="offers" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Ofertas Directas</h2>
              <Badge className="bg-blue-100 text-blue-800">
                {myOffers.length} pendientes
              </Badge>
            </div>

            {filteredOffers.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No tienes ofertas pendientes</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOffers.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onViewDetails={handleViewDetails}
                    actionButton={{
                      label: "Retirar",
                      onClick: handleWithdraw,
                      variant: "outline",
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Trabajos Aceptados */}
          <TabsContent value="accepted" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Mis Trabajos Activos</h2>
              <Badge className="bg-green-100 text-green-800">
                {acceptedJobs.length} activos
              </Badge>
            </div>

            {filteredJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No tienes trabajos aceptados actualmente</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onViewDetails={handleViewDetails}
                    actionButton={{
                      label: "Ver Detalles",
                      onClick: handleViewDetails,
                      variant: "default",
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

