# Migración: Edición de Perfil de Usuario

## 📋 Resumen
Se migró y mejoró la funcionalidad de edición de perfil de usuario con una ruta más coherente, conexión a base de datos real, y mejor UX con la paleta de colores del proyecto.

## 🔄 Cambios Realizados

### 1. Nueva Ruta
**Antes:** `/usuarios/settingsProfile`
**Ahora:** `/usuarios/profile/edit`

✅ Más coherente con la estructura RESTful
✅ Mantiene la relación jerárquica con `/usuarios/profile`

### 2. Endpoint de Actualización
**Archivo:** `/src/app/api/users/profile/update/route.ts`

**Método:** `PUT`

**Request Body:**
```typescript
{
  fullName: string;          // Required
  phone?: string;
  emergencyPhone?: string;
  notes?: string;
  location?: {
    province?: string;
    canton?: string;
    district?: string;
    addressLine1?: string;
  }
}
```

**Response Success (200):**
```typescript
{
  success: true;
  message: "Perfil actualizado exitosamente";
  user: {
    id: string;
    name: string;
    phone: string | null;
    emergencyPhone: string | null;
    notes: string | null;
  }
}
```

**Response Error (400/401/500):**
```typescript
{
  error: string;
}
```

### 3. Características del Formulario

#### Campos Editables:
✅ **Nombre Completo** (requerido)
✅ **Teléfono**
✅ **Teléfono de Emergencia**
✅ **Ubicación:**
  - Provincia
  - Cantón
  - Distrito
  - Dirección Exacta
✅ **Notas Adicionales** (información especial, condiciones médicas, preferencias)

#### Campos No Editables:
🔒 **Email** - Mostrado pero deshabilitado (no se puede cambiar)

### 4. Validaciones

**Frontend:**
- Nombre completo es requerido (trim)
- Mensajes de error con SweetAlert2

**Backend:**
- Validación de nombre no vacío
- Trim de todos los campos de texto
- Manejo de campos opcionales (null si vacío)
- Upsert inteligente de ubicación (solo si hay datos)

### 5. UX/UI Mejoras

#### Estados:
- ✅ **Loading inicial:** Spinner mientras carga datos del perfil
- ✅ **Saving:** Botón deshabilitado con spinner durante guardado
- ✅ **Success:** Alert de SweetAlert2 antes de redireccionar
- ✅ **Error:** Mensajes descriptivos con SweetAlert2

#### Paleta de Colores:
```typescript
// Información Personal
- Icon background: colors.primary[100]
- Icon color: colors.primary[600]
- Card title: colors.primary[700]

// Ubicación
- Icon background: colors.secondary[100]
- Icon color: colors.secondary[600]
- Card title: colors.secondary[700]

// Información Adicional
- Icon background: colors.accent[100]
- Icon color: colors.accent[600]
- Card title: colors.accent[700]

// Botones
- Guardar: colors.gradients.primary
- Cancelar: border colors.neutral[300]
```

#### Layout:
- Secciones separadas por tarjetas con iconos coloridos
- Grid responsivo (1 col mobile, 2-3 cols desktop)
- Campos de ubicación en grid de 3 columnas
- Textarea con altura fija para notas
- Botones de acción al final (Cancelar + Guardar)

### 6. Integración con Base de Datos

#### Tablas Afectadas:

**users:**
```sql
UPDATE users SET
  full_name = ?,
  phone_number = ?,
  emergency_number = ?,
  notes = ?
WHERE id = ?
```

**locations:**
```sql
-- Upsert (INSERT or UPDATE)
ON CONFLICT (user_id) DO UPDATE SET
  province = ?,
  canton = ?,
  district = ?,
  address_line1 = ?
```

### 7. Flujo de Usuario

```
1. Usuario en /usuarios/profile
2. Click en botón "Editar Perfil"
   ↓
3. Redirección a /usuarios/profile/edit
   ↓
4. Loading: Fetch datos actuales desde /api/users/profile
   ↓
5. Formulario prellenado con datos actuales
   ↓
6. Usuario edita campos
   ↓
7. Click en "Guardar Cambios"
   ↓
8. Validación frontend (nombre requerido)
   ↓
9. PUT request a /api/users/profile/update
   ↓
10. Validación backend
    ↓
11. Update en base de datos (users + locations)
    ↓
12. Success alert de SweetAlert2
    ↓
13. Redirección a /usuarios/profile
```

## 🗑️ Archivos Eliminados
- `/src/app/usuarios/settingsProfile/` (carpeta completa)
  - Contenía mock data
  - Ruta no coherente
  - No conectada a base de datos

## 📁 Archivos Nuevos/Modificados

### Creados:
- ✅ `/src/app/api/users/profile/update/route.ts`
- ✅ `/src/app/usuarios/profile/edit/page.tsx`

### Modificados:
- ✅ `/src/app/usuarios/profile/page.tsx` (cambio de ruta del botón editar)

## 🎨 Diseño

- **Responsivo:** Mobile-first, adapta a desktop
- **Accesible:** Labels para todos los inputs, placeholders descriptivos
- **Consistente:** Usa la paleta de colores del proyecto
- **Intuitivo:** Iconos claros, agrupación lógica de campos
- **Feedback visual:** Loading states, disabled states, success/error alerts

## 🔐 Seguridad

- ✅ Autenticación requerida (getCurrentUserId)
- ✅ Solo puede editar su propio perfil (userId de sesión)
- ✅ Validación de entrada (trim, required fields)
- ✅ Sanitización de datos (null para campos vacíos)
- ✅ Email no editable (previene cambios accidentales)

## 🧪 Testing Recomendado

1. **Carga de datos:**
   - Perfil con todos los campos llenos
   - Perfil con campos opcionales vacíos
   - Perfil sin ubicación registrada

2. **Guardado:**
   - Editar solo nombre
   - Editar solo ubicación
   - Editar múltiples campos
   - Intentar guardar sin nombre (debe fallar)
   - Limpiar campos opcionales

3. **Estados:**
   - Loading inicial
   - Saving state
   - Success alert
   - Error de red
   - Error de validación

4. **Navegación:**
   - Botón "Cancelar" vuelve atrás
   - Success redirecciona a perfil
   - Botón "Editar Perfil" desde profile page

## 📝 Notas Técnicas

- **Prisma Upsert:** Se usa upsert para location porque un usuario puede o no tener ubicación registrada
- **Trim automático:** Todos los strings se limpian de espacios antes/después
- **Null vs Empty:** Campos vacíos se guardan como `null` en DB (no strings vacíos)
- **Email readonly:** El input está deshabilitado para evitar confusión (el backend no lo actualizaría de todas formas)
- **Emergency number:** Campo de texto libre, permite formato "+506 8888-9999"

## 🚀 Próximas Mejoras Sugeridas

1. **Foto de perfil:**
   - Upload de imagen
   - Crop/resize
   - Guardar en storage (S3/Cloudinary)

2. **Validación avanzada:**
   - Formato de teléfono
   - Selector de provincia/cantón/distrito (no input libre)
   - Geocoding de dirección

3. **Historia de cambios:**
   - Tabla `user_profile_changes`
   - Log de quién y cuándo modificó

4. **Confirmación de cambios importantes:**
   - Alert antes de guardar si cambió teléfono de emergencia

5. **Auto-save:**
   - Guardar borrador cada X segundos
   - Recuperar si el usuario cierra accidentalmente
