/**
 * CuidApp - Paleta de Colores
 * 
 * Paleta profesional y premium para una aplicación de cuidado de personas.
 * Inspirada en diseños modernos como Uber, Airbnb y aplicaciones de salud premium.
 * 
 * Psicología de colores aplicada:
 * - Azul: Confianza, profesionalismo, calma
 * - Verde: Cuidado, salud, bienestar
 * - Naranja cálido: Calidez humana, compañía
 * - Grises: Sofisticación, neutralidad
 */

export const colors = {
  // Colores Primarios - Azul confianza
  primary: {
    50: '#EEF6FF',
    100: '#D9EBFF',
    200: '#BCDDFF',
    300: '#8EC8FF',
    400: '#59A9FF',
    500: '#3B82F6',  // Main primary
    600: '#1E63EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },

  // Colores Secundarios - Verde cuidado
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#10B981',  // Main secondary
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
    950: '#022C22',
  },

  // Acento - Naranja cálido (calidez humana)
  accent: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',  // Main accent
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#431407',
  },

  // Estados y alertas
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FED7AA',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },

  // Grises neutros (sofisticación)
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Fondos y superficies
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    dark: '#111827',
  },

  // Gradientes predefinidos
  gradients: {
    primary: 'linear-gradient(135deg, #3B82F6 0%, #1E63EB 100%)',
    secondary: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    accent: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    warm: 'linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FDBA74 100%)',
    cool: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
    premium: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #10B981 100%)',
    sunset: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
    trust: 'linear-gradient(to right, #3B82F6, #1D4ED8)',
  },
} as const;

// Mapeo semántico de colores por tipo de cuidado
export const careTypeColors = {
  children: {
    color: colors.accent[500],      // Naranja cálido
    bg: colors.accent[50],
    border: colors.accent[200],
    hover: colors.accent[100],
    text: colors.accent[700],
  },
  elderly: {
    color: colors.primary[500],     // Azul confianza
    bg: colors.primary[50],
    border: colors.primary[200],
    hover: colors.primary[100],
    text: colors.primary[700],
  },
  disability: {
    color: colors.secondary[500],   // Verde cuidado
    bg: colors.secondary[50],
    border: colors.secondary[200],
    hover: colors.secondary[100],
    text: colors.secondary[700],
  },
  hospital: {
    color: colors.info[500],        // Azul info
    bg: colors.info[50],
    border: colors.info[100],
    hover: colors.info[100],
    text: colors.info[700],
  },
  companion: {
    color: '#F59E0B',               // Ámbar
    bg: '#FFFBEB',
    border: '#FEF3C7',
    hover: '#FEF3C7',
    text: '#B45309',
  },
  'special-needs': {
    color: '#8B5CF6',               // Violeta
    bg: '#F5F3FF',
    border: '#E9D5FF',
    hover: '#EDE9FE',
    text: '#6D28D9',
  },
} as const;

// Mapeo semántico de urgencia
export const urgencyColors = {
  low: {
    color: colors.success[500],
    bg: colors.success[50],
    border: colors.success[100],
    hover: colors.success[100],
    text: colors.success[700],
  },
  medium: {
    color: colors.warning[500],
    bg: colors.warning[50],
    border: colors.warning[100],
    hover: colors.warning[100],
    text: colors.warning[700],
  },
  high: {
    color: colors.error[500],
    bg: colors.error[50],
    border: colors.error[100],
    hover: colors.error[100],
    text: colors.error[700],
  },
} as const;

// Mapeo semántico de estados
export const statusColors = {
  active: {
    color: colors.success[500],
    bg: colors.success[50],
    border: colors.success[200],
    hover: colors.success[100],
    text: colors.success[700],
  },
  'in-progress': {
    color: colors.primary[500],
    bg: colors.primary[50],
    border: colors.primary[200],
    hover: colors.primary[100],
    text: colors.primary[700],
  },
  paused: {
    color: colors.warning[500],
    bg: colors.warning[50],
    border: colors.warning[200],
    hover: colors.warning[100],
    text: colors.warning[700],
  },
  completed: {
    color: colors.neutral[500],
    bg: colors.neutral[50],
    border: colors.neutral[200],
    hover: colors.neutral[100],
    text: colors.neutral[700],
  },
  cancelled: {
    color: colors.error[500],
    bg: colors.error[50],
    border: colors.error[200],
    hover: colors.error[100],
    text: colors.error[700],
  },
} as const;

// Utilidades de color
export const colorUtils = {
  // Obtener color por tipo de cuidado
  getCareTypeColor: (type: keyof typeof careTypeColors) => careTypeColors[type],
  
  // Obtener color por urgencia
  getUrgencyColor: (urgency: keyof typeof urgencyColors) => urgencyColors[urgency],
  
  // Obtener color por estado
  getStatusColor: (status: keyof typeof statusColors) => statusColors[status],
};

// Exportar todo
export default colors;
