export const ESTADOS_EQUIPO = Object.freeze({
  DISPONIBLE: 'Disponible',
  PRESTADO: 'Prestado',
  MANTENIMIENTO: 'Mantenimiento',
  BAJA: 'Baja'
});

export const CATEGORIAS_EQUIPO = Object.freeze({
  LAPTOP: 'Laptop',
  COMPUTADORA_ESCRITORIO: 'ComputadoraEscritorio',
  MONITOR: 'Monitor',
  IMPRESORA: 'Impresora',
  TABLET: 'Tablet',
  PROYECTOR: 'Proyector',
  EQUIPO_RED: 'EquipoRed'
});

export const ESTADOS_PRESTAMO = Object.freeze({
  PENDIENTE: 'Pendiente',
  ACTIVO: 'Activo',
  DEVUELTO: 'Devuelto',
  RECHAZADO: 'Rechazado'
});

export const TIPOS_MOVIMIENTO = Object.freeze({
  REGISTRO: 'Registro',
  CAMBIO_ESTADO: 'CambioEstado',
  PRESTAMO_SOLICITADO: 'PrestamoSolicitado',
  PRESTAMO_APROBADO: 'PrestamoAprobado',
  PRESTAMO_RECHAZADO: 'PrestamoRechazado',
  DEVOLUCION: 'Devolucion',
  EDICION: 'Edicion'
});

export const METADATOS_ESTADO_EQUIPO = Object.freeze({
  [ESTADOS_EQUIPO.DISPONIBLE]: { etiqueta: 'Disponible', variante: 'exito', clase: 'bg-disponible-fondo text-disponible-texto' },
  [ESTADOS_EQUIPO.PRESTADO]: { etiqueta: 'Prestado', variante: 'informacion', clase: 'bg-prestado-fondo text-prestado-texto' },
  [ESTADOS_EQUIPO.MANTENIMIENTO]: { etiqueta: 'Mantenimiento', variante: 'advertencia', clase: 'bg-mantenimiento-fondo text-mantenimiento-texto' },
  [ESTADOS_EQUIPO.BAJA]: { etiqueta: 'Baja', variante: 'peligro', clase: 'bg-baja-fondo text-baja-texto' }
});

export const METADATOS_ESTADO_PRESTAMO = Object.freeze({
  [ESTADOS_PRESTAMO.PENDIENTE]: { etiqueta: 'Pendiente', variante: 'advertencia', clase: 'bg-pendiente-fondo text-pendiente-texto' },
  [ESTADOS_PRESTAMO.ACTIVO]: { etiqueta: 'Activo', variante: 'informacion', clase: 'bg-activo-fondo text-activo-texto' },
  [ESTADOS_PRESTAMO.DEVUELTO]: { etiqueta: 'Devuelto', variante: 'exito', clase: 'bg-devuelto-fondo text-devuelto-texto' },
  [ESTADOS_PRESTAMO.RECHAZADO]: { etiqueta: 'Rechazado', variante: 'peligro', clase: 'bg-rechazado-fondo text-rechazado-texto' }
});
