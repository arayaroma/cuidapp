"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { colors } from "@/config/colors";

interface PersonalInfo {
  email: string;
  phone: string;
  emergencyContact?: string;
}

interface CareNeeds {
  location: string;
  memberSince: string;
}

interface UserInfoTabProps {
  personalInfo: PersonalInfo;
  careNeeds: CareNeeds;
}

export function UserInfoTab({ personalInfo, careNeeds }: UserInfoTabProps) {
  return (
    <div className="space-y-4">
      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle 
            className="text-lg flex items-center gap-2"
            style={{ color: colors.primary[700] }}
          >
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.primary[50] }}
            >
              <Mail className="w-5 h-5" style={{ color: colors.primary[600] }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-700">Correo electrónico</p>
              <p className="text-neutral-900">{personalInfo.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.secondary[50] }}
            >
              <Phone className="w-5 h-5" style={{ color: colors.secondary[600] }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-700">Teléfono</p>
              <p className="text-neutral-900">{personalInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.accent[50] }}
            >
              <MapPin className="w-5 h-5" style={{ color: colors.accent[600] }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-700">Ubicación</p>
              <p className="text-neutral-900">{careNeeds.location}</p>
            </div>
          </div>
          
          {personalInfo.emergencyContact && (
            <div className="flex items-start gap-3 pt-3 border-t border-neutral-200">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.error[50] }}
              >
                <Phone className="w-5 h-5" style={{ color: colors.error[600] }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-700">Contacto de emergencia</p>
                <p className="text-neutral-900">{personalInfo.emergencyContact}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle 
            className="text-lg flex items-center gap-2"
            style={{ color: colors.primary[700] }}
          >
            Información de Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.neutral[100] }}
            >
              <Calendar className="w-5 h-5" style={{ color: colors.neutral[600] }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-700">Miembro desde</p>
              <p className="text-neutral-900">{careNeeds.memberSince}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
