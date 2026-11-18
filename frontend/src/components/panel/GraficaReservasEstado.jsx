// Gráfica de dona accesible SVG de distribución de equipos por estado · TechAsset
import Icono from '../ui/Icono';

const CONFIG_ESTADOS = [
  { clave: 'Disponible', label: 'Disponible', varColor: 'var(--exito-texto)', icono: 'CheckCircle2' },
  { clave: 'Prestado', label: 'Prestado', varColor: 'var(--info-texto)', icono: 'PackageCheck' },
  { clave: 'Mantenimiento', label: 'En mantenimiento', varColor: 'var(--advertencia-texto)', icono: 'AlertTriangle' },
  { clave: 'Baja', label: 'Baja técnica', varColor: 'var(--peligro-texto)', icono: 'XCircle' }
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

  const resumenAria = `Distribución de equipos: Total ${total}. ${items.map((i) => `${i.label} ${i.cantidad} (${i.porcentaje}%)`).join(', ')}`;
  const circ = 251.327; // 2 * PI * 40
  let acumulado = 0;

  return (
    <div className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-xs space-y-4 h-full flex flex-col">
      <h2 className="text-base sm:text-lg font-bold text-texto m-0">Distribución de equipos</h2>
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-auto">
        <div className="relative w-36 h-36 shrink-0" role="img" aria-label={resumenAria}>
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
            <span className="text-2xl font-black text-texto cifra-tabular leading-none">
              {total}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-texto-suave mt-0.5">
              Equipos
            </span>
          </div>
        </div>

        <div className="space-y-2 w-full max-w-[200px]">
          {items.map((item) => (
            <div key={item.clave} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.varColor }}
                />
                <span className="text-texto-suave truncate">{item.label}</span>
              </div>
              <span className="font-bold text-texto cifra-tabular shrink-0">
                {item.cantidad} <span className="text-texto-suave font-normal">({item.porcentaje}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
