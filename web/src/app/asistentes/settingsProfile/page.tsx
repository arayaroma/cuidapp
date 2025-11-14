"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/shared";
import { 
  ArrowLeft, 
  Save, 
  User, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar,
  Award,
  Briefcase,
  X,
  Plus,
  Shield,
  Car,
  Heart,
  Users,
  Globe,
  Phone,
  Mail,
  FileCheck,
  Camera,
  Languages,
  Baby
} from "lucide-react";

export default function EditAssistantProfilePage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estado unificado para todo el formulario
  const [formData, setFormData] = useState({
    // Información básica
    fullName: "",
    email: "",
    phoneNumber: "",
    photoUrl: "",
    bio: "",
    
    // Información profesional
    yearsExperience: "",
    hourlyRate: "",
    isAvailable: false,
    verified: false,
    backgroundCheck: false,
    hasFirstAid: false,
    hasVehicle: false,
    maxDistanceKm: "",
    
    // Ubicación
    province: "",
    canton: "",
    district: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    postalCode: "",
    
    // Horario
    availabilitySchedule: "8:00 AM - 6:00 PM",
    availableWeekdays: [] as string[],
    
    // Arrays
    specialties: [] as string[],
    certifications: [] as string[],
    languages: [] as string[],
    preferredAgeGroups: [] as string[],
  });

  // Estados temporales para inputs de arrays
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newAgeGroup, setNewAgeGroup] = useState("");

  const weekdayOptions = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleWeekday = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableWeekdays: prev.availableWeekdays.includes(day)
        ? prev.availableWeekdays.filter(d => d !== day)
        : [...prev.availableWeekdays, day]
    }));
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Usar el endpoint unificado de perfil de asistente
      const response = await fetch("/api/assistants/profile");
      
      if (!response.ok) {
        throw new Error("Error al cargar el perfil");
      }

      const data = await response.json();
      
      setFormData({
        // Información básica
        fullName: data.name || "",
        email: data.email || "",
        phoneNumber: data.phone || "",
        photoUrl: data.photoUrl || "",
        bio: data.bio || "",
        
        // Información profesional
        yearsExperience: data.experience ? String(data.experience) : "",
        hourlyRate: data.hourlyRate ? String(data.hourlyRate) : "",
        isAvailable: data.available || false,
        verified: data.verified || false,
        backgroundCheck: data.backgroundCheck || false,
        hasFirstAid: data.hasFirstAid || false,
        hasVehicle: data.hasVehicle || false,
        maxDistanceKm: data.maxDistanceKm ? String(data.maxDistanceKm) : "",
        
        // Ubicación
        province: data.location?.province || "",
        canton: data.location?.canton || "",
        district: data.location?.district || "",
        addressLine1: data.location?.addressLine1 || "",
        addressLine2: data.location?.addressLine2 || "",
        country: data.location?.country || "",
        postalCode: data.location?.postalCode || "",
        
        // Horario
        availabilitySchedule: data.availabilitySchedule || "8:00 AM - 6:00 PM",
        availableWeekdays: Array.isArray(data.availableWeekdays) ? data.availableWeekdays : [],
        
        // Arrays
        specialties: Array.isArray(data.specialties) ? data.specialties : [],
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        languages: Array.isArray(data.languages) ? data.languages : [],
        preferredAgeGroups: Array.isArray(data.preferredAgeGroups) ? data.preferredAgeGroups : [],
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty("");
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleAddAgeGroup = () => {
    if (newAgeGroup.trim()) {
      setFormData(prev => ({
        ...prev,
        preferredAgeGroups: [...prev.preferredAgeGroups, newAgeGroup.trim()]
      }));
      setNewAgeGroup("");
    }
  };

  const handleRemoveAgeGroup = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preferredAgeGroups: prev.preferredAgeGroups.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/assistants/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phoneNumber,
          photoUrl: formData.photoUrl,
          bio: formData.bio,
          yearsExperience: formData.yearsExperience ? Number(formData.yearsExperience) : 0,
          hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
          available: formData.isAvailable,
          hasFirstAid: formData.hasFirstAid,
          hasVehicle: formData.hasVehicle,
          maxDistanceKm: formData.maxDistanceKm ? Number(formData.maxDistanceKm) : null,
          specialties: formData.specialties,
          certifications: formData.certifications,
          languages: formData.languages,
          preferredAgeGroups: formData.preferredAgeGroups,
          availabilitySchedule: formData.availabilitySchedule,
          availableWeekdays: formData.availableWeekdays,
          location: {
            province: formData.province,
            canton: formData.canton,
            district: formData.district,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            country: formData.country,
            postalCode: formData.postalCode,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el perfil");
      }

      alert("Perfil actualizado exitosamente");
      router.push("/asistentes/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error al guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Gradient - Tema Verde/Emerald */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8 text-white shadow-lg">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancel}
              className="mb-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Editar Perfil Profesional</h1>
                <p className="text-green-100 text-lg">
                  Actualiza tu información y amplía tus características profesionales
                </p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-green-100">Última actualización</p>
                  <p className="font-semibold">{new Date().toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
                {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} size="lg">
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-emerald-600 hover:to-green-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>

        {/* Personal Information Card */}
        <Card className="border-l-4 border-l-cyan-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-emerald-950/30 dark:to-green-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <User className="w-6 h-6 text-cyan-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl">Información Personal</h2>
                <p className="text-sm text-muted-foreground font-normal">Datos básicos de tu cuenta</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Profile Photo with Upload */}
            <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-lg">
              <Label className="text-base font-semibold mb-4 block">
                Foto de Perfil
              </Label>
              <ImageUpload
                currentImage={formData.photoUrl}
                onImageChange={(url: string) => setFormData(prev => ({ ...prev, photoUrl: url }))}
                bucket="avatars"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-600" />
                Nombre Completo
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Juan Pérez González"
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-600" />
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  className="h-11 bg-muted"
                />
                <p className="text-xs text-muted-foreground">El correo no puede ser modificado</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-base flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-600" />
                  Teléfono
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+506 0000-0000"
                  className="h-11"
                />
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2 pt-4 border-t-2 border-cyan-100 dark:border-cyan-900">
              <Label htmlFor="bio" className="text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-600" />
                Biografía Profesional
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Cuéntanos sobre tu experiencia, habilidades y enfoque de cuidado..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Esta información se mostrará a los usuarios en tu perfil
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl">Ubicación</h2>
                <p className="text-sm text-muted-foreground font-normal">Dirección de operación</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Geographic Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province" className="text-base flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Provincia
                </Label>
                <Input 
                  id="province" 
                  name="province" 
                  value={formData.province} 
                  onChange={handleInputChange} 
                  placeholder="San José"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canton" className="text-base flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Cantón
                </Label>
                <Input 
                  id="canton" 
                  name="canton" 
                  value={formData.canton} 
                  onChange={handleInputChange} 
                  placeholder="Escazú"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district" className="text-base flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-lime-500"></div>
                  Distrito
                </Label>
                <Input 
                  id="district" 
                  name="district" 
                  value={formData.district} 
                  onChange={handleInputChange} 
                  placeholder="San Rafael"
                  className="h-11"
                />
              </div>
            </div>

            {/* Address Lines */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1" className="text-base">Dirección Línea 1</Label>
                <Input 
                  id="addressLine1" 
                  name="addressLine1" 
                  value={formData.addressLine1} 
                  onChange={handleInputChange} 
                  placeholder="Calle principal, número de casa"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2" className="text-base text-muted-foreground">
                  Dirección Línea 2 <span className="text-xs">(opcional)</span>
                </Label>
                <Input 
                  id="addressLine2" 
                  name="addressLine2" 
                  value={formData.addressLine2} 
                  onChange={handleInputChange} 
                  placeholder="Apartamento, unidad, edificio"
                  className="h-11"
                />
              </div>
            </div>

            {/* Country and Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-600" />
                  País
                </Label>
                <Input 
                  id="country" 
                  name="country" 
                  value={formData.country} 
                  onChange={handleInputChange} 
                  placeholder="Costa Rica"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-base">Código Postal</Label>
                <Input 
                  id="postalCode" 
                  name="postalCode" 
                  value={formData.postalCode} 
                  onChange={handleInputChange} 
                  placeholder="10101"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information Card */}
        <Card className="border-l-4 border-l-cyan-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-emerald-950/30 dark:to-green-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Briefcase className="w-6 h-6 text-cyan-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl">Información Profesional</h2>
                <p className="text-sm text-muted-foreground font-normal">Experiencia y tarifas</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearsExperience" className="text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-600" />
                  Años de Experiencia
                </Label>
                <Input
                  id="yearsExperience"
                  name="yearsExperience"
                  type="number"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  placeholder="5"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate" className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-600" />
                  Tarifa por Hora (CRC)
                </Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  placeholder="8500"
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxDistanceKm" className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-600" />
                  Distancia Máxima (km)
                </Label>
                <Input
                  id="maxDistanceKm"
                  name="maxDistanceKm"
                  type="number"
                  value={formData.maxDistanceKm}
                  onChange={handleInputChange}
                  placeholder="10"
                  className="h-11"
                />
              </div>
            </div>

            {/* Availability Switch */}
            <div className="flex items-center justify-between p-5 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-emerald-950/30 dark:to-green-950/30 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-base">Disponibilidad</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.isAvailable ? "✓ Disponible para nuevos servicios" : "No disponible actualmente"}
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isAvailable: checked }))
                }
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Qualifications Card */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <FileCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl">Cualificaciones y Verificaciones</h2>
                <p className="text-sm text-muted-foreground font-normal">Certificaciones y documentos</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Background Check */}
              <div className="flex items-center justify-between p-4 border-2 border-green-200 dark:border-green-800 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-green-950/30 dark:to-emerald-950/30">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Antecedentes</p>
                    <p className="text-xs text-muted-foreground">Verificado</p>
                  </div>
                </div>
                <Switch
                  checked={formData.backgroundCheck}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, backgroundCheck: checked }))
                  }
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              {/* First Aid */}
              <div className="flex items-center justify-between p-4 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-emerald-950/30 dark:to-green-950/30">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-cyan-600" />
                  <div>
                    <p className="font-medium text-sm">Primeros Auxilios</p>
                    <p className="text-xs text-muted-foreground">Certificado</p>
                  </div>
                </div>
                <Switch
                  checked={formData.hasFirstAid}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasFirstAid: checked }))
                  }
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              {/* Vehicle */}
              <div className="flex items-center justify-between p-4 border-2 border-green-200 dark:border-green-800 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-green-950/30 dark:to-emerald-950/30">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Vehículo Propio</p>
                    <p className="text-xs text-muted-foreground">Disponible</p>
                  </div>
                </div>
                <Switch
                  checked={formData.hasVehicle}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasVehicle: checked }))
                  }
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialties Card */}
        <Card className="border-l-4 border-l-cyan-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-emerald-950/30 dark:to-green-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Award className="w-6 h-6 text-cyan-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl">Especialidades</h2>
                <p className="text-sm text-muted-foreground font-normal">Áreas de experiencia</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-wrap gap-2">
              {formData.specialties.map((specialty, index) => (
                <Badge 
                  key={index} 
                  className="gap-2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-emerald-600 hover:to-green-600"
                >
                  {specialty}
                  <button
                    onClick={() => handleRemoveSpecialty(index)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
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
                placeholder="Agregar especialidad (ej: Cuidado de adultos mayores)"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty()}
                className="h-11"
              />
              <Button onClick={handleAddSpecialty} variant="outline" size="lg">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Certifications Card */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl">Certificaciones</h2>
                <p className="text-sm text-muted-foreground font-normal">Formación y capacitación</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-wrap gap-2">
              {formData.certifications.map((cert, index) => (
                <Badge 
                  key={index} 
                  className="gap-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                >
                  {cert}
                  <button
                    onClick={() => handleRemoveCertification(index)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Agregar certificación (ej: Enfermería Básica)"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCertification()}
                className="h-11"
              />
              <Button onClick={handleAddCertification} variant="outline" size="lg">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Languages Card */}
        <Card className="border-l-4 border-l-cyan-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-emerald-950/30 dark:to-green-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Globe className="w-6 h-6 text-cyan-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl">Idiomas</h2>
                <p className="text-sm text-muted-foreground font-normal">Idiomas que hablas</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((language, index) => (
                <Badge 
                  key={index} 
                  className="gap-2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-emerald-600 hover:to-green-600"
                >
                  {language}
                  <button
                    onClick={() => handleRemoveLanguage(index)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Agregar idioma (ej: Español, Inglés)"
                onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                className="h-11"
              />
              <Button onClick={handleAddLanguage} variant="outline" size="lg">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferred Age Groups Card */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl">Grupos de Edad Preferidos</h2>
                <p className="text-sm text-muted-foreground font-normal">Edades con las que prefieres trabajar</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-wrap gap-2">
              {formData.preferredAgeGroups.map((ageGroup, index) => (
                <Badge 
                  key={index} 
                  className="gap-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                >
                  {ageGroup}
                  <button
                    onClick={() => handleRemoveAgeGroup(index)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newAgeGroup}
                onChange={(e) => setNewAgeGroup(e.target.value)}
                placeholder="Agregar grupo de edad (ej: Adultos mayores, Niños)"
                onKeyPress={(e) => e.key === 'Enter' && handleAddAgeGroup()}
                className="h-11"
              />
              <Button onClick={handleAddAgeGroup} variant="outline" size="lg">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Availability Schedule Card */}
        <Card className="border-l-4 border-l-cyan-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-emerald-950/30 dark:to-green-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Clock className="w-6 h-6 text-cyan-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl">Horario de Disponibilidad</h2>
                <p className="text-sm text-muted-foreground font-normal">Días y horas disponibles</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="availabilitySchedule" className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-600" />
                Horas Preferidas
              </Label>
              <Input
                id="availabilitySchedule"
                value={formData.availabilitySchedule}
                onChange={(e) => setFormData(prev => ({ ...prev, availabilitySchedule: e.target.value }))}
                placeholder="8:00 AM - 6:00 PM"
                className="h-11"
              />
            </div>

            {/* Weekdays Selection */}
            <div className="space-y-4 pt-4 border-t-2 border-cyan-100 dark:border-cyan-900">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Calendar className="w-5 h-5 text-cyan-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <Label className="text-lg font-semibold">
                    Días Disponibles
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selecciona los días de la semana en los que puedes trabajar
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border-2 border-dashed border-emerald-200 dark:border-emerald-800 rounded-xl bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20">
                {weekdayOptions.map((day) => (
                  <div
                    key={day}
                    onClick={() => toggleWeekday(day)}
                    className={`
                      group relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${
                        formData.availableWeekdays.includes(day)
                          ? 'border-emerald-500 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-emerald-950 dark:to-green-950 shadow-md scale-[1.02]'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-300 hover:shadow-sm'
                      }
                    `}
                  >
                    <p className={`font-semibold text-sm ${
                      formData.availableWeekdays.includes(day)
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {day}
                    </p>
                  </div>
                ))}
              </div>

              {formData.availableWeekdays.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-600" />
                    Días Seleccionados ({formData.availableWeekdays.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.availableWeekdays.map(day => (
                      <Badge 
                        key={day} 
                        className="gap-2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-emerald-600 hover:to-green-600"
                      >
                        {day}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWeekday(day);
                          }}
                          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-8 pt-4">
          <p className="text-sm text-muted-foreground">
            Los cambios se aplicarán inmediatamente al guardar
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} size="lg" className="min-w-[120px]">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              size="lg"
              className="min-w-[160px] bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
