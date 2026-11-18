// Ranking de áreas con mayor demanda de préstamos con barras de proporción · Fidelidad ReservaUPLA
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';

export default function RankingAreas({ areas = [], prestamos = [] }) {
  // Acepta lista directa de áreas o calcula desde préstamos
  let ranking = [];
  if (areas && areas.length > 0) {
    ranking = areas.map((a) => ({
      nombre: a.areaNombre || a.area || a.nombre,
      cantidad: a.totalPrestamos ?? a.cantidad ?? 0,
    })).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);
  } else if (prestamos && prestamos.length > 0) {
    const conteos = {};
    prestamos.forEach((p) => {
      const area = p.solicitante?.areaNombre || p.solicitante?.area?.nombre || p.solicitanteArea;
      if (area) conteos[area] = (conteos[area] || 0) + 1;
    });
    ranking = Object.entries(conteos)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  }

  const maxCant = ranking[0]?.cantidad || 1;

  return (
    <div className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-sm space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-bold text-texto">Demanda por áreas</h2>
        {ranking.length > 0 && <span className="text-xs font-semibold text-texto-suave">Top 5</span>}
      </div>
      {ranking.length === 0 ? (
        <div className="my-auto py-8 text-center text-sm text-texto-suave">
          Aún no hay préstamos registrados
        </div>
      ) : (
        <div className="space-y-3 my-auto">
          {ranking.map((item, index) => {
            const esPrimero = index === 0;
            const pct = Math.round((item.cantidad / maxCant) * 100);
            const ruta = `${RUTAS.PRESTAMOS}?area=${encodeURIComponent(item.nombre)}`;
            return (
              <div key={item.nombre} className="space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${esPrimero ? 'bg-primario text-sobre-primario' : 'bg-superficie-2 text-texto-suave'}`}>
                      {index + 1}
                    </span>
                    <Link to={ruta} className="font-semibold text-texto hover:text-primario-enlace hover:underline truncate">
                      {item.nombre}
                    </Link>
                    {esPrimero && (
                      <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-pill text-[10px] font-bold bg-primario/10 text-primario">
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
                    className={`h-full rounded-pill transition-all duration-300 ${esPrimero ? 'bg-primario' : 'bg-primario/60'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
