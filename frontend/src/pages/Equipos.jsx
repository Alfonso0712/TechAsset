import { useState, useEffect, useCallback } from 'react';
import FilterBar from '../components/ui/FilterBar';
import TableList from '../components/ui/TableList';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import FormularioEquipo from '../components/equipos/FormularioEquipo';
import ModalCambiarEstadoEquipo from '../components/equipos/ModalCambiarEstadoEquipo';
import { equipoService } from '../services/equipoService';
import { useAuth } from '../hooks/useAuth';
import { PERMISOS } from '../constants/permisos';
import { CATEGORIAS_EQUIPO, ESTADOS_EQUIPO } from '../constants/estados';

const OPCIONES_CATEGORIA_FILTRO = [
  { valor: '', etiqueta: 'Todas las categorías' },
  ...Object.entries(CATEGORIAS_EQUIPO).map(([_, v]) => ({ valor: v, etiqueta: v }))
];

const OPCIONES_ESTADO_FILTRO = [
  { valor: '', etiqueta: 'Todos los estados' },
  ...Object.entries(ESTADOS_EQUIPO).map(([_, v]) => ({ valor: v, etiqueta: v }))
];

export default function Equipos() {
  const { puede } = useAuth();
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [toast, setToast] = useState(null);

  // Modales
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [equipoEditar, setEquipoEditar] = useState(null);
  const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);
  const [equipoCambiarEstado, setEquipoCambiarEstado] = useState(null);

  const cargarEquipos = useCallback(async () => {
    setCargando(true);
    try {
      const resp = await equipoService.listar({
        texto: busqueda,
        categoria: categoria || undefined,
        estado: estado || undefined,
        tamanoPagina: 50
      });
      if (resp.estado === 200 && resp.datos?.items) {
        setEquipos(resp.datos.items);
      } else {
        setEquipos([]);
      }
    } catch {
      setEquipos([]);
    } finally {
      setCargando(false);
    }
  }, [busqueda, categoria, estado]);

  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  const puedeCrear = puede(PERMISOS.EQUIPOS_CREAR);
  const puedeEditar = puede(PERMISOS.EQUIPOS_EDITAR);
  const puedeCambiarEstado = puede(PERMISOS.EQUIPOS_CAMBIAR_ESTADO);

  const hayFiltros = Boolean(busqueda || categoria || estado);
  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoria('');
    setEstado('');
  };

  const columnas = [
    {
      clave: 'codigoPatrimonial',
      encabezado: 'Cód. Patrimonial',
      ordenable: true,
      render: (valor) => <span className="font-mono font-bold text-primario">{valor}</span>
    },
    {
      clave: 'nombre',
      encabezado: 'Equipo',
      ordenable: true,
      render: (valor, fila) => (
        <div>
          <p className="font-semibold text-texto leading-snug">{valor}</p>
          <p className="text-xs text-texto-suave">{fila.marca}</p>
        </div>
      )
    },
    {
      clave: 'categoria',
      encabezado: 'Categoría',
      ordenable: true,
      render: (valor) => <span className="text-xs text-texto-suave font-medium">{valor}</span>
    },
    {
      clave: 'estado',
      encabezado: 'Estado',
      ordenable: true,
      render: (valor) => <Badge estado={valor} />
    },
    {
      clave: 'ubicacion',
      encabezado: 'Ubicación',
      render: (valor) => <span className="text-xs text-texto-suave">{valor || '-'}</span>
    },
    {
      clave: 'acciones',
      encabezado: 'Acciones',
      claseCelda: 'text-right',
      render: (_, fila) => (
        <div className="flex items-center justify-end gap-1.5">
          {puedeEditar && fila.estado !== ESTADOS_EQUIPO.BAJA && (
            <Button
              variante="ghost"
              tamano="sm"
              icono="Pencil"
              tooltip="Editar datos del equipo"
              onClick={() => {
                setEquipoEditar(fila);
                setModalFormAbierto(true);
              }}
            />
          )}
          {puedeCambiarEstado && fila.estado !== ESTADOS_EQUIPO.BAJA && (
            <Button
              variante="ghost"
              tamano="sm"
              icono="Power"
              tooltip="Cambiar estado operativo"
              onClick={() => {
                setEquipoCambiarEstado(fila);
                setModalEstadoAbierto(true);
              }}
            />
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-texto">
            Inventario de Equipos Tecnológicos
          </h1>
          <p className="text-xs text-texto-suave mt-1">
            Control de activos, estado operativo y disponibilidad para préstamos corporativos.
          </p>
        </div>

        {puedeCrear && (
          <Button
            variante="primary"
            icono="Plus"
            onClick={() => {
              setEquipoEditar(null);
              setModalFormAbierto(true);
            }}
          >
            Nuevo Equipo
          </Button>
        )}
      </div>

      {/* Barra de Filtros Genérica */}
      <FilterBar
        busqueda={busqueda}
        alCambiarBusqueda={setBusqueda}
        placeholderBusqueda="Buscar por código, nombre o marca…"
        filtros={[
          {
            id: 'categoria',
            etiqueta: 'Filtrar por categoría',
            valor: categoria,
            opciones: OPCIONES_CATEGORIA_FILTRO,
            alCambiar: setCategoria
          },
          {
            id: 'estado',
            etiqueta: 'Filtrar por estado',
            valor: estado,
            opciones: OPCIONES_ESTADO_FILTRO,
            alCambiar: setEstado
          }
        ]}
        hayFiltrosActivos={hayFiltros}
        alLimpiarFiltros={limpiarFiltros}
      />

      {/* Tabla de Equipos */}
      <TableList
        caption="Listado de equipos tecnológicos registrados en inventario"
        columnas={columnas}
        datos={equipos}
        cargando={cargando}
        esFiltroActivo={hayFiltros}
        alLimpiarFiltros={limpiarFiltros}
        mensajeVacio="No se encontraron equipos registrados."
      />

      {/* Modal Crear / Editar */}
      {modalFormAbierto && (
        <FormularioEquipo
          abierto={modalFormAbierto}
          equipoAEditar={equipoEditar}
          alCerrar={() => {
            setModalFormAbierto(false);
            setEquipoEditar(null);
          }}
          alGuardarExitoso={() => {
            cargarEquipos();
            setToast({ mensaje: 'Equipo tecnológico guardado correctamente.', variante: 'exito' });
          }}
        />
      )}

      {/* Modal Cambiar Estado */}
      {modalEstadoAbierto && (
        <ModalCambiarEstadoEquipo
          abierto={modalEstadoAbierto}
          equipo={equipoCambiarEstado}
          alCerrar={() => {
            setModalEstadoAbierto(false);
            setEquipoCambiarEstado(null);
          }}
          alExito={() => {
            cargarEquipos();
            setToast({ mensaje: 'Estado operativo del equipo actualizado.', variante: 'exito' });
          }}
        />
      )}

      {/* Notificación Toast */}
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
