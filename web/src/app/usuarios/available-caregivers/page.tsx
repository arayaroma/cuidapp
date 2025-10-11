"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ArrowLeft, Star, MapPin, Briefcase, DollarSign } from "lucide-react";

// Mock data de cuidadores
const mockCaregivers = [
  {
    id: "1",
    name: "María González",
    avatar: "",
    specialty: "Cuidado de Adultos Mayores",
    rating: 4.8,
    reviewCount: 24,
    experience: "5 años",
    location: "San José Centro",
    hourlyRate: "₡5,000",
    description: "Especialista en cuidado de adultos mayores con certificación en enfermería.",
    availability: "Disponible",
  },
  {
    id: "2",
    name: "Carlos Ramírez",
    avatar: "",
    specialty: "Cuidado de Niños",
    rating: 4.9,
    reviewCount: 31,
    experience: "3 años",
    location: "Escazú",
    hourlyRate: "₡4,500",
    description: "Educador infantil con experiencia en cuidado de niños de todas las edades.",
    availability: "Disponible",
  },
  {
    id: "3",
    name: "Ana Jiménez",
    avatar: "",
    specialty: "Cuidado Especial",
    rating: 5.0,
    reviewCount: 18,
    experience: "7 años",
    location: "Heredia",
    hourlyRate: "₡6,000",
    description: "Enfermera con especialización en cuidados especiales y rehabilitación.",
    availability: "Disponible",
  },
  {
    id: "4",
    name: "Roberto Mora",
    avatar: "",
    specialty: "Cuidado de Adultos Mayores",
    rating: 4.7,
    reviewCount: 15,
    experience: "4 años",
    location: "Cartago",
    hourlyRate: "₡4,800",
    description: "Auxiliar de enfermería con experiencia en cuidado geriátrico.",
    availability: "Disponible",
  },
];

export default function CuidadoresDisponiblesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCaregivers = useMemo(() => {
    return mockCaregivers.filter((caregiver) =>
      caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caregiver.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caregiver.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleViewProfile = (id: string) => {
    router.push(`/usuarios/available-caregivers/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/usuarios/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Cuidadores Disponibles</h1>
          <p className="text-cyan-100 mt-2">
            Encuentra al cuidador perfecto para tus necesidades
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, especialidad o ubicación..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-cyan-100">Todos</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-cyan-100">Adultos Mayores</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-cyan-100">Niños</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-cyan-100">Cuidado Especial</Badge>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredCaregivers.length} cuidadores disponibles
        </div>

        {/* Caregivers Grid */}
        {filteredCaregivers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No se encontraron cuidadores disponibles</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCaregivers.map((caregiver) => (
              <Card key={caregiver.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      {caregiver.avatar && <AvatarImage src={caregiver.avatar} />}
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-lg">
                        {caregiver.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{caregiver.name}</h3>
                      <Badge className="bg-cyan-100 text-cyan-800 mt-1">
                        {caregiver.specialty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{caregiver.rating}</span>
                    <span className="text-muted-foreground">({caregiver.reviewCount} reseñas)</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{caregiver.experience} de experiencia</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{caregiver.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-semibold text-cyan-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{caregiver.hourlyRate}/hora</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {caregiver.description}
                  </p>
                </CardContent>

                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    onClick={() => handleViewProfile(caregiver.id)}
                  >
                    Ver Perfil Completo
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
