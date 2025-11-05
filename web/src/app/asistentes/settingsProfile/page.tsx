"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  User, 
  MapPin, 
  DollarSign,
  Banknote,
  Clock, 
  Calendar,
  Award,
  Briefcase,
  X,
  Plus
} from "lucide-react";

export default function EditAssistantProfilePage() {
  const router = useRouter();

  // Estado para información básica
  const [formData, setFormData] = useState({
    name: "María González",
    email: "maria.gonzalez@example.com",
    phone: "+506 8888-7777",
    location: "San José, Costa Rica",
    experience: "8 años de experiencia",
    hourlyRate: 25,
    available: true,
  });

  // Estado para especialidades
  const [specialties, setSpecialties] = useState([
    "Cuidado de Adultos Mayores",
    "Enfermería",
    "Compañía"
  ]);
  const [newSpecialty, setNewSpecialty] = useState("");

  // Estado para certificaciones
  const [certifications, setCertifications] = useState([
    {
      id: "1",
      title: "Certificada en Primeros Auxilios",
      description: "Cruz Roja Costarricense - 2022",
      icon: "shield" as const,
    },
    {
      id: "2",
      title: "Técnico en Enfermería",
      description: "Colegio Universitario de Cartago - 2015",
      icon: "award" as const,
    },
    {
      id: "3",
      title: "Curso de Cuidado Geriátrico",
      description: "Universidad de Costa Rica - 2020",
      icon: "award" as const,
    },
  ]);

  // Estado para servicios
  const [services, setServices] = useState([
    "Cuidado personal y asistencia diaria",
    "Administración de medicamentos",
    "Compañía y apoyo emocional",
    "Preparación de comidas",
    "Acompañamiento a citas médicas",
    "Ejercicios de rehabilitación básica",
  ]);
  const [newService, setNewService] = useState("");

  // Estado para horario
  const [schedule, setSchedule] = useState({
    preferredHours: "8:00 AM - 6:00 PM",
    availableDays: "Lunes a Viernes",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim()) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleAddCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      title: "",
      description: "",
      icon: "award" as const,
    };
    setCertifications([...certifications, newCert]);
  };

  const handleUpdateCertification = (id: string, field: string, value: string) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const handleRemoveCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  const handleSave = () => {
    // TODO: Implementar guardado de datos
    console.log("Guardando datos:", {
      formData,
      specialties,
      certifications,
      services,
      schedule,
    });
    router.push("/asistentes/profile");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Editar Perfil</h1>
              <p className="text-muted-foreground">Actualiza tu información profesional</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-blue-500">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>

        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-500" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+506 0000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Ubicación
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ciudad, País"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información Profesional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-500" />
              Información Profesional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Experiencia</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Ej: 5 años de experiencia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">
                  <Banknote className="w-4 h-4 inline mr-1" />
                  Tarifa por Hora (₡)
                </Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  placeholder="25"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Disponibilidad</p>
                <p className="text-sm text-muted-foreground">
                  {formData.available ? "Disponible para nuevos servicios" : "No disponible actualmente"}
                </p>
              </div>
              <Switch
                checked={formData.available}
                onCheckedChange={(checked: boolean) => 
                  setFormData(prev => ({ ...prev, available: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Especialidades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-500" />
              Especialidades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                >
                  {specialty}
                  <button
                    onClick={() => handleRemoveSpecialty(index)}
                    className="ml-2 hover:text-cyan-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Agregar especialidad"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty()}
              />
              <Button onClick={handleAddSpecialty} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Certificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-500" />
                Certificaciones
              </div>
              <Button onClick={handleAddCertification} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <Input
                      value={cert.title}
                      onChange={(e) => handleUpdateCertification(cert.id, 'title', e.target.value)}
                      placeholder="Título de la certificación"
                    />
                    <Input
                      value={cert.description}
                      onChange={(e) => handleUpdateCertification(cert.id, 'description', e.target.value)}
                      placeholder="Institución y año"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCertification(cert.id)}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Servicios Ofrecidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-500" />
              Servicios Ofrecidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{service}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveService(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Agregar servicio"
                onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
              />
              <Button onClick={handleAddService} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Horario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-500" />
              Horario de Disponibilidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredHours">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Horas Preferidas
                </Label>
                <Input
                  id="preferredHours"
                  value={schedule.preferredHours}
                  onChange={(e) => setSchedule(prev => ({ ...prev, preferredHours: e.target.value }))}
                  placeholder="8:00 AM - 6:00 PM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableDays">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Días Disponibles
                </Label>
                <Input
                  id="availableDays"
                  value={schedule.availableDays}
                  onChange={(e) => setSchedule(prev => ({ ...prev, availableDays: e.target.value }))}
                  placeholder="Lunes a Viernes"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pb-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-blue-500">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
