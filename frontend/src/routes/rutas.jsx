import { createBrowserRouter, Navigate } from 'react-router-dom';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import LayoutAutenticacion from '../layouts/LayoutAutenticacion';
import RutaProtegida from './RutaProtegida';
import Ingresar from '../pages/Ingresar';
import Panel from '../pages/Panel';
import Equipos from '../pages/Equipos';
import Prestamos from '../pages/Prestamos';
import Usuarios from '../pages/Usuarios';
import Reportes from '../pages/Reportes';
import NoEncontrada from '../pages/NoEncontrada';
import { RUTAS } from '../constants/rutas';
import { PERMISOS } from '../constants/permisos';

export const enrutador = createBrowserRouter([
  {
    element: <LayoutAutenticacion />,
    children: [
      {
        path: RUTAS.INGRESAR,
        element: <Ingresar />
      }
    ]
  },
  {
    path: RUTAS.RAIZ,
    element: (
      <RutaProtegida>
        <LayoutPrincipal />
      </RutaProtegida>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={RUTAS.PANEL} replace />
      },
      {
        path: RUTAS.PANEL,
        element: (
          <RutaProtegida permiso={PERMISOS.DASHBOARD_VER}>
            <Panel />
          </RutaProtegida>
        )
      },
      {
        path: RUTAS.EQUIPOS,
        element: (
          <RutaProtegida permiso={PERMISOS.EQUIPOS_VER}>
            <Equipos />
          </RutaProtegida>
        )
      },
      {
        path: RUTAS.PRESTAMOS,
        element: (
          <RutaProtegida permiso={PERMISOS.PRESTAMOS_VER}>
            <Prestamos />
          </RutaProtegida>
        )
      },
      {
        path: RUTAS.USUARIOS,
        element: (
          <RutaProtegida permiso={PERMISOS.USUARIOS_LISTAR}>
            <Usuarios />
          </RutaProtegida>
        )
      },
      {
        path: RUTAS.REPORTES,
        element: (
          <RutaProtegida permiso={PERMISOS.REPORTES_VER}>
            <Reportes />
          </RutaProtegida>
        )
      }
    ]
  },
  {
    path: '*',
    element: <NoEncontrada />
  }
]);
