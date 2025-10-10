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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{data.name}</h2>
                  {data.verified && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Miembro desde {formatDate(data.memberSince)}
                </p>
              </div>
              <Button
                onClick={onEdit}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar Perfil
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{data.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{data.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{data.location}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
