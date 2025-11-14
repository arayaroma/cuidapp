"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { 
  ArrowLeft, 
  Save, 
  User, 
  MapPin, 
  Mail,
  Phone,
  Heart,
  AlertCircle,
  Shield,
  Camera,
  X,
  Plus,
  Globe
} from "lucide-react";

interface Disability {
  id: string;
  name: string;
  description?: string | null;
}

export default function UserSettingsProfilePage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [disabilities, setDisabilities] = useState<Disability[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    emergencyNumber: "",
    photoUrl: "",
    hasSafeguard: false,
    selectedDisabilities: [] as string[],
    province: "",
    canton: "",
    district: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchDisabilities();
      fetchProfile();
    }
  }, [status, router]);

  const fetchDisabilities = async () => {
    try {
      const response = await fetch("/api/disabilities");
      if (response.ok) {
        const data = await response.json();
        setDisabilities(data);
      }
    } catch (error) {
      console.error("Error fetching disabilities:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profile");
      
      if (!response.ok) {
        throw new Error("Error al cargar el perfil");
      }

      const data = await response.json();
      
      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        emergencyNumber: data.emergencyNumber || "",
        photoUrl: data.photoUrl || "",
        hasSafeguard: data.hasSafeguard || false,
        selectedDisabilities: data.disabilities?.map((d: Disability) => d.id) || [],
        province: data.location?.province || "",
        canton: data.location?.canton || "",
        district: data.location?.district || "",
        addressLine1: data.location?.addressLine1 || "",
        addressLine2: data.location?.addressLine2 || "",
        country: data.location?.country || "",
        postalCode: data.location?.postalCode || "",
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDisability = (disabilityId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDisabilities: prev.selectedDisabilities.includes(disabilityId)
        ? prev.selectedDisabilities.filter(id => id !== disabilityId)
        : [...prev.selectedDisabilities, disabilityId]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          emergencyNumber: formData.emergencyNumber,
          photoUrl: formData.photoUrl,
          hasSafeguard: formData.hasSafeguard,
          disabilityIds: formData.selectedDisabilities,
          notes: formData.notes,
          location: {
            province: formData.province,
            canton: formData.canton,
            district: formData.district,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            country: formData.country,
            postalCode: formData.postalCode,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el perfil");
      }

      alert("Perfil actualizado exitosamente");
      router.push("/usuarios/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error al guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8 text-white shadow-lg">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancel}
              className="mb-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Editar Perfil</h1>
                <p className="text-blue-100 text-lg">
                  Actualiza tu información personal y preferencias
                </p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-blue-100">Última actualización</p>
                  <p className="font-semibold">{new Date().toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} size="lg">
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>

        {/* Personal Information Card */}
        <Card className="border-l-4 border-l-cyan-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <User className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl">Información Personal</h2>
                <p className="text-sm text-muted-foreground font-normal">Datos básicos de tu cuenta</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Profile Photo with Upload */}
            <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-lg">
              <Label className="text-base font-semibold mb-4 block">
                Foto de Perfil
              </Label>
              <ImageUpload
                currentImage={formData.photoUrl}
                onImageChange={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
                bucket="avatars"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-600" />
                Nombre Completo
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Juan Pérez González"
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-600" />
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  className="h-11 bg-muted"
                />
                <p className="text-xs text-muted-foreground">El correo no puede ser modificado</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-base flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-600" />
                  Teléfono
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+506 0000-0000"
                  className="h-11"
                />
              </div>
            </div>

            {/* Disabilities Section */}
            <div className="space-y-4 pt-4 border-t-2 border-cyan-100 dark:border-cyan-900">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <AlertCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1">
                  <Label className="text-lg font-semibold">
                    Condiciones de Discapacidad
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selecciona todas las condiciones que apliquen a tu situación
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-4 border-2 border-dashed border-cyan-200 dark:border-cyan-800 rounded-xl bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20">
                {disabilities.map((disability) => (
                  <div
                    key={disability.id}
                    onClick={() => toggleDisability(disability.id)}
                    className={`
                      group relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${
                        formData.selectedDisabilities.includes(disability.id)
                          ? 'border-cyan-500 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 shadow-md scale-[1.02]'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-cyan-300 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="flex-1 pr-3">
                      <p className={`font-semibold text-sm ${
                        formData.selectedDisabilities.includes(disability.id)
                          ? 'text-cyan-700 dark:text-cyan-300'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {disability.name}
                      </p>
                      {disability.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {disability.description}
                        </p>
                      )}
                    </div>
                    <div className={`
                      flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200
                      ${
                        formData.selectedDisabilities.includes(disability.id)
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 scale-110'
                          : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900'
                      }
                    `}>
                      {formData.selectedDisabilities.includes(disability.id) ? (
                        <Plus className="w-4 h-4 text-white rotate-45" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {formData.selectedDisabilities.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-xl border border-cyan-200 dark:border-cyan-800">
                  <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-cyan-600" />
                    Condiciones Seleccionadas ({formData.selectedDisabilities.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedDisabilities.map(id => {
                      const disability = disabilities.find(d => d.id === id);
                      return disability ? (
                        <Badge 
                          key={id} 
                          className="gap-2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                        >
                          {disability.name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDisability(id);
                            }}
                            className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Safeguard Section */}
            <div className="flex items-center justify-between p-5 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-base">Salvaguarda Legal</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.hasSafeguard ? "✓ Cuenta con salvaguarda legal activa" : "Sin salvaguarda registrada"}
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.hasSafeguard}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, hasSafeguard: checked }))
                }
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl">Ubicación</h2>
                <p className="text-sm text-muted-foreground font-normal">Dirección de residencia</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Geographic Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province" className="text-base flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Provincia
                </Label>
                <Input 
                  id="province" 
                  name="province" 
                  value={formData.province} 
                  onChange={handleInputChange} 
                  placeholder="San José"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canton" className="text-base flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  Cantón
                </Label>
                <Input 
                  id="canton" 
                  name="canton" 
                  value={formData.canton} 
                  onChange={handleInputChange} 
                  placeholder="Escazú"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district" className="text-base flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Distrito
                </Label>
                <Input 
                  id="district" 
                  name="district" 
                  value={formData.district} 
                  onChange={handleInputChange} 
                  placeholder="San Rafael"
                  className="h-11"
                />
              </div>
            </div>

            {/* Address Lines */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1" className="text-base">Dirección Línea 1</Label>
                <Input 
                  id="addressLine1" 
                  name="addressLine1" 
                  value={formData.addressLine1} 
                  onChange={handleInputChange} 
                  placeholder="Calle principal, número de casa"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2" className="text-base text-muted-foreground">
                  Dirección Línea 2 <span className="text-xs">(opcional)</span>
                </Label>
                <Input 
                  id="addressLine2" 
                  name="addressLine2" 
                  value={formData.addressLine2} 
                  onChange={handleInputChange} 
                  placeholder="Apartamento, unidad, edificio"
                  className="h-11"
                />
              </div>
            </div>

            {/* Country and Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  País
                </Label>
                <Input 
                  id="country" 
                  name="country" 
                  value={formData.country} 
                  onChange={handleInputChange} 
                  placeholder="Costa Rica"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-base">Código Postal</Label>
                <Input 
                  id="postalCode" 
                  name="postalCode" 
                  value={formData.postalCode} 
                  onChange={handleInputChange} 
                  placeholder="10101"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Card */}
        <Card className="border-l-4 border-l-red-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl">Contacto de Emergencia</h2>
                <p className="text-sm text-muted-foreground font-normal">Persona a contactar en caso de emergencia</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="emergencyNumber" className="text-base flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                Teléfono de Emergencia
              </Label>
              <Input 
                id="emergencyNumber" 
                name="emergencyNumber" 
                value={formData.emergencyNumber} 
                onChange={handleInputChange} 
                placeholder="+506 0000-0000"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Este número será contactado en situaciones de emergencia
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Card */}
        <Card className="border-l-4 border-l-cyan-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Heart className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl">Información Adicional</h2>
                <p className="text-sm text-muted-foreground font-normal">Notas y detalles especiales</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base">Notas y Observaciones</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
                placeholder="Información adicional, preferencias de cuidado, alergias, medicamentos, etc..."
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Proporciona información relevante para los asistentes de cuidado
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-8 pt-4">
          <p className="text-sm text-muted-foreground">
            Los cambios se aplicarán inmediatamente al guardar
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} size="lg" className="min-w-[120px]">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              size="lg"
              className="min-w-[160px] bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
