import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Icono from '../ui/Icono';
import { RUTAS } from '../../constants/rutas';
import { formatearFecha } from '../../utils/formatearFecha';

export default function BandejaSolicitudesPendientes({ solicitudes = [], onAprobar, onRechazar }) {
  if (!solicitudes || solicitudes.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-texto-suave">
        <Icono nombre="CheckCircle2" className="w-8 h-8 text-exito-borde mx-auto mb-2 opacity-80" />
        No hay solicitudes de préstamo pendientes de revisión técnica.
      </div>
    );
  }

  return (
    <div className="divide-y divide-borde">
      {solicitudes.map((s) => (
        <div key={s.id} className="py-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-superficie-2/50 transition-colors">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-primario">{s.equipoCodigo}</span>
              <span className="text-xs font-semibold text-texto">{s.equipoNombre}</span>
            </div>
            <p className="text-xs text-texto-suave">
              Solicitado por <strong className="text-texto">{s.solicitanteNombre}</strong> ({s.solicitanteArea || 'Colaborador'})
            </p>
            <p className="text-[0.6875rem] text-texto-suave/80">
              Período: {formatearFecha(s.fechaPrestamo)} – {formatearFecha(s.fechaDevolucionEstimada)}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onAprobar && (
              <Button
                variante="success"
                tamano="sm"
                icono="Check"
                onClick={() => onAprobar(s)}
              >
                Aprobar
              </Button>
            )}
            {onRechazar && (
              <Button
                variante="danger-outline"
                tamano="sm"
                icono="X"
                onClick={() => onRechazar(s)}
              >
                Rechazar
              </Button>
            )}
          </div>
        </div>
      ))}

      <div className="pt-3 text-center">
        <Link
          to={RUTAS.PRESTAMOS}
          className="text-xs font-semibold text-primario hover:underline inline-flex items-center gap-1"
        >
          <span>Ver todas las solicitudes</span>
          <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
