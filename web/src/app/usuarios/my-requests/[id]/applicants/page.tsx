"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Star, 
  Briefcase,
  MapPin,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Eye,
  Clock
} from "lucide-react";

// Mock data
const mockRequest = {
  id: "1",
  title: "Cuidado de adulto mayor",
  description: "Necesito cuidador para mi padre de 75 años, con movilidad reducida",
  category: "Adultos Mayores",
  location: "San José Centro",
  schedule: "Lunes a Viernes, 8:00 AM - 4:00 PM",
  hourlyRate: "₡5,000",
  status: "Activa",
};

const mockApplicants = [
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
    applicationDate: "Hace 1 día",
    status: "Pendiente",
    message: "Tengo amplia experiencia cuidando adultos mayores y estaría encantada de ayudarle con su padre. Cuento con certificaciones en enfermería y cuidado geriátrico."
  },
  {
    id: "2",
    name: "Roberto Mora",
    avatar: "",
    specialty: "Cuidado de Adultos Mayores",
    rating: 4.7,
    reviewCount: 15,
    experience: "4 años",
    location: "Cartago",
    hourlyRate: "₡4,800",
    applicationDate: "Hace 2 días",
    status: "Pendiente",
    message: "Soy auxiliar de enfermería con 4 años de experiencia. Puedo brindar atención profesional y cariñosa a su padre."
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
    applicationDate: "Hace 3 días",
    status: "Rechazado",
    message: "Enfermera especializada en cuidados especiales. Me interesa mucho esta oportunidad."
  }
];

export default function PostulantesPage() {
  const router = useRouter();
  const params = useParams();
  const [applicants, setApplicants] = useState(mockApplicants);

  const handleAccept = (id: string) => {
    setApplicants(applicants.map(app => 
      app.id === id ? { ...app, status: "Aceptado" } : app
    ));
  };

  const handleReject = (id: string) => {
    setApplicants(applicants.map(app => 
      app.id === id ? { ...app, status: "Rechazado" } : app
    ));
  };

  const handleViewProfile = (id: string) => {
    router.push(`/usuarios/available-caregivers/${id}`);
  };

  const handleContact = (id: string) => {
    console.log("Contactando postulante:", id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aceptado":
        return <Badge className="bg-green-100 text-green-800">Aceptado</Badge>;
      case "Rechazado":
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
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
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">{mockRequest.title}</h1>
          <p className="text-blue-100 mt-2">
            {applicants.length} postulantes para esta solicitud
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Applicants List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Postulantes</h2>
              <div className="flex gap-2">
                <Badge variant="outline">Todos ({applicants.length})</Badge>
                <Badge variant="outline">Pendientes ({applicants.filter(a => a.status === "Pendiente").length})</Badge>
              </div>
            </div>

            {applicants.map((applicant) => (
              <Card key={applicant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-16 h-16">
                        {applicant.avatar && <AvatarImage src={applicant.avatar} />}
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-lg">
                          {applicant.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{applicant.name}</h3>
                          {getStatusBadge(applicant.status)}
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {applicant.specialty}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{applicant.rating}</span>
                            <span className="text-muted-foreground">({applicant.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                            <span>{applicant.experience}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{applicant.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{applicant.applicationDate}</span>
                    </div>
                    <div className="font-semibold text-blue-600">
                      {applicant.hourlyRate}/hora
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Mensaje del postulante:</h4>
                    <p className="text-sm text-muted-foreground">{applicant.message}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewProfile(applicant.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Perfil
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleContact(applicant.id)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Mensaje
                    </Button>
                    {applicant.status === "Pendiente" && (
                      <>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAccept(applicant.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Aceptar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(applicant.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar - Request Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Solicitud</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Categoría</h4>
                  <Badge variant="outline">{mockRequest.category}</Badge>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-1">Ubicación</h4>
                  <p className="text-sm text-muted-foreground">{mockRequest.location}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-1">Horario</h4>
                  <p className="text-sm text-muted-foreground">{mockRequest.schedule}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-1">Tarifa</h4>
                  <p className="text-sm font-semibold text-blue-600">{mockRequest.hourlyRate}/hora</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total postulantes:</span>
                  <span className="font-semibold">{applicants.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pendientes:</span>
                  <span className="font-semibold text-yellow-600">
                    {applicants.filter(a => a.status === "Pendiente").length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Aceptados:</span>
                  <span className="font-semibold text-green-600">
                    {applicants.filter(a => a.status === "Aceptado").length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rechazados:</span>
                  <span className="font-semibold text-red-600">
                    {applicants.filter(a => a.status === "Rechazado").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
