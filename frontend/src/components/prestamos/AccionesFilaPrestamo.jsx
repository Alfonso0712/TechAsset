// Botones de acciones por fila de préstamo con texto visible y WCAG 2.2 AA · TechAsset (RF-09..RF-12)
import IconButton from '../ui/IconButton';
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
  const esActivo = prestamo?.estado === ESTADOS_PRESTAMO.ACTIVO || prestamo?.estado === 'Activo' || prestamo?.estado === 'Prestado';

  return (
    <div className="inline-flex items-center justify-end gap-1.5 whitespace-nowrap">
      {/* Botón Detalle accesible */}
      <IconButton
        variante="detalle"
        icono="Eye"
        etiqueta="Ver detalle del préstamo"
        tooltip="Ver detalle"
        alHacerClic={() => alVerDetalle?.(prestamo)}
      />

      {/* Acciones de gestión para el Responsable en estado Pendiente */}
      {esPendiente && puedeGestionar && (
        <>
          <Button
            variante="exito"
            tamano="sm"
            deshabilitado={enProceso}
            aria-label="Aprobar solicitud de préstamo"
            alHacerClic={() => alAprobar?.(prestamo)}
          >
            <Icono nombre="CheckCircle2" className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span>Aprobar</span>
          </Button>

          <Button
            variante="peligro"
            tamano="sm"
            deshabilitado={enProceso}
            aria-label="Rechazar solicitud de préstamo"
            alHacerClic={() => alRechazar?.(prestamo)}
          >
            <Icono nombre="XCircle" className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span>Rechazar</span>
          </Button>
        </>
      )}

      {/* Acción de gestión para el Responsable en estado Activo: Registrar Devolución */}
      {esActivo && puedeGestionar && (
        <Button
          variante="exito"
          tamano="sm"
          deshabilitado={enProceso}
          aria-label="Registrar devolución de equipo"
          alHacerClic={() => alDevolver?.(prestamo)}
        >
          <Icono nombre="CheckCircle2" className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span>Registrar devolución</span>
        </Button>
      )}
    </div>
  );
}
