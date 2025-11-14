"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequestCard } from "@/components/asistentes/RequestCard";
import { MyRequest, CareRequest } from "@/types/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Inbox, Search, ArrowLeft } from "lucide-react";
import { colors } from "@/config/colors";

export default function OfertasRecibidasPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [myOffers, setMyOffers] = useState<MyRequest[]>([]);

  useEffect(() => {
    fetch('/api/assistants/offers')
      .then(res => res.json())
      .then(setMyOffers)
      .catch(console.error);
  }, []);

  const handleViewDetails = (request: CareRequest) => {
    router.push(`/asistentes/appointmentsDetails?id=${request.id}`);
  };

  const handleWithdraw = (request: MyRequest) => {
    console.log("Retirando aplicación:", request.id);
    // Lógica para retirar
  };

  // Filtrar ofertas
  const filteredOffers = useMemo(() => {
    return myOffers.filter((request) =>
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [myOffers, searchQuery]);

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
            <Inbox className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Ofertas Recibidas</h1>
              <p className="text-blue-100 mt-2">
                Revisa las invitaciones directas de clientes
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
            placeholder="Buscar ofertas..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ofertas Directas</h2>
          <Badge className="bg-blue-100 text-blue-800">
            {myOffers.length} pendientes
          </Badge>
        </div>

        {/* Results */}
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
                  onClick: () => handleWithdraw(request),
                  variant: "outline",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
