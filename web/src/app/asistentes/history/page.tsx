"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  Loader2, 
  FileText,
  Calendar,
  Clock,
  DollarSign,
  User,
  MapPin,
  Phone
} from "lucide-react";
import { colors, careTypeColors } from "@/config/colors";

interface HistoryItem {
  id: string;
  requestId: string;
  title: string;
  client: {
    id: string;
    name: string;
    avatar: string | null;
    phone: string | null;
    emergencyContact: string | null;
  };
  category: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  totalCost: number;
  hourlyRate: number;
  totalHours: number;
  status: string;
  personAge: number;
  requirements: string[];
  urgency: string;
  isRecurring: boolean;
  weekdays: string[];
  myRating: number;
  clientRating: number;
  acceptedDate: Date;
  completedDate: Date;
}

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function HistorialAsistentePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetch('/api/assistants/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching history:", error);
        setIsLoading(false);
      });
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [history, searchQuery, selectedCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalJobs = history.length;
    const totalEarnings = history.reduce((sum, item) => sum + item.totalCost, 0);
    const totalHours = history.reduce((sum, item) => sum + item.totalHours, 0);
    const avgRating = history.length > 0
      ? history.reduce((sum, item) => sum + item.clientRating, 0) / history.length
      : 0;

    return { totalJobs, totalEarnings, totalHours, avgRating };
  }, [history]);

  const handleViewDetails = (id: string) => {
    router.push(`/asistentes/appointmentsDetails?id=${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
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
            onClick={() => router.push("/asistentes/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Historial de Trabajos</h1>
              <p className="mt-2" style={{ color: colors.accent[100] }}>
                Revisa todos tus trabajos completados y estadísticas
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
            placeholder="Buscar en historial..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Badge 
            variant={selectedCategory === "all" ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedCategory("all")}
          >
            Todos
          </Badge>
          <Badge 
            variant={selectedCategory === "elderly" ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedCategory("elderly")}
          >
            Adultos Mayores
          </Badge>
          <Badge 
            variant={selectedCategory === "children" ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedCategory("children")}
          >
            Niños
          </Badge>
          <Badge 
            variant={selectedCategory === "disability" ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedCategory("disability")}
          >
            Discapacidad
          </Badge>
          <Badge 
            variant={selectedCategory === "companion" ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedCategory("companion")}
          >
            Acompañamiento
          </Badge>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalJobs}
                </p>
                <p className="text-sm text-muted-foreground">Trabajos Completados</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(stats.totalEarnings)}
                </p>
                <p className="text-sm text-muted-foreground">Total Ganado</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-3xl font-bold text-blue-600">{stats.totalHours}</p>
                <p className="text-sm text-muted-foreground">Horas Trabajadas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-3xl font-bold">{stats.avgRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Calificación Promedio</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredHistory.length} trabajo{filteredHistory.length !== 1 ? 's' : ''} encontrado{filteredHistory.length !== 1 ? 's' : ''}
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "all" 
                ? "No se encontraron trabajos con los filtros aplicados"
                : "Aún no tienes trabajos completados"}
            </p>
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
                        {/* Client Avatar */}
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={item.client.avatar || undefined} />
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {item.client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {/* Job Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="w-4 h-4" />
                                <span>{item.client.name}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Completado
                              </Badge>
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

                          {/* Description */}
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Inicio</p>
                                <p className="font-medium">{formatDate(item.startDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-xs text-muted-foreground">Fin</p>
                                <p className="font-medium">{formatDate(item.endDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Duración</p>
                                <p className="font-medium">{item.duration}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-xs text-muted-foreground">Ganancia</p>
                                <p className="font-medium text-green-600">{formatCurrency(item.totalCost)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{item.location}</span>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center gap-4">
                              {/* Rating */}
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">
                                  {item.clientRating > 0 ? item.clientRating.toFixed(1) : 'Sin calificar'}
                                </span>
                              </div>
                              {/* Hours */}
                              <span className="text-sm text-muted-foreground">
                                {item.totalHours} horas totales
                              </span>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(item.requestId)}
                            >
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
