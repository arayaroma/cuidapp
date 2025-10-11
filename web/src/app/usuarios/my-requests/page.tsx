"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ArrowLeft, Clock, MapPin, Users, Eye } from "lucide-react";

// Mock data de solicitudes
const mockRequests = [
  {
    id: "1",
    title: "Cuidado de adulto mayor",
    description: "Necesito cuidador para mi padre de 75 años, con movilidad reducida",
    category: "Adultos Mayores",
    location: "San José Centro",
    schedule: "Lunes a Viernes, 8:00 AM - 4:00 PM",
    hourlyRate: "₡5,000",
    status: "Activa",
    applicantsCount: 5,
    postedDate: "Hace 2 días",
    applicants: [
      {
        id: "1",
        name: "María González",
        avatar: "",
        rating: 4.8,
        reviewCount: 24,
        experience: "5 años",
        status: "Pendiente"
      },
      {
        id: "2",
        name: "Roberto Mora",
        avatar: "",
        rating: 4.7,
        reviewCount: 15,
        experience: "4 años",
        status: "Pendiente"
      }
    ]
  },
  {
    id: "2",
    title: "Niñera para niños de 3 y 5 años",
    description: "Busco niñera responsable y cariñosa para cuidar a mis hijos mientras trabajo",
    category: "Niños",
    location: "Escazú",
    schedule: "Lunes a Viernes, 7:00 AM - 5:00 PM",
    hourlyRate: "₡4,500",
    status: "Activa",
    applicantsCount: 8,
    postedDate: "Hace 5 días",
    applicants: [
      {
        id: "3",
        name: "Carlos Ramírez",
        avatar: "",
        rating: 4.9,
        reviewCount: 31,
        experience: "3 años",
        status: "Pendiente"
      }
    ]
  },
  {
    id: "3",
    title: "Enfermera para cuidados post-operatorios",
    description: "Requiero enfermera con experiencia en cuidados post-operatorios",
    category: "Cuidado Especial",
    location: "Heredia",
    schedule: "24/7 por 2 semanas",
    hourlyRate: "₡6,000",
    status: "En proceso",
    applicantsCount: 3,
    postedDate: "Hace 1 semana",
    applicants: [
      {
        id: "4",
        name: "Ana Jiménez",
        avatar: "",
        rating: 5.0,
        reviewCount: 18,
        experience: "7 años",
        status: "Aceptado"
      }
    ]
  }
];

export default function MisSolicitudesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = useMemo(() => {
    return mockRequests.filter((request) =>
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleViewApplicants = (id: string) => {
    router.push(`/usuarios/my-requests/${id}/applicants`);
  };

  const handleEditRequest = (id: string) => {
    console.log("Editando solicitud:", id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activa":
        return "bg-green-100 text-green-800";
      case "En proceso":
        return "bg-blue-100 text-blue-800";
      case "Completada":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/usuarios/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Mis Solicitudes</h1>
          <p className="text-blue-100 mt-2">
            Gestiona tus solicitudes activas y revisa los postulantes
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar solicitudes..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            Nueva Solicitud
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">Todas</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">Activas</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">En proceso</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">Completadas</Badge>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredRequests.length} solicitudes encontradas
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No se encontraron solicitudes</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{request.title}</CardTitle>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Request Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{request.postedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{request.applicantsCount} postulantes</span>
                      </div>
                      <div className="font-semibold text-blue-600">
                        {request.hourlyRate}/hora
                      </div>
                    </div>

                    {/* Recent Applicants Preview */}
                    {request.applicants.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-3">Postulantes recientes:</h4>
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            {request.applicants.slice(0, 3).map((applicant) => (
                              <Avatar key={applicant.id} className="border-2 border-white w-10 h-10">
                                {applicant.avatar && <AvatarImage src={applicant.avatar} />}
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                                  {applicant.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          {request.applicantsCount > 3 && (
                            <span className="text-sm text-muted-foreground">
                              +{request.applicantsCount - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        onClick={() => handleViewApplicants(request.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Postulantes ({request.applicantsCount})
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleEditRequest(request.id)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
