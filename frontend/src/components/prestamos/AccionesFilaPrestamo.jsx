// Botones de acciones agrupados por fila de préstamo · ISO 9241-110 · TechAsset
import Button from '../ui/Button';
import Icono from '../ui/Icono';
import { ESTADOS_PRESTAMO } from '../../constants/estados';

export default function AccionesFilaPrestamo({
  prestamo,
  puedeGestionar = false,
  enProceso = false,
  alVerDetalle,
  alAprobar,
  alRechazar,
  alDevolver
}) {
  const esPendiente = prestamo?.estado === ESTADOS_PRESTAMO.PENDIENTE || prestamo?.estado === 'Pendiente';
  const esActivo = prestamo?.estado === ESTADOS_PRESTAMO.ACTIVO || prestamo?.estado === 'Activo';

  return (
    <div className="inline-flex items-center justify-end gap-1.5 whitespace-nowrap">
      {/* Detalle en cada fila */}
      <Button
        variante="ghost"
        tamano="sm"
        aria-label="Ver detalle del préstamo"
        title="Ver detalle del préstamo"
        alHacerClic={() => alVerDetalle?.(prestamo)}
      >
        <Icono nombre="Eye" className="w-4 h-4 text-texto-suave hover:text-texto" />
      </Button>

      {/* Acciones para estado Pendiente */}
      {esPendiente && puedeGestionar && (
        <>
          <Button
            variante="success"
            tamano="sm"
            deshabilitado={enProceso}
            aria-label="Aprobar solicitud de préstamo"
            title="Aprobar préstamo"
            alHacerClic={() => alAprobar?.(prestamo)}
          >
            <Icono nombre="Check" className="w-3.5 h-3.5 2xl:mr-1 shrink-0" />
            <span className="hidden 2xl:inline">Aprobar</span>
          </Button>
          <Button
            variante="danger"
            tamano="sm"
            deshabilitado={enProceso}
            aria-label="Rechazar solicitud de préstamo"
            title="Rechazar solicitud"
            alHacerClic={() => alRechazar?.(prestamo)}
          >
            <Icono nombre="X" className="w-3.5 h-3.5 2xl:mr-1 shrink-0" />
            <span className="hidden 2xl:inline">Rechazar</span>
          </Button>
        </>
      )}

      {/* Acción para estado Activo: Registrar Devolución */}
      {esActivo && puedeGestionar && (
        <Button
          variante="primary"
          tamano="sm"
          deshabilitado={enProceso}
          aria-label="Registrar devolución de equipo"
          title="Registrar devolución"
          alHacerClic={() => alDevolver?.(prestamo)}
        >
          <Icono nombre="PackageCheck" className="w-3.5 h-3.5 2xl:mr-1 shrink-0" />
          <span className="hidden 2xl:inline">Devolver</span>
        </Button>
      )}
    </div>
  );
}
