// Botones icon-only con tooltip dinámico y prevención de estados inválidos · ISO 9241-110 · TechAsset
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
          <Button
            variante="ghost"
            tamano="sm"
            aria-label={`Editar ${equipo.nombre}`}
            title="Editar equipo"
            alHacerClic={() => alEditar?.(equipo)}
          >
            <Icono nombre="Pencil" className="w-4 h-4 text-texto-suave hover:text-texto" />
          </Button>
        )}

        {puedeCambiarEstado && (
          <div className="relative group inline-block">
            <Button
              variante="ghost"
              tamano="sm"
              deshabilitado={tienePrestamoActivo}
              aria-label={tooltipCambiarEstado}
              title={tooltipCambiarEstado}
              alHacerClic={() => !tienePrestamoActivo && alCambiarEstado?.(equipo)}
            >
              <Icono
                nombre="RefreshCw"
                className={`w-4 h-4 ${
                  tienePrestamoActivo
                    ? 'text-texto-suave/40 cursor-not-allowed'
                    : 'text-advertencia-texto hover:text-texto'
                }`}
              />
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (puedeSolicitar) {
    if (equipo.estado === 'Disponible') {
      return (
        <Button
          variante="primary"
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
