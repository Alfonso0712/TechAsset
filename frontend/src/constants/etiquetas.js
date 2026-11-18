// Diccionario canónico de etiquetas legibles para enums y códigos · TechAsset · WCAG 2.2 AA

export const ETIQUETAS_CATEGORIA = Object.freeze({
  Laptop: 'Laptop',
  ComputadoraEscritorio: 'Computadora de escritorio',
  Monitor: 'Monitor',
  Proyector: 'Proyector',
  Impresora: 'Impresora',
  EquipoRed: 'Equipo de red',
  Accesorio: 'Accesorio',
  Tablet: 'Tablet'
});

export const MAPA_CATEGORIAS_EQUIPO = ETIQUETAS_CATEGORIA;

export const ICONOS_CATEGORIA = Object.freeze({
  Laptop: 'Laptop',
  ComputadoraEscritorio: 'Monitor',
  Monitor: 'Monitor',
  Proyector: 'Tv',
  Impresora: 'Printer',
  EquipoRed: 'Network',
  Accesorio: 'Headphones',
  Tablet: 'Tablet'
});

export const ETIQUETAS_ESTADO_EQUIPO = Object.freeze({
  Disponible: 'Disponible',
  Prestado: 'Prestado',
  Mantenimiento: 'En mantenimiento',
  Baja: 'Baja técnica'
});

export const ETIQUETAS_ESTADO_PRESTAMO = Object.freeze({
  Pendiente: 'Pendiente',
  Activo: 'Activo',
  Devuelto: 'Devuelto',
  Rechazado: 'Rechazado'
});

export const ETIQUETAS_ROL = Object.freeze({
  Administrador: 'Administrador',
  ResponsableTecnologia: 'Responsable de Tecnología',
  Colaborador: 'Colaborador'
});

export function obtenerEtiquetaCategoria(categoria) {
  return ETIQUETAS_CATEGORIA[categoria] || categoria || 'Equipo';
}

export function obtenerEtiquetaEstadoEquipo(estado) {
  return ETIQUETAS_ESTADO_EQUIPO[estado] || estado || 'Desconocido';
}

export function obtenerEtiquetaEstadoPrestamo(estado) {
  return ETIQUETAS_ESTADO_PRESTAMO[estado] || estado || 'Desconocido';
}

export function obtenerEtiquetaRol(rol) {
  return ETIQUETAS_ROL[rol] || rol || 'Usuario';
}
