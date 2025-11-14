"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "@/components/shared/ApplicationModal";
import { MapPin, Calendar, Users, Baby, Heart, Accessibility, Clock, Hospital } from "lucide-react";
import { CareRequest, CareType } from "@/types/request";

interface RequestCardProps {
  request: CareRequest;
  onViewDetails: (request: CareRequest) => void;
  onApply?: (requestId: string, message: string) => void;
  actionButton?: {
    label: string;
    onClick: (request: CareRequest) => void;
    variant?: "default" | "outline" | "destructive" | "ghost";
  };
}

const careTypeIcons: Record<CareType, React.ElementType> = {
  children: Baby,
  elderly: Heart,
  disability: Accessibility,
  hospital: Hospital,
};

const careTypeColors: Record<CareType, string> = {
  children: "bg-blue-100 text-blue-800",
  elderly: "bg-orange-100 text-orange-800",
  disability: "bg-cyan-100 text-cyan-800",
  hospital: "bg-green-100 text-green-800",
};

const careTypeLabels: Record<CareType, string> = {
  children: "Cuidado Infantil",
  elderly: "Adulto Mayor",
  disability: "Discapacidad",
  hospital: "Hospitalario",
};

const urgencyColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const urgencyLabels = {
  low: "Baja",
  medium: "Media",
  high: "Urgente",
};

export function RequestCard({ request, onViewDetails, onApply, actionButton }: RequestCardProps) {
  const [isApplying, setIsApplying] = useState(false);
  const CareTypeIcon = careTypeIcons[request.careType] || Heart;

  const handleActionClick = () => {
    // Si ya se postuló, no hacer nada
    if (request.hasApplied) {
      return;
    }
    
    // Si el botón dice "Postularme" y hay callback onApply, abrir modal
    if (actionButton?.label === "Postularme" && onApply) {
      setIsApplying(true);
    } else if (actionButton) {
      actionButton.onClick(request);
    }
  };

  const handleApplySubmit = (message: string) => {
    if (onApply) {
      onApply(request.id, message);
      setIsApplying(false);
    }
  };

  return (
    <Card className={`p-4 sm:p-5 md:p-6 hover:shadow-md transition-shadow ${request.hasApplied ? 'bg-green-50 border-green-200' : ''}`}>
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CareTypeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
        </div>

        <div className="flex-1 min-w-0 w-full">
          {/* Title and Badges */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <h4 className="font-medium text-base sm:text-lg line-clamp-2">{request.title}</h4>
            <div className="flex gap-1 flex-wrap">
              {request.hasApplied && (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm" variant="outline">
                  Ya postulado
                </Badge>
              )}
              <Badge className={`${urgencyColors[request.urgency]} text-xs sm:text-sm`} variant="outline">
                {urgencyLabels[request.urgency]}
              </Badge>
            </div>
          </div>

          {/* Info Grid - Stack on mobile, 2 columns on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{request.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                {new Date(request.startDate).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">{request.schedule}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">{request.applicants} postulados</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{request.description}</p>

          {/* Bottom Section: Care Type, Rate, and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Care Type and Rate */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${careTypeColors[request.careType]} text-xs sm:text-sm`} variant="outline">
                {careTypeLabels[request.careType]}
              </Badge>
              <span className="font-semibold text-cyan-600 text-sm sm:text-base">₡{request.hourlyRate.toLocaleString()}/hora</span>
              <span className="text-xs text-muted-foreground">({request.totalHours}h)</span>
            </div>
            
            {/* Action Buttons - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {request.hasApplied ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="whitespace-nowrap bg-green-50 border-green-200 text-green-700 hover:bg-green-100 w-full sm:w-auto h-9"
                  disabled
                >
                  ✓ Postulado
                </Button>
              ) : (
                actionButton ? (
                  <Button
                    size="sm"
                    variant={actionButton.variant || "default"}
                    onClick={handleActionClick}
                    className="whitespace-nowrap w-full sm:w-auto h-9"
                  >
                    {actionButton.label}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onApply && onApply(request.id, "")}
                    className="whitespace-nowrap w-full sm:w-auto h-9"
                  >
                    Postularme
                  </Button>
                )
              )}

              {!(actionButton && actionButton.label && actionButton.label.toLowerCase() === "ver detalles") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(request)}
                  className="whitespace-nowrap w-full sm:w-auto h-9"
                >
                  Ver Detalles
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplying}
        onClose={() => setIsApplying(false)}
        onSubmit={handleApplySubmit}
        requestTitle={request.title}
      />
    </Card>
  );
}
