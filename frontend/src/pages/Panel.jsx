import { useState, useEffect, useCallback } from 'react';
import CardIndicador from '../components/ui/CardIndicador';
import Cargando from '../components/ui/Cargando';
import AlertMessage from '../components/ui/AlertMessage';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import GraficoDonaSVG from '../components/panel/GraficoDonaSVG';
import RankingAreas from '../components/panel/RankingAreas';
import BandejaSolicitudesPendientes from '../components/panel/BandejaSolicitudesPendientes';
import ModalAprobarPrestamo from '../components/prestamos/ModalAprobarPrestamo';
import ModalRechazarPrestamo from '../components/prestamos/ModalRechazarPrestamo';
import FormularioSolicitarPrestamo from '../components/prestamos/FormularioSolicitarPrestamo';
import { reporteService } from '../services/reporteService';
import { useAuth } from '../hooks/useAuth';
import { PERMISOS } from '../constants/permisos';

export default function Panel() {
  const { usuario, puede } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Modales
  const [modalAprobar, setModalAprobar] = useState(null);
  const [modalRechazar, setModalRechazar] = useState(null);
  const [modalSolicitar, setModalSolicitar] = useState(false);

  const puedeGestionar = puede(PERMISOS.PRESTAMOS_APROBAR_RECHAZAR);

  const cargarDashboard = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const resp = await reporteService.obtenerDashboard();
      if (resp.estado === 200 && resp.datos) {
        setDashboard(resp.datos);
      } else {
        setError('No se pudo cargar la información del panel.');
      }
    } catch {
      setError('Error al conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  if (cargando) {
    return <Cargando mensaje="Cargando métricas institucionales…" className="py-24" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-texto">
            Bienvenido, {usuario?.nombres || 'Usuario'}
          </h1>
          <p className="text-xs text-texto-suave mt-1">
            Resumen operativo y métricas de inventario y préstamos institucionales.
          </p>
        </div>

        <div>
          <Button
            variante="primary"
            icono="Plus"
            onClick={() => setModalSolicitar(true)}
          >
            Solicitar Préstamo
          </Button>
        </div>
      </div>

      {error && <AlertMessage variante="peligro" mensaje={error} />}

      {/* 6 Tarjetas de Indicadores */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <CardIndicador
          titulo="Total Equipos"
          valor={dashboard?.totalEquipos ?? 0}
          icono="Laptop"
          variante="primario"
        />
        <CardIndicador
          titulo="Disponibles"
          valor={dashboard?.equiposDisponibles ?? 0}
          icono="CheckCircle2"
          variante="exito"
        />
        <CardIndicador
          titulo="Prestados"
          valor={dashboard?.equiposPrestados ?? 0}
          icono="Clock"
          variante="informacion"
        />
        <CardIndicador
          titulo="Mantenimiento"
          valor={dashboard?.equiposMantenimiento ?? 0}
          icono="Wrench"
          variante="advertencia"
        />
        <CardIndicador
          titulo="Baja"
          valor={dashboard?.equiposBaja ?? 0}
          icono="Ban"
          variante="peligro"
        />
        <CardIndicador
          titulo="Préstamos"
          valor={dashboard?.totalPrestamos ?? 0}
          icono="ClipboardList"
          variante="primario"
        />
      </div>

      {/* Grilla Central: Gráfico de Dona + Áreas con Mayor Uso */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Distribución por Estado (SVG Donut) */}
        <div className="lg:col-span-6 rounded-xl border border-borde bg-superficie p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-borde">
            <div>
              <h3 className="text-base font-bold text-texto">
                Distribución de Equipos
              </h3>
              <p className="text-xs text-texto-suave">Estado operativo actual del inventario</p>
            </div>
          </div>
          <GraficoDonaSVG
            datos={dashboard?.distribucionPorEstado || []}
            total={dashboard?.totalEquipos || 0}
          />
        </div>

        {/* Áreas con Mayor Uso */}
        <div className="lg:col-span-6 rounded-xl border border-borde bg-superficie p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-borde">
            <div>
              <h3 className="text-base font-bold text-texto">
                Demanda por Áreas
              </h3>
              <p className="text-xs text-texto-suave">
                Área líder: <strong className="text-primario">{dashboard?.areaMayorUso || '-'}</strong>
              </p>
            </div>
          </div>
          <RankingAreas areas={dashboard?.prestamosPorArea || []} />
        </div>
      </div>

      {/* Bandeja de Solicitudes Pendientes (para Responsables y Admin) */}
      {puedeGestionar && (
        <div className="rounded-xl border border-borde bg-superficie shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-borde bg-superficie-2/40 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-texto">
                Bandeja de Solicitudes Pendientes
              </h3>
              <p className="text-xs text-texto-suave">
                Equipos solicitados que requieren evaluación y entrega técnica (RN-05)
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              {dashboard?.solicitudesPendientes?.length || 0} pendientes
            </span>
          </div>

          <BandejaSolicitudesPendientes
            solicitudes={dashboard?.solicitudesPendientes || []}
            onAprobar={(p) => setModalAprobar(p)}
            onRechazar={(p) => setModalRechazar(p)}
          />
        </div>
      )}

      {/* Modales de Aprobación / Rechazo / Solicitud */}
      {modalAprobar && (
        <ModalAprobarPrestamo
          abierto={Boolean(modalAprobar)}
          prestamo={modalAprobar}
          alCerrar={() => setModalAprobar(null)}
          alExito={() => {
            cargarDashboard();
            setToast({ mensaje: 'Préstamo aprobado exitosamente.', variante: 'exito' });
          }}
        />
      )}

      {modalRechazar && (
        <ModalRechazarPrestamo
          abierto={Boolean(modalRechazar)}
          prestamo={modalRechazar}
          alCerrar={() => setModalRechazar(null)}
          alExito={() => {
            cargarDashboard();
            setToast({ mensaje: 'Solicitud rechazada.', variante: 'peligro' });
          }}
        />
      )}

      {modalSolicitar && (
        <FormularioSolicitarPrestamo
          abierto={modalSolicitar}
          alCerrar={() => setModalSolicitar(false)}
          alGuardarExitoso={() => {
            cargarDashboard();
            setToast({ mensaje: 'Solicitud enviada exitosamente.', variante: 'exito' });
          }}
        />
      )}

      {toast && (
        <Toast
          mensaje={toast.mensaje}
          variante={toast.variante}
          alCerrar={() => setToast(null)}
        />
      )}
    </div>
  );
}
