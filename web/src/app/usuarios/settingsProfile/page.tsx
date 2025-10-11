"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  User, 
  MapPin, 
  Mail,
  Phone,
  Heart,
  AlertCircle,
  X,
  Plus
} from "lucide-react";

export default function EditUserProfilePage() {
  const router = useRouter();

  // Estado para información básica
  const [formData, setFormData] = useState({
    name: "Juan Pérez Mora",
    email: "juan.perez@example.com",
    phone: "+506 8888-9999",
    location: "Heredia, Costa Rica",
  });

  // Estado para información personal
  const [personalInfo, setPersonalInfo] = useState({
    age: 72,
    emergencyContact: "María Pérez (Hija)",
    emergencyPhone: "+506 7777-8888",
  });

  // Estado para necesidades de cuidado
  const [careNeeds, setCareNeeds] = useState({
    careType: "Cuidado en el hogar",
    frequency: "3 veces por semana",
  });

  // Estado para requerimientos especiales
  const [specialRequirements, setSpecialRequirements] = useState([
    "Asistencia con movilidad",
    "Recordatorio de medicamentos",
    "Compañía durante el día",
    "Preparación de comidas",
    "Apoyo con higiene personal",
  ]);
  const [newRequirement, setNewRequirement] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value }));
  };

  const handleCareNeedsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCareNeeds(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setSpecialRequirements([...specialRequirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setSpecialRequirements(specialRequirements.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // TODO: Implementar guardado de datos
    console.log("Guardando datos:", {
      formData,
      personalInfo,
      careNeeds,
      specialRequirements,
    });
    router.push("/usuarios/profile");
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
              <p className="text-muted-foreground">Actualiza tu información personal</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-cyan-500">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>

        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
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
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={personalInfo.age}
                  onChange={handlePersonalInfoChange}
                  placeholder="Edad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Correo Electrónico
                </Label>
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
                <Label htmlFor="phone">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+506 0000-0000"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
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

        {/* Contacto de Emergencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Contacto de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Nombre del Contacto</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={personalInfo.emergencyContact}
                  onChange={handlePersonalInfoChange}
                  placeholder="Nombre y relación"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Teléfono de Emergencia
                </Label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={personalInfo.emergencyPhone}
                  onChange={handlePersonalInfoChange}
                  placeholder="+506 0000-0000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Necesidades de Cuidado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-500" />
              Necesidades de Cuidado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="careType">Tipo de Cuidado</Label>
                <Input
                  id="careType"
                  name="careType"
                  value={careNeeds.careType}
                  onChange={handleCareNeedsChange}
                  placeholder="Ej: Cuidado en el hogar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frecuencia</Label>
                <Input
                  id="frequency"
                  name="frequency"
                  value={careNeeds.frequency}
                  onChange={handleCareNeedsChange}
                  placeholder="Ej: 3 veces por semana"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requerimientos Especiales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-500" />
              Requerimientos Especiales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {specialRequirements.map((requirement, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{requirement}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Agregar requerimiento"
                onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
              />
              <Button onClick={handleAddRequirement} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Describe las necesidades específicas de cuidado que requieres para ayudar a los asistentes a entender mejor tus necesidades.
            </p>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-500" />
              Información Adicional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Notas Adicionales</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Información adicional que consideres importante que los asistentes conozcan..."
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Puedes incluir información sobre condiciones médicas, preferencias de cuidado, rutinas diarias, etc.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pb-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-cyan-500">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
