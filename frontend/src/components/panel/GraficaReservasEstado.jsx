// Gráfica de dona accesible SVG de distribución de equipos por estado · TechAsset · WCAG 2.2 AA
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import Icono from '../ui/Icono';

const CONFIG_ESTADOS = [
  { clave: 'Disponible', label: 'Disponible', varColor: 'var(--grafico-disponible)', icono: 'CheckCircle2' },
  { clave: 'Prestado', label: 'Prestado', varColor: 'var(--grafico-prestado)', icono: 'UserCheck' },
  { clave: 'Mantenimiento', label: 'En mantenimiento', varColor: 'var(--grafico-mantenimiento)', icono: 'Wrench' },
  { clave: 'Baja', label: 'Baja técnica', varColor: 'var(--grafico-baja)', icono: 'Ban' }
];

export default function GraficaReservasEstado({ dashboard }) {
  const total = dashboard?.totalEquipos || 0;
  const mapaCantidades = {
    Disponible: dashboard?.equiposDisponibles ?? 0,
    Prestado: dashboard?.equiposPrestados ?? 0,
    Mantenimiento: dashboard?.equiposMantenimiento ?? 0,
    Baja: dashboard?.equiposBaja ?? 0
  };

  const items = CONFIG_ESTADOS.map((cfg) => {
    const cant = mapaCantidades[cfg.clave] ?? 0;
    const pct = total > 0 ? Math.round((cant / total) * 100) : 0;
    return { ...cfg, cantidad: cant, porcentaje: pct };
  });

  const resumenAria = `Distribución de equipos: Total ${total} equipos. ${items.map((i) => `${i.label} ${i.cantidad} (${i.porcentaje}%)`).join(', ')}`;
  const circ = 251.327; // 2 * PI * 40
  let acumulado = 0;

  return (
    <div className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-borde">
        <h2 className="text-base sm:text-lg font-bold text-texto m-0">
          Distribución de equipos
        </h2>
        <Link
          to={RUTAS.EQUIPOS}
          className="text-xs font-semibold text-primario-enlace hover:underline inline-flex items-center gap-0.5"
        >
          <span>Ver catálogo</span>
          <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Contenido centrado verticalmente */}
      <div className="my-auto py-4 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
        {/* Dona SVG accesible */}
        <div className="relative w-40 h-40 shrink-0" role="img" aria-label={resumenAria}>
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="12"
              className="text-borde/40"
            />
            {total > 0 &&
              items.map((item) => {
                const len = (item.cantidad / total) * circ;
                const offset = acumulado;
                acumulado += len;
                return item.cantidad > 0 ? (
                  <circle
                    key={item.clave}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={item.varColor}
                    strokeWidth="12"
                    strokeDasharray={`${len} ${circ}`}
                    strokeDashoffset={-offset}
                    className="transition-all duration-500"
                  />
                ) : null;
              })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-texto cifra-tabular leading-none">
              {total}
            </span>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-texto-suave mt-1">
              Equipos
            </span>
          </div>
        </div>

        {/* Leyenda interactiva clicable */}
        <div className="space-y-2.5 w-full max-w-[220px]">
          {items.map((item) => {
            const ruta = `${RUTAS.EQUIPOS}?estado=${encodeURIComponent(item.clave)}`;
            return (
              <Link
                key={item.clave}
                to={ruta}
                aria-label={`Filtrar inventario por estado ${item.label}: ${item.cantidad} equipos, ${item.porcentaje} por ciento`}
                className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-control text-xs hover:bg-superficie-2 transition-colors no-underline outline-none focus-visible:ring-2 focus-visible:ring-anillo-foco"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.varColor }}
                  />
                  <span className="text-texto-suave group-hover:text-primario-enlace font-medium truncate">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className="font-bold text-texto cifra-tabular">
                    {item.cantidad}
                  </span>
                  <span className="text-texto-suave font-normal cifra-tabular text-[11px]">
                    ({item.porcentaje}%)
                  </span>
                  <Icono nombre="ChevronRight" className="w-3 h-3 text-texto-suave/40 group-hover:text-primario transition-colors shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="sr-only">
        {resumenAria}
      </div>
    </div>
  );
}

GraficaReservasEstado.propTypes = {
  dashboard: PropTypes.shape({
    totalEquipos: PropTypes.number,
    equiposDisponibles: PropTypes.number,
    equiposPrestados: PropTypes.number,
    equiposMantenimiento: PropTypes.number,
    equiposBaja: PropTypes.number
  })
};
