"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  MapPin,
  DollarSign,
  Calendar,
  Award,
  Shield,
  Heart,
  CheckCircle,
  Edit,
  Briefcase,
  Clock,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Globe,
  Home,
  Navigation,
  Building2,
  MessageSquare
} from "lucide-react";

interface AssistantProfile {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  photoUrl: string | null;
  location: {
    province?: string | null;
    canton?: string | null;
    district?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    country?: string | null;
    postalCode?: string | null;
  } | null;
  rating: number | null;
  ratingCount: number | null;
  assistant: {
    bio: string | null;
    yearsExperience: number;
    hourlyRate: number | null;
    specialties: string[];
    certifications: string[];
    languages: string[];
    availableWeekdays: string[];
  } | null;
  createdAt: string;
}

export default function AssistantProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<AssistantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch("/api/profile");
      
      if (!response.ok) {
        throw new Error("Error al cargar el perfil");
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push("/asistentes/settingsProfile");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Cargando perfil...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profileData) {
    return (
      <DashboardLayout>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <MessageSquare className="w-12 h-12 text-red-500 mx-auto" />
              <p className="text-red-600 dark:text-red-400">{error || "No se pudo cargar el perfil"}</p>
              <Button onClick={fetchProfile} variant="outline">Reintentar</Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const getLocationShort = () => {
    if (!profileData.location) return "No especificada";
    const parts = [];
    if (profileData.location.canton) parts.push(profileData.location.canton);
    if (profileData.location.province) parts.push(profileData.location.province);
    if (profileData.location.country) parts.push(profileData.location.country);
    return parts.length > 0 ? parts.join(', ') : "No especificada";
  };

  const getFullAddress = () => {
    if (!profileData.location) return "No especificada";
    
    const parts = [];
    if (profileData.location.addressLine1) parts.push(profileData.location.addressLine1);
    if (profileData.location.addressLine2) parts.push(profileData.location.addressLine2);
    if (profileData.location.district) parts.push(profileData.location.district);
    if (profileData.location.canton) parts.push(profileData.location.canton);
    if (profileData.location.province) parts.push(profileData.location.province);
    if (profileData.location.postalCode) parts.push(`CP ${profileData.location.postalCode}`);
    if (profileData.location.country) parts.push(profileData.location.country);
    
    return parts.length > 0 ? parts.join(', ') : "No especificada";
  };

  const rating = profileData.rating || 0;
  const ratingCount = profileData.ratingCount || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Premium con gradiente y estadísticas */}
        <Card className="overflow-hidden border-0 shadow-xl">
          {/* Gradiente superior - Tema Cyan/Blue igual que usuarios */}
          <div className="h-40 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <CardContent className="relative px-6 pb-6">
            {/* Avatar flotante con indicador de disponibilidad */}
            <div className="flex flex-col md:flex-row gap-6 -mt-20 relative z-10">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-background shadow-2xl">
                  <AvatarImage src={profileData.photoUrl || undefined} alt={profileData.fullName} />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                    {profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* Indicador de disponibilidad */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 rounded-full border-4 border-background flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Información principal */}
              <div className="flex-1 space-y-4 pt-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-3">
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-white">
                        {profileData.fullName}
                      </h1>
                      <div className="flex items-center gap-3 mt-2">
                        {/* Rating con estrellas */}
                        {rating > 0 && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="ml-2 font-semibold text-lg">{rating.toFixed(1)}</span>
                            <span className="text-muted-foreground text-sm">({ratingCount} reseñas)</span>
                          </div>
                        )}
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Disponible
                        </Badge>
                      </div>
                    </div>

                    {/* Especialidades destacadas */}
                    {profileData.assistant?.specialties && profileData.assistant.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profileData.assistant.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300 px-3 py-1">
                            <Heart className="w-3 h-3 mr-1" />
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleEditProfile}
                    className="bg-white text-blue-600 hover:bg-blue-50 border border-blue-600 shadow-lg"
                  >
                    <Edit className="w-4 h-4 mr-2 text-blue-600" />
                    Editar Perfil
                  </Button>
                </div>

                <Separator />

                {/* Estadísticas clave */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-green-950/20 dark:to-emerald-950/20">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Experiencia</p>
                      <p className="text-sm font-bold">{profileData.assistant?.yearsExperience || 0} años</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-emerald-950/20 dark:to-green-950/20">
                    <div className="p-2 rounded-full bg-cyan-500/10">
                      <DollarSign className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tarifa/hora</p>
                      <p className="text-sm font-bold">₡{profileData.assistant?.hourlyRate?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-green-950/20 dark:to-emerald-950/20">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Clientes</p>
                      <p className="text-sm font-bold">{ratingCount} activos</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-emerald-950/20 dark:to-green-950/20">
                    <div className="p-2 rounded-full bg-cyan-500/10">
                      <Star className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Calificación</p>
                      <p className="text-sm font-bold">{rating > 0 ? `${rating.toFixed(1)}/5.0 ⭐` : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Información de contacto rápida */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Correo</p>
                      <p className="text-sm font-medium truncate">{profileData.email}</p>
                    </div>
                  </div>

                  {profileData.phoneNumber && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                      <div className="p-2 rounded-full bg-blue-500/10">
                        <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Teléfono</p>
                        <p className="text-sm font-medium">{profileData.phoneNumber}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/30">
                    <div className="p-2 rounded-full bg-cyan-500/10">
                      <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Ubicación</p>
                      <p className="text-sm font-medium truncate">{getLocationShort()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Tabs con información profesional */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
            <TabsTrigger value="about" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              <Briefcase className="w-4 h-4 mr-2" />
              Sobre Mí
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              <Award className="w-4 h-4 mr-2" />
              Habilidades
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              <Calendar className="w-4 h-4 mr-2" />
              Horario
            </TabsTrigger>
            <TabsTrigger value="location" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              <MapPin className="w-4 h-4 mr-2" />
              Ubicación
            </TabsTrigger>
          </TabsList>

          {/* Tab: Sobre Mí */}
          <TabsContent value="about" className="mt-6 space-y-4">
            {/* Biografía */}
            {profileData.assistant?.bio && (
              <Card className="border-l-4 border-l-cyan-500">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    Acerca de Mí
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">{profileData.assistant.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Estadísticas de rendimiento */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Desempeño Profesional
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {rating > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Calificación General</span>
                      <span className="text-2xl font-bold text-blue-600">{rating.toFixed(1)}</span>
                    </div>
                    <Progress value={(rating / 5) * 100} className="h-3" />
                    <p className="text-xs text-muted-foreground">Basado en {ratingCount} reseñas de clientes</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-cyan-600">{profileData.assistant?.yearsExperience || 0}</p>
                    <p className="text-sm text-muted-foreground mt-1">Años de Experiencia</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-blue-600">{ratingCount}</p>
                    <p className="text-sm text-muted-foreground mt-1">Clientes Atendidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Habilidades */}
          <TabsContent value="skills" className="mt-6 space-y-4">
            {/* Especialidades */}
            {profileData.assistant?.specialties && profileData.assistant.specialties.length > 0 && (
              <Card className="border-l-4 border-l-cyan-500">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <Heart className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    Especialidades
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {profileData.assistant.specialties.map((specialty, index) => (
                      <Badge key={index} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 text-sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certificaciones */}
            {profileData.assistant?.certifications && profileData.assistant.certifications.length > 0 && (
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Certificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {profileData.assistant.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-100 dark:border-blue-900">
                        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-blue-900 dark:text-blue-100">{cert}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Idiomas */}
            {profileData.assistant?.languages && profileData.assistant.languages.length > 0 && (
              <Card className="border-l-4 border-l-cyan-500">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    Idiomas
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {profileData.assistant.languages.map((language, index) => (
                      <Badge key={index} className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 px-4 py-2">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Horario */}
          <TabsContent value="schedule" className="mt-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Disponibilidad
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Días disponibles */}
                {profileData.assistant?.availableWeekdays && profileData.assistant.availableWeekdays.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-3">Días Disponibles</p>
                    <div className="grid grid-cols-7 gap-2">
                      {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => {
                        const isAvailable = profileData.assistant?.availableWeekdays.some(
                          d => d.toLowerCase().includes(day.toLowerCase())
                        );
                        return (
                          <div
                            key={index}
                            className={`text-center p-3 rounded-lg font-semibold ${
                              isAvailable
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-2 border-green-500'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tarifa */}
                {profileData.assistant?.hourlyRate && (
                  <div className="p-6 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-2 border-cyan-200 dark:border-cyan-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tarifa por Hora</p>
                        <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">
                          ${profileData.assistant.hourlyRate}
                        </p>
                      </div>
                      <DollarSign className="w-16 h-16 text-cyan-600/20" />
                    </div>
                  </div>
                )}

                {/* Estado de disponibilidad */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        Actualmente Disponible
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Aceptando nuevos clientes y solicitudes de servicio
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Ubicación */}
          <TabsContent value="location" className="mt-6">
            <Card className="border-l-4 border-l-cyan-500">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  Ubicación de Servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {profileData.location ? (
                  <div className="space-y-6">
                    {/* Dirección Principal */}
                    {(profileData.location.addressLine1 || profileData.location.addressLine2) && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                          <Home className="w-4 h-4" />
                          DIRECCIÓN
                        </div>
                        {profileData.location.addressLine1 && (
                          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <Navigation className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Línea 1</p>
                              <p className="text-base font-semibold">{profileData.location.addressLine1}</p>
                            </div>
                          </div>
                        )}
                        {profileData.location.addressLine2 && (
                          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <Navigation className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Línea 2</p>
                              <p className="text-base font-semibold">{profileData.location.addressLine2}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <Separator />

                    {/* Ubicación Geográfica */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        UBICACIÓN GEOGRÁFICA
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {profileData.location.district && (
                          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-100 dark:border-blue-900">
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Distrito</p>
                            <p className="text-base font-bold text-blue-900 dark:text-blue-100">{profileData.location.district}</p>
                          </div>
                        )}
                        {profileData.location.canton && (
                          <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border border-cyan-100 dark:border-cyan-900">
                            <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-1">Cantón</p>
                            <p className="text-base font-bold text-cyan-900 dark:text-cyan-100">{profileData.location.canton}</p>
                          </div>
                        )}
                        {profileData.location.province && (
                          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-100 dark:border-green-900">
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Provincia</p>
                            <p className="text-base font-bold text-green-900 dark:text-green-100">{profileData.location.province}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* País y Código Postal */}
                    {(profileData.location.country || profileData.location.postalCode) && (
                      <>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {profileData.location.country && (
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-100 dark:border-blue-900">
                              <div className="p-3 rounded-full bg-blue-500/10">
                                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">País</p>
                                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{profileData.location.country}</p>
                              </div>
                            </div>
                          )}
                          {profileData.location.postalCode && (
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900">
                              <div className="p-3 rounded-full bg-amber-500/10">
                                <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Código Postal</p>
                                <p className="text-lg font-bold text-amber-900 dark:text-amber-100">{profileData.location.postalCode}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <Separator />

                    {/* Dirección Completa */}
                    <div className="p-6 rounded-lg bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 border-2 border-dashed border-slate-300 dark:border-slate-700">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-2">Dirección Completa</p>
                          <p className="text-base leading-relaxed font-medium">{getFullAddress()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No se ha especificado una dirección de servicio</p>
                    <Button variant="outline" onClick={handleEditProfile}>
                      <MapPin className="w-4 h-4 mr-2" />
                      Agregar Dirección
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
