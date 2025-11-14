"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Loader2 } from "lucide-react";
import type { MyUserProfileData } from "@/components/usuarios/MyProfileHeader";

interface Appointment {
  id: string;
  assistant: {
    name: string;
  };
  date: Date;
  time: string;
  service: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<MyUserProfileData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch user profile
        const profileRes = await fetch("/api/users/profile");
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUserData({
            name: profile.name,
            avatar: profile.photoUrl || profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
            email: profile.email,
            phone: profile.phone || "Sin teléfono",
            location: profile.location?.fullAddress || "Sin ubicación",
            memberSince: profile.memberSince,
            verified: profile.verified,
          });
        }

        // Fetch appointments
        const appointmentsRes = await fetch("/api/users/appointments");
        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json();
          setAppointments(appointmentsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleEditProfile = () => {
    router.push("/usuarios/profile/edit");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!userData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-lg text-neutral-600">No se pudo cargar el perfil</p>
        </div>
      </DashboardLayout>
    );
  }

  const personalInfo = {
    email: userData.email,
    phone: userData.phone,
    emergencyContact: "Por configurar",
  };

  const careNeeds = {
    location: userData.location,
    memberSince: new Date(userData.memberSince).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
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
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <p className="text-red-600 dark:text-red-400">{error || "No se pudo cargar el perfil"}</p>
              <Button onClick={fetchProfile} variant="outline">Reintentar</Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  // Construir dirección completa
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

  const getLocationShort = () => {
    if (!profileData.location) return "No especificada";
    
    const parts = [];
    if (profileData.location.canton) parts.push(profileData.location.canton);
    if (profileData.location.province) parts.push(profileData.location.province);
    if (profileData.location.country) parts.push(profileData.location.country);
    
    return parts.length > 0 ? parts.join(', ') : "No especificada";
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 px-2 md:px-0">
        {/* Header moderno con gradiente - Optimizado para móvil */}
        <Card className="overflow-hidden border-0 shadow-lg">
          {/* Gradiente superior - Altura reducida en móvil */}
          <div className="h-24 md:h-32 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600" />
          
          <CardContent className="relative px-4 md:px-6 pb-4 md:pb-6">
            {/* Avatar flotante - Tamaño responsivo */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 -mt-12 md:-mt-16 relative z-10">
              {profileData.photoUrl && profileData.photoUrl.trim() !== '' ? (
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-xl mx-auto md:mx-0">
                  <AvatarImage src={profileData.photoUrl} alt={profileData.fullName} />
                  <AvatarFallback className="text-2xl md:text-3xl font-bold bg-gray-100 dark:bg-gray-800 text-transparent">
                    {profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-100 dark:bg-gray-800 border-4 border-background shadow-xl mx-auto md:mx-0"></div>
              )}

<<<<<<< Updated upstream
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-neutral-100">
            <TabsTrigger 
              value="info"
              className="data-[state=active]:bg-white data-[state=active]:text-primary-600"
            >
              Información Personal
            </TabsTrigger>
            <TabsTrigger 
              value="appointments"
              className="data-[state=active]:bg-white data-[state=active]:text-primary-600"
            >
              Próximas Citas ({appointments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-6">
            <UserInfoTab
              personalInfo={personalInfo}
              careNeeds={careNeeds}
            />
          </TabsContent>
          
          <TabsContent value="appointments" className="mt-6">
            {appointments.length === 0 ? (
              <Card className="border-neutral-200">
                <CardContent className="pt-8 pb-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
                  <p className="text-neutral-600 font-medium">No tienes citas programadas</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Las citas confirmadas aparecerán aquí
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="border-neutral-200 hover:border-primary-300 transition-colors">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-neutral-900">
                        {appointment.assistant.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-neutral-700">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-700">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span>{appointment.time}</span>
                      </div>
                      <p className="text-neutral-600 bg-neutral-50 px-3 py-2 rounded-md mt-2">
                        {appointment.service}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
=======
              {/* Información principal - Centrada en móvil */}
              <div className="flex-1 space-y-3 md:space-y-4 pt-2 md:pt-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                  <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {profileData.fullName}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground justify-center md:justify-start">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs md:text-sm">
                        Miembro desde {new Date(profileData.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleEditProfile} 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 w-full md:w-auto"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>

                {/* Badges de estado - Grid en móvil */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {profileData.hasSafeguard && (
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-2 md:px-3 py-1 text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Salvaguarda
                    </Badge>
                  )}
                  {profileData.disabilities && profileData.disabilities.length > 0 && profileData.disabilities.map((disability) => (
                    <Badge key={disability.id} variant="secondary" className="px-2 md:px-3 py-1 text-xs bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800">
                      <Heart className="w-3 h-3 mr-1" />
                      {disability.name}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="px-2 md:px-3 py-1 text-xs border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                </div>

                <Separator className="my-2 md:my-3" />

                {/* Información de contacto rápida - Optimizada para móvil */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                    <div className="p-2 rounded-full bg-blue-500/10 flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Correo</p>
                      <p className="text-xs md:text-sm font-medium truncate">{profileData.email}</p>
                    </div>
                  </div>

                  {profileData.phoneNumber && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900">
                      <div className="p-2 rounded-full bg-green-500/10 flex-shrink-0">
                        <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Teléfono</p>
                        <p className="text-xs md:text-sm font-medium">{profileData.phoneNumber}</p>
                      </div>
                    </div>
                  )}

                  {profileData.location && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900 sm:col-span-2 lg:col-span-1">
                      <div className="p-2 rounded-full bg-cyan-500/10 flex-shrink-0">
                        <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Ubicación</p>
                        <p className="text-xs md:text-sm font-medium truncate">{getLocationShort()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs - Diseño responsive */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-auto">
            <TabsTrigger 
              value="info" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs md:text-sm py-2 md:py-2.5"
            >
              <User className="w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Información</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger 
              value="location" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs md:text-sm py-2 md:py-2.5"
            >
              <MapPin className="w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2" />
              Ubicación
            </TabsTrigger>
            <TabsTrigger 
              value="appointments" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs md:text-sm py-2 md:py-2.5"
            >
              <Calendar className="w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Citas ({upcomingAppointments.length})</span>
              <span className="sm:hidden">Citas</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-4 md:mt-6 space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
              {/* Información Personal - Optimizada para móvil */}
              <Card className="border-l-4 border-l-cyan-500">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20 p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <div className="p-1.5 md:p-2 rounded-lg bg-cyan-500/10">
                      <User className="w-4 md:w-5 h-4 md:h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 p-4 md:pt-6">
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-start gap-3 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <User className="w-4 md:w-5 h-4 md:h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Nombre Completo</p>
                        <p className="text-sm md:text-base font-semibold">{profileData.fullName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <Mail className="w-4 md:w-5 h-4 md:h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Correo Electrónico</p>
                        <p className="text-sm md:text-base font-semibold break-all">{profileData.email}</p>
                      </div>
                    </div>

                    {profileData.phoneNumber && (
                      <div className="flex items-start gap-3 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <Phone className="w-4 md:w-5 h-4 md:h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm font-medium text-muted-foreground">Teléfono</p>
                          <p className="text-sm md:text-base font-semibold">{profileData.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {profileData.disabilities && profileData.disabilities.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2 md:mb-3 flex items-center gap-2">
                          <Heart className="w-3 md:w-4 h-3 md:h-4" />
                          {profileData.disabilities.length === 1 ? 'Condición Médica' : 'Condiciones Médicas'}
                        </p>
                        <div className="space-y-2">
                          {profileData.disabilities.map((disability) => (
                            <div key={disability.id} className="p-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-lg border border-cyan-100 dark:border-cyan-900">
                              <p className="text-sm md:text-base font-semibold text-cyan-900 dark:text-cyan-100">{disability.name}</p>
                              {disability.description && (
                                <p className="text-xs md:text-sm text-cyan-700 dark:text-cyan-300 mt-1">
                                  {disability.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Contacto de Emergencia - Diseño mejorado */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/20">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    Contacto de Emergencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {profileData.emergencyNumber ? (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900">
                      <Phone className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">Teléfono de Emergencia</p>
                        <p className="text-lg font-bold text-red-900 dark:text-red-100">{profileData.emergencyNumber}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-muted text-center">
                      <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No especificado</p>
                      <Button variant="outline" onClick={handleEditProfile} className="mt-2">
                        Agregar contacto de emergencia
                      </Button>
                    </div>
                  )}
                  
                  {profileData.hasSafeguard && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-900 dark:text-blue-100">
                            Salvaguarda Legal Activa
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Este usuario cuenta con protección legal mediante salvaguarda autorizada
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notas Adicionales */}
            {profileData.notes && (
              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    Notas y Observaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">{profileData.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="location" className="mt-6">
            <Card className="border-l-4 border-l-cyan-500">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <MapPinned className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  Ubicación Completa
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
                          <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-100 dark:border-green-900">
                            <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Provincia</p>
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
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900">
                              <div className="p-3 rounded-full bg-indigo-500/10">
                                <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">País</p>
                                <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{profileData.location.country}</p>
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

                    {/* Dirección Completa Formateada */}
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
                    <p className="text-muted-foreground mb-4">No se ha especificado una dirección</p>
                    <Button variant="outline" onClick={handleEditProfile}>
                      <MapPin className="w-4 h-4 mr-2" />
                      Agregar Dirección
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments" className="mt-6">
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Fecha destacada */}
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 md:w-32 flex flex-col items-center justify-center">
                          <Calendar className="w-8 h-8 mb-2" />
                          <p className="text-2xl font-bold">
                            {new Date(appointment.date).getDate()}
                          </p>
                          <p className="text-sm opacity-90">
                            {new Date(appointment.date).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                          </p>
                        </div>

                        {/* Detalles de la cita */}
                        <div className="flex-1 p-6 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-bold">{appointment.assistant}</h3>
                              <p className="text-sm text-muted-foreground">{appointment.service}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              Confirmada
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(appointment.date).toLocaleDateString('es-ES', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center space-y-4">
                      <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                      <div>
                        <p className="text-lg font-medium">No hay citas programadas</p>
                        <p className="text-sm text-muted-foreground">
                          Tus próximas citas aparecerán aquí
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
>>>>>>> Stashed changes
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
