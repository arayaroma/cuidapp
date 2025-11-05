"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Save, 
  User, 
  MapPin, 
  Mail,
  Phone,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { colors } from "@/config/colors";
import { successAlert, errorAlert } from "@/lib/alerts";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  emergencyPhone: string;
  notes: string;
  location: {
    province: string;
    canton: string;
    district: string;
    addressLine1: string;
  };
}

export default function EditUserProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phone: "",
    emergencyPhone: "",
    notes: "",
    location: {
      province: "",
      canton: "",
      district: "",
      addressLine1: "",
    },
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/users/profile");
        if (response.ok) {
          const data = await response.json();
          setFormData({
            fullName: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            emergencyPhone: data.emergencyContact || "",
            notes: data.notes || "",
            location: {
              province: data.location?.province || "",
              canton: data.location?.canton || "",
              district: data.location?.district || "",
              addressLine1: data.location?.fullAddress || "",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.fullName.trim()) {
      errorAlert.validation("El nombre completo es requerido");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/users/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        await successAlert.updated("Tu perfil", "Tus cambios han sido guardados correctamente");
        router.push("/usuarios/profile");
      } else {
        errorAlert.saving(data.error || "No se pudieron guardar los cambios");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      errorAlert.network();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: colors.primary[500] }}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              style={{ color: colors.neutral[700] }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: colors.neutral[900] }}>
                Editar Perfil
              </h1>
              <p style={{ color: colors.neutral[600] }}>
                Actualiza tu información personal
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="text-white font-semibold shadow-md"
            style={{ background: colors.gradients.primary }}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>

        {/* Información Personal */}
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader
            className="border-b"
            style={{ borderColor: colors.neutral[200] }}
          >
            <CardTitle
              className="flex items-center gap-2"
              style={{ color: colors.primary[700] }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <User className="w-5 h-5" style={{ color: colors.primary[600] }} />
              </div>
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" style={{ color: colors.neutral[700] }}>
                  Nombre Completo *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Tu nombre completo"
                  className="border-neutral-300 focus:border-primary-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: colors.neutral[700] }}>
                  <Mail className="w-4 h-4 inline mr-1" />
                  Correo Electrónico *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="border-neutral-300 bg-neutral-50 cursor-not-allowed"
                  title="El email no se puede modificar"
                />
                <p className="text-xs" style={{ color: colors.neutral[500] }}>
                  El correo no puede ser modificado
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" style={{ color: colors.neutral[700] }}>
                  <Phone className="w-4 h-4 inline mr-1" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+506 0000-0000"
                  className="border-neutral-300 focus:border-primary-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone" style={{ color: colors.neutral[700] }}>
                  <AlertCircle className="w-4 h-4 inline mr-1" style={{ color: colors.error[600] }} />
                  Teléfono de Emergencia
                </Label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  placeholder="+506 0000-0000"
                  className="border-neutral-300 focus:border-primary-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader
            className="border-b"
            style={{ borderColor: colors.neutral[200] }}
          >
            <CardTitle
              className="flex items-center gap-2"
              style={{ color: colors.secondary[700] }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.secondary[100] }}
              >
                <MapPin className="w-5 h-5" style={{ color: colors.secondary[600] }} />
              </div>
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location.province" style={{ color: colors.neutral[700] }}>
                  Provincia
                </Label>
                <Input
                  id="location.province"
                  name="location.province"
                  value={formData.location.province}
                  onChange={handleInputChange}
                  placeholder="Ej: San José"
                  className="border-neutral-300 focus:border-secondary-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location.canton" style={{ color: colors.neutral[700] }}>
                  Cantón
                </Label>
                <Input
                  id="location.canton"
                  name="location.canton"
                  value={formData.location.canton}
                  onChange={handleInputChange}
                  placeholder="Ej: Central"
                  className="border-neutral-300 focus:border-secondary-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location.district" style={{ color: colors.neutral[700] }}>
                  Distrito
                </Label>
                <Input
                  id="location.district"
                  name="location.district"
                  value={formData.location.district}
                  onChange={handleInputChange}
                  placeholder="Ej: Merced"
                  className="border-neutral-300 focus:border-secondary-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location.addressLine1" style={{ color: colors.neutral[700] }}>
                Dirección Exacta
              </Label>
              <Input
                id="location.addressLine1"
                name="location.addressLine1"
                value={formData.location.addressLine1}
                onChange={handleInputChange}
                placeholder="Ej: De la iglesia 200m norte, casa #42"
                className="border-neutral-300 focus:border-secondary-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notas Adicionales */}
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader
            className="border-b"
            style={{ borderColor: colors.neutral[200] }}
          >
            <CardTitle
              className="flex items-center gap-2"
              style={{ color: colors.accent[700] }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.accent[100] }}
              >
                <AlertCircle className="w-5 h-5" style={{ color: colors.accent[600] }} />
              </div>
              Información Adicional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="notes" style={{ color: colors.neutral[700] }}>
                Notas Especiales
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Información adicional que consideres importante (condiciones médicas, preferencias, rutinas, etc.)"
                rows={4}
                className="resize-none border-neutral-300 focus:border-accent-500"
              />
              <p className="text-sm" style={{ color: colors.neutral[500] }}>
                Esta información ayudará a los asistentes a brindarte un mejor servicio
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="border-2"
            style={{
              borderColor: colors.neutral[300],
              color: colors.neutral[700],
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="text-white font-semibold shadow-md"
            style={{ background: colors.gradients.primary }}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
