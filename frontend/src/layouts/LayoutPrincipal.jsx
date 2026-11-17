import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import BarraLateral from '../components/navegacion/BarraLateral';
import BarraNavegacion from '../components/navegacion/BarraNavegacion';

export default function LayoutPrincipal() {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);

  const alternarSidebar = useCallback(() => {
    setSidebarAbierta(prev => !prev);
  }, []);

  const cerrarSidebar = useCallback(() => {
    setSidebarAbierta(false);
  }, []);

  return (
    <div className="min-h-screen bg-fondo text-texto flex">
      {/* Barra lateral fija */}
      <BarraLateral abierta={sidebarAbierta} alCerrar={cerrarSidebar} />

      {/* Contenido derecho principal */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <BarraNavegacion alAlternarMenu={alternarSidebar} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
