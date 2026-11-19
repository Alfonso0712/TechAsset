// Modal de detalle completo de préstamo corporativo · TechAsset · WCAG 2.2 AA
import { useState, useEffect } from 'react';
import ModalDialog from '../ui/ModalDialog';
import Badge from '../ui/Badge';
import Icono from '../ui/Icono';
import { formatearFecha } from '../../utils/formatearFecha';
import { obtenerIniciales } from '../../utils/obtenerIniciales';
import { reporteService } from '../../services/reporteService';
import { obtenerEtiquetaTipoMovimiento, ICONOS_CATEGORIA } from '../../constants/etiquetas';
import { TIPOS_MOVIMIENTO } from '../../constants/estados';

function calcularDias(fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin) return null;
  try {
    const [y1, m1, d1] = fechaInicio.split('T')[0].split('-').map(Number);
    const [y2, m2, d2] = fechaFin.split('T')[0].split('-').map(Number);
    if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return null;
    const f1 = new Date(Date.UTC(y1, m1 - 1, d1));
    const f2 = new Date(Date.UTC(y2, m2 - 1, d2));
    const diffDias = Math.round((f2 - f1) / (1000 * 60 * 60 * 24));
    if (isNaN(diffDias) || diffDias < 0) return null;
    const dias = Math.max(1, diffDias);
    return `${dias} ${dias === 1 ? 'día' : 'días'}`;
  } catch {
    return null;
  }
}

function desglosarFechaHora(cadena) {
  if (!cadena) return { fecha: '—', hora: '' };
  try {
    const d = new Date(cadena);
    if (isNaN(d.getTime())) return { fecha: cadena, hora: '' };
    const fecha = d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const hora = d.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { fecha, hora };
  } catch {
    return { fecha: cadena, hora: '' };
  }
}

function obtenerColorPuntoTipoMovimiento(tipo) {
  switch (tipo) {
    case 'Registro':
    case TIPOS_MOVIMIENTO?.REGISTRO:
      return 'bg-exito-borde';
    case 'PrestamoAprobado':
    case 'PrestamoSolicitado':
    case 'PrestamoRechazado':
    case TIPOS_MOVIMIENTO?.PRESTAMO_APROBADO:
    case TIPOS_MOVIMIENTO?.PRESTAMO_SOLICITADO:
    case TIPOS_MOVIMIENTO?.PRESTAMO_RECHAZADO:
      return 'bg-info-borde';
    case 'Devolucion':
    case TIPOS_MOVIMIENTO?.DEVOLUCION:
      return 'bg-advertencia-borde';
    case 'Edicion':
    case TIPOS_MOVIMIENTO?.EDICION:
    case 'CambioEstado':
    case TIPOS_MOVIMIENTO?.CAMBIO_ESTADO:
    default:
      return 'bg-texto-suave/40';
  }
}

function limpiarDetalleTecnico(detalle, codigoEquipo) {
  if (!detalle) return '';
  let texto = detalle;
  if (codigoEquipo) {
    const patron1 = new RegExp(`\\s+del\\s+equipo\\s+${codigoEquipo}`, 'gi');
    texto = texto.replace(patron1, '');
    const patron2 = new RegExp(`\\s+${codigoEquipo}`, 'gi');
    texto = texto.replace(patron2, '');
  }
  texto = texto.replace(/\s+del\s+equipo\s+[A-Z0-9-]+/gi, '');
  texto = texto.replace(/\s+\./g, '.').replace(/\.{2,}/g, '.').trim();
  return texto || detalle;
}

export default function ModalDetallePrestamo({
  abierto = false,
  prestamo = null,
  alCerrar
}) {
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    if (abierto && prestamo) {
      const eqId = prestamo.equipoId || prestamo.equipo?.id;
      if (eqId) {
        reporteService.obtenerMovimientos({ equipoId: eqId, tamanoPagina: 5 }).then((resp) => {
          if (resp.estado === 200 && resp.datos?.items) {
            setMovimientos(resp.datos.items);
          }
        }).catch(() => {});
      }
    }
  }, [abierto, prestamo]);

  if (!prestamo) return null;

  const equipoNombre = prestamo.equipoNombre || prestamo.equipo?.nombre || 'Equipo tecnológico';
  const equipoCodigo = prestamo.equipoCodigo || prestamo.equipo?.codigoPatrimonial || 'S/C';
  const categoria = prestamo.equipoCategoria || prestamo.equipo?.categoria || prestamo.categoria || 'Laptop';
  const nombreIcono = ICONOS_CATEGORIA[categoria] || 'Laptop';

  const solicitanteNombre = prestamo.solicitanteNombre || prestamo.solicitante?.nombreCompleto || 'Colaborador';
  const solicitanteCorreo = prestamo.solicitanteCorreo || prestamo.solicitante?.correo || 'Sin correo';
  const solicitanteArea = prestamo.solicitanteArea || prestamo.solicitante?.areaNombre || prestamo.solicitante?.area?.nombre || 'General';
  const responsableNombre = prestamo.responsableNombre || prestamo.responsable?.nombreCompleto;

  const diasCalculados = calcularDias(prestamo.fechaPrestamo, prestamo.fechaDevolucionEstimada);
  const fechaCreacion = prestamo.createdAt || prestamo.fechaCreacion || prestamo.fechaSolicitud;
  const subtituloTexto = fechaCreacion
    ? `Solicitud registrada el ${formatearFecha(fechaCreacion)}`
    : `Préstamo desde el ${formatearFecha(prestamo.fechaPrestamo)}`;

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Detalle del préstamo"
      subtitulo={subtituloTexto}
      textoSecundario="Cerrar"
      tamano="lg"
      className="!max-h-[85vh] [&>div.overflow-y-auto]:[scrollbar-width:thin] [&>div.overflow-y-auto]:[scrollbar-color:var(--borde)_transparent]"
    >
      <div className="space-y-4" data-prestamo-id={prestamo.id}>
        {/* Bloque del equipo (parte superior del cuerpo) */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-borde/70">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className="w-10 h-10 rounded-lg bg-superficie-2 border border-borde flex items-center justify-center shrink-0 text-texto-suave mt-0.5"
              aria-hidden="true"
            >
              <Icono nombre={nombreIcono} className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base text-texto m-0 break-words" title={equipoNombre}>
                {equipoNombre}
              </h3>
              <p className="text-xs text-texto-suave font-mono mt-0.5 m-0">
                {equipoCodigo}
              </p>
            </div>
          </div>
          <div className="shrink-0 pt-0.5">
            <Badge estado={prestamo.estado} />
          </div>
        </div>

        {/* Datos del préstamo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 py-1">
          {/* Solicitante con avatar circular */}
          <div>
            <span className="block text-xs text-texto-suave font-normal mb-1.5">Solicitante</span>
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-8 h-8 rounded-full bg-primario-suave text-primario dark:text-primario-enlace font-bold text-xs flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                {obtenerIniciales(solicitanteNombre) || 'U'}
              </span>
              <div className="min-w-0 leading-tight">
                <span className="block text-sm font-medium text-texto truncate" title={solicitanteNombre}>
                  {solicitanteNombre}
                </span>
                <span className="block text-xs text-texto-suave truncate mt-0.5" title={solicitanteCorreo}>
                  {solicitanteCorreo}
                </span>
              </div>
            </div>
          </div>

          {/* Área corporativa */}
          <div>
            <span className="block text-xs text-texto-suave font-normal mb-1">Área corporativa</span>
            <span className="block text-sm font-medium text-texto whitespace-nowrap truncate" title={solicitanteArea}>
              {solicitanteArea}
            </span>
          </div>

          {/* Período con días calculados */}
          <div>
            <span className="block text-xs text-texto-suave font-normal mb-1">Período</span>
            <div className="text-sm font-medium text-texto flex flex-wrap items-baseline gap-1.5 cifra-tabular">
              <span className="whitespace-nowrap">
                {formatearFecha(prestamo.fechaPrestamo)} → {formatearFecha(prestamo.fechaDevolucionEstimada)}
              </span>
              {diasCalculados && (
                <span className="text-xs text-texto-suave font-normal whitespace-nowrap">
                  ({diasCalculados})
                </span>
              )}
            </div>
          </div>

          {/* Responsable de entrega */}
          <div>
            <span className="block text-xs text-texto-suave font-normal mb-1">Responsable de entrega</span>
            {responsableNombre && responsableNombre !== '—' && responsableNombre !== '-' ? (
              <span className="block text-sm font-medium text-texto truncate" title={responsableNombre}>
                {responsableNombre}
              </span>
            ) : (
              <span className="block text-sm text-texto-suave/70 italic">
                Sin asignar
              </span>
            )}
          </div>

          {/* Devolución efectiva (si aplica) */}
          {prestamo.fechaDevolucionReal && (
            <div className="sm:col-span-2">
              <span className="block text-xs text-texto-suave font-normal mb-1">Devolución efectiva</span>
              <span className="block text-sm font-medium text-exito-texto cifra-tabular">
                {formatearFecha(prestamo.fechaDevolucionReal)}
              </span>
            </div>
          )}
        </div>

        {/* Motivo de la solicitud (bloque de cita con borde de acento) */}
        <div className="pt-2">
          <span className="block text-xs text-texto-suave font-normal mb-1.5">Motivo de la solicitud</span>
          <blockquote className="border-l-[3px] border-primario pl-3.5 py-1 text-sm text-texto leading-relaxed m-0 font-normal">
            {prestamo.motivo || 'Sin motivo especificado.'}
          </blockquote>
        </div>

        {/* Observación de devolución si existe */}
        {prestamo.observacion && (
          <div className="pt-2">
            <span className="block text-xs text-texto-suave font-normal mb-1.5">
              Observación de devolución / justificación técnica
            </span>
            <blockquote className="border-l-[3px] border-borde pl-3.5 py-1 text-sm text-texto-suave leading-relaxed m-0 font-normal">
              {prestamo.observacion}
            </blockquote>
          </div>
        )}

        {/* Historial del equipo (Línea de tiempo vertical) */}
        {movimientos.length > 0 && (
          <div className="pt-4 border-t border-borde/70">
            <span className="block text-xs font-semibold text-texto mb-3">
              Historial del equipo
            </span>
            <div className="space-y-0">
              {movimientos.map((m, idx) => {
                const { fecha, hora } = desglosarFechaHora(m.fechaHora || m.fechaMovimiento);
                const esUltimo = idx === movimientos.length - 1;
                return (
                  <div key={m.id || idx} className="flex gap-3 text-xs">
                    {/* Columna punto + línea vertical */}
                    <div className="flex flex-col items-center shrink-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ring-2 ring-superficie shrink-0 mt-1 ${obtenerColorPuntoTipoMovimiento(m.tipo)}`}
                        aria-hidden="true"
                      />
                      {!esUltimo && (
                        <span className="w-px flex-1 bg-borde my-0.5 min-h-[1.5rem]" aria-hidden="true" />
                      )}
                    </div>

                    {/* Contenido del evento */}
                    <div className={`flex-1 min-w-0 flex items-start justify-between gap-3 ${!esUltimo ? 'pb-3.5' : 'pb-1'}`}>
                      <div className="min-w-0 pr-2">
                        <span className="block text-xs font-medium text-texto">
                          {obtenerEtiquetaTipoMovimiento(m.tipo)}
                        </span>
                        {m.detalle && (
                          <span className="block text-[11px] text-texto-suave mt-0.5 leading-snug">
                            {limpiarDetalleTecnico(m.detalle, equipoCodigo)}
                          </span>
                        )}
                      </div>
                      <div className="shrink-0 text-right text-xs text-texto-suave font-normal leading-snug">
                        <span className="block">{fecha}</span>
                        {hora && <span className="block text-[11px] text-texto-suave/80 mt-0.5">{hora}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ModalDialog>
  );
}
