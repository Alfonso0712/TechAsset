import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import LayoutAutenticacion from '../layouts/LayoutAutenticacion';
import RutaProtegida from './RutaProtegida';
import Landing from '../pages/Landing';
import Ingresar from '../pages/Ingresar';
import NoEncontrada from '../pages/NoEncontrada';
import Cargando from '../components/ui/Cargando';
import { RUTAS } from '../constants/rutas';
import { PERMISOS } from '../constants/permisos';

// Code-splitting con React.lazy para optimizar el bundle principal de producción
const Panel = lazy(() => import('../pages/Panel'));
const Equipos = lazy(() => import('../pages/Equipos'));
const Prestamos = lazy(() => import('../pages/Prestamos'));
const Usuarios = lazy(() => import('../pages/Usuarios'));
const Reportes = lazy(() => import('../pages/Reportes'));

const conSuspense = (Componente) => (
  <Suspense fallback={<Cargando mensaje="Cargando módulo corporativo…" className="py-20" />}>
    <Componente />
  </Suspense>
);

export const enrutador = createBrowserRouter([
  {
    path: RUTAS.RAIZ,
    element: <Landing />
  },
  {
    element: <LayoutAutenticacion />,
    children: [
      {
        path: '/login',
        element: <Ingresar />
      },
      {
        path: '/ingresar',
        element: <Ingresar />
      }
    ]
  },
  {
    element: (
      <RutaProtegida>
        <LayoutPrincipal />
      </RutaProtegida>
    ),
    children: [
      {
        path: RUTAS.PANEL,
        element: (
          <RutaProtegida permiso={PERMISOS.DASHBOARD_VER}>
            {conSuspense(Panel)}
          </RutaProtegida>
        )
      },
      {
        path: RUTAS.EQUIPOS,
        element: (
          <RutaProtegida permiso={PERMISOS.EQUIPOS_VER}>
            {conSuspense(Equipos)}
          </RutaProtegida>
        )
      },
      {
        path: RUTAS.PRESTAMOS,
        element: (
          <RutaProtegida permiso={PERMISOS.PRESTAMOS_VER}>
            {conSuspense(Prestamos)}
          </RutaProtegida>
        )
      },
      {
        path: RUTAS.USUARIOS,
        element: (
          <RutaProtegida permiso={PERMISOS.USUARIOS_LISTAR}>
            {conSuspense(Usuarios)}
          </RutaProtegida>
        )
      },
      {
        path: RUTAS.REPORTES,
        element: (
          <RutaProtegida permiso={PERMISOS.REPORTES_VER}>
            {conSuspense(Reportes)}
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
