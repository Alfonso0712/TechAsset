// Panel principal de métricas y control de inventario y préstamos · TechAsset · WCAG 2.2 AA
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PERMISOS } from '../constants/permisos';
import { reporteService } from '../services/reporteService';
import { prestamoService } from '../services/prestamoService';

import EncabezadoPanel from '../components/panel/EncabezadoPanel';
import KpisPanel from '../components/panel/KpisPanel';
import ResumenOcupacion from '../components/panel/ResumenOcupacion';
import RequiereAtencion from '../components/panel/RequiereAtencion';
import GraficaReservasEstado from '../components/panel/GraficaReservasEstado';
import RankingAreas from '../components/panel/RankingAreas';
import ProximosPrestamos from '../components/panel/ProximosPrestamos';

import ModalAprobarPrestamo from '../components/prestamos/ModalAprobarPrestamo';
import ModalRechazarPrestamo from '../components/prestamos/ModalRechazarPrestamo';
import FormularioSolicitarPrestamo from '../components/prestamos/FormularioSolicitarPrestamo';
import FormularioPrestamoDirecto from '../components/prestamos/FormularioPrestamoDirecto';

import Button from '../components/ui/Button';
import Cargando from '../components/ui/Cargando';
import Toast from '../components/ui/Toast';

export default function Panel() {
  const { puede, usuario } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [prestamos, setPrestamos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Modales de acciones
  const [modalAprobar, setModalAprobar] = useState(null);
  const [modalRechazar, setModalRechazar] = useState(null);
  const [modalSolicitar, setModalSolicitar] = useState(false);
  const [modalDirecto, setModalDirecto] = useState(false);

  const puedeAprobar = puede(PERMISOS.PRESTAMOS_APROBAR_RECHAZAR);
  const puedeSolicitar = puede(PERMISOS.PRESTAMOS_SOLICITAR);
  const esResponsable = usuario?.rol === 'ResponsableTecnologia' || puedeAprobar;
  const esColaborador = usuario?.rol === 'Colaborador';

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [resDash, resPrestamos] = await Promise.allSettled([
        reporteService.obtenerDashboard(),
        prestamoService.listar({ tamanoPagina: 50 })
      ]);

      if (resDash.status === 'fulfilled' && resDash.value.estado === 200) {
        setDashboard(resDash.value.datos);
      } else {
        setError('No se pudo cargar la información del panel.');
      }

      if (resPrestamos.status === 'fulfilled' && resPrestamos.value.estado === 200) {
        const datos = resPrestamos.value.datos;
        const lista = Array.isArray(datos) ? datos : datos.items || [];
        setPrestamos(lista);
      }
    } catch {
      setError('Error al conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const agregarToast = (mensaje, tipo = 'exito') => {
    setToasts((prev) => [...prev.slice(-3), { id: Date.now(), tipo, mensaje }]);
  };

  const handleExitoAprobar = () => {
    agregarToast(`Solicitud de préstamo aprobada exitosamente.`);
    cargarDatos();
  };

  const handleExitoRechazar = () => {
    agregarToast(`Solicitud de préstamo rechazada.`);
    cargarDatos();
  };

  const handleExitoSolicitar = () => {
    setModalSolicitar(false);
    agregarToast('Solicitud de préstamo enviada para revisión.');
    cargarDatos();
  };

  const handleExitoDirecto = () => {
    setModalDirecto(false);
    agregarToast('Préstamo registrado exitosamente.');
    cargarDatos();
  };

  // Solicitudes pendientes de atención: tomadas del dashboard o de préstamos
  const solicitudesPendientes = dashboard?.solicitudesPendientes && dashboard.solicitudesPendientes.length > 0
    ? dashboard.solicitudesPendientes
    : prestamos.filter((p) => p.estado === 'Pendiente');

  return (
    <div className="space-y-5 max-w-[1440px] mx-auto w-full">
      <EncabezadoPanel
        puedeRegistrarDirecto={esResponsable}
        puedeSolicitar={esColaborador && puedeSolicitar}
        alRegistrarPrestamo={() => setModalDirecto(true)}
        alSolicitarPrestamo={() => setModalSolicitar(true)}
      />

      {error && (
        <div className="flex items-center justify-between p-4 rounded-control bg-peligro-fondo text-peligro-texto border border-peligro-borde text-sm">
          <span>{error}</span>
          <Button variante="secondary" tamano="sm" alHacerClic={cargarDatos}>
            Reintentar
          </Button>
        </div>
      )}

      {cargando ? (
        <Cargando mensaje="Cargando información del panel…" className="py-20" />
      ) : (
        <>
          <KpisPanel dashboard={dashboard} />

          <ResumenOcupacion prestamos={prestamos} metricas={dashboard} />

          {puedeAprobar && (
            <RequiereAtencion
              solicitudes={solicitudesPendientes}
              puedeGestionar={puedeAprobar}
              alAprobar={(p) => setModalAprobar(p)}
              alRechazar={(p) => setModalRechazar(p)}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GraficaReservasEstado dashboard={dashboard} />
            <RankingAreas areas={dashboard?.prestamosPorArea} prestamos={prestamos} />
          </div>

          <ProximosPrestamos prestamos={prestamos} />
        </>
      )}

      {/* Modales de Gestión de Préstamos */}
      {modalAprobar && (
        <ModalAprobarPrestamo
          abierto={Boolean(modalAprobar)}
          prestamo={modalAprobar}
          alCerrar={() => setModalAprobar(null)}
          alExito={handleExitoAprobar}
        />
      )}

      {modalRechazar && (
        <ModalRechazarPrestamo
          abierto={Boolean(modalRechazar)}
          prestamo={modalRechazar}
          alCerrar={() => setModalRechazar(null)}
          alExito={handleExitoRechazar}
        />
      )}

      {modalSolicitar && (
        <FormularioSolicitarPrestamo
          abierto={modalSolicitar}
          alCerrar={() => setModalSolicitar(false)}
          alExito={handleExitoSolicitar}
        />
      )}

      {modalDirecto && (
        <FormularioPrestamoDirecto
          abierto={modalDirecto}
          alCerrar={() => setModalDirecto(false)}
          alExito={handleExitoDirecto}
        />
      )}

      <Toast toasts={toasts} alCerrar={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
