// Administración de usuarios, roles corporativos y control de acceso · Fidelidad ReservaUPLA · WCAG 2.2 AA
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { PERMISOS } from '../constants/permisos';
import { normalizarTexto } from '../utils/normalizarTexto';
import { obtenerIniciales } from '../utils/obtenerIniciales';
import { obtenerEtiquetaRol } from '../constants/etiquetas';
import { usuarioService } from '../services/usuarioService';

import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosUsuarios from '../components/usuarios/FiltrosUsuarios';
import AccionesFilaUsuario from '../components/usuarios/AccionesFilaUsuario';
import FormularioUsuario from '../components/usuarios/FormularioUsuario';
import ModalConfirmacion from '../components/ui/ModalConfirmacion';
import TableList from '../components/ui/TableList';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';
import Toast from '../components/ui/Toast';
import AlertMessage from '../components/ui/AlertMessage';

const ESTILOS_ROL_CHIP = {
  Administrador: 'bg-primario-suave text-primario dark:text-primario-enlace border border-primario/25',
  ResponsableTecnologia: 'bg-advertencia-fondo text-advertencia-texto border border-advertencia-borde',
  Colaborador: 'bg-superficie-2 text-texto border border-borde'
};

function RolChip({ rol }) {
  const etiqueta = obtenerEtiquetaRol(rol);
  const clases = ESTILOS_ROL_CHIP[rol] || ESTILOS_ROL_CHIP.Colaborador;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${clases}`}>
      {etiqueta}
    </span>
  );
}

export default function Usuarios() {
  const { puede, usuario: usuarioActual } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [textoFiltro, setTextoFiltro] = useState('');
  const textoDebounce = useDebounce(textoFiltro);
  const [rolFiltro, setRolFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  // Modales
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState(null);
  const [usuarioParaCambiarEstado, setUsuarioParaCambiarEstado] = useState(null);
  const [enProcesoEstado, setEnProcesoEstado] = useState(false);

  const [toasts, setToasts] = useState([]);

  const puedeCrear = puede(PERMISOS.USUARIOS_CREAR);
  const puedeEditar = puede(PERMISOS.USUARIOS_EDITAR);
  const puedeCambiarEstado = puede(PERMISOS.USUARIOS_CAMBIAR_ESTADO);

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const resp = await usuarioService.listar({ tamanoPagina: 100 });
      if (resp.estado === 200 && resp.datos) {
        const items = Array.isArray(resp.datos) ? resp.datos : resp.datos.items || [];
        setUsuarios(items);
      } else {
        setError('No se pudo cargar el listado de usuarios corporativos.');
      }
    } catch {
      setError('Error de conexión al cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const agregarToast = (mensaje, tipo = 'exito') => {
    setToasts((prev) => [...prev.slice(-2), { id: Date.now(), tipo, mensaje }]);
  };

  const handleExitoGuardar = (usuarioGuardado) => {
    setModalCrearAbierto(false);
    setUsuarioParaEditar(null);
    agregarToast(`Usuario "${usuarioGuardado.nombreCompleto}" guardado correctamente.`);
    cargarUsuarios();
  };

  const manejarSolicitudCambioEstado = (u) => {
    if (u.activo) {
      setUsuarioParaCambiarEstado(u);
    } else {
      ejecutarCambioEstado(u, true);
    }
  };

  const ejecutarCambioEstado = async (u, nuevoEstado) => {
    setEnProcesoEstado(true);
    try {
      const resp = await usuarioService.cambiarEstado(u.id, nuevoEstado);
      if (resp.estado === 200) {
        agregarToast(`Usuario "${u.nombreCompleto}" ${nuevoEstado ? 'reactivado' : 'desactivado'} con éxito.`);
        setUsuarioParaCambiarEstado(null);
        cargarUsuarios();
      } else {
        agregarToast(resp.datos?.error || 'No se pudo actualizar el estado del usuario.', 'error');
      }
    } catch {
      agregarToast('Error al conectar con el servidor para cambiar estado.', 'error');
    } finally {
      setEnProcesoEstado(false);
    }
  };

  // Filtrado local ágil
  const filtrados = useMemo(() => {
    const busqueda = normalizarTexto(textoDebounce).toLowerCase();
    return usuarios.filter((u) => {
      const coincideRol = !rolFiltro || u.rol === rolFiltro;
      const coincideEst = !estadoFiltro || (estadoFiltro === 'activos' ? u.activo : !u.activo);
      const textoCompleto = `${u.nombreCompleto || ''} ${u.nombres || ''} ${u.apellidos || ''} ${u.correo || ''} ${u.areaNombre || u.area?.nombre || ''}`.toLowerCase();
      const coincideTxt = !busqueda || textoCompleto.includes(busqueda);
      return coincideRol && coincideEst && coincideTxt;
    });
  }, [usuarios, textoDebounce, rolFiltro, estadoFiltro]);

  const columnas = [
    {
      clave: 'nombreCompleto',
      encabezado: 'Usuario',
      ordenable: true,
      claseEncabezado: 'min-w-[13rem] max-w-[18rem] px-3',
      claseCelda: 'min-w-[13rem] max-w-[18rem] px-3',
      render: (u) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-full bg-primario-suave text-primario dark:text-primario-enlace font-bold text-xs flex items-center justify-center shrink-0">
            {obtenerIniciales(u.nombreCompleto) || 'U'}
          </span>
          <span className="font-semibold text-texto text-sm truncate block" title={u.nombreCompleto}>
            {u.nombreCompleto}
          </span>
        </div>
      )
    },
    {
      clave: 'correo',
      encabezado: 'Correo',
      ordenable: true,
      claseEncabezado: 'min-w-[13rem] max-w-[18rem] px-3',
      claseCelda: 'min-w-[13rem] max-w-[18rem] px-3',
      render: (u) => (
        <span className="text-xs text-texto-suave truncate block" title={u.correo}>
          {u.correo}
        </span>
      )
    },
    {
      clave: 'area',
      encabezado: 'Área',
      claseEncabezado: 'min-w-[10rem] max-w-[14rem] px-3 hidden md:table-cell',
      claseCelda: 'min-w-[10rem] max-w-[14rem] px-3 hidden md:table-cell',
      render: (u) => (
        <span className="text-xs text-texto-suave line-clamp-1" title={u.areaNombre || u.area?.nombre || 'General'}>
          {u.areaNombre || u.area?.nombre || 'General'}
        </span>
      )
    },
    {
      clave: 'rol',
      encabezado: 'Rol',
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3',
      render: (u) => <RolChip rol={u.rol} />
    },
    {
      clave: 'estado',
      encabezado: 'Estado',
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3',
      render: (u) => (
        <span
          className={`inline-flex items-center gap-1.5 h-[1.625rem] px-2.5 rounded-full text-xs font-semibold leading-none whitespace-nowrap border ${
            u.activo
              ? 'bg-exito-fondo text-exito-texto border-exito-borde'
              : 'bg-peligro-fondo text-peligro-texto border-peligro-borde'
          }`}
        >
          <Icono nombre={u.activo ? 'CheckCircle2' : 'XCircle'} className="w-3.5 h-3.5 shrink-0" />
          <span>{u.activo ? 'Activo' : 'Inactivo'}</span>
        </span>
      )
    },
    {
      clave: 'acciones',
      encabezado: 'Acciones',
      align: 'right',
      claseEncabezado: 'w-px whitespace-nowrap text-right pl-3 pr-4',
      claseCelda: 'w-px whitespace-nowrap text-right pl-3 pr-4',
      render: (u) => (
        <AccionesFilaUsuario
          usuario={u}
          puedeEditar={puedeEditar}
          puedeCambiarEstado={puedeCambiarEstado}
          esUsuarioActual={usuarioActual?.id === u.id || usuarioActual?.correo === u.correo}
          alEditar={setUsuarioParaEditar}
          alCambiarEstado={manejarSolicitudCambioEstado}
        />
      )
    }
  ];

  const hayFiltrosActivos = Boolean(textoFiltro.trim() || rolFiltro || estadoFiltro);
  const limpiarFiltros = () => {
    setTextoFiltro('');
    setRolFiltro('');
    setEstadoFiltro('');
  };

  return (
    <div className="space-y-5 max-w-[1440px] mx-auto w-full">
      <EncabezadoPagina
        titulo="Usuarios"
        descripcion="Administración de cuentas corporativas, roles y asignación de áreas."
        accionPrimaria={
          puedeCrear ? (
            <Button
              variante="primario"
              alHacerClic={() => setModalCrearAbierto(true)}
            >
              <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
              <span>Nuevo usuario</span>
            </Button>
          ) : null
        }
      />

      <FiltrosUsuarios
        texto={textoFiltro}
        rol={rolFiltro}
        estado={estadoFiltro}
        totalResultados={filtrados.length}
        alCambiarTexto={setTextoFiltro}
        alCambiarRol={setRolFiltro}
        alCambiarEstado={setEstadoFiltro}
        alLimpiar={limpiarFiltros}
      />

      {error && (
        <div className="mb-4">
          <AlertMessage variante="error" mensaje={error} />
        </div>
      )}

      <TableList
        caption="Directorio corporativo de cuentas de usuario y permisos"
        columnas={columnas}
        datos={filtrados}
        cargando={cargando}
        esFiltroActivo={hayFiltrosActivos}
        alLimpiarFiltros={limpiarFiltros}
        mensajeVacio="No hay usuarios registrados aún"
        descripcionVacia="Puede registrar una nueva cuenta corporativa con el botón superior."
        accionVacia={
          puedeCrear ? (
            <Button variante="primario" alHacerClic={() => setModalCrearAbierto(true)}>
              <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
              <span>Nuevo usuario</span>
            </Button>
          ) : null
        }
      />

      {/* Modal Crear */}
      {modalCrearAbierto && (
        <FormularioUsuario
          abierto={modalCrearAbierto}
          alCerrar={() => setModalCrearAbierto(false)}
          alExito={handleExitoGuardar}
        />
      )}

      {/* Modal Editar */}
      {usuarioParaEditar && (
        <FormularioUsuario
          abierto={Boolean(usuarioParaEditar)}
          usuarioAEditar={usuarioParaEditar}
          alCerrar={() => setUsuarioParaEditar(null)}
          alExito={handleExitoGuardar}
        />
      )}

      {/* Modal Desactivar */}
      {usuarioParaCambiarEstado && (
        <ModalConfirmacion
          abierto={Boolean(usuarioParaCambiarEstado)}
          titulo="Desactivar cuenta corporativa"
          textoConfirmar="Desactivar usuario"
          variante="peligro"
          icono="Power"
          enProceso={enProcesoEstado}
          alConfirmar={() => ejecutarCambioEstado(usuarioParaCambiarEstado, false)}
          alCancelar={() => setUsuarioParaCambiarEstado(null)}
        >
          <div className="space-y-2 text-xs">
            <p className="text-sm font-semibold text-texto">
              ¿Está seguro de que desea desactivar a {usuarioParaCambiarEstado.nombreCompleto}?
            </p>
            <p className="text-texto-suave">
              El usuario perderá inmediatamente el acceso a la plataforma corporativa. Podrá reactivarlo en cualquier momento desde esta misma vista.
            </p>
          </div>
        </ModalConfirmacion>
      )}

      <Toast toasts={toasts} alCerrar={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
