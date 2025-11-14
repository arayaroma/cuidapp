"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ArrowLeft, Star, CheckCircle2, Loader2, FileText } from "lucide-react";
import { colors, careTypeColors } from "@/config/colors";

const getCareTypeInfo = (category: string) => {
  const careTypes = {
    elderly: { label: "Adultos Mayores", colors: careTypeColors.elderly },
    children: { label: "Niños", colors: careTypeColors.children },
    disability: { label: "Discapacidad", colors: careTypeColors.disability },
    hospital: { label: "Cuidado Hospitalario", colors: careTypeColors.hospital },
    companion: { label: "Acompañamiento", colors: careTypeColors.companion },
    "special-needs": { label: "Necesidades Especiales", colors: careTypeColors["special-needs"] },
  };
  return careTypes[category as keyof typeof careTypes] || careTypes.companion;
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface HistoryItem {
  id: string;
  requestId: string;
  title: string;
  caregiver: {
    id: string;
    name: string;
    avatar: string | null;
    rating: number;
  };
  category: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  totalCost: number;
  status: string;
  myRating: number;
  caregiverRating: number;
}

export default function HistorialPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users/history')
      .then(res => res.json())
      .then(data => {
        console.log("📋 Historial cargado:", data);
        // Asegurarnos de que data sea un array
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          console.error("La respuesta no es un array:", data);
          setHistory([]);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching history:", error);
        setHistory([]);
        setIsLoading(false);
      });
  }, []);

  const filteredHistory = useMemo(() => {
    // Validar que history sea un array
    if (!Array.isArray(history)) return [];
    
    return history.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  const handleViewDetails = (requestId: string) => {
    router.push(`/usuarios/history/${requestId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
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
        <h1 className="text-3xl font-bold">Historial de Servicios</h1>
        <p className="mt-2" style={{ color: colors.accent[100] }}>
        Revisa todos tus servicios completados
        </p>
      </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar en historial..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-sky-100">Todos</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-sky-100">Adultos Mayores</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-sky-100">Niños</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-sky-100">Cuidado Especial</Badge>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-sky-600">{history.length}</p>
                <p className="text-sm text-muted-foreground">Servicios Completados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <p className="text-3xl font-bold">
                    {history.length > 0 
                      ? (history.reduce((sum, item) => sum + item.caregiverRating, 0) / history.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Calificación Promedio</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-sky-600">
                  ₡{history.reduce((sum, item) => sum + item.totalCost, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Invertido</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredHistory.length} servicios encontrados
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No se encontró historial</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => {
              const categoryInfo = getCareTypeInfo(item.category);
              
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-14 w-14">
                          {item.caregiver.avatar && <AvatarImage src={item.caregiver.avatar} />}
                          <AvatarFallback className="bg-sky-100 text-sky-700">
                            {item.caregiver.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                Cuidador: {item.caregiver.name}
                              </p>
                            </div>
                            <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completado
                            </Badge>
                          </div>
                          <Badge 
                            variant="outline"
                            className="w-fit"
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
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Service Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Fecha inicio</p>
                          <p className="font-medium">
                            {formatDate(item.startDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Fecha fin</p>
                          <p className="font-medium">
                            {formatDate(item.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duración</p>
                          <p className="font-medium">
                            {item.duration}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Costo total</p>
                          <p className="font-medium text-green-600">
                            ₡{item.totalCost.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Ratings */}
                      <div className="flex items-center gap-6 pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Calificación del cuidador:
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{item.caregiver.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewDetails(item.requestId)}
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white"
                          onClick={() => router.push(`/usuarios/available-caregivers`)}
                        >
                          Contratar de Nuevo
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
