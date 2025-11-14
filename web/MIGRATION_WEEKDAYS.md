# 📅 Migración: Selección de Días de la Semana

## ✅ Cambios Realizados

### 1. **Schema de Prisma actualizado** ✅
- Agregado campo `weekdays` de tipo `String[]` al modelo `UserRequests`
- Valores permitidos: lunes, martes, miercoles, jueves, viernes, sabado, domingo

### 2. **Componente WeekdaysSelector creado** ✅
Ubicación: `/src/components/requests/WeekdaysSelector.tsx`

Características:
- ✨ Botones visuales para cada día de la semana
- ✅ Check mark cuando está seleccionado
- 🎨 Colores de la paleta profesional
- 🔘 Botones "Todos" y "Limpiar"
- 📊 Contador de días seleccionados
- ⚡ Hover effects suaves

### 3. **Validación Zod actualizada** ✅
- Schema actualizado con campo `weekdays` opcional
- Array de enum con los 7 días de la semana
- Default: array vacío

### 4. **TypeScript Types actualizados** ✅
- Agregado type `Weekday`
- Interface `CareRequest` ahora incluye `weekdays?: Weekday[]`

### 5. **Formularios actualizados** ✅

**Crear solicitud:**
- ✅ Importado `WeekdaysSelector`
- ✅ Agregado campo `weekdays` al state
- ✅ Selector visible solo cuando `isRecurring` es true
- ✅ Validación incluida

**Editar solicitud:**
- ✅ Importado `WeekdaysSelector`
- ✅ Agregado campo `weekdays` al state
- ✅ Fetch de datos incluye weekdays
- ✅ Selector visible solo cuando `isRecurring` es true
- ✅ Validación incluida

---

## 🚀 Próximos Pasos - IMPORTANTE

### **DEBES EJECUTAR LA MIGRACIÓN DE LA BASE DE DATOS:**

\`\`\`bash
# 1. Generar la migración
npx prisma migrate dev --name add_weekdays_to_user_requests

# 2. Aplicar la migración
npx prisma db push

# 3. Regenerar el cliente de Prisma
npx prisma generate
\`\`\`

---

## 🎨 Cómo se ve

El selector aparece automáticamente cuando el usuario activa el switch de "Servicio recurrente":

```
┌─────────────────────────────────────────────────────────┐
│ Días de la semana *                                     │
│ Selecciona los días en los que necesitas el servicio   │
│                                                         │
│ [Todos] [Limpiar]              3 días seleccionados    │
│                                                         │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐           │
│ │Lun│ │Mar│ │Mié│ │Jue│ │Vie│ │Sáb│ │Dom│           │
│ │ ✓ │ │ ✓ │ │   │ │ ✓ │ │   │ │   │ │   │           │
│ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘           │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Notas Importantes

1. **Validación condicional**: Los días de la semana solo se validan/muestran cuando `isRecurring` es true
2. **Default value**: El campo `weekdays` tiene default de array vacío
3. **Compatibilidad**: Las solicitudes existentes tendrán array vacío automáticamente
4. **UX mejorada**: Los botones son grandes y fáciles de clickear en móvil

---

## 🧪 Pruebas Recomendadas

1. ✅ Crear solicitud recurrente con días específicos
2. ✅ Crear solicitud NO recurrente (weekdays debe ser [])
3. ✅ Editar solicitud y cambiar días
4. ✅ Activar/desactivar isRecurring
5. ✅ Validar que se guarden correctamente en la BD

---

**Fecha de implementación:** ${new Date().toLocaleDateString('es-ES')}
