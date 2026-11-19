// Listado de préstamos activos en curso · TechAsset · DCU · Shneiderman · WCAG 2.2 AA
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import { ESTADOS_PRESTAMO } from '../../constants/estados';
import { formatearFecha } from '../../utils/formatearFecha';
import { fechaHoyLima } from '../../utils/fechas';
import Icono from '../ui/Icono';
import Button from '../ui/Button';

// Calcular plazo restante en días según hora de Lima
function calcularPlazoDevolucion(fechaEstimada, hoyStr) {
  if (!fechaEstimada) {
    return {
      texto: 'Sin fecha límite',
      claseBadge: 'bg-superficie-2 text-texto-suave border-borde',
      icono: 'Calendar',
      dias: 999
    };
  }

  const fDev = fechaEstimada.split('T')[0];
  const [y1, m1, d1] = hoyStr.split('-').map(Number);
  const [y2, m2, d2] = fDev.split('-').map(Number);
  const dHoy = new Date(y1, m1 - 1, d1);
  const dDev = new Date(y2, m2 - 1, d2);
  const diffDias = Math.round((dDev.getTime() - dHoy.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDias < 0) {
    const cant = Math.abs(diffDias);
    return {
      texto: cant === 1 ? 'Vencido hace 1 día' : `Vencido hace ${cant} días`,
      claseBadge: 'bg-peligro-fondo text-peligro-texto border-peligro-borde font-bold',
      icono: 'AlertTriangle',
      dias: diffDias
    };
  }

  if (diffDias === 0) {
    return {
      texto: 'Vence hoy',
      claseBadge: 'bg-advertencia-fondo text-advertencia-texto border-advertencia-borde font-bold',
      icono: 'Clock',
      dias: 0
    };
  }

  if (diffDias <= 3) {
    return {
      texto: diffDias === 1 ? 'Vence en 1 día' : `Vence en ${diffDias} días`,
      claseBadge: 'bg-advertencia-fondo/40 text-advertencia-texto border-advertencia-borde font-semibold',
      icono: 'Clock',
      dias: diffDias
    };
  }

  return {
    texto: `En plazo (${diffDias} días)`,
    claseBadge: 'bg-exito-fondo text-exito-texto border-exito-borde font-medium',
    icono: 'CheckCircle2',
    dias: diffDias
  };
}

export default function ProximosPrestamos({
  prestamos = [],
  puedeDevolver = false,
  onRegistrarDevolucion
}) {
  const hoyStr = fechaHoyLima();

  // Filtrar activos y asociar información de plazo calculada
  const prestamosConPlazo = prestamos
    .filter((p) => p.estado === ESTADOS_PRESTAMO.ACTIVO || p.estado === 'Activo' || p.estado === 'Prestado')
    .map((p) => ({
      ...p,
      plazo: calcularPlazoDevolucion(p.fechaDevolucionEstimada || p.fde_Prestamo, hoyStr)
    }))
    // Ordenar: vencidos primero (días negativos), luego hoy (0), luego más próximos
    .sort((a, b) => a.plazo.dias - b.plazo.dias)
    .slice(0, 5);

  return (
    <section aria-labelledby="titulo-proximos-prestamos" className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-borde">
        <div className="flex items-center gap-2">
          <Icono nombre="Clock" className="w-5 h-5 text-primario" />
          <h2 id="titulo-proximos-prestamos" className="text-base sm:text-lg font-bold text-texto m-0">
            Préstamos activos en curso
          </h2>
        </div>
        <Link
          to={`${RUTAS.PRESTAMOS}?estado=Activo`}
          className="text-xs sm:text-sm font-semibold text-primario-enlace hover:underline inline-flex items-center gap-0.5"
        >
          <span>Ver todos</span>
          <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
        </Link>
      </div>

      {prestamosConPlazo.length === 0 ? (
        <div className="py-8 px-4 text-center space-y-2">
          <Icono nombre="PackageCheck" className="w-8 h-8 mx-auto text-texto-suave/60" />
          <p className="text-sm font-semibold text-texto m-0">No hay préstamos activos en este momento.</p>
          <p className="text-xs text-texto-suave m-0">
            Cuando se apruebe una solicitud, los equipos asignados aparecerán listados aquí.
          </p>
          <div className="pt-2">
            <Link
              to={RUTAS.PRESTAMOS}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primario-enlace hover:underline"
            >
              <span>Ir al módulo de Préstamos</span>
              <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-borde">
          {prestamosConPlazo.map((p) => {
            const equipoTexto = p.equipoNombre || p.equipo?.nombre || 'Equipo tecnológico';
            const solicitanteTexto = p.solicitanteNombre || p.solicitante?.nombreCompleto || 'Colaborador';
            const areaTexto = p.solicitanteArea || p.solicitante?.area?.nombre || '';
            const fDevFormatted = p.fechaDevolucionEstimada ? formatearFecha(p.fechaDevolucionEstimada) : '—';

            return (
              <div
                key={p.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-superficie-2/50 px-2 -mx-2 rounded-control transition-colors"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-texto truncate">
                      {equipoTexto}
                    </span>
                    {p.equipoCodigo && (
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded-sm bg-superficie-2 text-texto-suave border border-borde font-semibold">
                        {p.equipoCodigo}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-texto-suave flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span>
                      Asignado a: <strong className="text-texto font-medium">{solicitanteTexto}</strong>
                      {areaTexto ? ` (${areaTexto})` : ''}
                    </span>
                    <span className="text-borde" aria-hidden="true">•</span>
                    <span>
                      Devolución prevista: <strong className="text-texto font-medium">{fDevFormatted}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-auto sm:ml-0">
                  {/* Badge de plazo con ícono + texto */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${p.plazo.claseBadge}`}
                  >
                    <Icono nombre={p.plazo.icono} className="w-3.5 h-3.5 shrink-0" />
                    <span>{p.plazo.texto}</span>
                  </span>

                  {/* Acción rápida de devolución (solo si rol puede devolver) */}
                  {puedeDevolver && (
                    <Button
                      variante="secundario"
                      tamano="sm"
                      alHacerClic={() => onRegistrarDevolucion?.(p)}
                      aria-label={`Registrar devolución del equipo ${equipoTexto}`}
                    >
                      <Icono nombre="RotateCcw" className="w-3.5 h-3.5 mr-1" />
                      <span>Devolver</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

ProximosPrestamos.propTypes = {
  prestamos: PropTypes.arrayOf(PropTypes.object),
  puedeDevolver: PropTypes.bool,
  onRegistrarDevolucion: PropTypes.func
};
