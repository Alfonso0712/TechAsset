// Reportes ejecutivos, analítica de inventario y trazabilidad de movimientos · TechAsset · WCAG 2.2 AA
import { useState, useEffect, useCallback, useMemo } from 'react';
import { reporteService } from '../services/reporteService';
import { formatearFechaHora } from '../utils/formatearFecha';
import { TIPOS_MOVIMIENTO } from '../constants/estados';
import { obtenerEtiquetaCategoria } from '../constants/etiquetas';

import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import TableList from '../components/ui/TableList';
import Badge from '../components/ui/Badge';
import CategoriaEquipoChip from '../components/ui/CategoriaEquipoChip';
import SelectInput from '../components/formulario/SelectInput';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';

const PESTANAS_REPORTES = [
  { clave: 'por-estado', etiqueta: 'Equipos por estado' },
  { clave: 'mas-utilizados', etiqueta: 'Más utilizados' },
  { clave: 'por-area', etiqueta: 'Préstamos por área' },
  { clave: 'movimientos', etiqueta: 'Movimientos' }
];

const OPCIONES_TIPO_MOVIMIENTO = [
  { valor: '', etiqueta: 'Todos los tipos de movimiento' },
  ...Object.entries(TIPOS_MOVIMIENTO).map(([k, v]) => ({ valor: v, etiqueta: v }))
];

export default function Reportes() {
  const [pestana, setPestana] = useState('por-estado');
  const [cargando, setCargando] = useState(true);

  // Estados de datos por pestaña
  const [porEstado, setPorEstado] = useState([]);
  const [masUtilizados, setMasUtilizados] = useState([]);
  const [porArea, setPorArea] = useState([]);
  const [movimientos, setMovimientos] = useState([]);

  // Filtros de movimientos
  const [tipoMovimiento, setTipoMovimiento] = useState('');

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      if (pestana === 'por-estado') {
        const resp = await reporteService.obtenerEquiposPorEstado();
        setPorEstado(resp.estado === 200 && Array.isArray(resp.datos) ? resp.datos : []);
      } else if (pestana === 'mas-utilizados') {
        const resp = await reporteService.obtenerEquiposMasUtilizados(20);
        setMasUtilizados(resp.estado === 200 && Array.isArray(resp.datos) ? resp.datos : []);
      } else if (pestana === 'por-area') {
        const resp = await reporteService.obtenerPrestamosPorArea();
        setPorArea(resp.estado === 200 && Array.isArray(resp.datos) ? resp.datos : []);
      } else if (pestana === 'movimientos') {
        const resp = await reporteService.obtenerMovimientos({
          tipo: tipoMovimiento || undefined,
          tamanoPagina: 100
        });
        const items = resp.estado === 200 && resp.datos?.items ? resp.datos.items : (Array.isArray(resp.datos) ? resp.datos : []);
        setMovimientos(items);
      }
    } catch {
      // Ignorar fallas transitorias de red
    } finally {
      setCargando(false);
    }
  }, [pestana, tipoMovimiento]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Tab 1: Equipos por Estado
  const totalEquiposPorEstado = useMemo(() => {
    return porEstado.reduce((acc, curr) => acc + (curr.cantidad || 0), 0);
  }, [porEstado]);

  const columnasPorEstado = [
    {
      clave: 'estado',
      encabezado: 'Estado del equipo',
      claseEncabezado: 'min-w-[12rem] px-3',
      claseCelda: 'min-w-[12rem] px-3',
      render: (item) => <Badge estado={item.estado || item.estadoNombre} />
    },
    {
      clave: 'cantidad',
      encabezado: 'Cantidad de equipos',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap text-right px-3',
      claseCelda: 'w-[1%] whitespace-nowrap text-right px-3 cifra-tabular',
      render: (item) => (
        <span className="font-bold text-base text-texto cifra-tabular">
          {item.cantidad}
        </span>
      )
    },
    {
      clave: 'porcentaje',
      encabezado: 'Proporción',
      claseEncabezado: 'min-w-[14rem] px-3',
      claseCelda: 'min-w-[14rem] px-3',
      render: (item) => {
        const pct = item.porcentaje ?? (totalEquiposPorEstado > 0 ? Math.round((item.cantidad / totalEquiposPorEstado) * 100) : 0);
        return (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-pill bg-superficie-2 overflow-hidden">
              <div
                className="h-full rounded-pill bg-primario transition-all duration-300"
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-texto-suave w-10 text-right cifra-tabular">
              {pct}%
            </span>
          </div>
        );
      }
    }
  ];

  // Tab 2: Más Utilizados
  const maxUso = useMemo(() => {
    return Math.max(...masUtilizados.map((e) => e.totalPrestamos || 0), 1);
  }, [masUtilizados]);

  const columnasMasUtilizados = [
    {
      clave: 'ranking',
      encabezado: '#',
      claseEncabezado: 'w-[1%] whitespace-nowrap pl-4 pr-2',
      claseCelda: 'w-[1%] whitespace-nowrap pl-4 pr-2',
      render: (_, __, index) => (
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
          index === 0 ? 'bg-primario text-sobre-primario' : 'bg-superficie-2 text-texto-suave'
        }`}>
          {index + 1}
        </span>
      )
    },
    {
      clave: 'codigoPatrimonial',
      encabezado: 'Cód. patrimonial',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3',
      render: (item) => (
        <span className="font-mono font-bold text-texto text-xs tracking-wider">
          {item.codigoPatrimonial}
        </span>
      )
    },
    {
      clave: 'nombreEquipo',
      encabezado: 'Equipo tecnológico',
      ordenable: true,
      claseEncabezado: 'min-w-[14rem] px-3',
      claseCelda: 'min-w-[14rem] px-3',
      render: (item) => (
        <div>
          <span className="font-semibold text-texto line-clamp-1 block" title={item.nombreEquipo}>
            {item.nombreEquipo}
          </span>
          <span className="text-xs text-texto-suave block">
            {obtenerEtiquetaCategoria(item.categoria)}
          </span>
        </div>
      )
    },
    {
      clave: 'totalPrestamos',
      encabezado: 'Total préstamos',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap text-right px-3',
      claseCelda: 'w-[1%] whitespace-nowrap text-right px-3 cifra-tabular',
      render: (item) => (
        <span className="font-bold text-sm text-texto cifra-tabular">
          {item.totalPrestamos} {item.totalPrestamos === 1 ? 'préstamo' : 'préstamos'}
        </span>
      )
    },
    {
      clave: 'demanda',
      encabezado: 'Frecuencia de demanda',
      claseEncabezado: 'min-w-[12rem] px-3 hidden sm:table-cell',
      claseCelda: 'min-w-[12rem] px-3 hidden sm:table-cell',
      render: (item) => {
        const pct = Math.round(((item.totalPrestamos || 0) / maxUso) * 100);
        return (
          <div className="h-2 w-full max-w-[160px] rounded-pill bg-superficie-2 overflow-hidden">
            <div
              className="h-full rounded-pill bg-primario transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        );
      }
    }
  ];

  // Tab 3: Préstamos por Área
  const maxArea = useMemo(() => {
    return Math.max(...porArea.map((a) => a.totalPrestamos || 0), 1);
  }, [porArea]);

  const columnasPorArea = [
    {
      clave: 'ranking',
      encabezado: '#',
      claseEncabezado: 'w-[1%] whitespace-nowrap pl-4 pr-2',
      claseCelda: 'w-[1%] whitespace-nowrap pl-4 pr-2',
      render: (_, __, index) => (
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
          index === 0 ? 'bg-primario text-sobre-primario' : 'bg-superficie-2 text-texto-suave'
        }`}>
          {index + 1}
        </span>
      )
    },
    {
      clave: 'area',
      encabezado: 'Área corporativa',
      ordenable: true,
      claseEncabezado: 'min-w-[14rem] px-3',
      claseCelda: 'min-w-[14rem] px-3',
      render: (item) => (
        <span className="font-semibold text-texto block">
          {item.areaNombre || item.area || 'General'}
        </span>
      )
    },
    {
      clave: 'totalPrestamos',
      encabezado: 'Total solicitudes',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap text-right px-3',
      claseCelda: 'w-[1%] whitespace-nowrap text-right px-3 cifra-tabular',
      render: (item) => (
        <span className="font-bold text-sm text-texto cifra-tabular">
          {item.totalPrestamos} {item.totalPrestamos === 1 ? 'solicitud' : 'solicitudes'}
        </span>
      )
    },
    {
      clave: 'proporcion',
      encabezado: 'Volumen relativo',
      claseEncabezado: 'min-w-[12rem] px-3 hidden sm:table-cell',
      claseCelda: 'min-w-[12rem] px-3 hidden sm:table-cell',
      render: (item) => {
        const pct = Math.round(((item.totalPrestamos || 0) / maxArea) * 100);
        return (
          <div className="h-2 w-full max-w-[160px] rounded-pill bg-superficie-2 overflow-hidden">
            <div
              className="h-full rounded-pill bg-primario transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        );
      }
    }
  ];

  // Tab 4: Movimientos
  const columnasMovimientos = [
    {
      clave: 'fechaHora',
      encabezado: 'Fecha y hora',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3 cifra-tabular',
      render: (m) => (
        <span className="text-xs font-semibold text-texto-suave block">
          {formatearFechaHora(m.fechaHora)}
        </span>
      )
    },
    {
      clave: 'equipo',
      encabezado: 'Equipo',
      claseEncabezado: 'min-w-[13rem] px-3',
      claseCelda: 'min-w-[13rem] px-3',
      render: (m) => (
        <div>
          <span className="font-semibold text-texto block text-sm line-clamp-1">
            {m.equipoNombre || 'Equipo'}
          </span>
          <span className="font-mono text-xs text-texto-suave block">
            {m.equipoCodigo || ''}
          </span>
        </div>
      )
    },
    {
      clave: 'tipo',
      encabezado: 'Tipo de movimiento',
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3',
      render: (m) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-superficie-2 text-texto border border-borde whitespace-nowrap">
          {m.tipo}
        </span>
      )
    },
    {
      clave: 'transicion',
      encabezado: 'Transición de estado',
      claseEncabezado: 'min-w-[14rem] px-3 hidden md:table-cell',
      claseCelda: 'min-w-[14rem] px-3 hidden md:table-cell',
      render: (m) => (
        <div className="flex items-center gap-1.5">
          <Badge estado={m.estadoAnterior} discreto />
          <Icono nombre="ArrowRight" className="w-3.5 h-3.5 text-texto-suave shrink-0" />
          <Badge estado={m.estadoNuevo} />
        </div>
      )
    },
    {
      clave: 'usuario',
      encabezado: 'Responsable',
      claseEncabezado: 'min-w-[11rem] px-3 hidden lg:table-cell',
      claseCelda: 'min-w-[11rem] px-3 hidden lg:table-cell',
      render: (m) => (
        <span className="text-xs font-semibold text-texto block truncate" title={m.usuarioNombre}>
          {m.usuarioNombre}
        </span>
      )
    },
    {
      clave: 'detalle',
      encabezado: 'Detalle técnico',
      claseEncabezado: 'min-w-[13rem] px-3 hidden xl:table-cell',
      claseCelda: 'min-w-[13rem] px-3 hidden xl:table-cell',
      render: (m) => (
        <p className="text-xs text-texto-suave line-clamp-2 leading-relaxed" title={m.detalle}>
          {m.detalle || 'Sin observaciones adicionales'}
        </p>
      )
    }
  ];

  return (
    <div className="space-y-5 max-w-[1440px] mx-auto w-full">
      <EncabezadoPagina
        titulo="Reportes"
        descripcion="Métricas de utilización corporativa y registro inmutable de trazabilidad de equipos."
      />

      {/* Selector de pestañas */}
      <div role="tablist" aria-label="Secciones de reportes" className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-borde">
        {PESTANAS_REPORTES.map((p) => {
          const esActivo = pestana === p.clave;
          return (
            <button
              key={p.clave}
              role="tab"
              type="button"
              aria-selected={esActivo}
              tabIndex={esActivo ? 0 : -1}
              onClick={() => setPestana(p.clave)}
              className={`inline-flex items-center px-3.5 py-1.5 rounded-pill text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer border ${
                esActivo
                  ? 'bg-primario text-sobre-primario border-primario shadow-sm'
                  : 'bg-superficie text-texto hover:bg-superficie-2 border-borde text-texto-suave hover:text-texto'
              }`}
            >
              <span>{p.etiqueta}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido según pestaña */}
      {pestana === 'por-estado' && (
        <TableList
          caption="Consolidado de activos tecnológicos agrupados por estado operativo"
          columnas={columnasPorEstado}
          datos={porEstado}
          cargando={cargando}
          mensajeVacio="No hay suficientes datos de estados registrados."
        />
      )}

      {pestana === 'mas-utilizados' && (
        <TableList
          caption="Ranking de equipos tecnológicos con mayor volumen de préstamos solicitados"
          columnas={columnasMasUtilizados}
          datos={masUtilizados}
          cargando={cargando}
          mensajeVacio="No hay suficientes datos de uso registrados aún."
        />
      )}

      {pestana === 'por-area' && (
        <TableList
          caption="Consolidado de demanda de préstamos agrupado por área corporativa"
          columnas={columnasPorArea}
          datos={porArea}
          cargando={cargando}
          mensajeVacio="No hay solicitudes agrupadas por área todavía."
        />
      )}

      {pestana === 'movimientos' && (
        <div className="space-y-3">
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
                  opciones={OPCIONES_TIPO_MOVIMIENTO}
                  placeholder="Todos los tipos de movimiento"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-auto">
                <span role="status" aria-live="polite" className="text-xs font-semibold text-texto-suave cifra-tabular">
                  {movimientos.length === 1 ? '1 movimiento registrado' : `${movimientos.length} movimientos registrados`}
                </span>
                {Boolean(tipoMovimiento) && (
                  <Button
                    variante="ghost"
                    tamano="sm"
                    aria-label="Limpiar filtro"
                    alHacerClic={() => setTipoMovimiento('')}
                  >
                    <Icono nombre="RotateCcw" className="w-3.5 h-3.5 mr-1" />
                    <span>Limpiar filtro</span>
                  </Button>
                )}
              </div>
            </div>
          </section>

          <TableList
            caption="Historial inmutable de auditoría y movimientos de inventario"
            columnas={columnasMovimientos}
            datos={movimientos}
            cargando={cargando}
            esFiltroActivo={Boolean(tipoMovimiento)}
            alLimpiarFiltros={() => setTipoMovimiento('')}
            mensajeVacio="No se registraron movimientos en el historial de auditoría."
          />
        </div>
      )}
    </div>
  );
}
