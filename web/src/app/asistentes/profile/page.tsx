"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MyProfileHeader } from "@/components/asistentes/MyProfileHeader";
import { AssistantInfoTab } from "@/components/asistentes/AssistantInfoTab";
import { AssistantReviewsTab } from "@/components/asistentes/AssistantReviewsTab";
import type { MyProfileHeaderData } from "@/components/asistentes/MyProfileHeader";

// fallbacks used while profile data loads or if fields are missing
const DEFAULT_CERTS: Array<{ title: string; description: string; icon: 'shield' | 'award' }> = [];

export default function AssistantProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<MyProfileHeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [certifications, setCertifications] = useState(DEFAULT_CERTS);
  const [services, setServices] = useState<string[]>([]);
  const [schedule, setSchedule] = useState({ preferredHours: "8:00 AM - 6:00 PM", availableDays: "Lunes a Viernes" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/assistants/profile");
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);

          // map certifications if provided (array of strings -> show as simple cert objects)
          if (Array.isArray(data.certifications) && data.certifications.length > 0) {
            setCertifications(
              data.certifications.map((c: string) => ({ title: c, description: "", icon: 'shield' as const }))
            );
          }

          // use specialties as services if available
          if (Array.isArray(data.specialties) && data.specialties.length > 0) {
            setServices(data.specialties);
          }

          // schedule: try to derive from availabilitySchedule / availableWeekdays
          const preferredHours = data.availabilitySchedule || "8:00 AM - 6:00 PM";
          let availableDays = "Lunes a Viernes";
          if (Array.isArray(data.availableWeekdays) && data.availableWeekdays.length > 0) {
            // map english weekday keys to spanish readable names when possible
            const mapping: Record<string, string> = {
              monday: 'Lunes',
              tuesday: 'Martes',
              wednesday: 'Miércoles',
              thursday: 'Jueves',
              friday: 'Viernes',
              saturday: 'Sábado',
              sunday: 'Domingo',
            };
            availableDays = data.availableWeekdays.map((d: string) => mapping[d] || d).join(', ');
          }

          setSchedule({ preferredHours, availableDays });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <DashboardLayout backgroundClass="from-purple-50 via-pink-50 to-rose-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profileData) {
    return (
      <DashboardLayout backgroundClass="from-purple-50 via-pink-50 to-rose-50">
        <div className="text-center py-12">
          <p className="text-gray-600">No se pudo cargar el perfil</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout backgroundClass="from-purple-50 via-pink-50 to-rose-50">
      <div className="space-y-6">
        <MyProfileHeader
          data={profileData}
          onEdit={() => router.push("/asistentes/settingsProfile")}
        />

        <div className="mt-6">
          <AssistantInfoTab
            certifications={certifications}
            services={services}
            schedule={schedule}
          />
        
          <div className="mt-6">
            <AssistantReviewsTab
              rating={profileData.rating ?? 0}
              totalReviews={profileData.reviews ?? 0}
              ratingBreakdown={[
                { stars: 5, count: 0, percentage: 0 },
                { stars: 4, count: 0, percentage: 0 },
                { stars: 3, count: 0, percentage: 0 },
                { stars: 2, count: 0, percentage: 0 },
                { stars: 1, count: 0, percentage: 0 },
              ]}
              reviews={[]}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
