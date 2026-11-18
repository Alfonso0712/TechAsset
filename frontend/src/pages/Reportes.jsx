// Reportes ejecutivos, analítica de inventario y trazabilidad de movimientos · TechAsset · WCAG 2.2 AA (RF-14 a RF-17)
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { reporteService } from '../services/reporteService';
import { equipoService } from '../services/equipoService';
import { prestamoService } from '../services/prestamoService';
import { formatearFechaHora } from '../utils/formatearFecha';
import { exportarCsv } from '../utils/exportarCsv';
import { fechaHoyLima, obtenerRangoPeriodo, esPrestamoVencido } from '../utils/fechas';
import { TIPOS_MOVIMIENTO, CATEGORIAS_EQUIPO } from '../constants/estados';
import {
  obtenerEtiquetaCategoria,
  obtenerEtiquetaTipoMovimiento
} from '../constants/etiquetas';

import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import TableList from '../components/ui/TableList';
import Badge from '../components/ui/Badge';
import CardIndicador from '../components/ui/CardIndicador';
import SelectInput from '../components/formulario/SelectInput';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';

const PESTANAS_REPORTES = [
  { clave: 'por-estado', etiqueta: 'Equipos por estado' },
  { clave: 'mas-utilizados', etiqueta: 'Más utilizados' },
  { clave: 'por-area', etiqueta: 'Préstamos por área' },
  { clave: 'movimientos', etiqueta: 'Movimientos' }
];

const OPCIONES_PERIODO = [
  { valor: 'todo', etiqueta: 'Todo el histórico' },
  { valor: 'este-mes', etiqueta: 'Este mes' },
  { valor: 'ultimos-30', etiqueta: 'Últimos 30 días' },
  { valor: 'personalizado', etiqueta: 'Personalizado' }
];

const OPCIONES_CATEGORIA = [
  { valor: '', etiqueta: 'Todas las categorías' },
  ...Object.entries(CATEGORIAS_EQUIPO).map(([_, v]) => ({
    valor: v,
    etiqueta: obtenerEtiquetaCategoria(v)
  }))
];

const OPCIONES_TIPO_MOVIMIENTO = [
  { valor: '', etiqueta: 'Todos los tipos de movimiento' },
  { valor: TIPOS_MOVIMIENTO.REGISTRO, etiqueta: 'Alta de equipo en inventario' },
  { valor: TIPOS_MOVIMIENTO.PRESTAMO_SOLICITADO, etiqueta: 'Solicitud de préstamo ingresada' },
  { valor: TIPOS_MOVIMIENTO.PRESTAMO_APROBADO, etiqueta: 'Préstamo aprobado' },
  { valor: TIPOS_MOVIMIENTO.DEVOLUCION, etiqueta: 'Devolución de equipo conforme' },
  { valor: TIPOS_MOVIMIENTO.CAMBIO_ESTADO, etiqueta: 'Cambio de estado operativo' },
  { valor: TIPOS_MOVIMIENTO.EDICION, etiqueta: 'Edición de datos del equipo' },
  { valor: TIPOS_MOVIMIENTO.PRESTAMO_RECHAZADO, etiqueta: 'Solicitud de préstamo rechazada' }
];

const AREAS_BASE_INNOVATECH = [
  'Desarrollo de Software',
  'Aseguramiento de Calidad (QA)',
  'Diseño y Experiencia (UX/UI)',
  'Gestión de Proyectos y Operaciones',
  'Soporte Técnico de TI',
  'Data Center & Infraestructura'
];

export default function Reportes() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab inicial según parámetro de URL
  const tabParam = searchParams.get('tab');
  const equipoIdParam = searchParams.get('equipoId');

  const tabInicial = useMemo(() => {
    if (equipoIdParam) return 'movimientos';
    if (tabParam === 'areas') return 'por-area';
    if (tabParam === 'utilizados') return 'mas-utilizados';
    if (tabParam === 'movimientos') return 'movimientos';
    return 'por-estado';
  }, [tabParam, equipoIdParam]);

  const [pestana, setPestana] = useState(tabInicial);
  const [cargando, setCargando] = useState(true);

  // Filtro de periodo común
  const [periodo, setPeriodo] = useState('todo');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Actualizar rango cuando cambia periodo predefinido
  useEffect(() => {
    if (periodo === 'personalizado') return;
    const { fechaDesde: d, fechaHasta: h } = obtenerRangoPeriodo(periodo);
    setFechaDesde(d);
    setFechaHasta(h);
  }, [periodo]);

  // Tab 1: Equipos por estado
  const [porEstado, setPorEstado] = useState([]);
  const [filtroChipEstado, setFiltroChipEstado] = useState('Todos');
  const [equiposDetalle, setEquiposDetalle] = useState([]);
  const [prestamosActivos, setPrestamosActivos] = useState([]);

  // Tab 2: Más utilizados
  const [masUtilizados, setMasUtilizados] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Tab 3: Préstamos por área
  const [porArea, setPorArea] = useState([]);

  // Tab 4: Movimientos
  const [movimientos, setMovimientos] = useState([]);
  const [tipoMovimiento, setTipoMovimiento] = useState('');
  const [busquedaMovimiento, setBusquedaMovimiento] = useState('');
  const [equipoIdFiltro, setEquipoIdFiltro] = useState(equipoIdParam || '');

  // Carga de datos unificada
  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const fDesde = fechaDesde || undefined;
      const fHasta = fechaHasta || undefined;

      if (pestana === 'por-estado') {
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
      } else if (pestana === 'mas-utilizados') {
        const resp = await reporteService.obtenerEquiposMasUtilizados({
          limite: 10,
          categoria: filtroCategoria || undefined,
          fechaDesde: fDesde,
          fechaHasta: fHasta
        });
        setMasUtilizados(resp.estado === 200 && Array.isArray(resp.datos) ? resp.datos : []);
      } else if (pestana === 'por-area') {
        const resp = await reporteService.obtenerPrestamosPorArea({
          fechaDesde: fDesde,
          fechaHasta: fHasta
        });
        setPorArea(resp.estado === 200 && Array.isArray(resp.datos) ? resp.datos : []);
      } else if (pestana === 'movimientos') {
        const resp = await reporteService.obtenerMovimientos({
          tipo: tipoMovimiento || undefined,
          equipoId: equipoIdFiltro || undefined,
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
  }, [pestana, filtroChipEstado, filtroCategoria, tipoMovimiento, equipoIdFiltro, fechaDesde, fechaHasta]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Sincronizar URL cuando cambia la pestaña
  const cambiarPestana = (nuevaPestana) => {
    setPestana(nuevaPestana);
    const params = new URLSearchParams(searchParams);
    if (nuevaPestana === 'por-estado') params.delete('tab');
    else if (nuevaPestana === 'por-area') params.set('tab', 'areas');
    else if (nuevaPestana === 'mas-utilizados') params.set('tab', 'utilizados');
    else if (nuevaPestana === 'movimientos') params.set('tab', 'movimientos');
    setSearchParams(params, { replace: true });
  };

  // ==========================================
  // TAB 1: EQUIPOS POR ESTADO
  // ==========================================
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

  // Mapear préstamos activos por equipoId para mostrar columnas con "Prestados"
  const mapaPrestamosPorEquipo = useMemo(() => {
    const mapa = {};
    prestamosActivos.forEach((p) => {
      const eqId = p.equipoId || p.equipo?.id;
      if (eqId) mapa[eqId] = p;
    });
    return mapa;
  }, [prestamosActivos]);

  // Columnas dinámicas según si filtramos "Prestados"
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

  // Exportar CSV Tab 1
  const exportarCsvTab1 = () => {
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
  };

  // ==========================================
  // TAB 2: MÁS UTILIZADOS
  // ==========================================
  const maxUso = useMemo(() => {
    return Math.max(...masUtilizados.map((e) => e.totalPrestamos || 0), 1);
  }, [masUtilizados]);

  const columnasMasUtilizados = [
    {
      clave: 'ranking',
      encabezado: 'Pos.',
      claseEncabezado: 'w-[1%] whitespace-nowrap pl-4 pr-2 text-center',
      claseCelda: 'w-[1%] whitespace-nowrap pl-4 pr-2 text-center',
      render: (item, index) => {
        const pos = typeof index === 'number' ? index + 1 : 1;
        let claseMedalla = 'bg-superficie-2 text-texto-suave';
        if (pos === 1) claseMedalla = 'bg-[#FCD34D] text-[#78350F] shadow-xs';
        else if (pos === 2) claseMedalla = 'bg-[#CBD5E1] text-[#1E293B] shadow-xs';
        else if (pos === 3) claseMedalla = 'bg-[#F97316] text-white shadow-xs';

        return (
          <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${claseMedalla}`}>
            {pos}
          </span>
        );
      }
    },
    {
      clave: 'codigoPatrimonial',
      encabezado: 'Cód. patrimonial',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3 font-mono font-bold text-xs',
      render: (item) => item.codigoPatrimonial || item.codigo || '—'
    },
    {
      clave: 'nombreEquipo',
      encabezado: 'Equipo (Nombre y Marca)',
      ordenable: true,
      claseEncabezado: 'min-w-[14rem] px-3',
      claseCelda: 'min-w-[14rem] px-3',
      render: (item) => {
        const nombre = item.nombreEquipo || item.nombre || 'Equipo tecnológico';
        const marca = item.marca ? ` • ${item.marca}` : '';
        return (
          <span className="font-semibold text-texto block truncate" title={`${nombre}${marca}`}>
            {nombre}{marca}
          </span>
        );
      }
    },
    {
      clave: 'categoria',
      encabezado: 'Categoría',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3 text-xs text-texto-suave',
      render: (item) => obtenerEtiquetaCategoria(item.categoria)
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
      clave: 'ultimoPrestamo',
      encabezado: 'Último préstamo',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3 cifra-tabular',
      claseCelda: 'w-[1%] whitespace-nowrap px-3 cifra-tabular text-xs text-texto-suave',
      render: (item) => item.ultimoPrestamo || '—'
    },
    {
      clave: 'demanda',
      encabezado: 'Frecuencia de demanda',
      claseEncabezado: 'min-w-[12rem] px-3 hidden sm:table-cell',
      claseCelda: 'min-w-[12rem] px-3 hidden sm:table-cell',
      render: (item) => {
        const cant = item.totalPrestamos || 0;
        const pct = maxUso > 0 && cant > 0 ? Math.max(4, Math.round((cant / maxUso) * 100)) : 0;
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-pill bg-superficie-2 overflow-hidden">
              <div
                className="h-full rounded-pill bg-grafico-marca transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-texto-suave w-10 text-right cifra-tabular">{pct}%</span>
          </div>
        );
      }
    }
  ];

  // Exportar CSV Tab 2
  const exportarCsvTab2 = () => {
    const headers = ['Posicion', 'Codigo', 'Nombre', 'Marca', 'Categoria', 'TotalPrestamos', 'UltimoPrestamo'];
    const rows = masUtilizados.map((item, idx) => [
      idx + 1,
      item.codigoPatrimonial || item.codigo || '',
      item.nombreEquipo || item.nombre || '',
      item.marca || '',
      obtenerEtiquetaCategoria(item.categoria),
      item.totalPrestamos || 0,
      item.ultimoPrestamo || ''
    ]);
    exportarCsv(`equipos_mas_utilizados_${fechaHoyLima()}`, headers, rows);
  };

  // ==========================================
  // TAB 3: PRÉSTAMOS POR ÁREA
  // ==========================================
  // Consolidar siempre las 6 áreas
  const datosAreaConsolidados = useMemo(() => {
    const mapa = {};
    AREAS_BASE_INNOVATECH.forEach((nom) => {
      mapa[nom] = { areaNombre: nom, totalPrestamos: 0, activos: 0, devueltos: 0, pendientes: 0 };
    });

    if (Array.isArray(porArea)) {
      porArea.forEach((item) => {
        const nom = item.areaNombre || item.area || item.nombre;
        if (nom) {
          mapa[nom] = {
            areaNombre: nom,
            totalPrestamos: item.totalPrestamos ?? item.cantidad ?? 0,
            activos: item.activos ?? 0,
            devueltos: item.devueltos ?? 0,
            pendientes: item.pendientes ?? 0
          };
        }
      });
    }

    return Object.values(mapa).sort((a, b) => b.totalPrestamos - a.totalPrestamos);
  }, [porArea]);

  const totalSolicitudesAreas = useMemo(() => {
    return datosAreaConsolidados.reduce((acc, curr) => acc + curr.totalPrestamos, 0);
  }, [datosAreaConsolidados]);

  const maxDemandaArea = useMemo(() => {
    return Math.max(...datosAreaConsolidados.map((a) => a.totalPrestamos), 1);
  }, [datosAreaConsolidados]);

  const columnasPorArea = [
    {
      clave: 'area',
      encabezado: 'Área corporativa',
      ordenable: true,
      claseEncabezado: 'min-w-[14rem] px-3',
      claseCelda: 'min-w-[14rem] px-3',
      render: (item, _, index) => {
        const esLider = index === 0 && item.totalPrestamos > 0;
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-texto block">{item.areaNombre}</span>
            {esLider && (
              <span className="inline-flex px-1.5 py-0.5 rounded-pill text-[10px] font-bold bg-acento/15 text-primario">
                Área con mayor uso
              </span>
            )}
          </div>
        );
      }
    },
    {
      clave: 'totalPrestamos',
      encabezado: 'Solicitudes',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap text-right px-3',
      claseCelda: 'w-[1%] whitespace-nowrap text-right px-3 cifra-tabular',
      render: (item) => (
        <span className="font-bold text-sm text-texto cifra-tabular">
          {item.totalPrestamos}
        </span>
      )
    },
    {
      clave: 'activos',
      encabezado: 'Activos',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap text-right px-3',
      claseCelda: 'w-[1%] whitespace-nowrap text-right px-3 cifra-tabular text-info-texto font-semibold',
      render: (item) => item.activos
    },
    {
      clave: 'devueltos',
      encabezado: 'Devueltos',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap text-right px-3',
      claseCelda: 'w-[1%] whitespace-nowrap text-right px-3 cifra-tabular text-exito-texto font-semibold',
      render: (item) => item.devueltos
    },
    {
      clave: 'porcentaje',
      encabezado: '% del total',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap text-right px-3',
      claseCelda: 'w-[1%] whitespace-nowrap text-right px-3 cifra-tabular',
      render: (item) => {
        const pct = totalSolicitudesAreas > 0
          ? Math.round((item.totalPrestamos / totalSolicitudesAreas) * 100)
          : 0;
        return (
          <span className="font-bold text-xs text-texto-suave cifra-tabular">
            {pct}%
          </span>
        );
      }
    }
  ];

  // Exportar CSV Tab 3
  const exportarCsvTab3 = () => {
    const headers = ['Area', 'Solicitudes', 'Activos', 'Devueltos', 'Porcentaje'];
    const rows = datosAreaConsolidados.map((item) => {
      const pct = totalSolicitudesAreas > 0
        ? Math.round((item.totalPrestamos / totalSolicitudesAreas) * 100)
        : 0;
      return [item.areaNombre, item.totalPrestamos, item.activos, item.devueltos, `${pct}%`];
    });
    exportarCsv(`prestamos_por_area_${fechaHoyLima()}`, headers, rows);
  };

  // ==========================================
  // TAB 4: MOVIMIENTOS (RF-17)
  // ==========================================
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

  const columnasMovimientos = [
    {
      clave: 'fechaHora',
      encabezado: 'Fecha y hora (Lima)',
      ordenable: true,
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3 cifra-tabular text-xs font-semibold text-texto-suave',
      render: (m) => formatearFechaHora(m.fechaHora || m.fechaMovimiento)
    },
    {
      clave: 'tipo',
      encabezado: 'Tipo de movimiento',
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3',
      render: (m) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-superficie-2 text-texto border border-borde whitespace-nowrap">
          {obtenerEtiquetaTipoMovimiento(m.tipo)}
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
            {m.equipoNombre || 'Equipo tecnológico'}
          </span>
          <span className="font-mono text-xs text-texto-suave block">
            {m.equipoCodigo || ''}
          </span>
        </div>
      )
    },
    {
      clave: 'transicion',
      encabezado: 'Transición de estado',
      claseEncabezado: 'min-w-[13rem] px-3 hidden md:table-cell',
      claseCelda: 'min-w-[13rem] px-3 hidden md:table-cell',
      render: (m) => (
        <div className="flex items-center gap-1.5">
          <Badge estado={m.estadoAnterior || '-'} discreto />
          <Icono nombre="ArrowRight" className="w-3.5 h-3.5 text-texto-suave shrink-0" />
          <Badge estado={m.estadoNuevo || '-'} />
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
          {m.usuarioNombre || 'Sistema'}
        </span>
      )
    },
    {
      clave: 'detalle',
      encabezado: 'Detalle técnico',
      claseEncabezado: 'min-w-[14rem] px-3 hidden xl:table-cell',
      claseCelda: 'min-w-[14rem] px-3 hidden xl:table-cell',
      render: (m) => (
        <p className="text-xs text-texto-suave line-clamp-2 leading-relaxed m-0" title={m.detalle}>
          {m.detalle || 'Sin observaciones adicionales'}
        </p>
      )
    }
  ];

  // Exportar CSV Tab 4
  const exportarCsvTab4 = () => {
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
  };

  return (
    <div className="space-y-5 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <EncabezadoPagina
          titulo="Reportes"
          descripcion="Métricas de utilización corporativa y registro inmutable de trazabilidad de equipos."
        />

        {/* Selector común de periodo y Exportar CSV */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-44 shrink-0">
            <SelectInput
              id="filtro-periodo-comun"
              nombre="filtro-periodo-comun"
              etiqueta=""
              aria-label="Selector de periodo"
              obligatorio={false}
              tamano="sm"
              valor={periodo}
              alCambiar={(e) => setPeriodo(e.target.value)}
              opciones={OPCIONES_PERIODO}
            />
          </div>

          {periodo === 'personalizado' && (
            <div className="flex items-center gap-1.5 text-xs">
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="h-9 px-2 rounded-control border border-borde bg-superficie text-texto text-xs"
                aria-label="Fecha desde"
              />
              <span className="text-texto-suave">a</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="h-9 px-2 rounded-control border border-borde bg-superficie text-texto text-xs"
                aria-label="Fecha hasta"
              />
            </div>
          )}

          <Button
            variante="secondary"
            tamano="sm"
            alHacerClic={() => {
              if (pestana === 'por-estado') exportarCsvTab1();
              else if (pestana === 'mas-utilizados') exportarCsvTab2();
              else if (pestana === 'por-area') exportarCsvTab3();
              else if (pestana === 'movimientos') exportarCsvTab4();
            }}
            aria-label="Exportar datos a CSV"
          >
            <Icono nombre="Download" className="w-3.5 h-3.5 mr-1" />
            <span>Exportar CSV</span>
          </Button>
        </div>
      </div>

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
              onClick={() => cambiarPestana(p.clave)}
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

      {/* ============================================================ */}
      {/* PESTAÑA 1: EQUIPOS POR ESTADO                               */}
      {/* ============================================================ */}
      {pestana === 'por-estado' && (
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
            {['Todos', 'Disponible', 'Prestado', 'Mantenimiento', 'Baja'].map((st) => {
              const activo = filtroChipEstado === st;
              const cant = st === 'Todos' ? totalEquipos : (mapaEstado[st] ?? 0);
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFiltroChipEstado(st)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-semibold cursor-pointer border transition-colors ${
                    activo
                      ? 'bg-primario text-sobre-primario border-primario'
                      : 'bg-superficie text-texto-suave border-borde hover:bg-superficie-2 hover:text-texto'
                  }`}
                >
                  <span>{st === 'Mantenimiento' ? 'En mantenimiento' : st}</span>
                  <span className={`px-1 rounded-full text-[10px] cifra-tabular ${activo ? 'bg-white/20 text-white' : 'bg-superficie-2 text-texto-suave'}`}>
                    {cant}
                  </span>
                </button>
              );
            })}
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
      )}

      {/* ============================================================ */}
      {/* PESTAÑA 2: MÁS UTILIZADOS                                    */}
      {/* ============================================================ */}
      {pestana === 'mas-utilizados' && (
        <div className="space-y-4">
          {/* Mini Indicadores */}
          <section aria-label="Resumen de equipos más solicitados" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <CardIndicador
              compacto
              etiqueta="Equipos en ranking"
              valor={masUtilizados.length}
              icono="Award"
              tono="primario"
            />
            <CardIndicador
              compacto
              etiqueta="Equipo líder"
              valor={masUtilizados[0]?.nombreEquipo || masUtilizados[0]?.nombre || '—'}
              descripcion={masUtilizados[0]?.totalPrestamos ? `${masUtilizados[0].totalPrestamos} préstamos` : ''}
              icono="Laptop"
              tono="exito"
            />
            <CardIndicador
              compacto
              etiqueta="Demanda máxima"
              valor={maxUso > 1 ? maxUso : (masUtilizados[0]?.totalPrestamos || 0)}
              icono="TrendingUp"
              tono="info"
            />
            <CardIndicador
              compacto
              etiqueta="Préstamos analizados"
              valor={masUtilizados.reduce((acc, curr) => acc + (curr.totalPrestamos || 0), 0)}
              icono="ClipboardList"
              tono="advertencia"
            />
          </section>

          {/* Filtro por Categoría */}
          <section aria-label="Filtro de categoría para más utilizados" className="p-2 sm:p-2.5 rounded-tarjeta border border-borde bg-superficie shadow-xs flex items-center justify-between gap-3">
            <div className="w-64 shrink-0">
              <SelectInput
                id="filtro-categoria-mas-utilizados"
                nombre="filtro-categoria-mas-utilizados"
                etiqueta=""
                aria-label="Filtrar por categoría"
                obligatorio={false}
                tamano="sm"
                valor={filtroCategoria}
                alCambiar={(e) => setFiltroCategoria(e.target.value)}
                opciones={OPCIONES_CATEGORIA}
              />
            </div>
            {filtroCategoria && (
              <Button
                variante="ghost"
                tamano="sm"
                alHacerClic={() => setFiltroCategoria('')}
              >
                <Icono nombre="RotateCcw" className="w-3.5 h-3.5 mr-1" />
                <span>Limpiar filtro</span>
              </Button>
            )}
          </section>

          {/* Tabla ranking top 10 */}
          <TableList
            caption="Ranking de los 10 equipos tecnológicos más utilizados y solicitados"
            columnas={columnasMasUtilizados}
            datos={masUtilizados}
            cargando={cargando}
            mensajeVacio="No hay suficientes datos de uso registrados para el criterio seleccionado."
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* PESTAÑA 3: PRÉSTAMOS POR ÁREA                                */}
      {/* ============================================================ */}
      {pestana === 'por-area' && (
        <div className="space-y-4">
          {/* Mini Indicadores */}
          <section aria-label="Indicadores de demanda por áreas" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <CardIndicador
              compacto
              etiqueta="Total solicitudes"
              valor={totalSolicitudesAreas}
              icono="ClipboardList"
              tono="primario"
            />
            <CardIndicador
              compacto
              etiqueta="Área líder"
              valor={datosAreaConsolidados[0]?.areaNombre || '—'}
              descripcion={datosAreaConsolidados[0]?.totalPrestamos ? `${datosAreaConsolidados[0].totalPrestamos} solicitudes` : ''}
              icono="Building2"
              tono="acento"
            />
            <CardIndicador
              compacto
              etiqueta="Préstamos activos"
              valor={datosAreaConsolidados.reduce((acc, curr) => acc + curr.activos, 0)}
              icono="PackageCheck"
              tono="info"
            />
            <CardIndicador
              compacto
              etiqueta="Devoluciones"
              valor={datosAreaConsolidados.reduce((acc, curr) => acc + curr.devueltos, 0)}
              icono="CheckCircle2"
              tono="exito"
            />
          </section>

          {/* Gráfico de barras horizontales SVG */}
          <div className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-texto m-0">Distribución de demanda por área corporativa</h3>
            <div className="space-y-2.5">
              {datosAreaConsolidados.map((item, index) => {
                const esPrimero = index === 0 && item.totalPrestamos > 0;
                const pct = maxDemandaArea > 0 && item.totalPrestamos > 0
                  ? Math.max(4, Math.round((item.totalPrestamos / maxDemandaArea) * 100))
                  : 0;

                return (
                  <div key={item.areaNombre} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-texto truncate">{item.areaNombre}</span>
                      <span className="font-bold text-texto-suave cifra-tabular shrink-0">
                        {item.totalPrestamos} {item.totalPrestamos === 1 ? 'solicitud' : 'solicitudes'}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-pill bg-superficie-2 overflow-hidden">
                      <div
                        className={`h-full rounded-pill transition-all duration-300 ${esPrimero ? 'bg-acento' : 'bg-grafico-marca'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabla de préstamos por área */}
          <TableList
            caption="Consolidado de solicitudes de préstamos agrupadas por las 6 áreas corporativas"
            columnas={columnasPorArea}
            datos={datosAreaConsolidados}
            cargando={cargando}
            mensajeVacio="No hay solicitudes agrupadas por área todavía."
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* PESTAÑA 4: MOVIMIENTOS (RF-17)                               */}
      {/* ============================================================ */}
      {pestana === 'movimientos' && (
        <div className="space-y-4">
          {/* Mini Indicadores */}
          <section aria-label="Indicadores de auditoría y movimientos" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              valor={movimientos.filter((m) => m.tipo === TIPOS_MOVIMIENTO.REGISTRO).length}
              icono="Plus"
              tono="exito"
            />
            <CardIndicador
              compacto
              etiqueta="Préstamos activos"
              valor={movimientos.filter((m) => m.tipo === TIPOS_MOVIMIENTO.PRESTAMO_APROBADO).length}
              icono="UserCheck"
              tono="info"
            />
            <CardIndicador
              compacto
              etiqueta="Devoluciones"
              valor={movimientos.filter((m) => m.tipo === TIPOS_MOVIMIENTO.DEVOLUCION).length}
              icono="RotateCcw"
              tono="advertencia"
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
                  opciones={OPCIONES_TIPO_MOVIMIENTO}
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
                    onClick={() => {
                      setEquipoIdFiltro('');
                      const params = new URLSearchParams(searchParams);
                      params.delete('equipoId');
                      setSearchParams(params, { replace: true });
                    }}
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
                {(Boolean(tipoMovimiento) || Boolean(busquedaMovimiento) || Boolean(equipoIdFiltro)) && (
                  <Button
                    variante="ghost"
                    tamano="sm"
                    aria-label="Limpiar filtros"
                    alHacerClic={() => {
                      setTipoMovimiento('');
                      setBusquedaMovimiento('');
                      setEquipoIdFiltro('');
                      const params = new URLSearchParams(searchParams);
                      params.delete('equipoId');
                      setSearchParams(params, { replace: true });
                    }}
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
            esFiltroActivo={Boolean(tipoMovimiento) || Boolean(busquedaMovimiento) || Boolean(equipoIdFiltro)}
            alLimpiarFiltros={() => {
              setTipoMovimiento('');
              setBusquedaMovimiento('');
              setEquipoIdFiltro('');
            }}
            mensajeVacio="No se registraron movimientos en el historial de auditoría para los criterios seleccionados."
          />
        </div>
      )}
    </div>
  );
}
