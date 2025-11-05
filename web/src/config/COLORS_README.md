# 🎨 Paleta de Colores - CuidApp

Paleta de colores profesional y premium diseñada específicamente para una aplicación de cuidado de personas.

## 🎯 Filosofía de Diseño

La paleta está inspirada en aplicaciones premium como Uber, Airbnb y plataformas de salud modernas, aplicando psicología del color:

- **Azul** (#3B82F6): Confianza, profesionalismo, calma
- **Verde** (#10B981): Cuidado, salud, bienestar
- **Naranja cálido** (#F97316): Calidez humana, compañía

## 📦 Uso

### Importar colores

```typescript
import { colors, careTypeColors, urgencyColors, statusColors } from "@/config/colors";
```

### Colores principales

```typescript
// Primario (Azul confianza)
colors.primary[500]  // #3B82F6
colors.primary[50]   // #EEF6FF (muy claro)
colors.primary[900]  // #1E3A8A (muy oscuro)

// Secundario (Verde cuidado)
colors.secondary[500] // #10B981

// Acento (Naranja cálido)
colors.accent[500]   // #F97316
```

### Gradientes predefinidos

```typescript
// En componentes React
<div style={{ background: colors.gradients.trust }}>
  {/* Gradiente azul profesional */}
</div>

<div style={{ background: colors.gradients.cool }}>
  {/* Gradiente azul-verde */}
</div>

<div style={{ background: colors.gradients.warm }}>
  {/* Gradiente naranja cálido */}
</div>
```

Gradientes disponibles:
- `trust` - Azul profesional
- `cool` - Azul a verde
- `warm` - Naranja cálido
- `premium` - Azul oscuro a verde
- `primary` - Azul primario
- `secondary` - Verde secundario
- `accent` - Naranja acento

### Colores semánticos

#### Tipos de cuidado

```typescript
import { careTypeColors } from "@/config/colors";

// Obtener colores para un tipo específico
const childrenColors = careTypeColors.children;
// {
//   color: "#F97316",     // Color principal
//   bg: "#FFF7ED",        // Fondo
//   border: "#FED7AA",    // Borde
//   hover: "#FFEDD5",     // Hover
//   text: "#C2410C"       // Texto
// }
```

Tipos disponibles:
- `children` - Niños (naranja)
- `elderly` - Adulto mayor (azul)
- `disability` - Discapacidad (verde)
- `hospital` - Hospitalario (azul info)
- `companion` - Compañía (ámbar)
- `special-needs` - Necesidades especiales (violeta)

#### Niveles de urgencia

```typescript
import { urgencyColors } from "@/config/colors";

const lowUrgency = urgencyColors.low;      // Verde
const mediumUrgency = urgencyColors.medium; // Ámbar
const highUrgency = urgencyColors.high;     // Rojo
```

#### Estados de solicitud

```typescript
import { statusColors } from "@/config/colors";

const activeStatus = statusColors.active;           // Verde
const inProgressStatus = statusColors['in-progress']; // Azul
const pausedStatus = statusColors.paused;           // Ámbar
const completedStatus = statusColors.completed;     // Gris
const cancelledStatus = statusColors.cancelled;     // Rojo
```

### Utilidades

```typescript
import { colorUtils } from "@/config/colors";

// Obtener colores dinámicamente
const colors = colorUtils.getCareTypeColor('elderly');
const urgency = colorUtils.getUrgencyColor('high');
const status = colorUtils.getStatusColor('active');
```

## 🎨 Ejemplos de Uso

### Botón con gradiente

```tsx
<Button
  style={{ background: colors.gradients.trust }}
  className="text-white hover:opacity-90 transition-opacity"
>
  Crear Solicitud
</Button>
```

### Card con color semántico

```tsx
const careColors = careTypeColors.elderly;

<div
  style={{
    backgroundColor: careColors.bg,
    borderColor: careColors.border,
  }}
  className="p-4 border-2 rounded-lg"
>
  <h3 style={{ color: careColors.text }}>Adulto Mayor</h3>
</div>
```

### Badge dinámico

```tsx
function UrgencyBadge({ urgency }) {
  const colors = urgencyColors[urgency];
  
  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
      className="px-3 py-1 rounded-full text-sm border"
    >
      {urgency}
    </span>
  );
}
```

## 🌈 Paleta Completa

### Primario (Azul)
- 50: #EEF6FF
- 100: #D9EBFF
- 500: #3B82F6 ⭐
- 900: #1E3A8A

### Secundario (Verde)
- 50: #F0FDF4
- 100: #DCFCE7
- 500: #10B981 ⭐
- 900: #064E3B

### Acento (Naranja)
- 50: #FFF7ED
- 100: #FFEDD5
- 500: #F97316 ⭐
- 900: #7C2D12

### Estados
- Success: #10B981 (verde)
- Warning: #F59E0B (ámbar)
- Error: #EF4444 (rojo)
- Info: #3B82F6 (azul)

### Neutrales
- 50: #FAFAFA (casi blanco)
- 500: #737373 (gris medio)
- 900: #171717 (casi negro)

## 💡 Mejores Prácticas

1. **Usa gradientes para headers y CTAs principales** - Da sensación premium
2. **Colores semánticos para categorías** - Mejora la UX con consistencia visual
3. **Fondos sutiles** - Usa tonos 50-100 para fondos, nunca colores saturados
4. **Contraste de texto** - Usa tonos 700-900 para texto sobre fondos claros
5. **Hover suave** - Prefiere `opacity` sobre cambios de color en hover

## 🔄 Migración

Para migrar código existente:

```typescript
// ❌ Antes
className="bg-purple-600 text-white"

// ✅ Ahora
style={{ background: colors.gradients.trust }}
className="text-white"
```

```typescript
// ❌ Antes
className="bg-purple-50 border-purple-200"

// ✅ Ahora
style={{
  backgroundColor: colors.primary[50],
  borderColor: colors.primary[200]
}}
```

## 📝 Notas

- Todos los colores están en formato HEX
- Los colores semánticos incluyen 5 propiedades: color, bg, border, hover, text
- Los gradientes usan `linear-gradient` CSS
- La paleta es extensible - puedes agregar más colores según necesites

---

**Creado para CuidApp** - Una plataforma premium de cuidado de personas
