// Tarjeta con solicitudes de préstamo pendientes de revisión técnica · TechAsset
import { Link } from 'react-router-dom';
import Icono from '../ui/Icono';
import FilaAtencionPendiente from './FilaAtencionPendiente';
import { RUTAS } from '../../constants/rutas';

export default function RequiereAtencion({
  solicitudes = [],
  puedeGestionar = false,
  enProceso = false,
  alAprobar,
  alRechazar
}) {
  const pendientes = solicitudes.filter((p) => p.estado === 'Pendiente');
  const visibles = pendientes.slice(0, 5);
  const totalPendientes = pendientes.length;

  return (
    <section aria-labelledby="titulo-requiere-atencion" className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-borde">
        <div className="flex items-center gap-2.5">
          <h2 id="titulo-requiere-atencion" className="text-base sm:text-lg font-bold text-texto m-0">
            Requiere tu atención
          </h2>
          {totalPendientes > 0 && (
            <span className="px-2 py-0.5 rounded-pill text-xs font-bold bg-advertencia-fondo text-advertencia-texto border border-advertencia-borde cifra-tabular">
              {totalPendientes}
            </span>
          )}
        </div>
        {totalPendientes > 5 && (
          <Link to={`${RUTAS.PRESTAMOS}?estado=Pendiente`} className="text-xs sm:text-sm font-semibold text-primario-enlace hover:underline">
            {`Ver todas (${totalPendientes}) →`}
          </Link>
        )}
      </div>

      {totalPendientes === 0 ? (
        <div className="flex items-center gap-3 p-4 rounded-control bg-exito-fondo text-exito-texto border border-exito-borde">
          <Icono nombre="CheckCircle2" className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold m-0">No hay solicitudes pendientes de revisión técnica. Todo al día.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {visibles.map((p) => (
            <FilaAtencionPendiente
              key={p.id}
              p={p}
              puedeGestionar={puedeGestionar}
              enProceso={enProceso}
              alAprobar={alAprobar}
              alRechazar={alRechazar}
            />
          ))}
        </div>
      )}
    </section>
  );
}
