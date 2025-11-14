"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  bucket?: string;
}

export function ImageUpload({ currentImage, onImageChange, bucket = "avatars" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validación de tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    try {
      setUploading(true);

      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Aquí iría la lógica de upload a tu servidor/Supabase
      // Por ahora solo guardamos el preview local
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      // Simulación de upload - reemplazar con tu lógica real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Por ahora usamos el preview como URL
      // En producción, aquí obtendrías la URL del servidor
      const imageUrl = reader.result as string;
      onImageChange(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Por favor intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {preview ? (
          <div className="relative group">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              <Image
                src={preview}
                alt="Profile preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={handleRemove}
              className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div 
            onClick={handleClick}
            className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors bg-gray-50 dark:bg-gray-900"
          >
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Subiendo...' : preview ? 'Cambiar Foto' : 'Subir Foto'}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
          >
            <X className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG o GIF. Máximo 5MB.
      </p>
    </div>
  );
}
