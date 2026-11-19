// Zona prioritaria "Requiere tu atención" · TechAsset · DCU · Nielsen 1 · Nielsen 5
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icono from '../ui/Icono';
import Button from '../ui/Button';
import { RUTAS } from '../../constants/rutas';
import { fechaHoyLima, esPrestamoVencido } from '../../utils/fechas';

export default function RequiereAtencion({
  prestamos = [],
  metricas = null,
  puedeAprobar = false,
  esColaborador = false,
  solicitudesPendientes = [],
  alAprobar,
  alRechazar,
  enProceso = false
}) {
  const hoyStr = fechaHoyLima();
  const [y, m, d] = hoyStr.split('-').map(Number);
  const fechaMax = new Date(y, m - 1, d + 3);
  const hoyMas3Str = `${fechaMax.getFullYear()}-${String(fechaMax.getMonth() + 1).padStart(2, '0')}-${String(fechaMax.getDate()).padStart(2, '0')}`;

  // 1. Préstamos vencidos
  const prestamosVencidos = prestamos.filter((p) => esPrestamoVencido(p));
  const cantVencidos = metricas?.prestamosVencidos ?? prestamosVencidos.length;

  // 2. Devoluciones próximas (3 días o menos, activas y no vencidas)
  const devolucionesProximas = prestamos.filter((p) => {
    if (p.estado !== 'Activo' && p.estado !== 'Prestado') return false;
    const fDev = p.fechaDevolucionEstimada || p.fde_Prestamo;
    return Boolean(fDev && fDev >= hoyStr && fDev <= hoyMas3Str);
  });
  const cantDevolucionesProximas = devolucionesProximas.length;

  // 3. Solicitudes pendientes (solo si el rol puede aprobar)
  const listaPendientes = solicitudesPendientes.length > 0
    ? solicitudesPendientes
    : prestamos.filter((p) => p.estado === 'Pendiente');
  const cantPendientes = listaPendientes.length;

  // 4. Equipos en mantenimiento
  const cantMantenimiento = metricas?.equiposMantenimiento ?? 0;

  // Comprobar si hay alguna acción que requiera atención
  const hayAcciones = cantVencidos > 0 ||
    cantDevolucionesProximas > 0 ||
    (puedeAprobar && cantPendientes > 0) ||
    cantMantenimiento > 0;

  return (
    <section aria-labelledby="titulo-requiere-atencion" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icono nombre="AlertCircle" className="w-5 h-5 text-primario" />
          <h2 id="titulo-requiere-atencion" className="text-base sm:text-lg font-bold text-texto m-0">
            Requiere tu atención
          </h2>
        </div>
        {hayAcciones && (
          <span className="text-xs font-semibold text-texto-suave">
            Alertas operativas activas
          </span>
        )}
      </div>

      {!hayAcciones ? (
        <div className="flex items-center gap-3 p-4 rounded-tarjeta bg-superficie border border-exito-borde text-exito-texto shadow-xs">
          <Icono nombre="CheckCircle2" className="w-5 h-5 shrink-0 text-exito-texto" />
          <div className="flex-1 text-xs sm:text-sm">
            <strong className="font-semibold text-texto block">Todo al día. No hay acciones pendientes.</strong>
            <span className="text-texto-suave">
              {esColaborador
                ? 'Tus préstamos se encuentran dentro del cronograma previsto.'
                : 'No se registran préstamos vencidos, devoluciones urgentes ni solicitudes pendientes.'}
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Alerta 1: Vencidos (destacado en peligro) */}
          <div
            className={`p-3.5 rounded-tarjeta border flex flex-col justify-between transition-all ${
              cantVencidos > 0
                ? 'bg-peligro-fondo border-peligro-borde text-peligro-texto shadow-xs'
                : 'bg-superficie border-borde text-texto'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Préstamos vencidos
                </span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  cantVencidos > 0 ? 'bg-peligro-borde text-white' : 'bg-superficie-2 text-texto-suave'
                }`}>
                  <Icono nombre="AlertTriangle" className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-bold cifra-tabular">
                {cantVencidos}
              </div>
              <p className="text-xs leading-relaxed m-0 text-texto-suave">
                {cantVencidos > 0
                  ? `${cantVencidos === 1 ? 'Requiere' : 'Requieren'} regularización inmediata de entrega.`
                  : 'Sin préstamos vencidos en inventario.'}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-borde/50">
              <Link
                to={`${RUTAS.PRESTAMOS}?estado=Vencido`}
                className={`text-xs font-semibold inline-flex items-center gap-1 ${
                  cantVencidos > 0 ? 'text-peligro-texto hover:underline' : 'text-primario-enlace hover:underline'
                }`}
              >
                <span>Revisar vencidos</span>
                <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Alerta 2: Devoluciones próximas (3 días) */}
          <div
            className={`p-3.5 rounded-tarjeta border flex flex-col justify-between transition-all ${
              cantDevolucionesProximas > 0
                ? 'bg-advertencia-fondo/35 border-advertencia-borde text-texto shadow-xs'
                : 'bg-superficie border-borde text-texto'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-advertencia-texto uppercase tracking-wider">
                  Devoluciones próximas
                </span>
                <span className="w-6 h-6 rounded-full bg-advertencia-borde/20 text-advertencia-texto flex items-center justify-center shrink-0">
                  <Icono nombre="Clock" className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-bold text-texto cifra-tabular">
                {cantDevolucionesProximas}
              </div>
              <p className="text-xs leading-relaxed m-0 text-texto-suave">
                {cantDevolucionesProximas > 0
                  ? `Previstas para entrega en 3 días o menos.`
                  : 'No hay devoluciones previstas a corto plazo.'}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-borde/50">
              <Link
                to={`${RUTAS.PRESTAMOS}?estado=Activo`}
                className="text-xs font-semibold text-primario-enlace hover:underline inline-flex items-center gap-1"
              >
                <span>Ver préstamos activos</span>
                <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Alerta 3: Solicitudes pendientes de aprobación */}
          {puedeAprobar ? (
            <div
              className={`p-3.5 rounded-tarjeta border flex flex-col justify-between transition-all ${
                cantPendientes > 0
                  ? 'bg-primario-suave border-primario/40 text-texto shadow-xs'
                  : 'bg-superficie border-borde text-texto'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-primario uppercase tracking-wider">
                    Solicitudes pendientes
                  </span>
                  <span className="w-6 h-6 rounded-full bg-primario/15 text-primario flex items-center justify-center shrink-0">
                    <Icono nombre="ClipboardList" className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-texto cifra-tabular">
                  {cantPendientes}
                </div>
                <p className="text-xs leading-relaxed m-0 text-texto-suave">
                  {cantPendientes > 0
                    ? `Esperan evaluación técnica de aprobación o rechazo.`
                    : 'Bandeja de solicitudes al día.'}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-borde/50">
                <Link
                  to={`${RUTAS.PRESTAMOS}?estado=Pendiente`}
                  className="text-xs font-semibold text-primario-enlace hover:underline inline-flex items-center gap-1"
                >
                  <span>Bandeja de aprobación</span>
                  <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-tarjeta border border-borde bg-superficie text-texto flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-texto-suave uppercase tracking-wider">
                    Equipos disponibles
                  </span>
                  <span className="w-6 h-6 rounded-full bg-exito-fondo text-exito-texto flex items-center justify-center shrink-0">
                    <Icono nombre="CheckCircle2" className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-texto cifra-tabular">
                  {metricas?.equiposDisponibles ?? 0}
                </div>
                <p className="text-xs leading-relaxed m-0 text-texto-suave">
                  Listos para asignación a proyectos o colaboradores.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-borde/50">
                <Link
                  to={`${RUTAS.EQUIPOS}?estado=Disponible`}
                  className="text-xs font-semibold text-primario-enlace hover:underline inline-flex items-center gap-1"
                >
                  <span>Explorar disponibles</span>
                  <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Alerta 4: Equipos en mantenimiento (estilo neutro) */}
          <div className="p-3.5 rounded-tarjeta border border-borde bg-superficie text-texto flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-texto-suave uppercase tracking-wider">
                  En mantenimiento
                </span>
                <span className="w-6 h-6 rounded-full bg-superficie-2 text-texto-suave flex items-center justify-center shrink-0">
                  <Icono nombre="Wrench" className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-bold text-texto cifra-tabular">
                {cantMantenimiento}
              </div>
              <p className="text-xs leading-relaxed m-0 text-texto-suave">
                {cantMantenimiento > 0
                  ? `Equipos en taller técnico para revisión o reparación.`
                  : 'Sin equipos en servicio técnico.'}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-borde/50">
              <Link
                to={`${RUTAS.EQUIPOS}?estado=Mantenimiento`}
                className="text-xs font-semibold text-primario-enlace hover:underline inline-flex items-center gap-1"
              >
                <span>Ver inventario en taller</span>
                <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Si hay solicitudes pendientes y el usuario tiene permisos, mostrar lista de acción rápida */}
      {puedeAprobar && cantPendientes > 0 && (
        <div className="p-4 rounded-tarjeta border border-borde bg-superficie shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-texto m-0">
              Solicitudes inmediatas por resolver ({cantPendientes})
            </h3>
            <Link
              to={`${RUTAS.PRESTAMOS}?estado=Pendiente`}
              className="text-xs font-semibold text-primario-enlace hover:underline inline-flex items-center gap-1"
            >
              <span>Ver todas en Préstamos</span>
              <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-borde">
            {listaPendientes.slice(0, 3).map((sol) => (
              <div key={sol.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-semibold text-sm text-texto block truncate">
                    {sol.equipoNombre || sol.equipo?.nombre || 'Equipo tecnológico'}
                  </span>
                  <span className="text-xs text-texto-suave block">
                    Solicitante: <strong className="text-texto font-medium">{sol.solicitanteNombre || sol.solicitante?.nombreCompleto || 'Colaborador'}</strong> ({sol.solicitanteArea || sol.solicitante?.area?.nombre || 'Área'})
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variante="exito"
                    tamano="sm"
                    deshabilitado={enProceso}
                    alHacerClic={() => alAprobar?.(sol)}
                    aria-label={`Aprobar solicitud de ${sol.solicitanteNombre || 'colaborador'}`}
                  >
                    <Icono nombre="Check" className="w-3.5 h-3.5 mr-1" />
                    <span>Aprobar</span>
                  </Button>
                  <Button
                    variante="peligro"
                    tamano="sm"
                    deshabilitado={enProceso}
                    alHacerClic={() => alRechazar?.(sol)}
                    aria-label={`Rechazar solicitud de ${sol.solicitanteNombre || 'colaborador'}`}
                  >
                    <Icono nombre="X" className="w-3.5 h-3.5 mr-1" />
                    <span>Rechazar</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

RequiereAtencion.propTypes = {
  prestamos: PropTypes.arrayOf(PropTypes.object),
  metricas: PropTypes.object,
  puedeAprobar: PropTypes.bool,
  esColaborador: PropTypes.bool,
  solicitudesPendientes: PropTypes.arrayOf(PropTypes.object),
  alAprobar: PropTypes.func,
  alRechazar: PropTypes.func,
  enProceso: PropTypes.bool
};
