// Gestión y listado de préstamos de equipos tecnológicos · Fidelidad ReservaUPLA · WCAG 2.2 AA
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { PERMISOS } from '../constants/permisos';
import { ESTADOS_PRESTAMO } from '../constants/estados';
import { normalizarTexto } from '../utils/normalizarTexto';
import { formatearFecha } from '../utils/formatearFecha';
import { obtenerIniciales } from '../utils/obtenerIniciales';
import { prestamoService } from '../services/prestamoService';

import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosPrestamos from '../components/prestamos/FiltrosPrestamos';
import PestanasEstado from '../components/prestamos/PestanasEstado';
import AccionesFilaPrestamo from '../components/prestamos/AccionesFilaPrestamo';
import TableList from '../components/ui/TableList';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';
import Toast from '../components/ui/Toast';
import AlertMessage from '../components/ui/AlertMessage';

import ModalDetallePrestamo from '../components/prestamos/ModalDetallePrestamo';
import ModalAprobarPrestamo from '../components/prestamos/ModalAprobarPrestamo';
import ModalRechazarPrestamo from '../components/prestamos/ModalRechazarPrestamo';
import ModalDevolverPrestamo from '../components/prestamos/ModalDevolverPrestamo';
import FormularioSolicitarPrestamo from '../components/prestamos/FormularioSolicitarPrestamo';
import FormularioPrestamoDirecto from '../components/prestamos/FormularioPrestamoDirecto';
import { esPrestamoVencido } from '../utils/fechas';

export default function Prestamos() {
  const { usuario, puede } = useAuth();
  const [params, setParams] = useSearchParams();

  const [prestamos, setPrestamos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Filtros sincronizados con URL
  const [busquedaTexto, setBusquedaTexto] = useState(() => params.get('texto') || '');
  const [fechaDesde, setFechaDesde] = useState(() => params.get('desde') || '');
  const [fechaHasta, setFechaHasta] = useState(() => params.get('hasta') || '');
  const estadoFiltro = params.get('estado') || '';
  const textoDebounce = useDebounce(busquedaTexto);

  // Modales
  const [prestamoDetalle, setPrestamoDetalle] = useState(null);
  const [prestamoParaAprobar, setPrestamoParaAprobar] = useState(null);
  const [prestamoParaRechazar, setPrestamoParaRechazar] = useState(null);
  const [prestamoParaDevolver, setPrestamoParaDevolver] = useState(null);
  const [modalSolicitarAbierto, setModalSolicitarAbierto] = useState(false);
  const [modalDirectoAbierto, setModalDirectoAbierto] = useState(false);

  const puedeGestionar = puede(PERMISOS.PRESTAMOS_APROBAR_RECHAZAR);
  const puedeSolicitar = puede(PERMISOS.PRESTAMOS_SOLICITAR);
  const esColaborador = usuario?.rol === 'Colaborador';

  const cargarPrestamos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const resp = await prestamoService.listar({ tamanoPagina: 100 });
      if (resp.estado === 200 && resp.datos) {
        const items = Array.isArray(resp.datos) ? resp.datos : resp.datos.items || [];
        setPrestamos(items);
      } else {
        setError('No se pudieron cargar los registros de préstamos.');
      }
    } catch {
      setError('Error de conexión al cargar préstamos.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPrestamos();
  }, [cargarPrestamos]);

  // Si hay un query param 'id', abrir detalle automáticamente
  useEffect(() => {
    const idParam = params.get('id');
    if (idParam && prestamos.length > 0) {
      const encontrado = prestamos.find((p) => p.id === idParam);
      if (encontrado) setPrestamoDetalle(encontrado);
    }
  }, [params, prestamos]);

  const actualizarParametro = useCallback((clave, valor) => {
    const nuevosParams = new URLSearchParams(params);
    if (clave === 'estado') {
      if (valor) nuevosParams.set('estado', valor);
      else nuevosParams.delete('estado');
    } else if (valor) {
      nuevosParams.set(clave, valor);
    } else {
      nuevosParams.delete(clave);
    }
    setParams(nuevosParams, { replace: true });
  }, [params, setParams]);

  const agregarToast = (mensaje, tipo = 'exito') => {
    setToasts((prev) => [...prev.slice(-2), { id: Date.now(), tipo, mensaje }]);
  };

  const handleExitoAccion = (mensaje) => {
    setPrestamoParaAprobar(null);
    setPrestamoParaRechazar(null);
    setPrestamoParaDevolver(null);
    setModalSolicitarAbierto(false);
    agregarToast(mensaje);
    cargarPrestamos();
  };

  // Cálculo de conteos reales para pestañas de estado
  const conteos = useMemo(() => {
    const base = {
      total: prestamos.length,
      pendientes: 0,
      activos: 0,
      devueltos: 0,
      rechazados: 0
    };
    prestamos.forEach((p) => {
      const est = p.estado;
      if (est === ESTADOS_PRESTAMO.PENDIENTE || est === 'Pendiente') base.pendientes++;
      else if (est === ESTADOS_PRESTAMO.ACTIVO || est === 'Activo' || est === 'Prestado') base.activos++;
      else if (est === ESTADOS_PRESTAMO.DEVUELTO || est === 'Devuelto') base.devueltos++;
      else if (est === ESTADOS_PRESTAMO.RECHAZADO || est === 'Rechazado') base.rechazados++;
    });
    return base;
  }, [prestamos]);

  // Filtrado y ordenamiento: pendientes primero, luego por fecha más reciente
  const filtrados = useMemo(() => {
    const busqueda = normalizarTexto(textoDebounce).toLowerCase();

    return prestamos.filter((p) => {
      if (esColaborador && usuario) {
        const esMio =
          p.colaboradorId === usuario.id ||
          p.solicitanteId === usuario.id ||
          p.solicitante?.id === usuario.id ||
          (usuario.correo && p.solicitanteCorreo?.toLowerCase() === usuario.correo.toLowerCase());
        if (!esMio) return false;
      }

      if (estadoFiltro) {
        if (estadoFiltro === ESTADOS_PRESTAMO.ACTIVO && p.estado !== 'Activo' && p.estado !== 'Prestado') return false;
        if (estadoFiltro !== ESTADOS_PRESTAMO.ACTIVO && p.estado !== estadoFiltro) return false;
      }
      if (fechaDesde && p.fechaPrestamo < fechaDesde) return false;
      if (fechaHasta && p.fechaPrestamo > fechaHasta) return false;

      if (!busqueda) return true;
      const solicitante = `${p.solicitanteNombre || p.solicitante?.nombreCompleto || ''} ${p.solicitanteCorreo || p.solicitante?.correo || ''} ${p.solicitanteArea || ''}`;
      const equipo = `${p.equipoNombre || p.equipo?.nombre || ''} ${p.equipoCodigo || p.equipo?.codigoPatrimonial || ''}`;
      const textoCompleto = `${solicitante} ${equipo} ${p.motivo || ''}`.toLowerCase();
      return textoCompleto.includes(busqueda);
    }).sort((a, b) => {
      const esPendA = a.estado === 'Pendiente' ? 0 : 1;
      const esPendB = b.estado === 'Pendiente' ? 0 : 1;
      if (esPendA !== esPendB) return esPendA - esPendB;
      return (b.fechaPrestamo || '').localeCompare(a.fechaPrestamo || '');
    });
  }, [prestamos, estadoFiltro, textoDebounce, fechaDesde, fechaHasta, esColaborador, usuario]);

  const columnas = [
    {
      clave: 'solicitante',
      encabezado: 'Solicitante',
      ordenable: true,
      claseEncabezado: 'min-w-[9.5rem] max-w-[12.5rem] px-2.5',
      claseCelda: 'min-w-[9.5rem] max-w-[12.5rem] px-2.5',
      render: (p) => {
        const nombre = p.solicitanteNombre || p.solicitante?.nombreCompleto || 'Colaborador';
        const correo = p.solicitanteCorreo || p.solicitante?.correo || '';
        const area = p.solicitanteArea || p.solicitante?.areaNombre || '';
        return (
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-full bg-primario-suave text-primario dark:text-primario-enlace font-bold text-xs flex items-center justify-center shrink-0">
              {obtenerIniciales(nombre) || 'U'}
            </span>
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setPrestamoDetalle(p)}
                className="font-semibold text-texto hover:text-primario-enlace hover:underline line-clamp-1 block text-sm text-left truncate"
                title={nombre}
              >
                {nombre}
              </button>
              <p className="text-xs text-texto-suave truncate mt-0.5" title={`${correo} · ${area}`}>
                {correo} {area ? `· ${area}` : ''}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      clave: 'equipo',
      encabezado: 'Equipo',
      claseEncabezado: 'min-w-[8.5rem] max-w-[11.5rem] px-2.5',
      claseCelda: 'min-w-[8.5rem] max-w-[11.5rem] px-2.5',
      render: (p) => {
        const nombre = p.equipoNombre || p.equipo?.nombre || 'Equipo';
        const codigo = p.equipoCodigo || p.equipo?.codigoPatrimonial || '';
        return (
          <div className="min-w-0">
            <p className="font-semibold text-texto line-clamp-1 block text-sm truncate" title={nombre}>
              {nombre}
            </p>
            {codigo && (
              <span className="font-mono text-xs text-texto-suave block mt-0.5">
                {codigo}
              </span>
            )}
          </div>
        );
      }
    },
    {
      clave: 'periodo',
      encabezado: 'Período',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap px-2.5',
      claseCelda: 'w-[1%] whitespace-nowrap px-2.5 cifra-tabular',
      render: (p) => (
        <div className="min-w-0">
          <span className="font-semibold text-texto block text-sm leading-snug">
            {formatearFecha(p.fechaPrestamo)}
          </span>
          <span className="text-xs text-texto-suave mt-0.5 block leading-snug">
            hasta {formatearFecha(p.fechaDevolucionEstimada)}
          </span>
        </div>
      )
    },
    {
      clave: 'responsable',
      encabezado: 'Responsable',
      claseEncabezado: 'min-w-[8rem] max-w-[11rem] px-2.5 hidden md:table-cell',
      claseCelda: 'min-w-[8rem] max-w-[11rem] px-2.5 hidden md:table-cell text-xs',
      render: (p) => (
        <span className="text-texto-suave truncate block">
          {p.estado === 'Pendiente' ? '—' : (p.responsableNombre || p.responsable?.nombreCompleto || '—')}
        </span>
      )
    },
    {
      clave: 'estado',
      encabezado: 'Estado',
      claseEncabezado: 'w-[1%] whitespace-nowrap px-2.5',
      claseCelda: 'w-[1%] whitespace-nowrap px-2.5',
      render: (p) => {
        const estaVencido = (p.estado === 'Activo' || p.estado === 'Prestado') && esPrestamoVencido(p);
        return (
          <div className="inline-flex items-center gap-1.5">
            <Badge estado={p.estado} />
            {estaVencido && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-peligro-fondo text-peligro-texto border border-peligro-borde uppercase">
                Vencido
              </span>
            )}
          </div>
        );
      }
    },
    {
      clave: 'acciones',
      encabezado: 'Acciones',
      claseEncabezado: 'w-[1%] whitespace-nowrap text-right pl-2 pr-3',
      claseCelda: 'w-[1%] whitespace-nowrap text-right pl-2 pr-3',
      render: (p) => (
        <AccionesFilaPrestamo
          prestamo={p}
          puedeGestionar={puedeGestionar}
          alVerDetalle={() => setPrestamoDetalle(p)}
          alAprobar={() => setPrestamoParaAprobar(p)}
          alRechazar={() => setPrestamoParaRechazar(p)}
          alDevolver={() => setPrestamoParaDevolver(p)}
        />
      )
    }
  ];

  const hayFiltrosActivos = Boolean(busquedaTexto.trim() || estadoFiltro || fechaDesde || fechaHasta);
  const limpiarFiltros = () => {
    setBusquedaTexto('');
    setFechaDesde('');
    setFechaHasta('');
    setParams({}, { replace: true });
  };

  const tituloPagina = esColaborador ? 'Mis préstamos' : 'Préstamos';
  const descPagina = esColaborador
    ? 'Consulte sus solicitudes, estado de aprobación y devolución de equipos asignados.'
    : 'Consulte, filtre y gestione las solicitudes y custodia de equipos corporativos.';

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto w-full">
      <EncabezadoPagina
        titulo={tituloPagina}
        descripcion={descPagina}
        accionPrimaria={
          puedeGestionar ? (
            <Button
              variante="primario"
              alHacerClic={() => setModalDirectoAbierto(true)}
            >
              <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
              <span>Registrar préstamo</span>
            </Button>
          ) : esColaborador && puedeSolicitar ? (
            <Button
              variante="primario"
              alHacerClic={() => setModalSolicitarAbierto(true)}
            >
              <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
              <span>Solicitar préstamo</span>
            </Button>
          ) : null
        }
      />

      <FiltrosPrestamos
        texto={busquedaTexto}
        estado={estadoFiltro}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        totalResultados={filtrados.length}
        alCambiarTexto={setBusquedaTexto}
        alCambiarFechaDesde={(v) => {
          setFechaDesde(v);
          actualizarParametro('desde', v);
        }}
        alCambiarFechaHasta={(v) => {
          setFechaHasta(v);
          actualizarParametro('hasta', v);
        }}
        alLimpiar={limpiarFiltros}
      />

      <PestanasEstado
        estadoActivo={estadoFiltro}
        conteos={conteos}
        alSeleccionar={(e) => actualizarParametro('estado', e)}
      />

      {error && (
        <div className="mb-4">
          <AlertMessage variante="error" mensaje={error} />
        </div>
      )}

      <TableList
        caption="Listado de solicitudes y custodia de equipos tecnológicos"
        columnas={columnas}
        datos={filtrados}
        cargando={cargando}
        esFiltroActivo={hayFiltrosActivos}
        alLimpiarFiltros={limpiarFiltros}
        mensajeVacio="No hay préstamos registrados aún"
        descripcionVacia="Puede registrar una nueva solicitud de préstamo con el botón superior."
      />

      {/* Modales de Gestión de Préstamos */}
      {prestamoDetalle && (
        <ModalDetallePrestamo
          abierto={Boolean(prestamoDetalle)}
          prestamo={prestamoDetalle}
          alCerrar={() => {
            setPrestamoDetalle(null);
            if (params.has('id')) {
              actualizarParametro('id', null);
            }
          }}
        />
      )}

      {prestamoParaAprobar && (
        <ModalAprobarPrestamo
          abierto={Boolean(prestamoParaAprobar)}
          prestamo={prestamoParaAprobar}
          alCerrar={() => setPrestamoParaAprobar(null)}
          alExito={() => handleExitoAccion('Solicitud de préstamo aprobada exitosamente.')}
        />
      )}

      {prestamoParaRechazar && (
        <ModalRechazarPrestamo
          abierto={Boolean(prestamoParaRechazar)}
          prestamo={prestamoParaRechazar}
          alCerrar={() => setPrestamoParaRechazar(null)}
          alExito={() => handleExitoAccion('Solicitud de préstamo rechazada.')}
        />
      )}

      {prestamoParaDevolver && (
        <ModalDevolverPrestamo
          abierto={Boolean(prestamoParaDevolver)}
          prestamo={prestamoParaDevolver}
          alCerrar={() => setPrestamoParaDevolver(null)}
          alExito={() => handleExitoAccion('Devolución registrada correctamente.')}
        />
      )}

      {modalSolicitarAbierto && (
        <FormularioSolicitarPrestamo
          abierto={modalSolicitarAbierto}
          alCerrar={() => setModalSolicitarAbierto(false)}
          alExito={() => handleExitoAccion('Solicitud de préstamo enviada para revisión.')}
        />
      )}

      {modalDirectoAbierto && (
        <FormularioPrestamoDirecto
          abierto={modalDirectoAbierto}
          alCerrar={() => setModalDirectoAbierto(false)}
          alExito={() => handleExitoAccion('Préstamo directo registrado exitosamente.')}
        />
      )}

      <Toast toasts={toasts} alCerrar={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
