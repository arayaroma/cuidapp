"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequestCard } from "@/components/asistentes/RequestCard";
import { CareRequest } from "@/types/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Search, ArrowLeft, FileX } from "lucide-react";
import Swal from 'sweetalert2'
import { colors } from "@/config/colors";

export default function SolicitudesDisponiblesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [availableRequests, setAvailableRequests] = useState<CareRequest[]>([]);

  useEffect(() => {
    fetch('/api/requests/available')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAvailableRequests(data);
        } else {
          console.error("Invalid API response: expected an array", data);
          setAvailableRequests([]);
        }
      })
      .catch(error => {
        console.error("Error fetching available requests:", error);
        setAvailableRequests([]);
      });
  }, []);

  const handleViewDetails = (request: CareRequest) => {
    router.push(`/asistentes/appointmentsDetails?id=${request.id}`);
  };

  const handleApply = async (requestId: string, message: string) => {
    try {
      const response = await fetch("/api/requests/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          message,
        }),
      });

        if (response.ok) {
        // Refresh the available requests to show updated status
        fetch('/api/requests/available')
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setAvailableRequests(data);
            }
          })
          .catch(console.error);
        Swal.fire({ icon: 'success', title: 'Postulación enviada', text: '¡Postulación enviada exitosamente!', timer: 1400, showConfirmButton: false })
      } else {
        const error = await response.json();
        Swal.fire({ icon: 'error', title: 'Error', text: error?.error || 'Error al enviar la postulación' })
      }
    } catch (error) {
      console.error("Error applying to request:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al enviar la postulación' })
    }
  };

  const handleApplyClick = (request: CareRequest) => {
    // This won't be called directly, the modal will handle it
  };  // Filtrar solicitudes disponibles
  const filteredAvailable = useMemo(() => {
    return availableRequests.filter((request) =>
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableRequests, searchQuery]);

  return (
    <div className="min-h-screen pb-10" style={{ background: colors.background.secondary }}>
      {/* Header */}
      <div className="text-white py-8" style={{ background: colors.gradients.primary }}>
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
              <p className="mt-2" style={{ color: colors.accent[100] }}>
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
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <FileX className="w-20 h-20 text-muted-foreground/90" />
              <p className="text-lg text-muted-foreground">No se encontraron solicitudes disponibles</p>
            </div>
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
