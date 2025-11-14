import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sube una imagen al storage de Supabase
 * @param file - Archivo a subir
 * @param bucket - Nombre del bucket (por defecto 'avatars')
 * @param path - Ruta dentro del bucket
 * @returns URL pública de la imagen subida
 */
export async function uploadImage(
  file: File,
  bucket: string = 'avatars',
  path?: string
): Promise<string> {
  try {
    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = path || `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Error al subir la imagen');
  }
}

/**
 * Elimina una imagen del storage de Supabase
 * @param url - URL de la imagen a eliminar
 * @param bucket - Nombre del bucket
 */
export async function deleteImage(url: string, bucket: string = 'avatars'): Promise<void> {
  try {
    // Extraer el path del archivo de la URL
    const urlParts = url.split('/');
    const filePath = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Error al eliminar la imagen');
  }
}
