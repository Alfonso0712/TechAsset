// Panel principal de métricas y control de inventario y préstamos · TechAsset · DCU · WCAG 2.2 AA
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PERMISOS } from '../constants/permisos';
import { reporteService } from '../services/reporteService';
import { prestamoService } from '../services/prestamoService';

import EncabezadoPanel from '../components/panel/EncabezadoPanel';
import RequiereAtencion from '../components/panel/RequiereAtencion';
import KpisPanel from '../components/panel/KpisPanel';
import GraficaReservasEstado from '../components/panel/GraficaReservasEstado';
import RankingAreas from '../components/panel/RankingAreas';
import ProximosPrestamos from '../components/panel/ProximosPrestamos';
import PanelSkeleton from '../components/panel/PanelSkeleton';

import ModalAprobarPrestamo from '../components/prestamos/ModalAprobarPrestamo';
import ModalRechazarPrestamo from '../components/prestamos/ModalRechazarPrestamo';
import ModalDevolverPrestamo from '../components/prestamos/ModalDevolverPrestamo';
import FormularioSolicitarPrestamo from '../components/prestamos/FormularioSolicitarPrestamo';
import FormularioPrestamoDirecto from '../components/prestamos/FormularioPrestamoDirecto';

import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';

export default function Panel() {
  const { puede, usuario } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [prestamos, setPrestamos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorDashboard, setErrorDashboard] = useState(null);
  const [errorPrestamos, setErrorPrestamos] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState('');
  const [toasts, setToasts] = useState([]);

  // Modales de acciones
  const [modalAprobar, setModalAprobar] = useState(null);
  const [modalRechazar, setModalRechazar] = useState(null);
  const [modalDevolver, setModalDevolver] = useState(null);
  const [modalSolicitar, setModalSolicitar] = useState(false);
  const [modalDirecto, setModalDirecto] = useState(false);

  // Permisos según sistema de seguridad
  const puedeAprobar = puede(PERMISOS.PRESTAMOS_APROBAR_RECHAZAR);
  const puedeSolicitar = puede(PERMISOS.PRESTAMOS_SOLICITAR);
  const puedeDevolver = puede(PERMISOS.PRESTAMOS_DEVOLVER);
  const esResponsableTI = usuario?.rol === 'ResponsableTecnologia';
  const esResponsable = puedeAprobar;
  const esColaborador = puedeSolicitar && !puedeAprobar;

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setErrorDashboard(null);
    setErrorPrestamos(null);

    try {
      const [resDash, resPrestamos] = await Promise.allSettled([
        reporteService.obtenerDashboard(),
        prestamoService.listar({
          tamanoPagina: 50,
          colaboradorId: esColaborador ? usuario?.id : undefined
        })
      ]);

      if (resDash.status === 'fulfilled' && resDash.value.estado === 200) {
        setDashboard(resDash.value.datos);
      } else {
        setErrorDashboard('No se pudieron obtener las métricas generales del inventario.');
      }

      if (resPrestamos.status === 'fulfilled' && resPrestamos.value.estado === 200) {
        const datos = resPrestamos.value.datos;
        const lista = Array.isArray(datos) ? datos : datos?.items || [];
        setPrestamos(lista);
      } else {
        setErrorPrestamos('No se pudieron obtener los registros de préstamos.');
      }

      // Marcar timestamp de actualización en hora local
      const ahora = new Date();
      const horaStr = ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
      setUltimaActualizacion(horaStr);
    } catch {
      setErrorDashboard('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  }, [esColaborador, usuario?.id]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const agregarToast = (mensaje, tipo = 'exito') => {
    setToasts((prev) => [...prev.slice(-3), { id: Date.now(), tipo, mensaje }]);
  };

  const handleExitoAprobar = () => {
    agregarToast('Solicitud de préstamo aprobada exitosamente.');
    setModalAprobar(null);
    cargarDatos();
  };

  const handleExitoRechazar = () => {
    agregarToast('Solicitud de préstamo rechazada.');
    setModalRechazar(null);
    cargarDatos();
  };

  const handleExitoDevolver = () => {
    agregarToast('Devolución de equipo registrada exitosamente.');
    setModalDevolver(null);
    cargarDatos();
  };

  const handleExitoSolicitar = () => {
    setModalSolicitar(false);
    agregarToast('Solicitud de préstamo enviada para revisión técnica.');
    cargarDatos();
  };

  const handleExitoDirecto = () => {
    setModalDirecto(false);
    agregarToast('Préstamo directo registrado exitosamente.');
    cargarDatos();
  };

  // Filtrado de solicitudes pendientes tomadas de dashboard o lista de préstamos
  const solicitudesPendientes = useMemo(() => {
    if (dashboard?.solicitudesPendientes && dashboard.solicitudesPendientes.length > 0) {
      return dashboard.solicitudesPendientes;
    }
    return prestamos.filter((p) => p.estado === 'Pendiente');
  }, [dashboard?.solicitudesPendientes, prestamos]);

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto w-full">
      {/* Encabezado fijo obligatorio */}
      <EncabezadoPanel
        puedeRegistrarDirecto={esResponsable && !esResponsableTI}
        puedeSolicitar={esColaborador && puedeSolicitar}
        alRegistrarPrestamo={() => setModalDirecto(true)}
        alSolicitarPrestamo={() => setModalSolicitar(true)}
        ultimaActualizacion={ultimaActualizacion}
        alActualizar={cargarDatos}
        cargando={cargando}
      />

      {/* Carga inicial con skeleton estructural */}
      {cargando && !dashboard && prestamos.length === 0 ? (
        <PanelSkeleton />
      ) : (
        <>
          {/* A. ZONA "REQUIERE TU ATENCIÓN" (Prioridad 1 debajo del encabezado) */}
          <RequiereAtencion
            prestamos={prestamos}
            metricas={dashboard}
            puedeAprobar={puedeAprobar}
            esColaborador={esColaborador}
            solicitudesPendientes={solicitudesPendientes}
            alAprobar={(p) => setModalAprobar(p)}
            alRechazar={(p) => setModalRechazar(p)}
          />

          {/* Error aislado de métricas si fallara solo ese bloque */}
          {errorDashboard && (
            <div className="flex items-center justify-between p-3.5 rounded-control bg-peligro-fondo text-peligro-texto border border-peligro-borde text-xs sm:text-sm">
              <span>{errorDashboard}</span>
              <Button variante="secondary" tamano="sm" alHacerClic={cargarDatos}>
                Reintentar
              </Button>
            </div>
          )}

          {/* B. TARJETAS KPI (6 obligatorias, 100% clicables con contexto secundario) */}
          <KpisPanel dashboard={dashboard} />

          {/* C. DISTRIBUCIÓN DE EQUIPOS Y DEMANDA POR ÁREAS (2 columnas equilibradas) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            <GraficaReservasEstado dashboard={dashboard} />
            <RankingAreas areas={dashboard?.prestamosPorArea} prestamos={prestamos} />
          </div>

          {/* Error aislado de préstamos si fallara ese bloque */}
          {errorPrestamos && (
            <div className="flex items-center justify-between p-3.5 rounded-control bg-peligro-fondo text-peligro-texto border border-peligro-borde text-xs sm:text-sm">
              <span>{errorPrestamos}</span>
              <Button variante="secondary" tamano="sm" alHacerClic={cargarDatos}>
                Reintentar
              </Button>
            </div>
          )}

          {/* D. PRÉSTAMOS ACTIVOS EN CURSO (con badges de plazo y acción de devolución) */}
          <ProximosPrestamos
            prestamos={prestamos}
            puedeDevolver={puedeDevolver}
            onRegistrarDevolucion={(p) => setModalDevolver(p)}
          />
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

      {modalDevolver && (
        <ModalDevolverPrestamo
          abierto={Boolean(modalDevolver)}
          prestamo={modalDevolver}
          alCerrar={() => setModalDevolver(null)}
          alExito={handleExitoDevolver}
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
