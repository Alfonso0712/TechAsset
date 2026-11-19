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
  puedeVerHistorial = true,
  alEditar,
  alCambiarEstado,
  alSolicitar
}) {
  const tienePrestamoActivo = equipo.estado === 'Prestado';

  if (puedeEditar || puedeCambiarEstado || puedeVerHistorial) {
    const tooltipCambiarEstado = tienePrestamoActivo
      ? 'No disponible: el equipo tiene un préstamo activo'
      : 'Cambiar estado';

    return (
      <div className="inline-flex items-center justify-end gap-1.5">
        {puedeEditar && (
          <IconButton
            variante="editar"
            etiqueta="Editar equipo"
            tooltip="Editar equipo"
            aria-label="Editar equipo"
            alHacerClic={() => alEditar?.(equipo)}
          />
        )}

        {puedeCambiarEstado && (
          <span
            className="inline-flex"
            title={tienePrestamoActivo ? tooltipCambiarEstado : undefined}
          >
            <IconButton
              variante="cambiar-estado"
              icono="RefreshCw"
              etiqueta={tooltipCambiarEstado}
              tooltip={tooltipCambiarEstado}
              aria-label={tooltipCambiarEstado}
              aria-disabled={tienePrestamoActivo ? 'true' : undefined}
              disabled={tienePrestamoActivo}
              deshabilitado={tienePrestamoActivo}
              className={tienePrestamoActivo ? 'disabled:opacity-80' : ''}
              alHacerClic={() => !tienePrestamoActivo && alCambiarEstado?.(equipo)}
            />
          </span>
        )}

        {puedeVerHistorial && (
          <Link
            to={`/reportes?equipoId=${equipo.id}`}
            aria-label="Ver historial"
            title="Ver historial"
          >
            <IconButton
              variante="historial"
              icono="History"
              etiqueta="Ver historial"
              tooltip="Ver historial"
              aria-label="Ver historial"
            />
          </Link>
        )}
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
