// Acciones por fila de usuario (editar y activar/desactivar) · ISO 9241-110 · TechAsset
import Button from '../ui/Button';
import Icono from '../ui/Icono';

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
        <Button
          variante="ghost"
          tamano="sm"
          aria-label={`Editar usuario ${usuario.nombreCompleto}`}
          title="Editar usuario"
          alHacerClic={() => alEditar?.(usuario)}
        >
          <Icono nombre="Pencil" className="w-4 h-4 text-texto-suave hover:text-texto" />
        </Button>
      )}

      {puedeCambiarEstado && (
        <Button
          variante="ghost"
          tamano="sm"
          deshabilitado={noPuedeDesactivar}
          aria-label={tooltipEstado}
          title={tooltipEstado}
          alHacerClic={() => !noPuedeDesactivar && alCambiarEstado?.(usuario)}
        >
          <Icono
            nombre="Power"
            className={`w-4 h-4 ${
              noPuedeDesactivar
                ? 'text-texto-suave/40 cursor-not-allowed'
                : usuario.activo
                  ? 'text-peligro-texto hover:text-peligro-texto/80'
                  : 'text-exito-texto hover:text-exito-texto/80'
            }`}
          />
        </Button>
      )}
    </div>
  );
}
