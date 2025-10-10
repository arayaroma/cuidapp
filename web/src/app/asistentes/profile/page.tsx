"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MyProfileHeader } from "@/components/asistentes/MyProfileHeader";
import { AssistantInfoTab } from "@/components/asistentes/AssistantInfoTab";
import type { MyProfileHeaderData } from "@/components/asistentes/MyProfileHeader";

const assistantData: MyProfileHeaderData = {
  name: "María González",
  avatar: "MG",
  experience: "8 años de experiencia",
  rating: 4.8,
  reviews: 42,
  hourlyRate: 25,
  location: "San José, Costa Rica",
  specialties: ["Cuidado de Adultos Mayores", "Enfermería", "Compañía"],
  available: true,
};

const certifications = [
  {
    title: "Certificada en Primeros Auxilios",
    description: "Cruz Roja Costarricense - 2022",
    icon: "shield" as const,
  },
  {
    title: "Técnico en Enfermería",
    description: "Colegio Universitario de Cartago - 2015",
    icon: "award" as const,
  },
  {
    title: "Curso de Cuidado Geriátrico",
    description: "Universidad de Costa Rica - 2020",
    icon: "award" as const,
  },
];

const services = [
  "Cuidado personal y asistencia diaria",
  "Administración de medicamentos",
  "Compañía y apoyo emocional",
  "Preparación de comidas",
  "Acompañamiento a citas médicas",
  "Ejercicios de rehabilitación básica",
];

const schedule = {
  preferredHours: "8:00 AM - 6:00 PM",
  availableDays: "Lunes a Viernes",
};

export default function AssistantProfilePage() {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/asistentes/settingsProfile");
  };

  const myProfileData: MyProfileHeaderData = {
    name: assistantData.name,
    avatar: assistantData.avatar,
    experience: assistantData.experience,
    rating: assistantData.rating,
    reviews: assistantData.reviews,
    hourlyRate: assistantData.hourlyRate,
    location: assistantData.location,
    specialties: assistantData.specialties,
    available: assistantData.available,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MyProfileHeader
          data={myProfileData}
          onEdit={handleEdit}
        />

        <div className="mt-6">
          <AssistantInfoTab
            certifications={certifications}
            services={services}
            schedule={schedule}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
