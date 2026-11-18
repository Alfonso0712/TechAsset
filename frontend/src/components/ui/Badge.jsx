import Icono from './Icono';
import {
  ESTADOS_EQUIPO,
  ESTADOS_PRESTAMO
} from '../../constants/estados';
import {
  obtenerEtiquetaEstadoEquipo,
  obtenerEtiquetaEstadoPrestamo
} from '../../constants/etiquetas';

const ESTILOS_POR_VARIANTE = {
  exito: 'bg-exito-fondo text-exito-texto border border-exito-borde',
  informacion: 'bg-info-fondo text-info-texto border border-info-borde',
  advertencia: 'bg-advertencia-fondo text-advertencia-texto border border-advertencia-borde',
  peligro: 'bg-peligro-fondo text-peligro-texto border border-peligro-borde',
  discreto: 'bg-superficie-2 text-texto-suave border border-borde'
};

const VARIANTE_POR_ESTADO = {
  // Equipos
  [ESTADOS_EQUIPO.DISPONIBLE]: 'exito',
  [ESTADOS_EQUIPO.PRESTADO]: 'informacion',
  [ESTADOS_EQUIPO.MANTENIMIENTO]: 'advertencia',
  [ESTADOS_EQUIPO.BAJA]: 'peligro',
  Disponible: 'exito',
  Prestado: 'informacion',
  Mantenimiento: 'advertencia',
  Baja: 'peligro',
  // Préstamos
  [ESTADOS_PRESTAMO.PENDIENTE]: 'advertencia',
  [ESTADOS_PRESTAMO.ACTIVO]: 'informacion',
  [ESTADOS_PRESTAMO.DEVUELTO]: 'exito',
  [ESTADOS_PRESTAMO.RECHAZADO]: 'peligro',
  Pendiente: 'advertencia',
  Activo: 'informacion',
  Devuelto: 'exito',
  Rechazado: 'peligro'
};

const ICONO_POR_ESTADO = {
  [ESTADOS_EQUIPO.DISPONIBLE]: 'CheckCircle2',
  [ESTADOS_EQUIPO.PRESTADO]: 'PackageCheck',
  [ESTADOS_EQUIPO.MANTENIMIENTO]: 'AlertTriangle',
  [ESTADOS_EQUIPO.BAJA]: 'XCircle',
  Disponible: 'CheckCircle2',
  Prestado: 'PackageCheck',
  Mantenimiento: 'AlertTriangle',
  Baja: 'XCircle',
  [ESTADOS_PRESTAMO.PENDIENTE]: 'Clock',
  [ESTADOS_PRESTAMO.ACTIVO]: 'PackageCheck',
  [ESTADOS_PRESTAMO.DEVUELTO]: 'CheckCircle2',
  [ESTADOS_PRESTAMO.RECHAZADO]: 'XCircle',
  Pendiente: 'Clock',
  Activo: 'PackageCheck',
  Devuelto: 'CheckCircle2',
  Rechazado: 'XCircle'
};

export default function Badge({ estado, variante: vProp, icono: iProp, discreto = false, children }) {
  const etiqueta = children || obtenerEtiquetaEstadoPrestamo(estado) || obtenerEtiquetaEstadoEquipo(estado) || estado || '';
  const variante = discreto ? 'discreto' : (vProp || VARIANTE_POR_ESTADO[estado] || 'discreto');
  const nombreIcono = iProp || ICONO_POR_ESTADO[estado] || 'Info';
  const clases = ESTILOS_POR_VARIANTE[variante] || ESTILOS_POR_VARIANTE.discreto;

  return (
    <span className={`inline-flex items-center gap-1.5 h-[1.625rem] px-2.5 rounded-full text-xs font-semibold leading-none whitespace-nowrap ${clases}`}>
      <Icono nombre={nombreIcono} className="w-3.5 h-3.5 shrink-0" />
      <span>{etiqueta}</span>
    </span>
  );
}
