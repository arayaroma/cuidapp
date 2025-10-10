"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Edit } from "lucide-react";

export interface UserHeaderData {
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  verified: boolean;
}

interface UserProfileHeaderProps {
  data: UserHeaderData;
  onEditProfile: () => void;
}

export function UserProfileHeader({
  data,
  onEditProfile,
}: UserProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              {data.avatar}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{data.name}</h2>
                  {data.verified && (
                    <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                      Verificado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Miembro desde {new Date(data.memberSince).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
              <Button variant="outline" onClick={onEditProfile}>
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{data.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{data.phone}</span>
              </div>
              <div className="flex items-center gap-2">
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
