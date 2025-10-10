"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MyProfileHeader } from "@/components/usuarios/MyProfileHeader";
import { UserInfoTab } from "@/components/usuarios/UserInfoTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import type { MyUserProfileData } from "@/components/usuarios/MyProfileHeader";

// Mock data - En producción vendría de una API
const userData: MyUserProfileData = {
  name: "Juan Pérez Mora",
  avatar: "JP",
  email: "juan.perez@example.com",
  phone: "+506 8888-9999",
  location: "Heredia, Costa Rica",
  memberSince: "2023-06-15",
  verified: true,
};

const personalInfo = {
  age: 72,
  emergencyContact: "María Pérez (Hija)",
  emergencyPhone: "+506 7777-8888",
};

const careNeeds = {
  careType: "Cuidado en el hogar",
  frequency: "3 veces por semana",
  specialRequirements: [
    "Asistencia con movilidad",
    "Recordatorio de medicamentos",
    "Compañía durante el día",
    "Preparación de comidas",
    "Apoyo con higiene personal",
  ],
};

const upcomingAppointments = [
  {
    id: "1",
    assistant: "María González",
    date: "2024-02-05",
    time: "10:00 AM - 2:00 PM",
    service: "Cuidado personal y compañía",
  },
  {
    id: "2",
    assistant: "Carlos Vargas",
    date: "2024-02-07",
    time: "9:00 AM - 1:00 PM",
    service: "Acompañamiento a cita médica",
  },
];

export default function UserProfilePage() {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push("/usuarios/settingsProfile");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MyProfileHeader
          data={userData}
          onEdit={handleEditProfile}
        />

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Información Personal</TabsTrigger>
            <TabsTrigger value="appointments">
              Próximas Citas ({upcomingAppointments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-6">
            <UserInfoTab
              personalInfo={personalInfo}
              careNeeds={careNeeds}
            />
          </TabsContent>
          
          <TabsContent value="appointments" className="mt-6">
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{appointment.assistant}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                    <p className="text-muted-foreground">{appointment.service}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
