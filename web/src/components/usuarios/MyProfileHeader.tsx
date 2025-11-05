"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  Edit,
  CheckCircle
} from "lucide-react";
import { colors } from "@/config/colors";

export interface MyUserProfileData {
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  verified: boolean;
}

interface MyProfileHeaderProps {
  data: MyUserProfileData;
  onEdit: () => void;
}

export function MyProfileHeader({ data, onEdit }: MyProfileHeaderProps) {
  const initials = data.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div 
            className="relative"
          >
            <Avatar className="w-24 h-24 border-4" style={{ borderColor: colors.primary[100] }}>
              <AvatarFallback 
                className="text-2xl font-semibold text-white"
                style={{ background: colors.gradients.primary }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            {data.verified && (
              <div 
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 border-white"
                style={{ backgroundColor: colors.success[500] }}
              >
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-1" style={{ color: colors.neutral[900] }}>
                  {data.name}
                </h2>
                <p 
                  className="text-sm flex items-center gap-1.5"
                  style={{ color: colors.neutral[600] }}
                >
                  <Calendar className="w-4 h-4" />
                  Miembro desde {formatDate(data.memberSince)}
                </p>
              </div>
              <Button
                onClick={onEdit}
                variant="outline"
                size="sm"
                className="gap-2 border-2"
                style={{ 
                  borderColor: colors.primary[300],
                  color: colors.primary[700],
                }}
              >
                <Edit className="w-4 h-4" />
                Editar Perfil
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div 
                className="flex items-center gap-2.5 p-3 rounded-lg"
                style={{ backgroundColor: colors.neutral[50] }}
              >
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.primary[100] }}
                >
                  <Mail className="w-4 h-4" style={{ color: colors.primary[600] }} />
                </div>
                <span className="text-sm" style={{ color: colors.neutral[700] }}>
                  {data.email}
                </span>
              </div>
              
              <div 
                className="flex items-center gap-2.5 p-3 rounded-lg"
                style={{ backgroundColor: colors.neutral[50] }}
              >
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.secondary[100] }}
                >
                  <Phone className="w-4 h-4" style={{ color: colors.secondary[600] }} />
                </div>
                <span className="text-sm" style={{ color: colors.neutral[700] }}>
                  {data.phone}
                </span>
              </div>
              
              <div 
                className="flex items-center gap-2.5 p-3 rounded-lg"
                style={{ backgroundColor: colors.neutral[50] }}
              >
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.accent[100] }}
                >
                  <MapPin className="w-4 h-4" style={{ color: colors.accent[600] }} />
                </div>
                <span className="text-sm" style={{ color: colors.neutral[700] }}>
                  {data.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
