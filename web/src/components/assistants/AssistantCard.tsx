"use client";

import {
  Star,
  MapPin,
  Clock,
  Banknote,
  Shield,
  Award,
  Car,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Assistant } from "@/types/assistant";
import { colors, careTypeColors } from "@/config/colors";
import { specialtyLabels } from "@/lib/validations/assistant";

interface AssistantCardProps {
  assistant: Assistant;
  onViewProfile: (id: string) => void;
}

export function AssistantCard({
  assistant,
  onViewProfile,
}: AssistantCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-200 flex flex-col h-full">
      <CardContent className="p-5 flex flex-col h-full">
        {/* Header con Avatar y Verified */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar
            className="w-16 h-16 border-2"
            style={{ borderColor: colors.primary[200] }}
          >
            <AvatarImage src={assistant.photoUrl} alt={assistant.name} />
            <AvatarFallback
              style={{
                backgroundColor: colors.primary[100],
                color: colors.primary[700],
              }}
            >
              {getInitials(assistant.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate mb-1">
              {assistant.name}
            </h3>

            {/* Rating */}
            {assistant.rating && (
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">
                  {assistant.rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({assistant.ratingCount || 0})
                </span>
              </div>
            )}

            {/* Verified Badge */}
            {assistant.verified && (
              <Badge
                className="text-xs"
                style={{
                  backgroundColor: colors.success[100],
                  color: colors.success[700],
                  borderColor: colors.success[500],
                }}
              >
                <Shield className="w-3 h-3 mr-1" />
                Verificado
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        {assistant.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {assistant.bio}
          </p>
        )}

        {/* Specialties */}
        {assistant.specialties && assistant.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {assistant.specialties.slice(0, 3).map((specialty) => {
              const colors =
                careTypeColors[specialty as keyof typeof careTypeColors];
              return (
                <Badge
                  key={specialty}
                  variant="outline"
                  className="text-xs"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: colors.border,
                  }}
                >
                  {specialtyLabels[specialty as keyof typeof specialtyLabels]}
                </Badge>
              );
            })}
            {assistant.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{assistant.specialties.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Info Grid */}
        <div className="space-y-2 mb-3 text-sm flex-1">
          {/* Experience */}
          <div className="flex items-center gap-2">
            <Award
              className="w-4 h-4 flex-shrink-0"
              style={{ color: colors.accent[600] }}
            />
            <span className="text-muted-foreground">
              {assistant.yearsExperience} año
              {assistant.yearsExperience !== 1 ? "s" : ""} de experiencia
            </span>
          </div>

          {/* Location */}
          {assistant.location && (
            <div className="flex items-center gap-2">
              <MapPin
                className="w-4 h-4 flex-shrink-0"
                style={{ color: colors.primary[600] }}
              />
              <span className="text-muted-foreground truncate">
                {assistant.location}
              </span>
            </div>
          )}

          {/* Hourly Rate */}
          {assistant.hourlyRate && (
            <div className="flex items-center gap-2">
              <Banknote
                className="w-4 h-4 flex-shrink-0"
                style={{ color: colors.success[600] }}
              />
              <span
                className="font-semibold"
                style={{ color: colors.success[700] }}
              >
                ₡{assistant.hourlyRate.toLocaleString()}/hora
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-3">
          {assistant.hasFirstAid && (
            <Badge variant="outline" className="text-xs">
              <Heart className="w-3 h-3 mr-1" />
              Primeros Auxilios
            </Badge>
          )}
          {assistant.hasVehicle && (
            <Badge variant="outline" className="text-xs">
              <Car className="w-3 h-3 mr-1" />
              Vehículo
            </Badge>
          )}
          {assistant.availableWeekdays.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {assistant.availableWeekdays.length} días/semana
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <Button
          className="w-full font-semibold"
          onClick={() => onViewProfile(assistant.id)}
          style={{ background: colors.gradients.primary, color: "white" }}
        >
          Ver Perfil Completo
        </Button>
      </CardContent>
    </Card>
  );
}
