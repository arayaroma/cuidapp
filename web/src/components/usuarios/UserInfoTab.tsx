"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Heart, Home, Calendar } from "lucide-react";

interface PersonalInfo {
  age: number;
  emergencyContact: string;
  emergencyPhone: string;
}

interface CareNeeds {
  careType: string;
  frequency: string;
  specialRequirements: string[];
}

interface UserInfoTabProps {
  personalInfo: PersonalInfo;
  careNeeds: CareNeeds;
}

export function UserInfoTab({ personalInfo, careNeeds }: UserInfoTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-medium">Edad</p>
              <p className="text-muted-foreground">{personalInfo.age} años</p>
            </div>
            <div>
              <p className="font-medium">Contacto de Emergencia</p>
              <p className="text-muted-foreground">{personalInfo.emergencyContact}</p>
              <p className="text-muted-foreground">{personalInfo.emergencyPhone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-blue-500" />
            Necesidades de Cuidado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-medium flex items-center gap-2">
                <Home className="w-4 h-4 text-muted-foreground" />
                Tipo de Cuidado
              </p>
              <p className="text-muted-foreground ml-6">{careNeeds.careType}</p>
            </div>
            <div>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Frecuencia
              </p>
              <p className="text-muted-foreground ml-6">{careNeeds.frequency}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requerimientos Especiales</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {careNeeds.specialRequirements.map((requirement, index) => (
              <li key={index}>• {requirement}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
