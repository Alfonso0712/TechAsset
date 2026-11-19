// Pestaña 4 de Reportes: Auditoría y Movimientos (RF-17) · TechAsset
import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { reporteService } from '../../services/reporteService';
import { exportarCsv } from '../../utils/exportarCsv';
import { fechaHoyLima } from '../../utils/fechas';
import { TIPOS_MOVIMIENTO } from '../../constants/estados';
import { obtenerEtiquetaTipoMovimiento } from '../../constants/etiquetas';
import { OPCIONES_TIPO_MOVIMIENTO } from '../../utils/reportes';
import TableList from '../ui/TableList';
import Badge from '../ui/Badge';
import CardIndicador from '../ui/CardIndicador';
import SelectInput from '../formulario/SelectInput';
import Button from '../ui/Button';
import Icono from '../ui/Icono';

function desglosarFechaHora(cadena) {
  if (!cadena) return { fecha: '-', hora: '' };
  try {
    const d = new Date(cadena);
    if (isNaN(d.getTime())) return { fecha: cadena, hora: '' };
    const fecha = d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const hora = d.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { fecha, hora };
  } catch {
    return { fecha: cadena, hora: '' };
  }
}

function obtenerClaseTipoMovimiento(tipo) {
  switch (tipo) {
    case TIPOS_MOVIMIENTO.REGISTRO:
    case 'Registro':
      return 'bg-exito-fondo text-exito-texto border-exito-borde';
    case TIPOS_MOVIMIENTO.PRESTAMO_APROBADO:
    case TIPOS_MOVIMIENTO.PRESTAMO_SOLICITADO:
    case TIPOS_MOVIMIENTO.PRESTAMO_RECHAZADO:
    case 'PrestamoAprobado':
    case 'PrestamoSolicitado':
    case 'PrestamoRechazado':
      return 'bg-info-fondo text-info-texto border-info-borde';
    case TIPOS_MOVIMIENTO.DEVOLUCION:
    case 'Devolucion':
      return 'bg-advertencia-fondo text-advertencia-texto border-advertencia-borde';
    case TIPOS_MOVIMIENTO.EDICION:
    case 'Edicion':
    default:
      return 'bg-superficie-2 text-texto border-borde';
  }
}

function limpiarDetalleTecnico(detalle, codigoEquipo) {
  if (!detalle) return 'Sin observaciones adicionales';
  let texto = detalle;
  if (codigoEquipo) {
    const patron1 = new RegExp(`\\s+del\\s+equipo\\s+${codigoEquipo}`, 'gi');
    texto = texto.replace(patron1, '');
    const patron2 = new RegExp(`\\s+${codigoEquipo}`, 'gi');
    texto = texto.replace(patron2, '');
  }
  texto = texto.replace(/\s+del\s+equipo\s+[A-Z0-9-]+/gi, '');
  texto = texto.replace(/\s+\./g, '.').replace(/\.{2,}/g, '.').trim();
  return texto || detalle;
}

export default function TabMovimientos({ equipoIdInicial, alRegistrarExportar }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cargando, setCargando] = useState(true);
  const [movimientos, setMovimientos] = useState([]);
  const [tipoMovimiento, setTipoMovimiento] = useState('');
  const [busquedaMovimiento, setBusquedaMovimiento] = useState('');
  const [equipoIdFiltro, setEquipoIdFiltro] = useState(equipoIdInicial || '');

  useEffect(() => {
    if (equipoIdInicial !== undefined) {
      setEquipoIdFiltro(equipoIdInicial || '');
    }
  }, [equipoIdInicial]);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const resp = await reporteService.obtenerMovimientos({
        tipo: tipoMovimiento || undefined,
        equipoId: equipoIdFiltro || undefined,
        tamanoPagina: 100
      });
      const items = resp.estado === 200 && resp.datos?.items
        ? resp.datos.items
        : (Array.isArray(resp.datos) ? resp.datos : []);
      setMovimientos(items);
    } catch {
      // Ignorar fallas transitorias de red
    } finally {
      setCargando(false);
    }
  }, [tipoMovimiento, equipoIdFiltro]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((m) => {
      if (tipoMovimiento && m.tipo !== tipoMovimiento) return false;
      if (equipoIdFiltro && (m.equipoId !== equipoIdFiltro && m.ide_Movimiento !== equipoIdFiltro)) return false;
      if (busquedaMovimiento) {
        const q = busquedaMovimiento.toLowerCase();
        const eqNom = (m.equipoNombre || '').toLowerCase();
        const eqCod = (m.equipoCodigo || '').toLowerCase();
        const usrNom = (m.usuarioNombre || '').toLowerCase();
        const det = (m.detalle || '').toLowerCase();
        if (!eqNom.includes(q) && !eqCod.includes(q) && !usrNom.includes(q) && !det.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [movimientos, tipoMovimiento, equipoIdFiltro, busquedaMovimiento]);

  const columnasMovimientos = useMemo(() => [
    {
      clave: 'fechaHora',
      encabezado: 'Fecha y hora (Lima)',
      ordenable: true,
      claseEncabezado: 'whitespace-nowrap pl-4 pr-3',
      claseCelda: 'whitespace-nowrap pl-4 pr-3 align-top py-3.5',
      render: (m) => {
        const { fecha, hora } = desglosarFechaHora(m.fechaHora || m.fechaMovimiento);
        return (
          <div className="leading-snug">
            <span className="block text-texto text-xs font-medium">{fecha}</span>
            {hora && <span className="block text-[11px] text-texto-suave mt-0.5">{hora}</span>}
          </div>
        );
      }
    },
    {
      clave: 'tipo',
      encabezado: 'Tipo de movimiento',
      claseEncabezado: 'whitespace-nowrap px-3',
      claseCelda: 'whitespace-nowrap px-3 align-top py-3.5',
      render: (m) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap border ${obtenerClaseTipoMovimiento(m.tipo)}`}>
          {obtenerEtiquetaTipoMovimiento(m.tipo)}
        </span>
      )
    },
    {
      clave: 'equipo',
      encabezado: 'Equipo',
      claseEncabezado: 'whitespace-nowrap px-3 min-w-[12rem] max-w-[16rem]',
      claseCelda: 'px-3 min-w-[12rem] max-w-[16rem] align-top py-3.5',
      render: (m) => (
        <div className="leading-snug">
          <span className="font-semibold text-texto block text-sm" title={m.equipoNombre}>
            {m.equipoNombre || 'Equipo tecnológico'}
          </span>
          <span className="font-mono text-xs text-texto-suave block mt-0.5" title={m.equipoCodigo}>
            {m.equipoCodigo || ''}
          </span>
        </div>
      )
    },
    {
      clave: 'transicion',
      encabezado: 'Transición de estado',
      claseEncabezado: 'whitespace-nowrap px-3 min-w-[13rem]',
      claseCelda: 'whitespace-nowrap px-3 align-top py-3.5',
      render: (m) => {
        const anterior = (m.estadoAnterior || '').trim();
        const nuevo = (m.estadoNuevo || '').trim();

        if (!anterior || anterior === '-') {
          return (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center h-[1.625rem] px-2.5 rounded-full text-xs font-semibold leading-none whitespace-nowrap bg-superficie-2 text-texto-suave border border-borde">
                Registro inicial
              </span>
              <Icono nombre="ArrowRight" className="w-3.5 h-3.5 text-texto-suave shrink-0" />
              <Badge estado={nuevo || 'Disponible'} />
            </div>
          );
        }

        if (anterior === nuevo) {
          return (
            <span className="text-xs text-texto-suave italic whitespace-nowrap">
              Sin cambio de estado
            </span>
          );
        }

        return (
          <div className="flex items-center gap-1.5">
            <Badge estado={anterior} discreto />
            <Icono nombre="ArrowRight" className="w-3.5 h-3.5 text-texto-suave shrink-0" />
            <Badge estado={nuevo} />
          </div>
        );
      }
    },
    {
      clave: 'usuario',
      encabezado: 'Responsable',
      claseEncabezado: 'whitespace-nowrap px-3 min-w-[8rem]',
      claseCelda: 'whitespace-nowrap px-3 align-top py-3.5',
      render: (m) => (
        <span className="text-xs font-semibold text-texto block" title={m.usuarioNombre}>
          {m.usuarioNombre || 'Sistema'}
        </span>
      )
    },
    {
      clave: 'detalle',
      encabezado: 'Detalle técnico',
      claseEncabezado: 'w-full min-w-[14rem] pl-3 pr-4',
      claseCelda: 'w-full min-w-[14rem] pl-3 pr-4 align-top py-3.5',
      render: (m) => (
        <p className="text-xs text-texto-suave leading-relaxed m-0 break-words" title={m.detalle}>
          {limpiarDetalleTecnico(m.detalle, m.equipoCodigo)}
        </p>
      )
    }
  ], []);

  const limpiarFiltroEquipo = useCallback(() => {
    setEquipoIdFiltro('');
    const params = new URLSearchParams(searchParams);
    params.delete('equipoId');
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const limpiarTodosFiltros = useCallback(() => {
    setTipoMovimiento('');
    setBusquedaMovimiento('');
    limpiarFiltroEquipo();
  }, [limpiarFiltroEquipo]);

  const exportarCsvTab = useCallback(() => {
    const headers = ['FechaHora', 'Tipo', 'Equipo', 'Codigo', 'EstadoAnterior', 'EstadoNuevo', 'Responsable', 'Detalle'];
    const rows = movimientosFiltrados.map((m) => [
      m.fechaHora || m.fechaMovimiento || '',
      obtenerEtiquetaTipoMovimiento(m.tipo),
      m.equipoNombre || '',
      m.equipoCodigo || '',
      m.estadoAnterior || '',
      m.estadoNuevo || '',
      m.usuarioNombre || '',
      m.detalle || ''
    ]);
    exportarCsv(`auditoria_movimientos_${fechaHoyLima()}`, headers, rows);
  }, [movimientosFiltrados]);

  useEffect(() => {
    if (alRegistrarExportar) {
      alRegistrarExportar(exportarCsvTab);
    }
  }, [alRegistrarExportar, exportarCsvTab]);

  const esFiltroActivo = Boolean(tipoMovimiento) || Boolean(busquedaMovimiento) || Boolean(equipoIdFiltro);

  return (
    <div className="space-y-4">
      {/* Mini Indicadores */}
      <section aria-label="Indicadores de auditoría y movimientos" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <CardIndicador
          compacto
          etiqueta="Total movimientos"
          valor={movimientos.length}
          icono="History"
          tono="primario"
        />
        <CardIndicador
          compacto
          etiqueta="Altas y registros"
          valor={movimientos.filter((m) => m.tipo === TIPOS_MOVIMIENTO.REGISTRO || m.tipo === 'Registro').length}
          icono="Plus"
          tono="exito"
        />
        <CardIndicador
          compacto
          etiqueta="Préstamos activos"
          valor={movimientos.filter((m) => m.tipo === TIPOS_MOVIMIENTO.PRESTAMO_APROBADO || m.tipo === 'PrestamoAprobado').length}
          icono="UserCheck"
          tono="info"
        />
        <CardIndicador
          compacto
          etiqueta="Devoluciones"
          valor={movimientos.filter((m) => m.tipo === TIPOS_MOVIMIENTO.DEVOLUCION || m.tipo === 'Devolucion').length}
          icono="RotateCcw"
          tono="advertencia"
        />
        <CardIndicador
          compacto
          etiqueta="Ediciones"
          valor={movimientos.filter((m) => m.tipo === TIPOS_MOVIMIENTO.EDICION || m.tipo === 'Edicion').length}
          icono="Pencil"
          tono="primario"
        />
      </section>

      {/* Filtros de movimientos */}
      <section aria-label="Filtro de movimientos" className="p-2 sm:p-2.5 rounded-tarjeta border border-borde bg-superficie shadow-xs">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3">
          <div className="w-full sm:w-64 shrink-0">
            <SelectInput
              id="filtro-tipo-movimiento"
              nombre="filtro-tipo-movimiento"
              etiqueta=""
              aria-label="Tipo de movimiento"
              obligatorio={false}
              tamano="sm"
              valor={tipoMovimiento}
              alCambiar={(e) => setTipoMovimiento(e.target.value)}
              opciones={OPCIONES_TIPO_MOVIMIENTO.filter((op) => Boolean(op.valor))}
              placeholder="Todos los tipos"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Icono nombre="Search" className="w-4 h-4 text-texto-suave absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={busquedaMovimiento}
                onChange={(e) => setBusquedaMovimiento(e.target.value)}
                placeholder="Buscar por equipo, código o usuario..."
                className="w-full h-9 pl-9 pr-3 rounded-control border border-borde bg-superficie text-texto text-xs outline-none focus:ring-2 focus:ring-anillo-foco"
              />
            </div>
          </div>

          {equipoIdFiltro && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primario-suave text-primario border border-borde shrink-0">
              <span>Filtrando por equipo</span>
              <button
                type="button"
                onClick={limpiarFiltroEquipo}
                className="hover:opacity-75 cursor-pointer"
                aria-label="Quitar filtro de equipo"
              >
                <Icono nombre="X" className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <span role="status" aria-live="polite" className="text-xs font-semibold text-texto-suave cifra-tabular">
              {movimientosFiltrados.length === 1 ? '1 movimiento' : `${movimientosFiltrados.length} movimientos`}
            </span>
            {esFiltroActivo && (
              <Button
                variante="ghost"
                tamano="sm"
                aria-label="Limpiar filtros"
                alHacerClic={limpiarTodosFiltros}
              >
                <Icono nombre="RotateCcw" className="w-3.5 h-3.5 mr-1" />
                <span>Limpiar</span>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Tabla de movimientos */}
      <TableList
        caption="Historial inmutable de auditoría y movimientos de inventario"
        columnas={columnasMovimientos}
        datos={movimientosFiltrados}
        cargando={cargando}
        esFiltroActivo={esFiltroActivo}
        alLimpiarFiltros={limpiarTodosFiltros}
        mensajeVacio="No se registraron movimientos en el historial de auditoría para los criterios seleccionados."
      />
    </div>
  );
}

TabMovimientos.propTypes = {
  equipoIdInicial: PropTypes.string,
  alRegistrarExportar: PropTypes.func
};
