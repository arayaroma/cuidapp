"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, Loader2, Save, FileText } from "lucide-react";
import { useSession } from "next-auth/react";
import { errorAlert, successAlert } from "@/lib/alerts";
import {
  createRequestSchema,
  type CreateRequestInput,
} from "@/lib/validations/request";
import { colors } from "@/config/colors";
import {
  FormField,
  FormSection,
  EnhancedRadioGroup,
  RequirementsInput,
  WeekdaysSelector,
  careTypeOptions,
  urgencyOptions,
} from "@/components/requests";

export default function CreateRequestPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    careType: "companion" as
      | "children"
      | "elderly"
      | "disability"
      | "hospital"
      | "companion"
      | "special-needs",
    personAge: "",
    requirements: [] as string[],
    urgency: "medium" as "low" | "medium" | "high",
    hourlyRate: "",
    totalHours: "",
    isRecurring: false,
    weekdays: [] as string[],
    requestDate: "",
    requestTime: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Validar progreso del formulario para mostrar pasos completados
  const isStep1Complete = Boolean(formData.title && formData.description);
  const isStep2Complete = Boolean(
    formData.careType && formData.personAge && formData.requirements.length > 0
  );
  const isStep3Complete = Boolean(
    formData.urgency && formData.requestDate && formData.requestTime
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Preparar datos para validación
      const dataToValidate: CreateRequestInput = {
        title: formData.title,
        description: formData.description,
        careType: formData.careType,
        personAge: parseInt(formData.personAge) || 0,
        requirements: formData.requirements,
        urgency: formData.urgency,
        hourlyRate: formData.hourlyRate
          ? parseFloat(formData.hourlyRate)
          : null,
        totalHours: formData.totalHours ? parseInt(formData.totalHours) : null,
        isRecurring: formData.isRecurring,
        weekdays: formData.weekdays,
        requestDate: formData.requestDate,
        requestTime: formData.requestTime,
      };

      // Validar con Zod
      const validatedData = createRequestSchema.parse(dataToValidate);

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...validatedData,
          userId: (session?.user as { id: string })?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la solicitud");
      }

      await successAlert.created("La solicitud");
      router.push("/usuarios/my-requests");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);

      // Manejar errores de validación de Zod
      if (error && typeof error === "object" && "issues" in error) {
        const zodError = error as any;
        const errors: Record<string, string> = {};
        zodError.issues?.forEach((err: any) => {
          const path = err.path.join(".");
          errors[path] = err.message;
        });
        setValidationErrors(errors);
        errorAlert.validation("Por favor corrige los errores en el formulario");
      } else {
        errorAlert.creating("la solicitud");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-10">
      {/* Header */}
      <div
        className="text-white py-8"
        style={{ background: colors.gradients.trust }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/20 mb-4"
            onClick={() => router.push("/usuarios/my-requests")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Mis Solicitudes
          </Button>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Nueva Solicitud de Cuidado</h1>
              <p className="text-blue-100 mt-2">
                Completa el formulario paso a paso para crear tu solicitud
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Información Básica */}
            <FormSection
              title="Información Básica"
              description="Cuéntanos sobre el servicio que necesitas"
              step={1}
              totalSteps={4}
              isCompleted={isStep1Complete}
            >
              <FormField
                label="Título de la solicitud"
                required
                error={validationErrors.title}
                hint="Un título claro y descriptivo (5-100 caracteres)"
              >
                <Input
                  placeholder="Ej: Cuidado de adulto mayor con movilidad reducida"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  minLength={5}
                  maxLength={100}
                />
              </FormField>

              <FormField
                label="Descripción detallada"
                required
                error={validationErrors.description}
                hint="Describe las necesidades específicas de cuidado (20-1000 caracteres)"
              >
                <Textarea
                  placeholder="Ej: Necesito un cuidador para mi padre de 82 años. Tiene movilidad reducida y requiere asistencia para actividades diarias como baño, alimentación y medicación..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={5}
                  minLength={20}
                  maxLength={1000}
                  className="resize-none"
                />
              </FormField>
            </FormSection>

            {/* Step 2: Detalles del Cuidado */}
            <FormSection
              title="Detalles del Cuidado"
              description="Especifica el tipo de cuidado y requisitos"
              step={2}
              totalSteps={4}
              isCompleted={isStep2Complete}
            >
              <FormField label="Tipo de cuidado necesario" required>
                <EnhancedRadioGroup
                  value={formData.careType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      careType: value as typeof formData.careType,
                    })
                  }
                  options={careTypeOptions}
                  name="careType"
                />
              </FormField>

              <FormField
                label="Edad de la persona a cuidar"
                required
                error={validationErrors.personAge}
              >
                <Input
                  type="number"
                  placeholder="Ej: 75"
                  value={formData.personAge}
                  onChange={(e) =>
                    setFormData({ ...formData, personAge: e.target.value })
                  }
                  min="0"
                  max="120"
                />
              </FormField>

              <FormField
                label="Requisitos del cuidador"
                required
                error={validationErrors.requirements}
                hint="Agrega entre 1 y 10 requisitos. Presiona Enter o haz clic en + para agregar."
              >
                <RequirementsInput
                  requirements={formData.requirements}
                  onChange={(requirements) =>
                    setFormData({ ...formData, requirements })
                  }
                  maxItems={10}
                  placeholder="Ej: Experiencia con Alzheimer, certificado en primeros auxilios"
                />
              </FormField>
            </FormSection>

            {/* Step 3: Urgencia y Horarios */}
            <FormSection
              title="Urgencia y Horarios"
              description="¿Cuándo necesitas el servicio?"
              step={3}
              totalSteps={4}
              isCompleted={isStep3Complete}
            >
              <FormField label="Nivel de urgencia" required>
                <EnhancedRadioGroup
                  value={formData.urgency}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      urgency: value as typeof formData.urgency,
                    })
                  }
                  options={urgencyOptions}
                  name="urgency"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Fecha de inicio"
                  required
                  error={validationErrors.requestDate}
                >
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={formData.requestDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requestDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </FormField>

                <FormField
                  label="Horario"
                  required
                  error={validationErrors.requestTime}
                  hint="Especifica días y rango de horario"
                >
                  <Input
                    placeholder="Ej: Lunes a Viernes 8:00 - 16:00"
                    value={formData.requestTime}
                    onChange={(e) =>
                      setFormData({ ...formData, requestTime: e.target.value })
                    }
                    maxLength={100}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Step 4: Información Adicional */}
            <FormSection
              title="Información Adicional"
              description="Detalles opcionales sobre compensación y frecuencia"
              step={4}
              totalSteps={4}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Tarifa por hora (₡)"
                  error={validationErrors.hourlyRate}
                  hint="Opcional: Tarifa que pagarás por hora"
                >
                  <Input
                    type="number"
                    placeholder="Ej: 5000"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData({ ...formData, hourlyRate: e.target.value })
                    }
                    min="0"
                    step="0.01"
                  />
                </FormField>

                <FormField
                  label="Horas totales estimadas"
                  error={validationErrors.totalHours}
                  hint="Opcional: Horas por semana o mes"
                >
                  <Input
                    type="number"
                    placeholder="Ej: 40"
                    value={formData.totalHours}
                    onChange={(e) =>
                      setFormData({ ...formData, totalHours: e.target.value })
                    }
                    min="0"
                  />
                </FormField>
              </div>

              <div
                className="flex items-center justify-between p-4 border rounded-lg"
                style={{ backgroundColor: colors.primary[50] + "80" }}
              >
                <div className="space-y-0.5">
                  <Label
                    htmlFor="isRecurring"
                    className="text-base cursor-pointer font-medium"
                  >
                    Servicio recurrente
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    ¿Necesitas este servicio de forma regular (semanal/mensual)?
                  </p>
                </div>
                <Switch
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isRecurring: checked })
                  }
                />
              </div>

              {/* Días de la semana */}
              {formData.isRecurring && (
                <FormField
                  label="Días de la semana"
                  hint="Selecciona los días en los que necesitas el servicio"
                  error={validationErrors.weekdays}
                  required
                >
                  <WeekdaysSelector
                    value={formData.weekdays}
                    onChange={(weekdays) =>
                      setFormData({ ...formData, weekdays })
                    }
                    error={validationErrors.weekdays}
                  />
                </FormField>
              )}
            </FormSection>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/usuarios/my-requests")}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                style={{ background: colors.gradients.trust }}
                className="flex-1 hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando solicitud...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Crear Solicitud
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
