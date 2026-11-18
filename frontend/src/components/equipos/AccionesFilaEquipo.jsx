// Botones con IconButton y accesibilidad WCAG 2.2 AA · TechAsset (RF-05..RF-08)
import { Link } from 'react-router-dom';
import IconButton from '../ui/IconButton';
import Button from '../ui/Button';
import Icono from '../ui/Icono';

export default function AccionesFilaEquipo({
  equipo,
  puedeEditar,
  puedeCambiarEstado,
  puedeSolicitar,
  alEditar,
  alCambiarEstado,
  alSolicitar
}) {
  const tienePrestamoActivo = equipo.estado === 'Prestado';

  if (puedeEditar || puedeCambiarEstado) {
    const tooltipCambiarEstado = tienePrestamoActivo
      ? 'No se puede cambiar el estado: el equipo se encuentra actualmente prestado'
      : 'Cambiar estado del equipo';

    return (
      <div className="inline-flex items-center justify-end gap-1.5">
        {puedeEditar && (
          <IconButton
            variante="editar"
            etiqueta={`Editar ${equipo.nombre}`}
            tooltip="Editar equipo"
            alHacerClic={() => alEditar?.(equipo)}
          />
        )}

        {puedeCambiarEstado && (
          <IconButton
            variante="cambiar-estado"
            icono="RefreshCw"
            etiqueta={tooltipCambiarEstado}
            tooltip={tooltipCambiarEstado}
            disabled={tienePrestamoActivo}
            deshabilitado={tienePrestamoActivo}
            alHacerClic={() => !tienePrestamoActivo && alCambiarEstado?.(equipo)}
          />
        )}

        <Link
          to={`/reportes?equipoId=${equipo.id}`}
          aria-label={`Ver historial de movimientos de ${equipo.nombre}`}
          title="Ver historial de movimientos"
        >
          <IconButton
            variante="historial"
            icono="History"
            etiqueta={`Historial de ${equipo.nombre}`}
            tooltip="Ver historial de movimientos"
          />
        </Link>
      </div>
    );
  }

  if (puedeSolicitar) {
    if (equipo.estado === 'Disponible') {
      return (
        <Button
          variante="primario"
          tamano="sm"
          alHacerClic={() => alSolicitar?.(equipo.id)}
        >
          <Icono nombre="Plus" className="w-3.5 h-3.5 mr-1" />
          <span>Solicitar</span>
        </Button>
      );
    }
    return (
      <span className="text-xs text-texto-suave italic">
        No disponible
      </span>
    );
  }

  return null;
}
