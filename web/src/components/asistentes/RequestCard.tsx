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
  const CareTypeIcon = careTypeIcons[request.careType];

  const handleActionClick = () => {
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
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CareTypeIcon className="w-6 h-6 text-cyan-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm sm:text-base line-clamp-1">{request.title}</h4>
            <Badge className={urgencyColors[request.urgency]} variant="secondary">
              {urgencyLabels[request.urgency]}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-2 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{request.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                {request.startDate.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">{request.schedule}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">{request.applicants} postulados</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{request.description}</p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={careTypeColors[request.careType]} variant="secondary">
                {careTypeLabels[request.careType]}
              </Badge>
              <span className="font-semibold text-cyan-600">${request.hourlyRate}/hora</span>
              <span className="text-xs text-muted-foreground">({request.totalHours}h)</span>
            </div>
            <div className="flex gap-2">
              {actionButton && (
                <Button
                  size="sm"
                  variant={actionButton.variant || "default"}
                  onClick={handleActionClick}
                  className="whitespace-nowrap"
                >
                  {actionButton.label}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(request)}
                className="whitespace-nowrap"
              >
                Ver Detalles
              </Button>
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
