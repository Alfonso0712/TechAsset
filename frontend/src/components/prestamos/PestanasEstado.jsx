// ISO 9241-110 · WCAG 2.2 AA · Pestañas de estado con contadores para préstamos · Fidelidad ReservaUPLA
import { ESTADOS_PRESTAMO } from '../../constants/estados';

const PESTANAS = [
  { clave: '', etiqueta: 'Todas', propConteo: 'total' },
  { clave: ESTADOS_PRESTAMO.PENDIENTE, etiqueta: 'Pendientes', propConteo: 'pendientes' },
  { clave: ESTADOS_PRESTAMO.ACTIVO, etiqueta: 'Activos', propConteo: 'activos' },
  { clave: ESTADOS_PRESTAMO.DEVUELTO, etiqueta: 'Devueltos', propConteo: 'devueltos' },
  { clave: ESTADOS_PRESTAMO.RECHAZADO, etiqueta: 'Rechazados', propConteo: 'rechazados' }
];

export default function PestanasEstado({ estadoActivo = '', conteos = {}, alSeleccionar }) {
  return (
    <div role="tablist" aria-label="Filtrar préstamos por estado" className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {PESTANAS.map((p) => {
        const esActivo = (estadoActivo || '') === p.clave;
        const total = conteos?.[p.propConteo] ?? 0;
        const esPendienteConDatos = p.clave === ESTADOS_PRESTAMO.PENDIENTE && total > 0;
        const claseBadge = esActivo
          ? (esPendienteConDatos ? 'bg-advertencia-fondo text-advertencia-texto' : 'bg-white/20 text-sobre-primario')
          : (esPendienteConDatos ? 'bg-advertencia-fondo text-advertencia-texto border border-advertencia-borde' : 'bg-superficie-2 text-texto');

        return (
          <button
            key={p.etiqueta}
            role="tab"
            type="button"
            aria-selected={esActivo}
            tabIndex={esActivo ? 0 : -1}
            onClick={() => alSeleccionar?.(p.clave)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer border ${
              esActivo
                ? 'bg-primario text-sobre-primario border-primario shadow-sm'
                : 'bg-superficie text-texto hover:bg-superficie-2 border-borde text-texto-suave hover:text-texto'
            }`}
          >
            <span>{p.etiqueta}</span>
            <span className={`px-1.5 py-0.5 rounded-pill text-xs font-bold cifra-tabular ${claseBadge}`}>
              {total}
            </span>
          </button>
        );
      })}
    </div>
  );
}
