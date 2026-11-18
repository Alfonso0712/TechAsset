import { useState, useEffect, useCallback } from 'react';
import FilterBar from '../components/ui/FilterBar';
import TableList from '../components/ui/TableList';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import ModalConfirmacion from '../components/ui/ModalConfirmacion';
import FormularioUsuario from '../components/usuarios/FormularioUsuario';
import { usuarioService } from '../services/usuarioService';
import { ROLES } from '../constants/roles';

const OPCIONES_ROL_FILTRO = [
  { valor: '', etiqueta: 'Todos los roles' },
  { valor: ROLES.ADMINISTRADOR, etiqueta: 'Administrador' },
  { valor: ROLES.RESPONSABLE_TECNOLOGIA, etiqueta: 'Responsable Tecnología' },
  { valor: ROLES.COLABORADOR, etiqueta: 'Colaborador' }
];

const OPCIONES_ACTIVO_FILTRO = [
  { valor: '', etiqueta: 'Todos los estados' },
  { valor: 'true', etiqueta: 'Activos' },
  { valor: 'false', etiqueta: 'Inactivos' }
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');
  const [activoFiltro, setActivoFiltro] = useState('');
  const [toast, setToast] = useState(null);

  // Modales
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);
  const [usuarioCambiarEstado, setUsuarioCambiarEstado] = useState(null);
  const [enProcesoEstado, setEnProcesoEstado] = useState(false);

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    try {
      const resp = await usuarioService.listar({
        texto: busqueda,
        rol: rolFiltro || undefined,
        activo: activoFiltro !== '' ? activoFiltro === 'true' : undefined,
        tamanoPagina: 50
      });
      if (resp.estado === 200 && resp.datos?.items) {
        setUsuarios(resp.datos.items);
      } else {
        setUsuarios([]);
      }
    } catch {
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  }, [busqueda, rolFiltro, activoFiltro]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const hayFiltros = Boolean(busqueda || rolFiltro || activoFiltro);
  const limpiarFiltros = () => {
    setBusqueda('');
    setRolFiltro('');
    setActivoFiltro('');
  };

  const confirmarCambioEstado = async () => {
    if (!usuarioCambiarEstado) return;
    setEnProcesoEstado(true);
    try {
      const nuevoEstado = !usuarioCambiarEstado.activo;
      const resp = await usuarioService.cambiarEstado(usuarioCambiarEstado.id, nuevoEstado);
      if (resp.estado === 200) {
        cargarUsuarios();
        setToast({
          mensaje: nuevoEstado ? 'Usuario reactivado exitosamente.' : 'Usuario deshabilitado.',
          variante: nuevoEstado ? 'exito' : 'advertencia'
        });
        setModalEstadoAbierto(false);
        setUsuarioCambiarEstado(null);
      } else {
        setToast({
          mensaje: resp.datos?.mensaje || 'No se pudo cambiar el estado del usuario (verifique si tiene préstamos activos - RN-09).',
          variante: 'peligro'
        });
      }
    } catch {
      setToast({ mensaje: 'Error al actualizar el estado del usuario.', variante: 'peligro' });
    } finally {
      setEnProcesoEstado(false);
    }
  };

  const columnas = [
    {
      clave: 'nombreCompleto',
      encabezado: 'Usuario',
      ordenable: true,
      render: (valor, fila) => (
        <div>
          <p className="font-semibold text-texto leading-snug">{valor}</p>
          <p className="text-xs text-texto-suave font-mono">{fila.correo}</p>
        </div>
      )
    },
    {
      clave: 'areaNombre',
      encabezado: 'Área',
      ordenable: true,
      render: (valor) => <span className="text-xs text-texto-suave font-medium">{valor || '-'}</span>
    },
    {
      clave: 'rol',
      encabezado: 'Rol Institucional',
      ordenable: true,
      render: (valor) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-superficie-2 text-texto border border-borde">
          {valor}
        </span>
      )
    },
    {
      clave: 'activo',
      encabezado: 'Estado',
      ordenable: true,
      render: (valor) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          valor ? 'bg-exito-fondo text-exito-texto' : 'bg-peligro-fondo text-peligro-texto'
        }`}>
          {valor ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      clave: 'acciones',
      encabezado: 'Acciones',
      claseCelda: 'text-right',
      render: (_, fila) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variante="ghost"
            tamano="sm"
            icono="Pencil"
            tooltip="Editar datos"
            onClick={() => {
              setUsuarioAEditar(fila);
              setModalFormAbierto(true);
            }}
          />
          <Button
            variante={fila.activo ? 'danger-outline' : 'ghost'}
            tamano="sm"
            icono="Power"
            tooltip={fila.activo ? 'Deshabilitar cuenta' : 'Reactivar cuenta'}
            onClick={() => {
              setUsuarioCambiarEstado(fila);
              setModalEstadoAbierto(true);
            }}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-texto">
            Gestión de Usuarios y Accesos
          </h1>
          <p className="text-xs text-texto-suave mt-1">
            Administración de cuentas corporativas, roles y asignación de áreas.
          </p>
        </div>

        <Button
          variante="primary"
          icono="Plus"
          onClick={() => {
            setUsuarioAEditar(null);
            setModalFormAbierto(true);
          }}
        >
          Nuevo Usuario
        </Button>
      </div>

      <FilterBar
        busqueda={busqueda}
        alCambiarBusqueda={setBusqueda}
        placeholderBusqueda="Buscar por nombre o correo…"
        filtros={[
          {
            id: 'rolFiltro',
            etiqueta: 'Filtrar por rol',
            valor: rolFiltro,
            opciones: OPCIONES_ROL_FILTRO,
            alCambiar: setRolFiltro
          },
          {
            id: 'activoFiltro',
            etiqueta: 'Filtrar por estado',
            valor: activoFiltro,
            opciones: OPCIONES_ACTIVO_FILTRO,
            alCambiar: setActivoFiltro
          }
        ]}
        hayFiltrosActivos={hayFiltros}
        alLimpiarFiltros={limpiarFiltros}
      />

      <TableList
        caption="Listado de usuarios registrados en el sistema"
        columnas={columnas}
        datos={usuarios}
        cargando={cargando}
        esFiltroActivo={hayFiltros}
        alLimpiarFiltros={limpiarFiltros}
        mensajeVacio="No se encontraron usuarios registrados."
      />

      {/* Modal Formulario Usuario */}
      {modalFormAbierto && (
        <FormularioUsuario
          abierto={modalFormAbierto}
          usuarioAEditar={usuarioAEditar}
          alCerrar={() => {
            setModalFormAbierto(false);
            setUsuarioAEditar(null);
          }}
          alGuardarExitoso={() => {
            cargarUsuarios();
            setToast({ mensaje: 'Usuario guardado exitosamente.', variante: 'exito' });
          }}
        />
      )}

      {/* Modal Confirmación Desactivación / Reactivación */}
      {modalEstadoAbierto && (
        <ModalConfirmacion
          abierto={modalEstadoAbierto}
          titulo={usuarioCambiarEstado?.activo ? 'Deshabilitar Usuario' : 'Reactivar Usuario'}
          mensaje={
            usuarioCambiarEstado?.activo
              ? `¿Está seguro de que desea deshabilitar la cuenta de ${usuarioCambiarEstado?.nombreCompleto}? El usuario no podrá iniciar sesión. (RN-09: No procederá si mantiene préstamos activos).`
              : `¿Desea restaurar el acceso al sistema para ${usuarioCambiarEstado?.nombreCompleto}?`
          }
          textoConfirmar={usuarioCambiarEstado?.activo ? 'Deshabilitar' : 'Reactivar'}
          variante={usuarioCambiarEstado?.activo ? 'peligro' : 'exito'}
          enProceso={enProcesoEstado}
          alConfirmar={confirmarCambioEstado}
          alCancelar={() => {
            setModalEstadoAbierto(false);
            setUsuarioCambiarEstado(null);
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
