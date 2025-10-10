"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RequestDetails } from "@/components/asistentes/RequestDetails";
import { Card } from "@/components/ui/card";
import { mockAvailableRequests } from "@/data/mockRequests";
import { useEffect, useState } from "react";
import { CareRequest } from "@/types/request";

export default function AppointmentDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id');
  
  const [request, setRequest] = useState<CareRequest | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar la solicitud en los datos mock
    const foundRequest = mockAvailableRequests.find(req => req.id === requestId);
    if (foundRequest) {
      setRequest(foundRequest);
    }
    setLoading(false);
  }, [requestId]);

  const handleBack = () => {
    router.back();
  };

  const handleApply = (requestId: string, message: string) => {
    console.log(`Aplicando a solicitud ${requestId} con mensaje:`, message);
    setHasApplied(true);
    
    // TODO: Implementar lógica real de postulación
    // - Enviar datos al backend
    // - Mostrar notificación de éxito
    // - Actualizar estado de la solicitud
  };

  const handleWithdraw = (requestId: string) => {
    console.log(`Retirando postulación de solicitud ${requestId}`);
    setHasApplied(false);
    
    // TODO: Implementar lógica real de retiro
    // - Enviar solicitud al backend
    // - Mostrar notificación de confirmación
    // - Actualizar estado de la solicitud
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50 flex items-center justify-center">
        <Card className="p-8">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-center mt-4 text-muted-foreground">Cargando detalles...</p>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-center text-muted-foreground">No se encontró la solicitud</p>
        </Card>
      </div>
    );
  }

  return (
    <RequestDetails
      request={request}
      userType="assistant"
      onBack={handleBack}
      onApply={handleApply}
      onWithdraw={handleWithdraw}
      hasApplied={hasApplied}
    />
  );
}
