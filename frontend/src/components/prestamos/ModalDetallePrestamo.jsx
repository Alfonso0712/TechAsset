// Modal de detalle completo de préstamo corporativo · TechAsset · WCAG 2.2 AA
import ModalDialog from '../ui/ModalDialog';
import Badge from '../ui/Badge';
import { formatearFecha, formatearFechaHora } from '../../utils/formatearFecha';

export default function ModalDetallePrestamo({
  abierto = false,
  prestamo = null,
  alCerrar
}) {
  if (!prestamo) return null;

  const equipoNombre = prestamo.equipoNombre || prestamo.equipo?.nombre || 'Equipo tecnológico';
  const equipoCodigo = prestamo.equipoCodigo || prestamo.equipo?.codigoPatrimonial || 'S/C';
  const solicitanteNombre = prestamo.solicitanteNombre || prestamo.solicitante?.nombreCompleto || 'Colaborador';
  const solicitanteCorreo = prestamo.solicitanteCorreo || prestamo.solicitante?.correo || 'Sin correo';
  const solicitanteArea = prestamo.solicitanteArea || prestamo.solicitante?.areaNombre || prestamo.solicitante?.area?.nombre || 'General';
  const responsableNombre = prestamo.responsableNombre || prestamo.responsable?.nombreCompleto || 'Pendiente de asignación';

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Detalle del préstamo"
      subtitulo={`Registro de trazabilidad #${prestamo.id?.slice(0, 8)}`}
      textoSecundario="Cerrar"
      tamano="md"
    >
      <div className="space-y-4 text-xs sm:text-sm">
        <div className="flex items-center justify-between pb-3 border-b border-borde">
          <div>
            <h3 className="font-bold text-base text-texto m-0">{equipoNombre}</h3>
            <p className="text-xs text-texto-suave font-mono mt-0.5 m-0">Código: {equipoCodigo}</p>
          </div>
          <Badge estado={prestamo.estado} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-control bg-superficie-2 border border-borde">
          <div>
            <span className="text-xs font-semibold text-texto-suave block">Solicitante:</span>
            <span className="font-semibold text-texto block">{solicitanteNombre}</span>
            <span className="text-xs text-texto-suave block">{solicitanteCorreo}</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-texto-suave block">Área corporativa:</span>
            <span className="font-semibold text-texto block">{solicitanteArea}</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-texto-suave block">Fecha de préstamo:</span>
            <span className="font-semibold text-texto block cifra-tabular">
              {formatearFecha(prestamo.fechaPrestamo)}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-texto-suave block">Devolución estimada:</span>
            <span className="font-semibold text-texto block cifra-tabular">
              {formatearFecha(prestamo.fechaDevolucionEstimada)}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-texto-suave block">Responsable de entrega:</span>
            <span className="font-semibold text-texto block">{responsableNombre}</span>
          </div>

          {prestamo.fechaDevolucionReal && (
            <div>
              <span className="text-xs font-semibold text-texto-suave block">Devolución efectiva:</span>
              <span className="font-semibold text-exito-texto block cifra-tabular">
                {formatearFecha(prestamo.fechaDevolucionReal)}
              </span>
            </div>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold text-texto-suave block mb-1">Motivo de la solicitud:</span>
          <p className="p-3 rounded-control bg-superficie border border-borde text-texto text-xs leading-relaxed m-0">
            {prestamo.motivo || 'Sin motivo especificado.'}
          </p>
        </div>

        {prestamo.observacion && (
          <div>
            <span className="text-xs font-semibold text-texto-suave block mb-1">Observaciones técnicas / rechazo:</span>
            <p className="p-3 rounded-control bg-superficie border border-borde text-texto text-xs leading-relaxed m-0">
              {prestamo.observacion}
            </p>
          </div>
        )}
      </div>
    </ModalDialog>
  );
}
