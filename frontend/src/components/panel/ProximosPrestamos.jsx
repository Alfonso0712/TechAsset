// Próximos préstamos activos o por devolver · Fidelidad ReservaUPLA
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import { ESTADOS_PRESTAMO } from '../../constants/estados';
import { formatearFecha } from '../../utils/formatearFecha';

export default function ProximosPrestamos({ prestamos = [] }) {
  // Préstamos en estado Activo ordenados por fecha de devolución estimada próxima
  const activos = prestamos
    .filter((p) => p.estado === ESTADOS_PRESTAMO.ACTIVO || p.estado === 'Activo')
    .sort((a, b) => (a.fechaDevolucionEstimada || '').localeCompare(b.fechaDevolucionEstimada || ''))
    .slice(0, 5);

  return (
    <section aria-labelledby="titulo-proximos-prestamos" className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-borde">
        <h2 id="titulo-proximos-prestamos" className="text-base sm:text-lg font-bold text-texto">
          Préstamos activos en curso
        </h2>
        <Link to={`${RUTAS.PRESTAMOS}?estado=Activo`} className="text-xs sm:text-sm font-semibold text-primario-enlace hover:underline">
          Ver todos →
        </Link>
      </div>

      {activos.length === 0 ? (
        <p className="py-4 text-center text-sm text-texto-suave">No hay préstamos activos en este momento</p>
      ) : (
        <div className="divide-y divide-borde/60">
          {activos.map((p) => {
            const fechaDev = p.fechaDevolucionEstimada ? `Devolución: ${formatearFecha(p.fechaDevolucionEstimada)}` : 'Sin fecha';
            const equipoTexto = p.equipoNombre || p.equipo?.nombre || p.equipoCodigo || 'Equipo';
            const solicitanteTexto = p.solicitanteNombre || p.solicitante?.nombreCompleto || 'Colaborador';
            return (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5 hover:bg-superficie-2 px-2 -mx-2 rounded-md transition-colors group"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-texto group-hover:text-primario-enlace transition-colors truncate">
                    {equipoTexto}
                    {p.equipoCodigo && (
                      <span className="ml-2 font-mono text-xs text-texto-suave">
                        [{p.equipoCodigo}]
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-texto-suave truncate">
                    {solicitanteTexto} {p.solicitanteArea ? `· ${p.solicitanteArea}` : ''}
                  </p>
                </div>
                <span className="text-xs font-medium text-texto-suave cifra-tabular shrink-0">
                  {fechaDev}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
