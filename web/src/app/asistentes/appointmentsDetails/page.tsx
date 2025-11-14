"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RequestDetails } from "@/components/asistentes/RequestDetails";
import { colors } from "@/config/colors";
import { Card } from "@/components/ui/card";
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
    const fetchRequest = async () => {
      if (!requestId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/requests/${requestId}`);
        if (response.ok) {
          const requestData = await response.json();
          setRequest(requestData);
        }
      } catch (error) {
        console.error("Error fetching request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.secondary }}>
        <Card className="p-8">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: colors.primary[600] }} />
          <p className="text-center mt-4 text-muted-foreground">Cargando detalles...</p>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.secondary }}>
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
