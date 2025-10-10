"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Star, 
  DollarSign, 
  Edit,
  CheckCircle,
  Clock
} from "lucide-react";

export interface MyProfileHeaderData {
  name: string;
  avatar: string;
  experience: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  location: string;
  specialties: string[];
  available: boolean;
}

interface MyProfileHeaderProps {
  data: MyProfileHeaderData;
  onEdit: () => void;
}

export function MyProfileHeader({ data, onEdit }: MyProfileHeaderProps) {
  const initials = data.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold">{data.name}</h2>
                <p className="text-sm text-muted-foreground">{data.experience}</p>
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
            
            <div className="flex flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{data.rating}</span>
                <span className="text-muted-foreground">({data.reviews} reseñas)</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <DollarSign className="w-4 h-4 text-cyan-600" />
                <span className="font-semibold">${data.hourlyRate}/hora</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{data.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {data.specialties.map((specialty, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                >
                  {specialty}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {data.available ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Disponible para nuevos trabajos
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  <Clock className="w-3 h-3 mr-1" />
                  No disponible actualmente
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
