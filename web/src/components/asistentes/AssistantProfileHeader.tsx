"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Heart, MessageCircle, Phone } from "lucide-react";

export interface AssistantHeaderData {
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

interface AssistantProfileHeaderProps {
  data: AssistantHeaderData;
  onBookService: () => void;
  onMessage: () => void;
  onCall: () => void;
  onToggleFavorite: () => void;
}

export function AssistantProfileHeader({
  data,
  onBookService,
  onMessage,
  onCall,
  onToggleFavorite,
}: AssistantProfileHeaderProps) {
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
                <h2 className="text-xl font-bold">{data.name}</h2>
                <p className="text-muted-foreground">{data.experience}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onToggleFavorite}>
                <Heart className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{data.rating}</span>
                <span className="text-muted-foreground text-sm">({data.reviews} reseñas)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">{data.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              {data.available ? (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  Disponible
                </Badge>
              ) : (
                <Badge variant="secondary">No disponible</Badge>
              )}
              <span className="font-medium text-lg">${data.hourlyRate}/hora</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {data.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
                    <Button
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600" 
            onClick={() => console.log("Contratar asistente")}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contactar
          </Button>
          <Button variant="outline" onClick={onMessage}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Mensaje
          </Button>
          <Button variant="outline" onClick={onCall}>
            <Phone className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
