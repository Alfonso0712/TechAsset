// Reglas de negocio y permisos sobre activos tecnológicos · TechAsset RBAC
import { PERMISOS } from '../constants/permisos';
import { ROLES } from '../constants/roles';

/**
 * Determina si el usuario puede editar equipos.
 * Regla: Administrador puede editar. Responsable de TI NO puede editar.
 */
export function canEditEquipo(usuario, puede) {
  if (!usuario) return false;
  if (usuario.rol === ROLES.RESPONSABLE_TECNOLOGIA) return false;
  return Boolean(usuario.rol === ROLES.ADMINISTRADOR || puede?.(PERMISOS.EQUIPOS_EDITAR));
}

/**
 * Determina si el usuario puede cambiar el estado de un equipo.
 * Regla: Administrador puede cambiar estado. Responsable de TI NO puede cambiar estado.
 */
export function canChangeEstadoEquipo(usuario, puede) {
  if (!usuario) return false;
  if (usuario.rol === ROLES.RESPONSABLE_TECNOLOGIA) return false;
  return Boolean(usuario.rol === ROLES.ADMINISTRADOR || puede?.(PERMISOS.EQUIPOS_CAMBIAR_ESTADO));
}

/**
 * Determina si el usuario puede consultar el historial de equipos.
 * Regla: Administrador y Responsable de TI pueden ver historial de auditoría.
 */
export function canViewHistorialEquipo(usuario, puede) {
  if (!usuario) return false;
  if (usuario.rol === ROLES.COLABORADOR) return false;
  return Boolean(
    usuario.rol === ROLES.ADMINISTRADOR ||
    usuario.rol === ROLES.RESPONSABLE_TECNOLOGIA ||
    puede?.(PERMISOS.REPORTES_VER) ||
    puede?.(PERMISOS.EQUIPOS_VER)
  );
}
