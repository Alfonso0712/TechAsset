import { RUTAS } from './rutas';
import { PERMISOS } from './permisos';

export const ELEMENTOS_NAVEGACION = Object.freeze([
  {
    titulo: 'Dashboard',
    ruta: RUTAS.PANEL,
    icono: 'LayoutDashboard',
    permiso: PERMISOS.DASHBOARD_VER
  },
  {
    titulo: 'Equipos',
    ruta: RUTAS.EQUIPOS,
    icono: 'Laptop',
    permiso: PERMISOS.EQUIPOS_VER
  },
  {
    titulo: 'Préstamos',
    ruta: RUTAS.PRESTAMOS,
    icono: 'ClipboardList',
    permiso: PERMISOS.PRESTAMOS_VER
  },
  {
    titulo: 'Usuarios',
    ruta: RUTAS.USUARIOS,
    icono: 'Users',
    permiso: PERMISOS.USUARIOS_LISTAR
  },
  {
    titulo: 'Reportes y Auditoría',
    ruta: RUTAS.REPORTES,
    icono: 'BarChart3',
    permiso: PERMISOS.REPORTES_VER
  }
]);
