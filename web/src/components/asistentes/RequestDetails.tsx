"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ApplicationModal } from "@/components/shared/ApplicationModal";
import { WithdrawConfirmationModal } from "@/components/shared/WithdrawConfirmationModal";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign,
  User,
  Baby,
  Heart,
  Accessibility,
  CheckCircle,
  AlertCircle,
  Users,
  Star,
  Shield,
  Award
} from "lucide-react";
import { CareRequest, CareType } from "@/types/request";

interface RequestDetailsProps {
  request: CareRequest;
  userType: 'assistant' | 'user';
  onBack: () => void;
  onApply?: (requestId: string, message: string) => void;
  onWithdraw?: (requestId: string) => void;
  hasApplied?: boolean;
}

const careTypeIcons = {
  children: Baby,
  elderly: Heart,
  disability: Accessibility,
  hospital: User
};

const careTypeBadges: Record<CareType, string> = {
  children: 'bg-blue-100 text-blue-800 border-blue-200',
  elderly: 'bg-orange-100 text-orange-800 border-orange-200',
  disability: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  hospital: 'bg-green-100 text-green-800 border-green-200',
};

const careTypeLabels: Record<CareType, string> = {
  children: 'Cuidado Infantil',
  elderly: 'Adulto Mayor',
  disability: 'Discapacidad',
  hospital: 'Hospitalario',
};

const urgencyColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200'
};

export function RequestDetails({ 
  request, 
  userType, 
  onBack, 
  onApply, 
  onWithdraw,
  hasApplied: initialHasApplied = false 
}: RequestDetailsProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleApply = (message: string) => {
    if (onApply) {
      onApply(request.id, message);
      setHasApplied(true);
      setIsApplying(false);
    }
  };

  const handleWithdraw = () => {
    if (onWithdraw) {
      onWithdraw(request.id);
      setHasApplied(false);
    }
  };

  const CareTypeIcon = careTypeIcons[request.careType];
  const estimatedDaily = request.hourlyRate * request.totalHours;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="hover:bg-sky-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-lg">Detalles de Solicitud</h1>
            <p className="text-xs text-muted-foreground">
              ID: {request.id.substring(0, 8)}...
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-4 pb-20">
        {/* Main Card */}
        <Card className="overflow-hidden border-2 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-sky-500" />
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CareTypeIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{request.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className={`${careTypeBadges[request.careType]} border`}>
                    {careTypeLabels[request.careType]}
                  </Badge>
                  <Badge className={`${urgencyColors[request.urgency]} border`}>
                    {request.urgency === 'low' ? 'Normal' : request.urgency === 'medium' ? 'Urgente' : 'Muy Urgente'}
                  </Badge>
                  {request.status === 'active' && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                      Activa
                    </Badge>
                  )}
                  {hasApplied && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ya Postulado
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <span className="font-medium">{request.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{request.applicants} postulado{request.applicants !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Compensation Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                            {/* Tarifa destacada */}
              <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-100">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <DollarSign className="w-5 h-5 text-cyan-600" />
                  <div className="text-2xl font-bold text-cyan-700">${request.hourlyRate}</div>
                </div>
                <div className="text-sm text-cyan-600 font-medium">por hora</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border-2 border-blue-100">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-700">${estimatedDaily}</div>
                </div>
                <div className="text-sm text-blue-600 font-medium">estimado/día</div>
              </div>
            </div>

            {/* Action Buttons for Assistant */}
            {userType === 'assistant' && !hasApplied && request.status === 'active' && (
              <Button 
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg"
                size="lg"
                onClick={() => setIsApplying(true)}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Postularme a esta Solicitud
              </Button>
            )}

            {hasApplied && userType === 'assistant' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-800">¡Postulación Enviada!</p>
                    <p className="text-sm text-green-700">La familia revisará tu perfil pronto</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => setIsWithdrawing(true)}
                >
                  Retirar Postulación
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-600" />
              Descripción del Cuidado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed text-gray-700">{request.description}</p>
            {request.personAge && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-900">
                  👤 Edad de la persona a cuidar: <span className="font-bold">{request.personAge} años</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule and Dates */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Horarios y Fechas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Fecha de inicio</p>
                <p className="text-sm text-gray-600 mt-1">
                  {request.startDate.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {request.isRecurring ? '🔁 Horario recurrente' : '📅 Una sola vez'}
                </p>
                <p className="text-sm text-gray-600 mt-1">{request.schedule}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {request.totalHours} horas por día
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        {request.requirements.length > 0 && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-600" />
                Requisitos Deseados
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {request.requirements.map((req, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-sm py-1.5 px-3 bg-cyan-100 text-cyan-800 hover:bg-cyan-200"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {req}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posted By */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-sky-600" />
              Publicado por
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 border-2 border-sky-200 shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-sky-400 to-cyan-400 text-white font-semibold text-lg">
                  {request.createdBy.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-lg text-gray-900">{request.createdBy}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">4.8</span>
                  </div>
                  <span className="text-sm text-muted-foreground">• Miembro desde 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Urgent Alert */}
        {request.urgency === 'high' && (
          <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-red-800 text-lg">⚡ Solicitud Urgente</p>
                  <p className="text-sm text-red-700 mt-1">
                    Esta familia necesita ayuda <span className="font-semibold">inmediata</span>. 
                    Responde pronto si estás disponible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplying}
        onClose={() => setIsApplying(false)}
        onSubmit={handleApply}
        requestTitle={request.title}
      />

      {/* Withdraw Confirmation Modal */}
      <WithdrawConfirmationModal
        isOpen={isWithdrawing}
        onClose={() => setIsWithdrawing(false)}
        onConfirm={handleWithdraw}
        requestTitle={request.title}
      />
    </div>
  );
}
