"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  ArrowLeft,
  Loader2,
  Users,
  Filter,
  X,
  Shield,
  Car,
  Heart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Assistant } from "@/types/assistant";
import { AssistantCard } from "@/components/assistants";
import { colors } from "@/config/colors";

export default function CuidadoresDisponiblesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assistantId = searchParams.get('assistantId');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedAssistant, setHighlightedAssistant] = useState<string | null>(assistantId);

  // Filtros
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [minExperience, setMinExperience] = useState<string>("all");
  const [maxRate, setMaxRate] = useState<string>("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hasFirstAidOnly, setHasFirstAidOnly] = useState(false);
  const [hasVehicleOnly, setHasVehicleOnly] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    fetch("/api/assistants/available")
      .then((res) => res.json())
      .then((data) => {
        console.log("📋 Asistentes cargados:", data);
        // Asegurarnos de que data es un array
        if (Array.isArray(data)) {
          setAssistants(data);
          
          // Si hay un assistantId específico, scrollear a ese asistente
          if (assistantId) {
            setTimeout(() => {
              const element = document.getElementById(`assistant-${assistantId}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 500);
          }
        } else {
          console.error("La respuesta no es un array:", data);
          setAssistants([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading assistants:", error);
        setAssistants([]);
        setIsLoading(false);
      });
  }, [assistantId]);

  const filteredAssistants = useMemo(() => {
    // Validar que assistants sea un array
    if (!assistants || !Array.isArray(assistants)) return [];

    const q = searchQuery.toLowerCase();
    let filtered = assistants.filter(
      (assistant: Assistant) =>
        assistant.name?.toLowerCase().includes(q) ||
        false ||
        assistant.bio?.toLowerCase().includes(q) ||
        false ||
        assistant.location?.toLowerCase().includes(q) ||
        false
    );

    // Filtro por especialidad
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter((a) =>
        a.specialties.includes(selectedSpecialty as any)
      );
    }

    // Filtro por experiencia mínima
    if (minExperience !== "all") {
      const minYears = parseInt(minExperience);
      filtered = filtered.filter((a) => a.yearsExperience >= minYears);
    }

    // Filtro por tarifa máxima
    if (maxRate !== "all") {
      const maxRateValue = parseInt(maxRate);
      filtered = filtered.filter(
        (a) => a.hourlyRate && a.hourlyRate <= maxRateValue
      );
    }

    // Filtro verificado
    if (verifiedOnly) {
      filtered = filtered.filter((a) => a.verified);
    }

    // Filtro primeros auxilios
    if (hasFirstAidOnly) {
      filtered = filtered.filter((a) => a.hasFirstAid);
    }

    // Filtro vehículo
    if (hasVehicleOnly) {
      filtered = filtered.filter((a) => a.hasVehicle);
    }

    return filtered;
  }, [
    searchQuery,
    assistants,
    selectedSpecialty,
    minExperience,
    maxRate,
    verifiedOnly,
    hasFirstAidOnly,
    hasVehicleOnly,
  ]);

  const activeFiltersCount = [
    selectedSpecialty !== "all",
    minExperience !== "all",
    maxRate !== "all",
    verifiedOnly,
    hasFirstAidOnly,
    hasVehicleOnly,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedSpecialty("all");
    setMinExperience("all");
    setMaxRate("all");
    setVerifiedOnly(false);
    setHasFirstAidOnly(false);
    setHasVehicleOnly(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-10">
      {/* Header */}
      <div
        className="text-white py-8"
        style={{ background: colors.gradients.trust }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/usuarios/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Cuidadores Disponibles</h1>
              <p className="text-blue-100 mt-2">
                Encuentra al cuidador perfecto para tus necesidades
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search and Filters Card */}
        <Card className="p-6 shadow-lg">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, biografía o ubicación..."
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="w-4 h-4" />
                Filtros:
              </div>

              {/* Specialty */}
              <Select
                value={selectedSpecialty}
                onValueChange={setSelectedSpecialty}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="elderly">Adulto Mayor</SelectItem>
                  <SelectItem value="children">Niños y Bebés</SelectItem>
                  <SelectItem value="disability">Discapacidad</SelectItem>
                  <SelectItem value="hospital">Hospitalario</SelectItem>
                  <SelectItem value="companion">Compañía</SelectItem>
                  <SelectItem value="special-needs">
                    Necesidades Especiales
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Experience */}
              <Select value={minExperience} onValueChange={setMinExperience}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Experiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier experiencia</SelectItem>
                  <SelectItem value="1">1+ años</SelectItem>
                  <SelectItem value="3">3+ años</SelectItem>
                  <SelectItem value="5">5+ años</SelectItem>
                  <SelectItem value="10">10+ años</SelectItem>
                </SelectContent>
              </Select>

              {/* Max Rate */}
              <Select value={maxRate} onValueChange={setMaxRate}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tarifa máxima" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier tarifa</SelectItem>
                  <SelectItem value="3000">Hasta ₡3,000</SelectItem>
                  <SelectItem value="5000">Hasta ₡5,000</SelectItem>
                  <SelectItem value="8000">Hasta ₡8,000</SelectItem>
                  <SelectItem value="10000">Hasta ₡10,000</SelectItem>
                </SelectContent>
              </Select>

              {/* Toggle Filters */}
              <Button
                variant={verifiedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                style={
                  verifiedOnly
                    ? { background: colors.success[500], color: "white" }
                    : {}
                }
              >
                <Shield className="w-4 h-4 mr-1" />
                Verificados
              </Button>

              <Button
                variant={hasFirstAidOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setHasFirstAidOnly(!hasFirstAidOnly)}
                style={
                  hasFirstAidOnly
                    ? { background: colors.error[500], color: "white" }
                    : {}
                }
              >
                <Heart className="w-4 h-4 mr-1" />
                Primeros Auxilios
              </Button>

              <Button
                variant={hasVehicleOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setHasVehicleOnly(!hasVehicleOnly)}
                style={
                  hasVehicleOnly
                    ? { background: colors.primary[500], color: "white" }
                    : {}
                }
              >
                <Car className="w-4 h-4 mr-1" />
                Con Vehículo
              </Button>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpiar ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredAssistants.length} cuidador
            {filteredAssistants.length !== 1 ? "es" : ""} disponible
            {filteredAssistants.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <Card className="p-16 text-center shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <Loader2
                className="w-12 h-12 animate-spin"
                style={{ color: colors.primary[500] }}
              />
              <p className="text-muted-foreground">Cargando cuidadores...</p>
            </div>
          </Card>
        ) : filteredAssistants.length === 0 ? (
          /* Empty State */
          <Card className="p-16 text-center shadow-lg">
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <Users
                  className="w-10 h-10"
                  style={{ color: colors.primary[500] }}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery || activeFiltersCount > 0
                    ? "No se encontraron cuidadores"
                    : "No hay cuidadores disponibles"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || activeFiltersCount > 0
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Por el momento no hay cuidadores registrados en el sistema"}
                </p>
                {(searchQuery || activeFiltersCount > 0) && (
                  <Button
                    onClick={clearAllFilters}
                    style={{ background: colors.gradients.trust }}
                    className="text-white"
                  >
                    Limpiar Filtros
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          /* Assistants Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAssistants.map((assistant) => (
              <div
                key={assistant.id}
                id={`assistant-${assistant.id}`}
                className={highlightedAssistant === assistant.id ? "ring-2 ring-sky-500 rounded-lg" : ""}
              >
                <AssistantCard
                  assistant={assistant}
                  onViewProfile={(id) =>
                    router.push(`/usuarios/available-caregivers/${id}`)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
