"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MyProfileHeader } from "@/components/usuarios/MyProfileHeader";
import { UserInfoTab } from "@/components/usuarios/UserInfoTab";
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MyProfileHeader
          data={userData}
          onEdit={handleEditProfile}
        />

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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
