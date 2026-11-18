// Nielsen 3 · WCAG 2.2 AA · Layout principal con barra lateral fija, cabecera y contenedor semántico
import { useState, useRef, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RUTAS } from '../constants/rutas';
import SaltarAlContenido from '../components/navegacion/SaltarAlContenido';
import Sidebar from '../components/navegacion/Sidebar';
import Header from '../components/navegacion/Header';
import PageContainer from '../components/navegacion/PageContainer';
import FormularioSolicitarPrestamo from '../components/prestamos/FormularioSolicitarPrestamo';

export default function LayoutPrincipal({ children }) {
  const { usuario } = useAuth();
  const ubicacion = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalPrestamo, setModalPrestamo] = useState({ abierto: false, equipoId: '' });
  const [mensajeGlobal, setMensajeGlobal] = useState('');
  const [versionDatos, setVersionDatos] = useState(0);
  const botonMenuRef = useRef(null);

  const abrirModalPrestamo = useCallback((equipoId = '') => {
    setModalPrestamo({ abierto: true, equipoId: String(equipoId || '') });
  }, []);

  const cerrarModalPrestamo = useCallback(() => {
    setModalPrestamo({ abierto: false, equipoId: '' });
  }, []);

  const manejarPrestamoCreado = useCallback((mensaje) => {
    setModalPrestamo({ abierto: false, equipoId: '' });
    setMensajeGlobal(mensaje);
    setVersionDatos((v) => v + 1);
  }, []);

  const contextoOutlet = {
    abrirModalPrestamo,
    mensajeGlobal,
    limpiarMensajeGlobal: () => setMensajeGlobal(''),
    versionDatos,
    recargarDatos: () => setVersionDatos((v) => v + 1)
  };

  const anchoContenedor = (ubicacion.pathname === RUTAS.PANEL || ubicacion.pathname === '/') ? 'estandar' : 'completo';

  return (
    <div className="min-h-screen flex bg-fondo text-texto">
      <SaltarAlContenido />
      <Sidebar
        usuario={usuario}
        abiertoMovil={menuAbierto}
        alCerrarMovil={() => setMenuAbierto(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          menuAbierto={menuAbierto}
          alAlternarMenu={() => setMenuAbierto((prev) => !prev)}
          botonMenuRef={botonMenuRef}
        />
        <PageContainer ancho={anchoContenedor}>
          {children || <Outlet context={contextoOutlet} />}
        </PageContainer>
      </div>

      <FormularioSolicitarPrestamo
        abierto={modalPrestamo.abierto}
        equipoPreseleccionadoId={modalPrestamo.equipoId}
        alCerrar={cerrarModalPrestamo}
        alGuardarExitoso={manejarPrestamoCreado}
      />
    </div>
  );
}
