import { useState, useEffect, useCallback } from 'react';
import TableList from '../components/ui/TableList';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import FormularioSolicitarPrestamo from '../components/prestamos/FormularioSolicitarPrestamo';
import FormularioPrestamoDirecto from '../components/prestamos/FormularioPrestamoDirecto';
import ModalAprobarPrestamo from '../components/prestamos/ModalAprobarPrestamo';
import ModalRechazarPrestamo from '../components/prestamos/ModalRechazarPrestamo';
import ModalDevolverPrestamo from '../components/prestamos/ModalDevolverPrestamo';
import { prestamoService } from '../services/prestamoService';
import { useAuth } from '../hooks/useAuth';
import { PERMISOS } from '../constants/permisos';
import { ROLES } from '../constants/roles';
import { ESTADOS_PRESTAMO } from '../constants/estados';
import { formatearFecha } from '../utils/formatearFecha';

const PESTANAS = [
  { clave: '', etiqueta: 'Todos' },
  { clave: ESTADOS_PRESTAMO.PENDIENTE, etiqueta: 'Pendientes' },
  { clave: ESTADOS_PRESTAMO.ACTIVO, etiqueta: 'Activos' },
  { clave: ESTADOS_PRESTAMO.DEVUELTO, etiqueta: 'Devueltos' },
  { clave: ESTADOS_PRESTAMO.RECHAZADO, etiqueta: 'Rechazados' }
];

export default function Prestamos() {
  const { usuario, puede } = useAuth();
  const [prestamos, setPrestamos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pestanaActiva, setPestanaActiva] = useState('');
  const [toast, setToast] = useState(null);

  // Modales
  const [modalSolicitarAbierto, setModalSolicitarAbierto] = useState(false);
  const [modalDirectoAbierto, setModalDirectoAbierto] = useState(false);
  const [modalAprobarAbierto, setModalAprobarAbierto] = useState(false);
  const [modalRechazarAbierto, setModalRechazarAbierto] = useState(false);
  const [modalDevolverAbierto, setModalDevolverAbierto] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

  const cargarPrestamos = useCallback(async () => {
    setCargando(true);
    try {
      const resp = await prestamoService.listar({
        estado: pestanaActiva || undefined,
        tamanoPagina: 50
      });
      if (resp.estado === 200 && resp.datos?.items) {
        setPrestamos(resp.datos.items);
      } else {
        setPrestamos([]);
      }
    } catch {
      setPrestamos([]);
    } finally {
      setCargando(false);
    }
  }, [pestanaActiva]);

  useEffect(() => {
    cargarPrestamos();
  }, [cargarPrestamos]);

  const esColaborador = usuario?.rol === ROLES.COLABORADOR;
  const puedeSolicitar = puede(PERMISOS.PRESTAMOS_SOLICITAR);
  const puedeAprobarRechazar = puede(PERMISOS.PRESTAMOS_APROBAR_RECHAZAR);
  const puedeDevolver = puede(PERMISOS.PRESTAMOS_DEVOLVER);

  const columnas = [
    {
      clave: 'equipoCodigo',
      encabezado: 'Equipo',
      ordenable: true,
      render: (valor, fila) => (
        <div>
          <span className="font-mono font-bold text-primario">{valor}</span>
          <p className="text-xs text-texto font-medium">{fila.equipoNombre}</p>
        </div>
      )
    },
    ...(!esColaborador ? [
      {
        clave: 'solicitanteNombre',
        encabezado: 'Solicitante',
        ordenable: true,
        render: (valor, fila) => (
          <div>
            <p className="font-semibold text-texto leading-snug">{valor}</p>
            <p className="text-xs text-texto-suave">{fila.solicitanteArea || fila.solicitanteCorreo}</p>
          </div>
        )
      }
    ] : []),
    {
      clave: 'fechaPrestamo',
      encabezado: 'Período',
      ordenable: true,
      render: (_, fila) => (
        <div className="text-xs">
          <p className="text-texto font-medium">{formatearFecha(fila.fechaPrestamo)}</p>
          <p className="text-texto-suave">hasta {formatearFecha(fila.fechaDevolucionEstimada)}</p>
        </div>
      )
    },
    {
      clave: 'estado',
      encabezado: 'Estado',
      ordenable: true,
      render: (valor) => <Badge estado={valor} />
    },
    {
      clave: 'motivo',
      encabezado: 'Motivo / Detalle',
      render: (valor, fila) => (
        <div className="max-w-xs text-xs">
          <p className="text-texto line-clamp-1">{valor}</p>
          {fila.observacion && (
            <p className="text-emerald-700 dark:text-emerald-400 italic line-clamp-1 mt-0.5">
              Obs: {fila.observacion}
            </p>
          )}
        </div>
      )
    },
    {
      clave: 'acciones',
      encabezado: 'Acciones',
      claseCelda: 'text-right',
      render: (_, fila) => (
        <div className="flex items-center justify-end gap-1.5">
          {puedeAprobarRechazar && fila.estado === ESTADOS_PRESTAMO.PENDIENTE && (
            <>
              <Button
                variante="success"
                tamano="sm"
                icono="Check"
                tooltip="Aprobar solicitud"
                onClick={() => {
                  setPrestamoSeleccionado(fila);
                  setModalAprobarAbierto(true);
                }}
              />
              <Button
                variante="danger"
                tamano="sm"
                icono="X"
                tooltip="Rechazar solicitud"
                onClick={() => {
                  setPrestamoSeleccionado(fila);
                  setModalRechazarAbierto(true);
                }}
              />
            </>
          )}

          {puedeDevolver && fila.estado === ESTADOS_PRESTAMO.ACTIVO && (
            <Button
              variante="primary"
              tamano="sm"
              icono="RotateCcw"
              tooltip="Registrar devolución de equipo (RN-10)"
              onClick={() => {
                setPrestamoSeleccionado(fila);
                setModalDevolverAbierto(true);
              }}
            >
              Devolver
            </Button>
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
            Gestión de Préstamos de Equipos
          </h1>
          <p className="text-xs text-texto-suave mt-1">
            {esColaborador
              ? 'Mis solicitudes y equipos tecnológicos asignados en préstamo activo.'
              : 'Control institucional de solicitudes, entregas en custodia y devoluciones técnicas.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {puedeAprobarRechazar && (
            <Button
              variante="secondary"
              icono="Plus"
              onClick={() => setModalDirectoAbierto(true)}
            >
              Préstamo Directo
            </Button>
          )}
          {puedeSolicitar && (
            <Button
              variante="primary"
              icono="Plus"
              onClick={() => setModalSolicitarAbierto(true)}
            >
              Solicitar Préstamo
            </Button>
          )}
        </div>
      </div>

      {/* Pestañas de Estado */}
      <div className="flex items-center gap-2 border-b border-borde overflow-x-auto pb-1">
        {PESTANAS.map((pestana) => (
          <button
            key={pestana.clave}
            type="button"
            onClick={() => setPestanaActiva(pestana.clave)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              pestanaActiva === pestana.clave
                ? 'bg-primario text-sobre-primario shadow-xs'
                : 'text-texto-suave hover:text-texto hover:bg-superficie-2'
            }`}
          >
            {pestana.etiqueta}
          </button>
        ))}
      </div>

      {/* Tabla de Préstamos */}
      <TableList
        caption="Listado de préstamos y solicitudes de equipos"
        columnas={columnas}
        datos={prestamos}
        cargando={cargando}
        mensajeVacio="No se encontraron registros de préstamos."
      />

      {/* Modales */}
      {modalSolicitarAbierto && (
        <FormularioSolicitarPrestamo
          abierto={modalSolicitarAbierto}
          alCerrar={() => setModalSolicitarAbierto(false)}
          alGuardarExitoso={() => {
            cargarPrestamos();
            setToast({ mensaje: 'Solicitud de préstamo enviada exitosamente.', variante: 'exito' });
          }}
        />
      )}

      {modalDirectoAbierto && (
        <FormularioPrestamoDirecto
          abierto={modalDirectoAbierto}
          alCerrar={() => setModalDirectoAbierto(false)}
          alGuardarExitoso={() => {
            cargarPrestamos();
            setToast({ mensaje: 'Préstamo directo otorgado y equipo marcado como Prestado.', variante: 'exito' });
          }}
        />
      )}

      {modalAprobarAbierto && (
        <ModalAprobarPrestamo
          abierto={modalAprobarAbierto}
          prestamo={prestamoSeleccionado}
          alCerrar={() => {
            setModalAprobarAbierto(false);
            setPrestamoSeleccionado(null);
          }}
          alExito={() => {
            cargarPrestamos();
            setToast({ mensaje: 'Préstamo aprobado y equipo entregado.', variante: 'exito' });
          }}
        />
      )}

      {modalRechazarAbierto && (
        <ModalRechazarPrestamo
          abierto={modalRechazarAbierto}
          prestamo={prestamoSeleccionado}
          alCerrar={() => {
            setModalRechazarAbierto(false);
            setPrestamoSeleccionado(null);
          }}
          alExito={() => {
            cargarPrestamos();
            setToast({ mensaje: 'Solicitud de préstamo rechazada.', variante: 'peligro' });
          }}
        />
      )}

      {modalDevolverAbierto && (
        <ModalDevolverPrestamo
          abierto={modalDevolverAbierto}
          prestamo={prestamoSeleccionado}
          alCerrar={() => {
            setModalDevolverAbierto(false);
            setPrestamoSeleccionado(null);
          }}
          alExito={() => {
            cargarPrestamos();
            setToast({ mensaje: 'Devolución registrada y equipo marcado como Disponible.', variante: 'exito' });
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
