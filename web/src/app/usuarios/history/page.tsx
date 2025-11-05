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

interface HistoryItem {
  id: string;
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

  const filteredHistory = useMemo(() => {
    return mockHistory.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleViewDetails = (id: string) => {
    router.push(`/usuarios/history/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/usuarios/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Historial de Servicios</h1>
          <p className="text-sky-100 mt-2">
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
                <p className="text-3xl font-bold text-sky-600">{mockHistory.length}</p>
                <p className="text-sm text-muted-foreground">Servicios Completados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <p className="text-3xl font-bold">4.9</p>
                </div>
                <p className="text-sm text-muted-foreground">Calificación Promedio</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-sky-600">₡1.25M</p>
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
                <Card key={item.id} className="hover:shadow-lg transition-shadow border-neutral-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="w-16 h-16 border-4" style={{ borderColor: colors.success[100] }}>
                          {item.caregiver.avatar && <AvatarImage src={item.caregiver.avatar} />}
                          <AvatarFallback 
                            className="text-white text-lg"
                            style={{ background: colors.gradients.cool }}
                          >
                            {item.caregiver.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl" style={{ color: colors.neutral[900] }}>
                              {item.title}
                            </CardTitle>
                            <Badge 
                              className="border"
                              style={{
                                backgroundColor: colors.success[50],
                                color: colors.success[700],
                                borderColor: colors.success[200],
                              }}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm" style={{ color: colors.neutral[600] }}>
                            Cuidador: {item.caregiver.name}
                          </p>
                          <Badge 
                            variant="outline"
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
                          <p style={{ color: colors.neutral[600] }}>Fecha inicio</p>
                          <p className="font-semibold" style={{ color: colors.neutral[900] }}>
                            {formatDate(item.startDate)}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: colors.neutral[600] }}>Fecha fin</p>
                          <p className="font-semibold" style={{ color: colors.neutral[900] }}>
                            {formatDate(item.endDate)}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: colors.neutral[600] }}>Duración</p>
                          <p className="font-semibold" style={{ color: colors.neutral[900] }}>
                            {item.duration}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: colors.neutral[600] }}>Costo total</p>
                          <p className="font-semibold" style={{ color: colors.success[600] }}>
                            ₡{item.totalCost.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Ratings */}
                      <div className="flex items-center gap-6 pt-2 border-t border-neutral-200">
                        <div className="flex items-center gap-2">
                          <span className="text-sm" style={{ color: colors.neutral[600] }}>
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
                          style={{
                            borderColor: colors.primary[300],
                            color: colors.primary[700],
                          }}
                          onClick={() => handleViewDetails(item.id)}
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          className="flex-1 text-white"
                          style={{ background: colors.gradients.cool }}
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
