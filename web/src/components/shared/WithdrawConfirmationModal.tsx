"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface WithdrawConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requestTitle?: string;
}

export function WithdrawConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  requestTitle,
}: WithdrawConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <Card className="w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            Confirmar Retiro de Postulación
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {requestTitle && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700">Solicitud:</p>
              <p className="text-sm text-gray-900 font-semibold">{requestTitle}</p>
            </div>
          )}
          
          <p className="text-sm text-gray-700">
            ¿Estás seguro de que deseas retirar tu postulación a esta solicitud?
            Esta acción <span className="font-semibold">no se puede deshacer</span>.
          </p>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              ⚠️ La familia ya no podrá ver tu perfil para esta solicitud específica.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleConfirm}
            >
              Retirar Postulación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
