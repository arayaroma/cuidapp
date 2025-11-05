# 🫂 CuidApp

> **Cuidado con amor** - Plataforma de conexión entre usuarios y cuidadores profesionales en Costa Rica

CuidApp es una aplicación web moderna que conecta a personas que necesitan servicios de cuidado con asistentes profesionales verificados. La plataforma facilita la búsqueda, contratación y gestión de servicios de cuidado personalizado.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-316192?logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#️-tech-stack)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#️-base-de-datos)
- [Autenticación](#-autenticación)
- [Paleta de Colores](#-paleta-de-colores)
- [Documentación Adicional](#-documentación-adicional)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### Para Usuarios
- 🔍 **Búsqueda Avanzada**: Encuentra cuidadores por especialidad, experiencia, ubicación y tarifa
- 📋 **Gestión de Solicitudes**: Crea y administra solicitudes de servicios de cuidado
- 👤 **Perfiles Detallados**: Visualiza información completa de asistentes verificados
- 💬 **Sistema de Mensajería**: Comunicación directa con asistentes (próximamente)
- ⭐ **Sistema de Calificaciones**: Valora y revisa los servicios recibidos
- 📊 **Dashboard Personalizado**: Seguimiento de servicios activos e historial
- 💳 **Gestión de Pagos**: Visualiza tarifas y costos estimados en colones (₡)

### Para Asistentes
- 📝 **Perfil Profesional**: Muestra experiencia, especialidades y certificaciones
- 🔔 **Solicitudes Disponibles**: Visualiza trabajos disponibles en tiempo real
- ✅ **Gestión de Aplicaciones**: Aplica a solicitudes y gestiona ofertas
- 📈 **Estadísticas**: Seguimiento de trabajos completados y calificaciones
- 💼 **Servicios Activos**: Administra tus trabajos en progreso
- 🎯 **Perfil Verificado**: Badge de verificación para mayor confianza

### Características Técnicas
- ✅ **Conectado a PostgreSQL**: Todos los datos almacenados en base de datos real
- 🔐 **Autenticación Segura**: NextAuth.js con sesiones seguras
- 📱 **Responsive Design**: Optimizado para móvil, tablet y desktop
- 🎨 **UI/UX Moderna**: Diseño consistente con paleta de colores profesional
- ⚡ **Performance**: Optimizado con Next.js 15 y React 19
- 🔄 **Estados de Carga**: Feedback visual en todas las operaciones
- 🌐 **i18n Ready**: Preparado para internacionalización

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.5](https://nextjs.org/) con App Router
- **UI Library**: [React 19.1](https://reactjs.org/)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Components**: Custom components + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Alerts**: [SweetAlert2](https://sweetalert2.github.io/)
- **UI Components**: [Material-UI](https://mui.com/)

### Backend
- **API Routes**: Next.js API Routes
- **ORM**: [Prisma 6.15](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: [NextAuth.js 4.24](https://next-auth.js.org/)
- **Password Hash**: [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Validation**: [Zod 4.x](https://zod.dev/)

### DevOps & Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Build Tool**: Turbopack
- **Database Tool**: Prisma Studio

---

## 📦 Requisitos Previos

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **PostgreSQL**: >= 14.x
- **Git**: >= 2.x

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/arayaroma/cuidapp.git
cd cuidapp/web
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `web/`:

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/cuidapp?schema=cuidapp"
DIRECT_URL="postgresql://usuario:contraseña@localhost:5432/cuidapp?schema=cuidapp"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-super-seguro-aqui"

# Otros (opcional)
NODE_ENV="development"
```

### 4. Configurar Base de Datos

```bash
# Generar cliente de Prisma
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Sembrar datos de prueba (opcional)
npm run db:seed
```

### 5. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

---

## ⚙️ Configuración

### Base de Datos

El proyecto usa **Prisma** como ORM. El esquema se encuentra en `prisma/schema.prisma`.

**Comandos útiles:**

```bash
# Ver base de datos en Prisma Studio
npx prisma studio

# Generar cliente después de cambios en schema
npx prisma generate

# Aplicar cambios a la base de datos
npx prisma db push

# Resetear base de datos y sembrar datos
npm run db:reset
```

### Autenticación

Configuración de NextAuth.js en `src/lib/auth.ts`:

- **Provider**: Credentials (email/password)
- **Session Strategy**: JWT
- **Password Hash**: bcryptjs

**Usuarios de prueba** (después de ejecutar `db:seed`):

```
Usuario:
- Email: user@example.com
- Password: password123

Asistente:
- Email: assistant@example.com
- Password: password123
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo con Turbopack

# Producción
npm run build            # Compila la aplicación para producción
npm start                # Inicia servidor de producción

# Base de Datos
npm run db:seed          # Siembra datos de prueba
npm run db:reset         # Resetea y siembra la base de datos

# Calidad de Código
npm run lint             # Ejecuta ESLint
```

---

## 📁 Estructura del Proyecto

```
web/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.ts                # Script de datos de prueba
│   └── migrations/            # Migraciones de base de datos
│
├── public/                    # Archivos estáticos
│
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── assistants/    # Endpoints de asistentes
│   │   │   ├── auth/          # Autenticación (NextAuth)
│   │   │   └── users/         # Endpoints de usuarios
│   │   ├── asistentes/        # Páginas de asistentes
│   │   ├── login/             # Página de login
│   │   └── usuarios/          # Páginas de usuarios
│   │
│   ├── components/            # Componentes React
│   │   ├── asistentes/        # Componentes de asistentes
│   │   ├── assistants/        # Componentes de búsqueda
│   │   ├── dashboard/         # Componentes de dashboard
│   │   ├── login/             # Componentes de login
│   │   ├── requests/          # Componentes de solicitudes
│   │   ├── shared/            # Componentes compartidos
│   │   ├── ui/                # UI primitivos
│   │   └── usuarios/          # Componentes de usuarios
│   │
│   ├── config/                # Configuración
│   │   ├── colors.ts          # Paleta de colores
│   │   ├── assistantNavConfig.ts
│   │   └── userNavConfig.ts
│   │
│   ├── hooks/                 # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useLoginForm.ts
│   │   └── useNavigation.ts
│   │
│   ├── lib/                   # Utilidades y helpers
│   │   ├── alerts.ts          # SweetAlert2 helpers
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Cliente de Prisma
│   │   ├── session.ts         # Helper de sesión
│   │   ├── utils.ts           # Utilidades generales
│   │   └── validations/       # Schemas de validación
│   │
│   └── types/                 # TypeScript types
│       ├── assistant.ts
│       ├── auth.d.ts
│       └── request.ts
│
├── .env                       # Variables de entorno (no commitear)
├── .gitignore
├── components.json            # Config de componentes UI
├── next.config.ts             # Config de Next.js
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔌 API Endpoints

### Autenticación

```
POST   /api/auth/signin         # Login
POST   /api/auth/signout        # Logout
GET    /api/auth/session        # Obtener sesión actual
```

### Usuarios

```
GET    /api/users/profile       # Perfil del usuario autenticado
PUT    /api/users/profile/update # Actualizar perfil
GET    /api/users/appointments  # Citas del usuario
GET    /api/users/requests      # Solicitudes del usuario
POST   /api/users/requests      # Crear nueva solicitud
GET    /api/users/in-progress   # Servicios activos
GET    /api/users/history       # Historial de servicios
```

### Asistentes

```
GET    /api/assistants/available          # Asistentes disponibles
GET    /api/assistants/available-requests # Solicitudes disponibles
GET    /api/assistants/profile            # Perfil del asistente
PUT    /api/assistants/profile/update     # Actualizar perfil
```

### Solicitudes

```
GET    /api/requests/:id        # Detalle de solicitud
PUT    /api/requests/:id        # Actualizar solicitud
DELETE /api/requests/:id        # Cancelar solicitud
POST   /api/requests/:id/apply  # Aplicar a solicitud (asistente)
```

---

## 🗄️ Base de Datos

### Modelos Principales

- **User**: Usuarios y asistentes
- **Role**: Roles del sistema (user, assistant, admin)
- **Location**: Ubicaciones de usuarios
- **Disability**: Tipos de discapacidad
- **Assistant**: Perfil extendido de asistentes
- **UserRequests**: Solicitudes de servicios
- **ApplicationRequests**: Aplicaciones a solicitudes
- **UsersAssistant**: Servicios contratados

### Diagrama ER (Simplificado)

```
User ──────┐
│          ├─── Location
│          ├─── Role
│          ├─── Disability
│          ├─── Assistant
│          ├─── UserRequests
│          └─── UsersAssistant
│
UserRequests ──── ApplicationRequests
```

Ver schema completo en: `prisma/schema.prisma`

---

## 🔐 Autenticación

### Flujo de Autenticación

1. Usuario ingresa email/password en `/login`
2. Credenciales se envían a `/api/auth/callback/credentials`
3. NextAuth valida contra la base de datos
4. Se genera JWT con información del usuario y rol
5. Session se almacena en cookie segura
6. Middleware protege rutas basado en rol

### Protección de Rutas

```typescript
// middleware.ts
export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/usuarios/:path*",
    "/asistentes/:path*",
  ]
}
```

### Obtener Sesión en Componentes

```typescript
// Client Component
import { useSession } from "next-auth/react"

const { data: session } = useSession()
```

```typescript
// Server Component / API Route
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const session = await getServerSession(authOptions)
```

---

## 🎨 Paleta de Colores

La aplicación usa una paleta de colores consistente definida en `src/config/colors.ts`:

```typescript
// Colores Principales
primary: {
  50: '#EFF6FF',    // Azul muy claro
  500: '#3B82F6',   // Azul principal
  700: '#1D4ED8',   // Azul oscuro
}

secondary: {
  50: '#F0FDF4',    // Verde muy claro
  500: '#10B981',   // Verde principal
  700: '#047857',   // Verde oscuro
}

accent: {
  50: '#FFF7ED',    // Naranja muy claro
  500: '#F97316',   // Naranja principal
  700: '#C2410C',   // Naranja oscuro
}

// Gradientes
gradients: {
  primary: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
  trust: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
  warm: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
}
```

### Uso de Colores

```tsx
import { colors } from "@/config/colors"

<div style={{ background: colors.gradients.primary }}>
  <h1 style={{ color: colors.primary[700] }}>Título</h1>
</div>
```

---

## 📚 Documentación Adicional

El proyecto incluye documentación detallada en markdown:

- **`MIGRATION_DATABASE.md`**: Migración de mock data a base de datos
- **`PROFILE_EDIT_MIGRATION.md`**: Implementación de edición de perfil
- **`MIGRATION_WEEKDAYS.md`**: Sistema de disponibilidad por días
- **`UPDATES.md`**: Registro de actualizaciones del proyecto

---

## 🤝 Contribuir

### Proceso de Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'feat: add amazing feature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva característica
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma faltante, etc
refactor: refactorización de código
test: agregar tests
chore: actualizar dependencias, etc
```

### Estándares de Código

- **TypeScript**: Uso estricto de tipos
- **ESLint**: Seguir configuración del proyecto
- **Componentes**: Functional components con hooks
- **Naming**: camelCase para variables, PascalCase para componentes
- **Imports**: Organizar y usar alias `@/`

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.



## 📞 Contacto y Soporte

- **Issues**: [GitHub Issues](https://github.com/arayaroma/cuidapp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/arayaroma/cuidapp/discussions)

---

<div align="center">
  
**Hecho con ❤️ en Costa Rica 🇨🇷**

_CuidApp - Cuidado con amor_

</div>
