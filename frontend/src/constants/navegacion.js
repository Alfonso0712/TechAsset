import { RUTAS } from './rutas';
import { PERMISOS } from './permisos';

export const ELEMENTOS_NAVEGACION = Object.freeze([
  {
    id: 'panel',
    titulo: 'Inicio',
    etiqueta: 'Inicio',
    ruta: RUTAS.PANEL,
    icono: 'LayoutDashboard',
    permiso: PERMISOS.DASHBOARD_VER
  },
  {
    id: 'equipos',
    titulo: 'Equipos',
    etiqueta: 'Equipos',
    ruta: RUTAS.EQUIPOS,
    icono: 'Laptop',
    permiso: PERMISOS.EQUIPOS_VER
  },
  {
    id: 'prestamos',
    titulo: 'Préstamos',
    etiqueta: 'Préstamos',
    ruta: RUTAS.PRESTAMOS,
    icono: 'ClipboardList',
    permiso: PERMISOS.PRESTAMOS_VER
  },
  {
    id: 'usuarios',
    titulo: 'Usuarios',
    etiqueta: 'Usuarios',
    ruta: RUTAS.USUARIOS,
    icono: 'Users',
    permiso: PERMISOS.USUARIOS_LISTAR
  },
  {
    id: 'reportes',
    titulo: 'Reportes',
    etiqueta: 'Reportes',
    ruta: RUTAS.REPORTES,
    icono: 'BarChart3',
    permiso: PERMISOS.REPORTES_VER
  }
]);

export function obtenerItemsNavegacion(usuario, puede) {
  const esColaborador = usuario?.rol === 'Colaborador';
  return ELEMENTOS_NAVEGACION.filter(item => {
    if (typeof puede === 'function' && !puede(item.permiso)) return false;
    return true;
  }).map(item => {
    if (item.id === 'prestamos' && esColaborador) {
      return { ...item, etiqueta: 'Mis préstamos', titulo: 'Mis préstamos' };
    }
    return item;
  });
}
