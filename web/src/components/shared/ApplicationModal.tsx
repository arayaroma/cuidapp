"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
  requestTitle?: string;
}

export function ApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  requestTitle,
}: ApplicationModalProps) {
  const [applicationMessage, setApplicationMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (applicationMessage.trim()) {
      onSubmit(applicationMessage);
      setApplicationMessage(""); // Limpiar después de enviar
    }
  };

  const handleCancel = () => {
    setApplicationMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <Card className="w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
        <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-2xl">
          <CardTitle className="text-xl">Postularme a esta Solicitud</CardTitle>
          {requestTitle && (
            <p className="text-sm text-cyan-100 mt-1">
              {requestTitle}
            </p>
          )}
          <p className="text-sm text-cyan-100 mt-1">
            Preséntate y destaca por qué eres el candidato ideal
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              Mensaje de presentación *
            </label>
            <Textarea
              placeholder="Ejemplo: Hola, soy María y tengo 5 años de experiencia cuidando niños. Estoy certificada en primeros auxilios y cuento con excelentes referencias. Me encuentro disponible en los horarios solicitados..."
              rows={6}
              value={applicationMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setApplicationMessage(e.target.value)
              }
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {applicationMessage.length}/500 caracteres
            </p>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-200">
            <p className="text-sm font-semibold text-cyan-900 mb-2">
              💡 Consejos para destacar:
            </p>
            <ul className="text-xs text-cyan-800 space-y-1">
              <li>• Menciona tu experiencia relevante</li>
              <li>• Indica tu disponibilidad específica</li>
              <li>• Destaca certificaciones o formación</li>
              <li>• Muestra tu entusiasmo y compromiso</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              onClick={handleSubmit}
              disabled={!applicationMessage.trim() || applicationMessage.length > 500}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Enviar Postulación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
