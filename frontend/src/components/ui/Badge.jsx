import Icono from './Icono';
import {
  ESTADOS_EQUIPO,
  ESTADOS_PRESTAMO
} from '../../constants/estados';

const ESTILOS_POR_VARIANTE = {
  exito: 'bg-disponible-fondo text-disponible-texto border border-disponible-texto/20',
  informacion: 'bg-prestado-fondo text-prestado-texto border border-prestado-texto/20',
  advertencia: 'bg-pendiente-fondo text-pendiente-texto border border-pendiente-texto/20',
  peligro: 'bg-baja-fondo text-baja-texto border border-baja-texto/20',
  discreto: 'bg-superficie-2 text-texto-suave border border-borde/60'
};

const VARIANTE_POR_ESTADO = {
  // Equipos
  [ESTADOS_EQUIPO.DISPONIBLE]: 'exito',
  [ESTADOS_EQUIPO.PRESTADO]: 'informacion',
  [ESTADOS_EQUIPO.MANTENIMIENTO]: 'advertencia',
  [ESTADOS_EQUIPO.BAJA]: 'peligro',
  // Préstamos
  [ESTADOS_PRESTAMO.PENDIENTE]: 'advertencia',
  [ESTADOS_PRESTAMO.ACTIVO]: 'informacion',
  [ESTADOS_PRESTAMO.DEVUELTO]: 'exito',
  [ESTADOS_PRESTAMO.RECHAZADO]: 'peligro'
};

const ICONO_POR_ESTADO = {
  [ESTADOS_EQUIPO.DISPONIBLE]: 'CheckCircle2',
  [ESTADOS_EQUIPO.PRESTADO]: 'Clock',
  [ESTADOS_EQUIPO.MANTENIMIENTO]: 'Wrench',
  [ESTADOS_EQUIPO.BAJA]: 'Ban',
  [ESTADOS_PRESTAMO.PENDIENTE]: 'Clock',
  [ESTADOS_PRESTAMO.ACTIVO]: 'ArrowLeft',
  [ESTADOS_PRESTAMO.DEVUELTO]: 'CheckCircle2',
  [ESTADOS_PRESTAMO.RECHAZADO]: 'XCircle'
};

export default function Badge({ estado, variante: vProp, icono: iProp, discreto = false, children }) {
  const etiqueta = children || estado || '';
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
