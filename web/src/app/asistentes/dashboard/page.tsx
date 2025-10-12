"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssistantDashboardCards } from "@/components/asistentes/AssistantDashboardCards";
import { mockAvailableRequests, mockMyOffers, mockAcceptedJobs } from "@/data/mockRequests";
import { Briefcase } from "lucide-react";

export default function AssistantsDashboardPage() {
  const router = useRouter();
  const [availableRequests] = useState(mockAvailableRequests);
  const [myOffers] = useState(mockMyOffers);
  const [acceptedJobs] = useState(mockAcceptedJobs);

  const handleViewAvailable = () => {
    router.push("/asistentes/available-requests");
  };

  const handleViewOffers = () => {
    router.push("/asistentes/received-offers");
  };

  const handleViewInProgress = () => {
    router.push("/asistentes/in-progress");
  };

  const handleViewAccepted = () => {
    router.push("/asistentes/accepted-jobs");
  };

  return (
    <DashboardLayout backgroundColor="from-cyan-50 via-blue-50 to-sky-50">
      <DashboardHeader
        icon={Briefcase}
        title="Panel de Asistente"
        subtitle="Gestiona tus solicitudes y oportunidades de trabajo"
        gradientFrom="cyan-500"
        gradientTo="blue-500"
      />
      <AssistantDashboardCards
        onViewAvailable={handleViewAvailable}
        onViewOffers={handleViewOffers}
        onViewInProgress={handleViewInProgress}
        onViewAccepted={handleViewAccepted}
        availableCount={availableRequests.length}
        offersCount={myOffers.length}
        inProgressCount={2}
        acceptedCount={acceptedJobs.length}
      />
    </DashboardLayout>
  );
}

