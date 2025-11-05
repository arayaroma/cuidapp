import Swal from "sweetalert2";

// Configuración base para todas las alertas
const baseConfig = {
  confirmButtonColor: "#3b82f6",
  cancelButtonColor: "#6b7280",
};

// Alertas de éxito
export const successAlert = {
  // Éxito genérico
  show: (title: string, text?: string) => {
    return Swal.fire({
      icon: "success",
      title,
      text,
      ...baseConfig,
    });
  },

  // Guardado exitoso
  saved: (message = "Los cambios se han guardado correctamente") => {
    return Swal.fire({
      icon: "success",
      title: "¡Guardado!",
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  },

  // Creado exitoso
  created: (item = "El elemento", message?: string) => {
    return Swal.fire({
      icon: "success",
      title: "¡Creado!",
      text: message || `${item} se ha creado exitosamente`,
      timer: 2000,
      showConfirmButton: false,
    });
  },

  // Eliminado exitoso
  deleted: (item = "El elemento", message?: string) => {
    return Swal.fire({
      icon: "success",
      title: "¡Eliminado!",
      text: message || `${item} se ha eliminado exitosamente`,
      timer: 2000,
      showConfirmButton: false,
    });
  },

  // Actualizado exitoso
  updated: (item = "El elemento", message?: string) => {
    return Swal.fire({
      icon: "success",
      title: "¡Actualizado!",
      text: message || `${item} se ha actualizado exitosamente`,
      timer: 2000,
      showConfirmButton: false,
    });
  },
};

// Alertas de error
export const errorAlert = {
  // Error genérico
  show: (title: string, text?: string) => {
    return Swal.fire({
      icon: "error",
      title,
      text,
      ...baseConfig,
    });
  },

  // Error al cargar
  loading: (item = "la información", message?: string) => {
    return Swal.fire({
      icon: "error",
      title: "Error al cargar",
      text: message || `No se pudo cargar ${item}. Por favor intenta de nuevo.`,
      ...baseConfig,
    });
  },

  // Error al guardar
  saving: (message = "No se pudieron guardar los cambios. Por favor intenta de nuevo.") => {
    return Swal.fire({
      icon: "error",
      title: "Error al guardar",
      text: message,
      ...baseConfig,
    });
  },

  // Error al crear
  creating: (item = "el elemento", message?: string) => {
    return Swal.fire({
      icon: "error",
      title: "Error al crear",
      text: message || `No se pudo crear ${item}. Por favor intenta de nuevo.`,
      ...baseConfig,
    });
  },

  // Error al eliminar
  deleting: (item = "el elemento", message?: string) => {
    return Swal.fire({
      icon: "error",
      title: "Error al eliminar",
      text: message || `No se pudo eliminar ${item}. Por favor intenta de nuevo.`,
      ...baseConfig,
    });
  },

  // Error de validación
  validation: (message = "Por favor verifica los datos ingresados") => {
    return Swal.fire({
      icon: "error",
      title: "Datos inválidos",
      text: message,
      ...baseConfig,
    });
  },

  // Error de permisos
  permission: (message = "No tienes permisos para realizar esta acción") => {
    return Swal.fire({
      icon: "error",
      title: "Acceso denegado",
      text: message,
      ...baseConfig,
    });
  },

  // Error de red
  network: (message = "Verifica tu conexión a internet e intenta de nuevo") => {
    return Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: message,
      ...baseConfig,
    });
  },
};

// Alertas de advertencia
export const warningAlert = {
  // Advertencia genérica
  show: (title: string, text?: string) => {
    return Swal.fire({
      icon: "warning",
      title,
      text,
      ...baseConfig,
    });
  },

  // Cambios sin guardar
  unsavedChanges: () => {
    return Swal.fire({
      icon: "warning",
      title: "Cambios sin guardar",
      text: "Tienes cambios sin guardar. ¿Estás seguro que deseas salir?",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      ...baseConfig,
    });
  },

  // Acción irreversible
  irreversible: (message = "Esta acción no se puede deshacer") => {
    return Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: message,
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      ...baseConfig,
    });
  },
};

// Alertas de confirmación
export const confirmAlert = {
  // Confirmar eliminación
  delete: (item = "este elemento") => {
    return Swal.fire({
      icon: "question",
      title: "¿Eliminar?",
      text: `¿Estás seguro que deseas eliminar ${item}?`,
      html: `¿Estás seguro que deseas eliminar <strong>${item}</strong>?<br><small class="text-muted-foreground">Esta acción no se puede deshacer</small>`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
  },

  // Confirmar acción genérica
  action: (title: string, text: string, confirmText = "Sí, continuar") => {
    return Swal.fire({
      icon: "question",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: "Cancelar",
      ...baseConfig,
    });
  },

  // Confirmar cambio de estado
  statusChange: (newStatus: string) => {
    return Swal.fire({
      icon: "question",
      title: "Cambiar estado",
      text: `¿Deseas cambiar el estado a "${newStatus}"?`,
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      ...baseConfig,
    });
  },
};

// Alertas de información
export const infoAlert = {
  // Info genérica
  show: (title: string, text?: string) => {
    return Swal.fire({
      icon: "info",
      title,
      text,
      ...baseConfig,
    });
  },

  // Sin resultados
  noResults: (message = "No se encontraron resultados") => {
    return Swal.fire({
      icon: "info",
      title: "Sin resultados",
      text: message,
      ...baseConfig,
    });
  },

  // Próximamente
  comingSoon: (feature = "Esta función") => {
    return Swal.fire({
      icon: "info",
      title: "Próximamente",
      text: `${feature} estará disponible pronto`,
      ...baseConfig,
    });
  },
};

// Alertas de carga (loading)
export const loadingAlert = {
  // Mostrar loading
  show: (title = "Cargando...", text = "Por favor espera") => {
    return Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  // Loading con mensaje personalizado
  processing: (message = "Procesando tu solicitud...") => {
    return Swal.fire({
      title: "Procesando",
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  // Cerrar loading
  close: () => {
    Swal.close();
  },
};

// Toast notifications (alertas pequeñas no invasivas)
export const toast = {
  success: (message: string) => {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  },

  error: (message: string) => {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  },

  info: (message: string) => {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  },

  warning: (message: string) => {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  },
};

// Exportar todo como un objeto para fácil importación
export const alerts = {
  success: successAlert,
  error: errorAlert,
  warning: warningAlert,
  confirm: confirmAlert,
  info: infoAlert,
  loading: loadingAlert,
  toast,
};

export default alerts;
