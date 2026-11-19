// Acciones por fila de usuario (editar y activar/desactivar) · ISO 9241-110 · TechAsset
import IconButton from '../ui/IconButton';

export default function AccionesFilaUsuario({
  usuario,
  puedeEditar,
  puedeCambiarEstado,
  esUsuarioActual = false,
  alEditar,
  alCambiarEstado
}) {
  const tienePrestamosActivos = (usuario.prestamosActivos || 0) > 0;
  const noPuedeDesactivar = (esUsuarioActual && usuario.activo) || (usuario.activo && tienePrestamosActivos);

  let motivoBloqueo = '';
  if (esUsuarioActual && usuario.activo) {
    motivoBloqueo = 'No puede desactivar su propia cuenta de administrador';
  } else if (usuario.activo && tienePrestamosActivos) {
    motivoBloqueo = 'El colaborador tiene préstamos activos pendientes de devolución';
  }

  const tooltipEstado = noPuedeDesactivar
    ? motivoBloqueo
    : usuario.activo
      ? 'Desactivar usuario'
      : 'Activar usuario';

  return (
    <div className="inline-flex items-center justify-end gap-1.5">
      {puedeEditar && (
        <IconButton
          variante="editar"
          etiqueta={`Editar usuario ${usuario.nombreCompleto}`}
          tooltip="Editar usuario"
          aria-label={`Editar usuario ${usuario.nombreCompleto}`}
          align="end"
          alHacerClic={() => alEditar?.(usuario)}
        />
      )}

      {puedeCambiarEstado && (
        <span
          className="inline-flex"
          title={noPuedeDesactivar ? tooltipEstado : undefined}
        >
          <IconButton
            variante="cambiar-estado"
            icono="Power"
            etiqueta={tooltipEstado}
            tooltip={tooltipEstado}
            aria-label={tooltipEstado}
            aria-disabled={noPuedeDesactivar ? 'true' : undefined}
            disabled={noPuedeDesactivar}
            deshabilitado={noPuedeDesactivar}
            className={noPuedeDesactivar ? 'disabled:opacity-80' : ''}
            align="end"
            alHacerClic={() => !noPuedeDesactivar && alCambiarEstado?.(usuario)}
          />
        </span>
      )}
    </div>
  );
}
