import { describe, it, expect } from 'vitest';
import { canEditEquipo, canChangeEstadoEquipo, canViewHistorialEquipo } from '../utils/permisosEquipo';
import { ROLES } from '../constants/roles';
import { PERMISOS } from '../constants/permisos';

describe('Permisos y Reglas de Negocio en Equipos (TechAsset RBAC)', () => {
  it('Responsable de TI NO puede editar equipos ni cambiar estado, pero SÍ puede ver historial', () => {
    const usuarioResp = { rol: ROLES.RESPONSABLE_TECNOLOGIA };
    const puedeSimulado = () => true; // Simula tener permisos genéricos en JWT

    expect(canEditEquipo(usuarioResp, puedeSimulado)).toBe(false);
    expect(canChangeEstadoEquipo(usuarioResp, puedeSimulado)).toBe(false);
    expect(canViewHistorialEquipo(usuarioResp, puedeSimulado)).toBe(true);
  });

  it('Administrador puede editar, cambiar estado y ver historial', () => {
    const usuarioAdmin = { rol: ROLES.ADMINISTRADOR };
    const puedeSimulado = (p) => [PERMISOS.EQUIPOS_EDITAR, PERMISOS.EQUIPOS_CAMBIAR_ESTADO, PERMISOS.REPORTES_VER].includes(p);

    expect(canEditEquipo(usuarioAdmin, puedeSimulado)).toBe(true);
    expect(canChangeEstadoEquipo(usuarioAdmin, puedeSimulado)).toBe(true);
    expect(canViewHistorialEquipo(usuarioAdmin, puedeSimulado)).toBe(true);
  });

  it('Colaborador no puede editar, cambiar estado ni ver historial de equipos', () => {
    const usuarioColab = { rol: ROLES.COLABORADOR };
    const puedeSimulado = (p) => p === PERMISOS.PRESTAMOS_SOLICITAR;

    expect(canEditEquipo(usuarioColab, puedeSimulado)).toBe(false);
    expect(canChangeEstadoEquipo(usuarioColab, puedeSimulado)).toBe(false);
    expect(canViewHistorialEquipo(usuarioColab, puedeSimulado)).toBe(false);
  });
});
