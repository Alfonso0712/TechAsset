// Catálogo de equipos tecnológicos, acciones y permisos RBAC · Fidelidad ReservaUPLA · WCAG 2.2 AA
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { PERMISOS } from '../constants/permisos';
import { canEditEquipo, canChangeEstadoEquipo, canViewHistorialEquipo } from '../utils/permisosEquipo';
import { normalizarTexto } from '../utils/normalizarTexto';
import { equipoService } from '../services/equipoService';

import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosEquipos from '../components/equipos/FiltrosEquipos';
import AccionesFilaEquipo from '../components/equipos/AccionesFilaEquipo';
import FormularioEquipo from '../components/equipos/FormularioEquipo';
import ModalCambiarEstadoEquipo from '../components/equipos/ModalCambiarEstadoEquipo';
import FormularioSolicitarPrestamo from '../components/prestamos/FormularioSolicitarPrestamo';

import TableList from '../components/ui/TableList';
import PestanasConteo from '../components/ui/PestanasConteo';
import CategoriaEquipoChip from '../components/ui/CategoriaEquipoChip';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';
import Toast from '../components/ui/Toast';
import AlertMessage from '../components/ui/AlertMessage';

export default function Equipos() {
  const { puede, usuario } = useAuth();
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
  const puedeEditar = canEditEquipo(usuario, puede);
  const puedeCambiarEstado = canChangeEstadoEquipo(usuario, puede);
  const puedeVerHistorial = canViewHistorialEquipo(usuario, puede);
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
      claseEncabezado: 'whitespace-nowrap pl-4 pr-2',
      claseCelda: 'whitespace-nowrap pl-4 pr-2',
      render: (e) => (
        <span
          className="font-mono font-medium text-texto text-xs tracking-wider"
          title={e.codigoPatrimonial}
        >
          {e.codigoPatrimonial}
        </span>
      )
    },
    {
      clave: 'nombre',
      encabezado: 'Equipo',
      ordenable: true,
      claseEncabezado: 'max-w-[220px] px-2',
      claseCelda: 'max-w-[220px] px-2',
      render: (e) => (
        <span
          className="font-medium text-texto text-sm truncate block"
          title={e.nombre}
        >
          {e.nombre}
        </span>
      )
    },
    {
      clave: 'marca',
      encabezado: 'Marca',
      ordenable: true,
      claseEncabezado: 'whitespace-nowrap px-2',
      claseCelda: 'whitespace-nowrap px-2',
      render: (e) => (
        <span
          className="text-sm text-texto-suave whitespace-nowrap block"
          title={e.marca || '—'}
        >
          {e.marca || '—'}
        </span>
      )
    },
    {
      clave: 'categoria',
      encabezado: 'Categoría',
      claseEncabezado: 'whitespace-nowrap px-2',
      claseCelda: 'whitespace-nowrap px-2',
      render: (e) => <CategoriaEquipoChip categoria={e.categoria} />
    },
    {
      clave: 'ubicacion',
      encabezado: 'Ubicación',
      claseEncabezado: 'whitespace-nowrap px-2',
      claseCelda: 'whitespace-nowrap px-2',
      render: (e) => (
        <span
          className="text-sm text-texto-suave whitespace-nowrap block"
          title={e.ubicacion || 'Almacén Central'}
        >
          {e.ubicacion || 'Almacén Central'}
        </span>
      )
    },
    {
      clave: 'estado',
      encabezado: 'Estado',
      claseEncabezado: 'whitespace-nowrap px-2',
      claseCelda: 'whitespace-nowrap px-2',
      render: (e) => <Badge estado={e.estado} />
    },
    {
      clave: 'acciones',
      encabezado: 'Acciones',
      align: 'right',
      claseEncabezado: 'w-px whitespace-nowrap text-right pl-2 pr-4',
      claseCelda: 'w-px whitespace-nowrap text-right pl-2 pr-4',
      render: (e) => (
        <AccionesFilaEquipo
          equipo={e}
          puedeEditar={puedeEditar}
          puedeCambiarEstado={puedeCambiarEstado}
          puedeVerHistorial={puedeVerHistorial}
          puedeSolicitar={puedeSolicitar}
          alEditar={(eq) => puedeEditar && setEquipoParaEditar(eq)}
          alCambiarEstado={(eq) => puedeCambiarEstado && setEquipoParaCambiarEstado(eq)}
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
        descripcion="Catálogo de activos tecnológicos, estado y disponibilidad para préstamos."
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

      {/* Chips de estado con conteo (Fidelidad ReservaUPLA / RF-05..RF-08) */}
      <PestanasConteo
        ariaLabel="Filtro rápido por estado"
        opciones={[
          { valor: '', etiqueta: 'Todos', cantidad: equipos.length },
          { valor: 'Disponible', etiqueta: 'Disponibles', cantidad: equipos.filter((e) => e.estado === 'Disponible').length },
          { valor: 'Prestado', etiqueta: 'Prestados', cantidad: equipos.filter((e) => e.estado === 'Prestado').length },
          { valor: 'Mantenimiento', etiqueta: 'Mantenimiento', cantidad: equipos.filter((e) => e.estado === 'Mantenimiento').length },
          { valor: 'Baja', etiqueta: 'Baja', cantidad: equipos.filter((e) => e.estado === 'Baja').length }
        ]}
        seleccionado={estadoFiltro}
        alCambiar={setEstadoFiltro}
      />

      {error && (
        <div className="mb-4">
          <AlertMessage variante="error" mensaje={error} />
        </div>
      )}

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

      {puedeEditar && equipoParaEditar && (
        <FormularioEquipo
          abierto={Boolean(equipoParaEditar)}
          equipo={equipoParaEditar}
          alCerrar={() => setEquipoParaEditar(null)}
          alExito={handleExitoGuardar}
        />
      )}

      {puedeCambiarEstado && equipoParaCambiarEstado && (
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
