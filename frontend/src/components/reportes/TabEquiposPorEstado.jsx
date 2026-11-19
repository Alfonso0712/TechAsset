// Pestaña 1 de Reportes: Equipos por estado · TechAsset
import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { reporteService } from '../../services/reporteService';
import { equipoService } from '../../services/equipoService';
import { prestamoService } from '../../services/prestamoService';
import { exportarCsv } from '../../utils/exportarCsv';
import { fechaHoyLima, esPrestamoVencido } from '../../utils/fechas';
import { obtenerEtiquetaCategoria } from '../../constants/etiquetas';
import TableList from '../ui/TableList';
import Badge from '../ui/Badge';
import CardIndicador from '../ui/CardIndicador';
import PestanasConteo from '../ui/PestanasConteo';

export default function TabEquiposPorEstado({ alRegistrarExportar }) {
  const [cargando, setCargando] = useState(true);
  const [porEstado, setPorEstado] = useState([]);
  const [filtroChipEstado, setFiltroChipEstado] = useState('Todos');
  const [equiposDetalle, setEquiposDetalle] = useState([]);
  const [prestamosActivos, setPrestamosActivos] = useState([]);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [respEstado, respEquipos, respPrestamos] = await Promise.allSettled([
        reporteService.obtenerEquiposPorEstado(),
        equipoService.listar({
          tamanoPagina: 100,
          estado: filtroChipEstado !== 'Todos' ? filtroChipEstado : undefined
        }),
        prestamoService.listar({ estado: 'Activo', tamanoPagina: 50 })
      ]);

      if (respEstado.status === 'fulfilled' && respEstado.value.estado === 200) {
        setPorEstado(Array.isArray(respEstado.value.datos) ? respEstado.value.datos : []);
      }
      if (respEquipos.status === 'fulfilled' && respEquipos.value.estado === 200) {
        const items = respEquipos.value.datos?.items || (Array.isArray(respEquipos.value.datos) ? respEquipos.value.datos : []);
        setEquiposDetalle(items);
      }
      if (respPrestamos.status === 'fulfilled' && respPrestamos.value.estado === 200) {
        const pList = respPrestamos.value.datos?.items || (Array.isArray(respPrestamos.value.datos) ? respPrestamos.value.datos : []);
        setPrestamosActivos(pList);
      }
    } catch {
      // Ignorar fallas transitorias de red
    } finally {
      setCargando(false);
    }
  }, [filtroChipEstado]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const totalEquipos = useMemo(() => {
    return porEstado.reduce((acc, curr) => acc + (curr.cantidad || 0), 0);
  }, [porEstado]);

  const mapaEstado = useMemo(() => {
    const mapa = { Disponible: 0, Prestado: 0, Mantenimiento: 0, Baja: 0 };
    porEstado.forEach((item) => {
      const est = item.estado || item.estadoNombre;
      if (mapa[est] !== undefined) mapa[est] = item.cantidad || 0;
    });
    return mapa;
  }, [porEstado]);

  const itemsDona = [
    { clave: 'Disponible', label: 'Disponible', cant: mapaEstado.Disponible, color: 'var(--grafico-disponible)' },
    { clave: 'Prestado', label: 'Prestado', cant: mapaEstado.Prestado, color: 'var(--grafico-prestado)' },
    { clave: 'Mantenimiento', label: 'En mantenimiento', cant: mapaEstado.Mantenimiento, color: 'var(--grafico-mantenimiento)' },
    { clave: 'Baja', label: 'Baja técnica', cant: mapaEstado.Baja, color: 'var(--grafico-baja)' }
  ];

  const mapaPrestamosPorEquipo = useMemo(() => {
    const mapa = {};
    prestamosActivos.forEach((p) => {
      const eqId = p.equipoId || p.equipo?.id;
      if (eqId) mapa[eqId] = p;
    });
    return mapa;
  }, [prestamosActivos]);

  const esFiltroPrestados = filtroChipEstado === 'Prestado';

  const columnasEquipos = useMemo(() => {
    if (esFiltroPrestados) {
      return [
        {
          clave: 'codigoPatrimonial',
          encabezado: 'Cód. patrimonial',
          claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
          claseCelda: 'w-[1%] whitespace-nowrap px-3 font-mono font-bold text-xs',
          render: (e) => e.codigoPatrimonial
        },
        {
          clave: 'equipo',
          encabezado: 'Equipo tecnológico',
          claseEncabezado: 'min-w-[13rem] px-3',
          claseCelda: 'min-w-[13rem] px-3',
          render: (e) => (
            <div>
              <span className="font-semibold text-texto block">{e.nombre}</span>
              <span className="text-xs text-texto-suave block">{e.marca || 'Marca corporativa'}</span>
            </div>
          )
        },
        {
          clave: 'categoria',
          encabezado: 'Categoría',
          claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
          claseCelda: 'w-[1%] whitespace-nowrap px-3',
          render: (e) => <span className="text-xs text-texto-suave">{obtenerEtiquetaCategoria(e.categoria)}</span>
        },
        {
          clave: 'prestadoA',
          encabezado: 'Prestado a',
          claseEncabezado: 'min-w-[12rem] px-3',
          claseCelda: 'min-w-[12rem] px-3',
          render: (e) => {
            const p = mapaPrestamosPorEquipo[e.id];
            return (
              <span className="font-semibold text-xs text-texto block">
                {p?.nombreSolicitante || p?.solicitante?.nombreCompleto || 'Colaborador asignado'}
              </span>
            );
          }
        },
        {
          clave: 'area',
          encabezado: 'Área',
          claseEncabezado: 'min-w-[11rem] px-3',
          claseCelda: 'min-w-[11rem] px-3',
          render: (e) => {
            const p = mapaPrestamosPorEquipo[e.id];
            return (
              <span className="text-xs text-texto-suave block">
                {p?.solicitanteArea || p?.solicitante?.area?.nombre || 'General'}
              </span>
            );
          }
        },
        {
          clave: 'desde',
          encabezado: 'Desde',
          claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
          claseCelda: 'w-[1%] whitespace-nowrap px-3 cifra-tabular text-xs',
          render: (e) => {
            const p = mapaPrestamosPorEquipo[e.id];
            return p?.fechaPrestamo || '—';
          }
        },
        {
          clave: 'devolucionPrevista',
          encabezado: 'Devolución prevista',
          claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
          claseCelda: 'w-[1%] whitespace-nowrap px-3 cifra-tabular text-xs font-semibold',
          render: (e) => {
            const p = mapaPrestamosPorEquipo[e.id];
            return p?.fechaDevolucionEstimada || '—';
          }
        },
        {
          clave: 'estado',
          encabezado: 'Estado',
          claseEncabezado: 'w-[1%] whitespace-nowrap px-3 text-right',
          claseCelda: 'w-[1%] whitespace-nowrap px-3 text-right',
          render: (e) => {
            const p = mapaPrestamosPorEquipo[e.id];
            const estaVencido = p ? esPrestamoVencido(p) : false;
            return (
              <div className="inline-flex items-center gap-1.5 justify-end">
                <Badge estado="Prestado" />
                {estaVencido && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-peligro-fondo text-peligro-texto border border-peligro-borde uppercase">
                    Vencido
                  </span>
                )}
              </div>
            );
          }
        }
      ];
    }

    return [
      {
        clave: 'codigoPatrimonial',
        encabezado: 'Cód. patrimonial',
        claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
        claseCelda: 'w-[1%] whitespace-nowrap px-3 font-mono font-bold text-xs',
        render: (e) => e.codigoPatrimonial
      },
      {
        clave: 'equipo',
        encabezado: 'Equipo tecnológico',
        claseEncabezado: 'min-w-[14rem] px-3',
        claseCelda: 'min-w-[14rem] px-3',
        render: (e) => (
          <div>
            <span className="font-semibold text-texto block">{e.nombre}</span>
            <span className="text-xs text-texto-suave block">{e.marca || 'Marca corporativa'}</span>
          </div>
        )
      },
      {
        clave: 'categoria',
        encabezado: 'Categoría',
        claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
        claseCelda: 'w-[1%] whitespace-nowrap px-3',
        render: (e) => <span className="text-xs text-texto-suave">{obtenerEtiquetaCategoria(e.categoria)}</span>
      },
      {
        clave: 'estado',
        encabezado: 'Estado operativo',
        claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
        claseCelda: 'w-[1%] whitespace-nowrap px-3',
        render: (e) => <Badge estado={e.estado} />
      },
      {
        clave: 'ubicacion',
        encabezado: 'Ubicación física',
        claseEncabezado: 'min-w-[12rem] px-3',
        claseCelda: 'min-w-[12rem] px-3 text-xs text-texto-suave',
        render: (e) => e.ubicacion || 'Almacén Central TI'
      }
    ];
  }, [esFiltroPrestados, mapaPrestamosPorEquipo]);

  const exportarCsvTab = useCallback(() => {
    if (esFiltroPrestados) {
      const headers = ['Codigo', 'Equipo', 'Marca', 'Categoria', 'PrestadoA', 'Area', 'Desde', 'DevolucionPrevista', 'Estado'];
      const rows = equiposDetalle.map((e) => {
        const p = mapaPrestamosPorEquipo[e.id];
        return [
          e.codigoPatrimonial,
          e.nombre,
          e.marca || '',
          obtenerEtiquetaCategoria(e.categoria),
          p?.nombreSolicitante || '',
          p?.solicitanteArea || '',
          p?.fechaPrestamo || '',
          p?.fechaDevolucionEstimada || '',
          p && esPrestamoVencido(p) ? 'Vencido' : 'Prestado'
        ];
      });
      exportarCsv(`equipos_prestados_${fechaHoyLima()}`, headers, rows);
    } else {
      const headers = ['Codigo', 'Equipo', 'Marca', 'Categoria', 'Estado', 'Ubicacion'];
      const rows = equiposDetalle.map((e) => [
        e.codigoPatrimonial,
        e.nombre,
        e.marca || '',
        obtenerEtiquetaCategoria(e.categoria),
        e.estado,
        e.ubicacion || ''
      ]);
      exportarCsv(`equipos_por_estado_${filtroChipEstado.toLowerCase()}_${fechaHoyLima()}`, headers, rows);
    }
  }, [esFiltroPrestados, equiposDetalle, mapaPrestamosPorEquipo, filtroChipEstado]);

  useEffect(() => {
    if (alRegistrarExportar) {
      alRegistrarExportar(exportarCsvTab);
    }
  }, [alRegistrarExportar, exportarCsvTab]);

  return (
    <div className="space-y-4">
      {/* Mini Indicadores */}
      <section aria-label="Indicadores de estado de equipos" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <CardIndicador compacto etiqueta="Total de equipos" valor={totalEquipos} icono="Laptop" tono="primario" />
        <CardIndicador compacto etiqueta="Disponibles" valor={mapaEstado.Disponible} icono="CheckCircle2" tono="exito" />
        <CardIndicador compacto etiqueta="Prestados" valor={mapaEstado.Prestado} icono="UserCheck" tono="info" />
        <CardIndicador compacto etiqueta="Mantenimiento / Baja" valor={mapaEstado.Mantenimiento + mapaEstado.Baja} icono="Wrench" tono="advertencia" />
      </section>

      {/* Dona + 4 Tarjetas de estado fijas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-xs flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-texto mb-3 self-start">Distribución porcentual</h3>
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-borde/40" />
              {(() => {
                const circ = 251.327;
                let acumulado = 0;
                return itemsDona.map((item) => {
                  const len = totalEquipos > 0 ? (item.cant / totalEquipos) * circ : 0;
                  const offset = acumulado;
                  acumulado += len;
                  return item.cant > 0 ? (
                    <circle
                      key={item.clave}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth="12"
                      strokeDasharray={`${len} ${circ}`}
                      strokeDashoffset={-offset}
                      className="transition-all duration-500"
                    />
                  ) : null;
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-texto cifra-tabular leading-none">{totalEquipos}</span>
              <span className="text-[10px] uppercase font-semibold text-texto-suave mt-0.5">Equipos</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {itemsDona.map((item) => {
            const pct = totalEquipos > 0 ? Math.round((item.cant / totalEquipos) * 100) : 0;
            return (
              <div key={item.clave} className="p-4 rounded-tarjeta border border-borde bg-superficie shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-texto-suave">{item.label}</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-texto cifra-tabular">{item.cant}</span>
                  <span className="text-xs font-semibold text-texto-suave cifra-tabular">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chips de estado para filtrar tabla */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-texto-suave mr-1">Filtrar tabla:</span>
        <PestanasConteo
          ariaLabel="Filtrar equipos por estado"
          opciones={[
            { valor: 'Todos', etiqueta: 'Todos', cantidad: totalEquipos },
            { valor: 'Disponible', etiqueta: 'Disponible', cantidad: mapaEstado['Disponible'] ?? 0 },
            { valor: 'Prestado', etiqueta: 'Prestado', cantidad: mapaEstado['Prestado'] ?? 0 },
            { valor: 'Mantenimiento', etiqueta: 'En mantenimiento', cantidad: mapaEstado['Mantenimiento'] ?? 0 },
            { valor: 'Baja', etiqueta: 'Baja', cantidad: mapaEstado['Baja'] ?? 0 }
          ]}
          seleccionado={filtroChipEstado}
          alCambiar={setFiltroChipEstado}
        />
      </div>

      {/* Tabla de equipos */}
      <TableList
        caption={`Listado de equipos tecnológicos · Filtro: ${filtroChipEstado}`}
        columnas={columnasEquipos}
        datos={equiposDetalle}
        cargando={cargando}
        mensajeVacio="No se encontraron equipos para el estado seleccionado."
      />
    </div>
  );
}

TabEquiposPorEstado.propTypes = {
  alRegistrarExportar: PropTypes.func
};
