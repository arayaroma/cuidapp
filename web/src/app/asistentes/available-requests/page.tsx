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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/requests/available');
        const data = await res.json();
        
        console.log("API Response:", data); // Debug
        
        if (Array.isArray(data)) {
          setAvailableRequests(data);
        } else {
          console.error("Invalid API response: expected an array", data);
          setAvailableRequests([]);
        }
      } catch (error) {
        console.error("Error fetching available requests:", error);
        setAvailableRequests([]);
        Swal.fire({ 
          icon: 'error', 
          title: 'Error', 
          text: 'No se pudieron cargar las solicitudes' 
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
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
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-3xl font-bold">Solicitudes Disponibles</h1>
          </div>
          <p className="text-sm sm:text-base text-blue-50">
            Encuentra trabajos de cuidado que se ajusten a tu perfil
          </p>
          <div className="mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push("/asistentes/dashboard")}
              className="bg-white hover:bg-blue-50 text-blue-600 w-full sm:w-auto"
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar solicitudes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>
        </div>        
      
        {/* Results */}
        {isLoading ? (
          <Card className="p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-base sm:text-lg text-muted-foreground">Cargando solicitudes...</p>
            </div>
          </Card>
        ) : filteredAvailable.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <FileX className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground/90" />
              <p className="text-base sm:text-lg text-muted-foreground">
                {searchQuery 
                  ? "No se encontraron solicitudes que coincidan con tu búsqueda" 
                  : availableRequests.length === 0 
                    ? "No hay solicitudes disponibles en este momento"
                    : "No se encontraron solicitudes disponibles"}
              </p>
              {searchQuery && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
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
