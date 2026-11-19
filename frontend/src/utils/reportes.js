// Utilidades y constantes compartidas para el módulo de Reportes y Analítica · TechAsset
import { CATEGORIAS_EQUIPO, TIPOS_MOVIMIENTO } from '../constants/estados';
import { obtenerEtiquetaCategoria } from '../constants/etiquetas';

export const PESTANAS_REPORTES = Object.freeze([
  { clave: 'por-estado', etiqueta: 'Equipos por estado' },
  { clave: 'mas-utilizados', etiqueta: 'Más utilizados' },
  { clave: 'por-area', etiqueta: 'Préstamos por área' },
  { clave: 'movimientos', etiqueta: 'Movimientos' }
]);

export const OPCIONES_PERIODO = Object.freeze([
  { valor: 'todo', etiqueta: 'Todo el histórico' },
  { valor: 'este-mes', etiqueta: 'Este mes' },
  { valor: 'ultimos-30', etiqueta: 'Últimos 30 días' },
  { valor: 'personalizado', etiqueta: 'Personalizado' }
]);

export const OPCIONES_CATEGORIA_REPORTE = Object.freeze([
  { valor: '', etiqueta: 'Todas las categorías' },
  ...Object.entries(CATEGORIAS_EQUIPO).map(([_, v]) => ({
    valor: v,
    etiqueta: obtenerEtiquetaCategoria(v)
  }))
]);

export const OPCIONES_TIPO_MOVIMIENTO = Object.freeze([
  { valor: '', etiqueta: 'Todos los tipos de movimiento' },
  { valor: TIPOS_MOVIMIENTO.REGISTRO, etiqueta: 'Alta de equipo en inventario' },
  { valor: TIPOS_MOVIMIENTO.PRESTAMO_SOLICITADO, etiqueta: 'Solicitud de préstamo ingresada' },
  { valor: TIPOS_MOVIMIENTO.PRESTAMO_APROBADO, etiqueta: 'Préstamo aprobado' },
  { valor: TIPOS_MOVIMIENTO.DEVOLUCION, etiqueta: 'Devolución de equipo conforme' },
  { valor: TIPOS_MOVIMIENTO.CAMBIO_ESTADO, etiqueta: 'Cambio de estado operativo' },
  { valor: TIPOS_MOVIMIENTO.EDICION, etiqueta: 'Edición de datos del equipo' },
  { valor: TIPOS_MOVIMIENTO.PRESTAMO_RECHAZADO, etiqueta: 'Solicitud de préstamo rechazada' }
]);

export const AREAS_BASE_INNOVATECH = Object.freeze([
  'Desarrollo de Software',
  'Aseguramiento de Calidad (QA)',
  'Diseño y Experiencia (UX/UI)',
  'Gestión de Proyectos y Operaciones',
  'Soporte Técnico de TI',
  'Data Center & Infraestructura'
]);

export function obtenerEstiloMedalla(pos) {
  if (pos === 1) return 'bg-[#FCD34D] text-[#78350F] shadow-xs';
  if (pos === 2) return 'bg-[#CBD5E1] text-[#1E293B] shadow-xs';
  if (pos === 3) return 'bg-[#F97316] text-white shadow-xs';
  return 'bg-superficie-2 text-texto-suave';
}

export function calcularPorcentaje(cantidad, total) {
  if (!total || total <= 0) return 0;
  return Math.round(((cantidad || 0) / total) * 100);
}
