"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Award } from "lucide-react";

interface Certification {
  title: string;
  description: string;
  icon: 'shield' | 'award';
}

interface AssistantInfoTabProps {
  certifications: Certification[];
  services: string[];
  schedule: {
    preferredHours: string;
    availableDays: string;
  };
}

export function AssistantInfoTab({
  certifications,
  services,
  schedule,
}: AssistantInfoTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-500" />
            Experiencia y Certificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {certifications.map((cert, index) => (
            <div key={index} className="flex items-center gap-3">
              {cert.icon === 'shield' ? (
                <Shield className="w-5 h-5 text-cyan-500" />
              ) : (
                <Award className="w-5 h-5 text-cyan-500" />
              )}
              <div>
                <p className="font-medium">{cert.title}</p>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Servicios Ofrecidos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {services.map((service, index) => (
              <li key={index}>• {service}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Disponibilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-medium">Horarios preferidos</p>
              <p className="text-muted-foreground">{schedule.preferredHours}</p>
            </div>
            <div>
              <p className="font-medium">Días disponibles</p>
              <p className="text-muted-foreground">{schedule.availableDays}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
