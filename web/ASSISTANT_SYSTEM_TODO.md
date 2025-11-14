# 🎯 Sistema de Cuidadores - Plan de Implementación

## Estado Actual: ✅ Componentes Base Creados

### ✅ Completado:
- [x] Schema Prisma con modelo `Assistant` 
- [x] Tipos TypeScript (`/types/assistant.ts`)
- [x] Validaciones Zod (`/lib/validations/assistant.ts`)
- [x] Componente `SpecialtySelector`
- [x] Componente `ChipInput`
- [x] Options centralizadas

---

## 🚀 Próximos Pasos Críticos

### 1. ⚠️ Base de Datos
```bash
# IMPORTANTE: Ejecutar cuando tengas conexión a Supabase
cd web
npx prisma db push
npx prisma generate
```

### 2. 📄 Páginas a Crear

#### A. Para USUARIOS (buscar cuidadores):
```
/app/usuarios/available-caregivers/
├── page.tsx          → Lista de cuidadores con filtros y búsqueda
└── [id]/
    └── page.tsx      → Perfil público del cuidador
```

**Características:**
- Grid de cards (3 columnas en desktop, responsivo)
- Filtros: especialidad, experiencia, tarifa, verificado, días disponibles
- Búsqueda por nombre/bio
- Badges de verified, especialidades, rating
- Botón "Contactar" o "Ver Perfil"

#### B. Para ASISTENTES (su propio perfil):
```
/app/asistentes/profile/
├── page.tsx          → Ver mi perfil (readonly)
└── edit/
    └── page.tsx      → Editar mi perfil
```

**Formulario debe incluir:**
- Bio (textarea 50-1000 caracteres)
- Especialidades (multi-select con `SpecialtySelector`)
- Años de experiencia (select 0-50)
- Certificaciones (ChipInput con sugerencias)
- Idiomas (ChipInput con sugerencias)
- Horario (text input o dropdown)
- Días disponibles (WeekdaysSelector - ¡ya existe!)
- Tarifa por hora (number input)
- Distancia máxima (number input con "km")
- Checkboxes: Vehículo propio, Primeros auxilios
- Toggle: Disponible/No disponible

### 3. 🔌 API Endpoints a Crear/Actualizar

```typescript
// Ya existe pero necesita actualización:
GET  /api/assistants/available
     → Actualizar para usar modelo Assistant

// Crear nuevos:
GET  /api/assistants/[id]
     → Obtener un asistente específico con toda su info

PUT  /api/assistants/[id]
     → Actualizar perfil de asistente (solo el dueño)

POST /api/assistants
     → Crear perfil de asistente (primera vez)
```

### 4. 🎨 Componentes Adicionales

```
/components/assistants/
├── AssistantCard.tsx         → Card para lista (compacta)
├── AssistantProfileCard.tsx  → Card para perfil completo
├── AssistantFilters.tsx      → Barra de filtros
└── AvailabilityBadge.tsx     → Badge de disponibilidad
```

**AssistantCard debe mostrar:**
- Foto o avatar
- Nombre
- Rating (estrellas + número)
- Especialidades (badges pequeños)
- Años de experiencia
- Tarifa por hora (destacada)
- Badge "Verificado" si `verified = true`
- Badge "Primeros Auxilios" si `hasFirstAid = true`
- Ubicación
- Botones: "Ver Perfil"

### 5. 🎨 Diseño UX/UI

**Paleta de colores** (ya creada en `/config/colors.ts`):
- Usar `colors.secondary` (verde) para badges de verified/disponible
- Usar `careTypeColors` para las especialidades
- Mantener diseño limpio y profesional como en "Mis Solicitudes"

**Layout:**
- Grid responsivo: 1 col (móvil) → 2 cols (tablet) → 3 cols (desktop)
- Cards con hover effect (shadow-xl)
- Filtros sticky en top o sidebar
- Empty state con icono y mensaje

---

## 📝 Orden Recomendado de Implementación

### Fase 1: Backend (API)
1. ✅ Migrar DB (`prisma db push`)
2. Actualizar `/api/assistants/available/route.ts`
3. Crear `/api/assistants/[id]/route.ts` (GET, PUT)
4. Crear `/api/assistants/route.ts` (POST)

### Fase 2: Componentes
1. `AssistantCard.tsx`
2. `AssistantFilters.tsx`
3. `AssistantProfileCard.tsx`

### Fase 3: Páginas para Usuarios
1. `/usuarios/available-caregivers/page.tsx` (lista)
2. `/usuarios/available-caregivers/[id]/page.tsx` (perfil)

### Fase 4: Páginas para Asistentes
1. `/asistentes/profile/page.tsx` (vista readonly)
2. `/asistentes/profile/edit/page.tsx` (formulario)

### Fase 5: Testing & Polish
1. Probar todos los filtros
2. Verificar responsividad
3. Probar CRUD completo
4. Verificar validaciones

---

## 🔧 Comandos Útiles

```bash
# Generar cliente de Prisma después de cambios
npx prisma generate

# Ver base de datos en UI
npx prisma studio

# Ver logs en desarrollo
npm run dev

# Verificar TypeScript
npx tsc --noEmit
```

---

## 📦 Datos de Ejemplo para Testing

```sql
-- Insertar asistente de prueba (después de migración)
INSERT INTO cuidapp.assistants (
  id, user_id, bio, specialties, years_experience,
  certifications, languages, available_weekdays,
  hourly_rate, is_available, verified, has_first_aid
) VALUES (
  'assistant_test_1',
  'user_id_aqui',
  'Cuidador profesional con experiencia en adultos mayores',
  ARRAY['elderly', 'companion'],
  5,
  ARRAY['Primeros Auxilios', 'RCP Básico'],
  ARRAY['Español', 'Inglés'],
  ARRAY['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
  5000,
  true,
  true,
  true
);
```

---

## ⚠️ Notas Importantes

1. **Migración de DB**: DEBE hacerse antes de continuar
2. **WeekdaysSelector**: Ya existe, reutilizar desde `/components/requests`
3. **Paleta de colores**: Ya existe en `/config/colors.ts`
4. **Validaciones**: Ya creadas en `/lib/validations/assistant.ts`
5. **Roles**: Asegúrate de verificar roles (Usuario vs Asistente) en las páginas

---

## 🎯 Objetivo Final

**Para Usuarios:**
- Buscar cuidadores fácilmente
- Filtrar por necesidades específicas
- Ver perfiles completos con reviews
- Contactar/solicitar servicios

**Para Asistentes:**
- Mantener perfil actualizado
- Mostrar especialidades y certificaciones
- Controlar disponibilidad
- Recibir más solicitudes

---

**Estado:** 🟡 En Progreso - Esperando migración de DB
**Próximo:** Crear API endpoints y componentes de cards
