// ISO 9241-110 · WCAG 2.2 AA · Pestañas de estado con contadores para préstamos · Fidelidad ReservaUPLA
import { ESTADOS_PRESTAMO } from '../../constants/estados';
import PestanasConteo from '../ui/PestanasConteo';

const PESTANAS = [
  { clave: '', etiqueta: 'Todas', propConteo: 'total' },
  { clave: ESTADOS_PRESTAMO.PENDIENTE, etiqueta: 'Pendientes', propConteo: 'pendientes' },
  { clave: ESTADOS_PRESTAMO.ACTIVO, etiqueta: 'Activos', propConteo: 'activos' },
  { clave: ESTADOS_PRESTAMO.DEVUELTO, etiqueta: 'Devueltos', propConteo: 'devueltos' },
  { clave: ESTADOS_PRESTAMO.RECHAZADO, etiqueta: 'Rechazados', propConteo: 'rechazados' }
];

export default function PestanasEstado({ estadoActivo = '', conteos = {}, alSeleccionar }) {
  const opciones = PESTANAS.map((p) => {
    const total = conteos?.[p.propConteo] ?? 0;
    const esPendienteConDatos = p.clave === ESTADOS_PRESTAMO.PENDIENTE && total > 0;

    return {
      valor: p.clave,
      etiqueta: p.etiqueta,
      cantidad: total,
      claseBadge: (activo) =>
        activo
          ? (esPendienteConDatos ? 'bg-advertencia-fondo text-advertencia-texto' : 'bg-white/20 text-sobre-primario')
          : (esPendienteConDatos ? 'bg-advertencia-fondo text-advertencia-texto border border-advertencia-borde' : 'bg-superficie-2 text-texto')
    };
  });

  return (
    <PestanasConteo
      opciones={opciones}
      seleccionado={estadoActivo}
      alCambiar={alSeleccionar}
      ariaLabel="Filtrar préstamos por estado"
      tamano="md"
    />
  );
}
