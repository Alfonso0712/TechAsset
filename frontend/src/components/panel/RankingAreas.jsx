// Ranking de áreas con mayor demanda de préstamos con barras de proporción (RF-13)
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';

const AREAS_BASE = [
  'Desarrollo de Software',
  'Aseguramiento de Calidad (QA)',
  'Diseño y Experiencia (UX/UI)',
  'Gestión de Proyectos y Operaciones',
  'Soporte Técnico de TI',
  'Data Center & Infraestructura'
];

export default function RankingAreas({ areas = [], prestamos = [] }) {
  // Mapa de conteos partiendo de las 6 áreas corporativas
  const mapaConteos = {};
  AREAS_BASE.forEach((a) => {
    mapaConteos[a] = 0;
  });

  if (Array.isArray(areas) && areas.length > 0) {
    areas.forEach((a) => {
      const nombre = a.areaNombre || a.area || a.nombre;
      if (nombre) {
        mapaConteos[nombre] = (a.totalPrestamos ?? a.cantidad ?? 0);
      }
    });
  } else if (Array.isArray(prestamos) && prestamos.length > 0) {
    prestamos.forEach((p) => {
      const nombre = p.solicitante?.areaNombre || p.solicitante?.area?.nombre || p.solicitanteArea;
      if (nombre && mapaConteos[nombre] !== undefined) {
        mapaConteos[nombre] += 1;
      }
    });
  }

  const ranking = Object.entries(mapaConteos)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  const maxCant = Math.max(1, ranking[0]?.cantidad || 0);

  return (
    <div className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-xs space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-bold text-texto m-0">Demanda por áreas</h2>
        <span className="text-xs font-semibold text-texto-suave">6 áreas corporativas</span>
      </div>

      <div className="space-y-3 my-auto">
        {ranking.map((item, index) => {
          const esPrimero = index === 0 && item.cantidad > 0;
          const pct = maxCant > 0 && item.cantidad > 0
            ? Math.max(4, Math.round((item.cantidad / maxCant) * 100))
            : 0;
          const ruta = `${RUTAS.PRESTAMOS}?area=${encodeURIComponent(item.nombre)}`;

          return (
            <div key={item.nombre} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      esPrimero
                        ? 'bg-acento text-white'
                        : 'bg-superficie-2 text-texto-suave'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <Link
                    to={ruta}
                    className="font-semibold text-texto hover:text-primario-enlace hover:underline truncate"
                  >
                    {item.nombre}
                  </Link>
                  {esPrimero && (
                    <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-pill text-[10px] font-bold bg-acento/15 text-primario">
                      Mayor demanda
                    </span>
                  )}
                </div>
                <span className="font-semibold text-texto cifra-tabular shrink-0">
                  {item.cantidad} {item.cantidad === 1 ? 'préstamo' : 'préstamos'}
                </span>
              </div>
              <div className="h-2 w-full rounded-pill bg-superficie-2 overflow-hidden">
                <div
                  className={`h-full rounded-pill transition-all duration-300 ${
                    esPrimero ? 'bg-acento' : 'bg-grafico-marca'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
