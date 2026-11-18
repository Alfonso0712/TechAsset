// Catálogo de equipos tecnológicos, acciones y permisos RBAC · Fidelidad ReservaUPLA · WCAG 2.2 AA
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { PERMISOS } from '../constants/permisos';
import { normalizarTexto } from '../utils/normalizarTexto';
import { equipoService } from '../services/equipoService';

import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosEquipos from '../components/equipos/FiltrosEquipos';
import AccionesFilaEquipo from '../components/equipos/AccionesFilaEquipo';
import FormularioEquipo from '../components/equipos/FormularioEquipo';
import ModalCambiarEstadoEquipo from '../components/equipos/ModalCambiarEstadoEquipo';
import FormularioSolicitarPrestamo from '../components/prestamos/FormularioSolicitarPrestamo';

import TableList from '../components/ui/TableList';
import CategoriaEquipoChip from '../components/ui/CategoriaEquipoChip';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';
import Toast from '../components/ui/Toast';

export default function Equipos() {
  const { puede } = useAuth();
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [textoFiltro, setTextoFiltro] = useState('');
  const textoDebounce = useDebounce(textoFiltro);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  // Modales
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [equipoParaEditar, setEquipoParaEditar] = useState(null);
  const [equipoParaCambiarEstado, setEquipoParaCambiarEstado] = useState(null);
  const [equipoParaSolicitarId, setEquipoParaSolicitarId] = useState(null);

  const [toasts, setToasts] = useState([]);

  const puedeCrear = puede(PERMISOS.EQUIPOS_CREAR);
  const puedeEditar = puede(PERMISOS.EQUIPOS_EDITAR);
  const puedeCambiarEstado = puede(PERMISOS.EQUIPOS_CAMBIAR_ESTADO);
  const puedeSolicitar = puede(PERMISOS.PRESTAMOS_SOLICITAR);

  const cargarEquipos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const resp = await equipoService.listar({ tamanoPagina: 100 });
      if (resp.estado === 200 && resp.datos) {
        const items = Array.isArray(resp.datos) ? resp.datos : resp.datos.items || [];
        setEquipos(items);
      } else {
        setError('No se pudo cargar el inventario de equipos.');
      }
    } catch {
      setError('Error de conexión al cargar los equipos.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  const agregarToast = (mensaje, tipo = 'exito') => {
    setToasts((prev) => [...prev.slice(-2), { id: Date.now(), tipo, mensaje }]);
  };

  const handleExitoGuardar = (equipoGuardado) => {
    setModalCrearAbierto(false);
    setEquipoParaEditar(null);
    agregarToast(`Equipo "${equipoGuardado.nombre}" guardado correctamente.`);
    cargarEquipos();
  };

  const handleExitoCambiarEstado = (equipoActualizado) => {
    setEquipoParaCambiarEstado(null);
    agregarToast(`Estado de "${equipoActualizado.nombre}" actualizado a ${equipoActualizado.estado}.`);
    cargarEquipos();
  };

  const handleExitoSolicitud = () => {
    setEquipoParaSolicitarId(null);
    agregarToast('Solicitud de préstamo enviada para revisión técnica.');
    cargarEquipos();
  };

  // Filtrado local ágil con debounce
  const filtrados = useMemo(() => {
    const busqueda = normalizarTexto(textoDebounce).toLowerCase();
    return equipos.filter((e) => {
      const coincideCat = !categoriaFiltro || e.categoria === categoriaFiltro;
      const coincideEst = !estadoFiltro || e.estado === estadoFiltro;
      const textoCompleto = `${e.codigoPatrimonial || ''} ${e.nombre || ''} ${e.marca || ''} ${e.modelo || ''} ${e.ubicacion || ''}`.toLowerCase();
      const coincideTxt = !busqueda || textoCompleto.includes(busqueda);
      return coincideCat && coincideEst && coincideTxt;
    });
  }, [equipos, textoDebounce, categoriaFiltro, estadoFiltro]);

  const columnas = [
    {
      clave: 'codigoPatrimonial',
      encabezado: 'Cód. patrimonial',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3',
      render: (e) => (
        <span className="font-mono font-bold text-texto text-xs tracking-wider">
          {e.codigoPatrimonial}
        </span>
      )
    },
    {
      clave: 'nombre',
      encabezado: 'Equipo',
      ordenable: true,
      claseEncabezado: 'min-w-[11rem] px-3',
      claseCelda: 'min-w-[11rem] px-3',
      render: (e) => (
        <div>
          <span className="font-semibold text-texto line-clamp-1 block" title={e.nombre}>
            {e.nombre}
          </span>
          <span className="text-xs text-texto-suave block">
            {e.marca} {e.modelo}
          </span>
        </div>
      )
    },
    {
      clave: 'categoria',
      encabezado: 'Categoría',
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3 hidden md:table-cell',
      claseCelda: 'w-[1%] whitespace-nowrap px-3 hidden md:table-cell',
      render: (e) => <CategoriaEquipoChip categoria={e.categoria} />
    },
    {
      clave: 'ubicacion',
      encabezado: 'Ubicación',
      claseEncabezado: 'min-w-[8rem] max-w-[12rem] px-3 hidden lg:table-cell',
      claseCelda: 'min-w-[8rem] max-w-[12rem] px-3 hidden lg:table-cell',
      render: (e) => (
        <span className="text-xs text-texto-suave line-clamp-1" title={e.ubicacion}>
          {e.ubicacion || 'Almacén Central'}
        </span>
      )
    },
    {
      clave: 'estado',
      encabezado: 'Estado',
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3',
      render: (e) => <Badge estado={e.estado} />
    },
    {
      clave: 'acciones',
      encabezado: 'Acciones',
      claseEncabezado: 'w-[1%] whitespace-nowrap text-right pl-3 pr-4',
      claseCelda: 'w-[1%] whitespace-nowrap text-right pl-3 pr-4',
      render: (e) => (
        <AccionesFilaEquipo
          equipo={e}
          puedeEditar={puedeEditar}
          puedeCambiarEstado={puedeCambiarEstado}
          puedeSolicitar={puedeSolicitar}
          alEditar={setEquipoParaEditar}
          alCambiarEstado={setEquipoParaCambiarEstado}
          alSolicitar={(id) => setEquipoParaSolicitarId(id)}
        />
      )
    }
  ];

  const hayFiltrosActivos = Boolean(textoFiltro.trim() || categoriaFiltro || estadoFiltro);
  const limpiarFiltros = () => {
    setTextoFiltro('');
    setCategoriaFiltro('');
    setEstadoFiltro('');
  };

  return (
    <div className="space-y-5 max-w-[1440px] mx-auto w-full">
      <EncabezadoPagina
        titulo="Equipos"
        descripcion="Catálogo de activos tecnológicos, estado operativo y disponibilidad para préstamos corporativos."
        accionPrimaria={
          puedeCrear ? (
            <Button
              variante="primario"
              alHacerClic={() => setModalCrearAbierto(true)}
            >
              <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
              <span>Nuevo equipo</span>
            </Button>
          ) : null
        }
      />

      <FiltrosEquipos
        texto={textoFiltro}
        categoria={categoriaFiltro}
        estado={estadoFiltro}
        totalResultados={filtrados.length}
        alCambiarTexto={setTextoFiltro}
        alCambiarCategoria={setCategoriaFiltro}
        alCambiarEstado={setEstadoFiltro}
        alLimpiar={limpiarFiltros}
      />

      <TableList
        caption="Inventario corporativo de activos tecnológicos"
        columnas={columnas}
        datos={filtrados}
        cargando={cargando}
        esFiltroActivo={hayFiltrosActivos}
        alLimpiarFiltros={limpiarFiltros}
        mensajeVacio="No hay equipos registrados aún"
        descripcionVacia="Puede registrar un nuevo activo tecnológico con el botón superior."
        accionVacia={
          puedeCrear ? (
            <Button variante="primario" alHacerClic={() => setModalCrearAbierto(true)}>
              <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
              <span>Nuevo equipo</span>
            </Button>
          ) : null
        }
      />

      {/* Modales de Formulario y Estado */}
      {modalCrearAbierto && (
        <FormularioEquipo
          abierto={modalCrearAbierto}
          alCerrar={() => setModalCrearAbierto(false)}
          alExito={handleExitoGuardar}
        />
      )}

      {equipoParaEditar && (
        <FormularioEquipo
          abierto={Boolean(equipoParaEditar)}
          equipo={equipoParaEditar}
          alCerrar={() => setEquipoParaEditar(null)}
          alExito={handleExitoGuardar}
        />
      )}

      {equipoParaCambiarEstado && (
        <ModalCambiarEstadoEquipo
          abierto={Boolean(equipoParaCambiarEstado)}
          equipo={equipoParaCambiarEstado}
          alCerrar={() => setEquipoParaCambiarEstado(null)}
          alExito={handleExitoCambiarEstado}
        />
      )}

      {equipoParaSolicitarId && (
        <FormularioSolicitarPrestamo
          abierto={Boolean(equipoParaSolicitarId)}
          equipoPreseleccionadoId={equipoParaSolicitarId}
          alCerrar={() => setEquipoParaSolicitarId(null)}
          alExito={handleExitoSolicitud}
        />
      )}

      <Toast toasts={toasts} alCerrar={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
