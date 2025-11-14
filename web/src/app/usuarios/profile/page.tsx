"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Loader2, Edit, Phone, User as UserIcon, Mail, MapPin, CheckCircle, Shield, Heart, MapPinned, Home, Navigation, Globe, Building2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  emergencyNumber: string | null;
  disability: string | null;
  hasSafeguard: boolean;
  notes: string | null;
  location: {
    addressLine1: string | null;
    addressLine2: string | null;
    district: string | null;
    canton: string | null;
    province: string | null;
    country: string | null;
    postalCode: string | null;
  } | null;
  memberSince: string;
  verified: boolean;
}

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
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setIsLoading(true);
      
      // Fetch user profile
      const profileRes = await fetch("/api/users/profile");
      if (profileRes.ok) {
        const profile = await profileRes.json();
        setProfileData(profile);
      }

      // Fetch appointments
      const appointmentsRes = await fetch("/api/users/appointments");
      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        setUpcomingAppointments(appointmentsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditProfile = () => {
    router.push("/usuarios/settingsProfile");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profileData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-lg text-neutral-600">No se pudo cargar el perfil</p>
          <Button onClick={fetchProfile} className="mt-4">Reintentar</Button>
        </div>
      </DashboardLayout>
    );
  }

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
    
    return parts.length > 0 ? parts.join(", ") : "No especificada";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header con Avatar y Nombre */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8 shadow-lg">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative flex items-center space-x-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
              <AvatarImage src={profileData.photoUrl || undefined} alt={profileData.name} />
              <AvatarFallback className="bg-white text-blue]\-600 text-2xl font-bold">
                {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{profileData.name}</h1>
                {profileData.verified && (
                  <Badge className="bg-white/20 hover:bg-white/30 border-white/40 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
              <p className="text-blue-100 text-sm">
                Miembro desde {new Date(profileData.memberSince).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Button
              onClick={handleEditProfile}
              variant="outline"
              className="bg-white hover:bg-blue-50 text-blue-600 border-0 shadow-md"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </div>

        {/* Tabs con Información */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-auto">
            <TabsTrigger 
              value="info" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-md transition-all"
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Información Personal
            </TabsTrigger>
            <TabsTrigger 
              value="location" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-md transition-all"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Ubicación
            </TabsTrigger>
            <TabsTrigger 
              value="appointments" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-md transition-all"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Citas
            </TabsTrigger>
          </TabsList>

          {/* Información Personal */}
          <TabsContent value="info" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contacto */}
              <Card className="border-l-4 border-l-cyan-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mail className="w-5 h-5 text-cyan-600" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-neutral-500 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-500">Email</p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-neutral-500 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-500">Teléfono</p>
                      <p className="font-medium">{profileData.phone || "No especificado"}</p>
                    </div>
                  </div>
                  {profileData.emergencyNumber && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-red-500 mt-1" />
                        <div>
                          <p className="text-sm text-neutral-500">Contacto de Emergencia</p>
                          <p className="font-medium text-red-600">{profileData.emergencyNumber}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Necesidades de Cuidado */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="w-5 h-5 text-blue-600" />
                    Necesidades de Cuidado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.disability && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-sm text-neutral-500 mb-1">Discapacidad</p>
                      <p className="font-medium text-blue-700 dark:text-blue-300">{profileData.disability}</p>
                    </div>
                  )}
                  {profileData.hasSafeguard && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                          Salvaguarda Activa
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Protección adicional habilitada
                        </p>
                      </div>
                    </div>
                  )}
                  {profileData.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-neutral-500 mb-2">Notas Adicionales</p>
                        <p className="text-sm bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg">
                          {profileData.notes}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ubicación */}
          <TabsContent value="location" className="mt-6">
            <Card className="border-l-4 border-l-cyan-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="w-5 h-5 text-cyan-600" />
                  Dirección Completa
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profileData.location ? (
                  <div className="space-y-4">
                    {profileData.location.addressLine1 && (
                      <div className="flex items-start gap-3">
                        <Home className="w-4 h-4 text-neutral-500 mt-1" />
                        <div>
                          <p className="text-sm text-neutral-500">Dirección Principal</p>
                          <p className="font-medium">{profileData.location.addressLine1}</p>
                        </div>
                      </div>
                    )}
                    {profileData.location.addressLine2 && (
                      <>
                        <Separator />
                        <div className="flex items-start gap-3">
                          <Building2 className="w-4 h-4 text-neutral-500 mt-1" />
                          <div>
                            <p className="text-sm text-neutral-500">Dirección Secundaria</p>
                            <p className="font-medium">{profileData.location.addressLine2}</p>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profileData.location.district && (
                        <div className="flex items-start gap-2">
                          <Navigation className="w-4 h-4 text-neutral-500 mt-1" />
                          <div>
                            <p className="text-xs text-neutral-500">Distrito</p>
                            <p className="text-sm font-medium">{profileData.location.district}</p>
                          </div>
                        </div>
                      )}
                      {profileData.location.canton && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-neutral-500 mt-1" />
                          <div>
                            <p className="text-xs text-neutral-500">Cantón</p>
                            <p className="text-sm font-medium">{profileData.location.canton}</p>
                          </div>
                        </div>
                      )}
                      {profileData.location.province && (
                        <div className="flex items-start gap-2">
                          <Globe className="w-4 h-4 text-neutral-500 mt-1" />
                          <div>
                            <p className="text-xs text-neutral-500">Provincia</p>
                            <p className="text-sm font-medium">{profileData.location.province}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {(profileData.location.postalCode || profileData.location.country) && (
                      <>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {profileData.location.postalCode && (
                            <div>
                              <p className="text-sm text-neutral-500">Código Postal</p>
                              <p className="font-medium">{profileData.location.postalCode}</p>
                            </div>
                          )}
                          {profileData.location.country && (
                            <div>
                              <p className="text-sm text-neutral-500">País</p>
                              <p className="font-medium">{profileData.location.country}</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                      <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100 mb-1">
                        Dirección Completa
                      </p>
                      <p className="text-sm text-cyan-700 dark:text-cyan-300">
                        {getFullAddress()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No se ha especificado una ubicación</p>
                    <Button onClick={handleEditProfile} variant="outline" className="mt-4">
                      Agregar Ubicación
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Citas */}
          <TabsContent value="appointments" className="mt-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Próximas Citas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col items-center justify-center bg-blue-600 text-white rounded-lg p-3 min-w-[60px]">
                            <Clock className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">{appointment.time}</span>
                          </div>
                          <div>
                            <p className="font-medium text-blue-900 dark:text-blue-100">
                              {appointment.service}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              con {appointment.assistant.name}
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">
                              {new Date(appointment.date).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                          Confirmada
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No tienes citas próximas</p>
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
