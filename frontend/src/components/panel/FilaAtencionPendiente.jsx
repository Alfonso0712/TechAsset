// Fila individual de solicitud de préstamo pendiente · TechAsset
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Icono from '../ui/Icono';
import { RUTAS } from '../../constants/rutas';
import { obtenerIniciales } from '../../utils/obtenerIniciales';

export default function FilaAtencionPendiente({
  p,
  puedeGestionar,
  enProceso,
  alAprobar,
  alRechazar
}) {
  const rutaDetalle = `${RUTAS.PRESTAMOS}?id=${p.id}`;
  const nombreSolicitante = p.solicitante?.nombreCompleto || p.nombreSolicitante || 'Colaborador';
  const nombreEquipo = p.equipo?.nombre || p.nombreEquipo || 'Equipo';
  const codigoPatrimonial = p.equipo?.codigoPatrimonial || p.codigoPatrimonial || '';
  const fechaHorario = `${p.fechaPrestamo} hasta ${p.fechaDevolucionEstimada}`;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 rounded-control border border-borde bg-superficie hover:bg-superficie-2 transition-colors">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-full bg-primario-suave text-primario dark:text-primario-enlace font-bold text-xs flex items-center justify-center shrink-0">
          {obtenerIniciales(nombreSolicitante) || 'U'}
        </span>
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm text-texto truncate">
              {nombreSolicitante}
            </span>
            <span className="text-xs text-texto-suave">
              • {nombreEquipo} {codigoPatrimonial && `(${codigoPatrimonial})`}
            </span>
          </div>
          <p className="text-xs text-texto-suave cifra-tabular m-0">
            Período: {fechaHorario}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-borde">
        <Link
          to={rutaDetalle}
          className="min-h-control px-2.5 py-1 inline-flex items-center gap-1 rounded-control text-xs font-semibold text-texto-suave hover:text-texto hover:bg-superficie-2 transition-colors"
        >
          <Icono nombre="Eye" className="w-3.5 h-3.5 shrink-0" />
          <span>Detalle</span>
        </Link>
        {puedeGestionar && (
          <>
            <Button
              variante="success"
              tamano="sm"
              deshabilitado={enProceso}
              alHacerClic={() => alAprobar?.(p)}
            >
              <Icono nombre="CheckCircle2" className="w-3.5 h-3.5 mr-1" />
              <span>Aprobar</span>
            </Button>
            <Button
              variante="danger-outline"
              tamano="sm"
              deshabilitado={enProceso}
              alHacerClic={() => alRechazar?.(p)}
            >
              <Icono nombre="XCircle" className="w-3.5 h-3.5 mr-1" />
              <span>Rechazar</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
