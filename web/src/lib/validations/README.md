# Esquemas de Validación con Zod

Este directorio contiene los esquemas de validación de datos usando Zod para garantizar la integridad de los datos en toda la aplicación.

## 📋 Esquemas Disponibles

### `request.ts` - Validación de Solicitudes de Cuidado

#### **createRequestSchema**
Esquema para la creación de nuevas solicitudes de cuidado.

**Campos obligatorios:**
- `title` (string): 5-100 caracteres
- `description` (string): 20-1000 caracteres
- `careType` (enum): "children" | "elderly" | "disability" | "hospital"
- `personAge` (number): 0-120 años
- `requirements` (array): 1-10 requisitos, cada uno mínimo 1 carácter
- `urgency` (enum): "low" | "medium" | "high"
- `requestDate` (string): Fecha ISO, no puede ser anterior a hoy
- `requestTime` (string): Formato HH:MM

**Campos opcionales:**
- `hourlyRate` (number | null): Tarifa por hora, debe ser positiva
- `totalHours` (number | null): Horas totales, debe ser positivo
- `isRecurring` (boolean): Por defecto `false`

**Ejemplo de uso:**
```typescript
import { createRequestSchema } from "@/lib/validations/request";

const data = {
  title: "Cuidado de adulto mayor",
  description: "Necesito cuidador para mi padre de 80 años con Alzheimer...",
  careType: "elderly",
  personAge: 80,
  requirements: ["Experiencia con Alzheimer", "Paciencia"],
  urgency: "high",
  hourlyRate: 5000,
  totalHours: 40,
  isRecurring: true,
  requestDate: "2025-11-15",
  requestTime: "08:00"
};

try {
  const validatedData = createRequestSchema.parse(data);
  // Datos validados y seguros
} catch (error) {
  // Manejar errores de validación
  console.error(error.errors);
}
```

#### **updateRequestSchema**
Extiende `createRequestSchema` y agrega el campo `status` para actualizaciones.

**Campo adicional:**
- `status` (enum): "active" | "in-progress" | "completed" | "paused" | "cancelled"

**Ejemplo de uso:**
```typescript
import { updateRequestSchema } from "@/lib/validations/request";

const updateData = {
  ...createData,
  status: "in-progress"
};

const validatedData = updateRequestSchema.parse(updateData);
```

#### **requestIdSchema**
Valida IDs de solicitudes en formato CUID.

```typescript
import { requestIdSchema } from "@/lib/validations/request";

const { id } = requestIdSchema.parse({ id: "clxyz..." });
```

#### **requestFiltersSchema**
Valida filtros de búsqueda para solicitudes.

```typescript
import { requestFiltersSchema } from "@/lib/validations/request";

const filters = requestFiltersSchema.parse({
  status: "active",
  careType: "elderly",
  urgency: "high",
  searchQuery: "Alzheimer"
});
```

## 🏷️ Tipos TypeScript

Todos los esquemas exportan tipos TypeScript inferidos:

```typescript
import type { 
  CreateRequestInput,
  UpdateRequestInput,
  RequestFilters 
} from "@/lib/validations/request";
```

## 📚 Utilidades de Etiquetas

El archivo también exporta objetos con etiquetas legibles en español:

```typescript
import { 
  careTypeLabels,
  urgencyLabels,
  statusLabels 
} from "@/lib/validations/request";

// Uso en componentes
<span>{careTypeLabels[request.careType]}</span> // "Adulto Mayor"
<span>{urgencyLabels[request.urgency]}</span>   // "Alta"
<span>{statusLabels[request.status]}</span>     // "En Proceso"
```

## ✅ Ventajas de Usar Zod

1. **Validación en tiempo de ejecución**: Detecta datos inválidos antes de que causen errores
2. **Type safety**: Los tipos TypeScript se infieren automáticamente
3. **Mensajes de error claros**: Fácil de mostrar al usuario
4. **Composición**: Reutiliza esquemas base para crear variantes
5. **Documentación viva**: El código es la documentación

## 🔧 Manejo de Errores

```typescript
try {
  const data = createRequestSchema.parse(formData);
} catch (error) {
  if (error instanceof z.ZodError) {
    // Procesar errores de validación
    error.errors.forEach(err => {
      console.log(err.path.join("."), err.message);
    });
  }
}
```

## 📝 Mejores Prácticas

1. Siempre valida datos del usuario antes de enviarlos al servidor
2. Valida datos recibidos del servidor antes de usarlos
3. Usa los tipos inferidos en lugar de definir tipos manualmente
4. Centraliza validaciones complejas en esquemas reutilizables
5. Proporciona mensajes de error descriptivos en español
