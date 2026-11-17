import { useState, useEffect, useCallback } from 'react';
import TableList from '../components/ui/TableList';
import FilterBar from '../components/ui/FilterBar';
import Badge from '../components/ui/Badge';
import { reporteService } from '../services/reporteService';
import { formatearFechaHora } from '../utils/formatearFecha';
import { TIPOS_MOVIMIENTO } from '../constants/estados';

const PESTANAS_REPORTES = [
  { clave: 'mas-utilizados', etiqueta: 'Equipos Más Solicitados' },
  { clave: 'por-area', etiqueta: 'Demanda por Áreas' },
  { clave: 'movimientos', etiqueta: 'Auditoría de Movimientos (RF-17)' }
];

const OPCIONES_TIPO_MOVIMIENTO = [
  { valor: '', etiqueta: 'Todos los tipos de movimiento' },
  ...Object.entries(TIPOS_MOVIMIENTO).map(([_, v]) => ({ valor: v, etiqueta: v }))
];

export default function Reportes() {
  const [pestana, setPestana] = useState('mas-utilizados');
  const [cargando, setCargando] = useState(true);

  // Datos
  const [masUtilizados, setMasUtilizados] = useState([]);
  const [porArea, setPorArea] = useState([]);
  const [movimientos, setMovimientos] = useState([]);

  // Filtros de movimientos
  const [tipoMovimiento, setTipoMovimiento] = useState('');

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      if (pestana === 'mas-utilizados') {
        const resp = await reporteService.obtenerEquiposMasUtilizados(15);
        setMasUtilizados(resp.estado === 200 && Array.isArray(resp.datos) ? resp.datos : []);
      } else if (pestana === 'por-area') {
        const resp = await reporteService.obtenerPrestamosPorArea();
        setPorArea(resp.estado === 200 && Array.isArray(resp.datos) ? resp.datos : []);
      } else if (pestana === 'movimientos') {
        const resp = await reporteService.obtenerMovimientos({
          tipo: tipoMovimiento || undefined,
          tamanoPagina: 50
        });
        setMovimientos(resp.estado === 200 && resp.datos?.items ? resp.datos.items : []);
      }
    } catch {
      // Ignorar error de red
    } finally {
      setCargando(false);
    }
  }, [pestana, tipoMovimiento]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const columnasMasUtilizados = [
    {
      clave: 'codigoPatrimonial',
      encabezado: 'Código',
      ordenable: true,
      render: (v) => <span className="font-mono font-bold text-primario">{v}</span>
    },
    {
      clave: 'nombreEquipo',
      encabezado: 'Equipo',
      ordenable: true,
      render: (v, f) => (
        <div>
          <p className="font-semibold text-texto leading-snug">{v}</p>
          <p className="text-xs text-texto-suave">{f.categoria}</p>
        </div>
      )
    },
    {
      clave: 'totalPrestamos',
      encabezado: 'Total Préstamos',
      ordenable: true,
      render: (v) => (
        <span className="font-bold text-sm text-texto cifra-tabular">
          {v} {v === 1 ? 'préstamo' : 'préstamos'}
        </span>
      )
    }
  ];

  const columnasPorArea = [
    {
      clave: 'area',
      encabezado: 'Área Corporativa',
      ordenable: true,
      render: (v) => <span className="font-semibold text-texto">{v}</span>
    },
    {
      clave: 'totalPrestamos',
      encabezado: 'Total Solicitudes',
      ordenable: true,
      render: (v) => (
        <span className="font-bold text-sm text-primario cifra-tabular">
          {v} {v === 1 ? 'préstamo' : 'préstamos'}
        </span>
      )
    }
  ];

  const columnasMovimientos = [
    {
      clave: 'fecha',
      encabezado: 'Fecha y Hora',
      ordenable: true,
      render: (v) => <span className="text-xs text-texto-suave cifra-tabular">{formatearFechaHora(v)}</span>
    },
    {
      clave: 'equipoCodigo',
      encabezado: 'Equipo',
      render: (v, f) => (
        <div>
          <span className="font-mono font-bold text-xs text-primario">{v}</span>
          <p className="text-xs text-texto-suave truncate max-w-[150px]">{f.equipoNombre}</p>
        </div>
      )
    },
    {
      clave: 'tipo',
      encabezado: 'Tipo Movimiento',
      ordenable: true,
      render: (v) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-superficie-2 text-texto border border-borde">
          {v}
        </span>
      )
    },
    {
      clave: 'transicion',
      encabezado: 'Transición',
      render: (_, f) => (
        <div className="flex items-center gap-1 text-xs">
          <Badge estado={f.estadoAnterior} discreto />
          <span className="text-texto-suave">→</span>
          <Badge estado={f.estadoNuevo} />
        </div>
      )
    },
    {
      clave: 'usuarioNombre',
      encabezado: 'Ejecutado Por',
      render: (v) => <span className="text-xs font-semibold text-texto">{v}</span>
    },
    {
      clave: 'detalle',
      encabezado: 'Detalle Técnico',
      render: (v) => <p className="text-xs text-texto-suave max-w-xs">{v}</p>
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-texto">
          Reportes y Trazabilidad de Auditoría
        </h1>
        <p className="text-xs text-texto-suave mt-1">
          Métricas de utilización institucional y registro inmutable de movimientos tecnológicos (RF-17).
        </p>
      </div>

      {/* Subpestañas */}
      <div className="flex items-center gap-2 border-b border-borde pb-1 overflow-x-auto">
        {PESTANAS_REPORTES.map((p) => (
          <button
            key={p.clave}
            type="button"
            onClick={() => setPestana(p.clave)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              pestana === p.clave
                ? 'bg-primario text-white shadow-xs'
                : 'text-texto-suave hover:text-texto hover:bg-superficie-2'
            }`}
          >
            {p.etiqueta}
          </button>
        ))}
      </div>

      {/* Contenido según pestaña */}
      {pestana === 'mas-utilizados' && (
        <TableList
          caption="Equipos tecnológicos con mayor índice de utilización y préstamos"
          columnas={columnasMasUtilizados}
          datos={masUtilizados}
          cargando={cargando}
          mensajeVacio="No hay suficientes datos de uso registrados."
        />
      )}

      {pestana === 'por-area' && (
        <TableList
          caption="Consolidado de solicitudes y préstamos agrupados por área corporativa"
          columnas={columnasPorArea}
          datos={porArea}
          cargando={cargando}
          mensajeVacio="No hay solicitudes agrupadas por área aún."
        />
      )}

      {pestana === 'movimientos' && (
        <div className="space-y-4">
          <FilterBar
            filtros={[
              {
                id: 'tipoMovimiento',
                etiqueta: 'Tipo de movimiento',
                valor: tipoMovimiento,
                opciones: OPCIONES_TIPO_MOVIMIENTO,
                alCambiar: setTipoMovimiento
              }
            ]}
            hayFiltrosActivos={Boolean(tipoMovimiento)}
            alLimpiarFiltros={() => setTipoMovimiento('')}
          />

          <TableList
            caption="Historial inmutable de auditoría y movimientos de equipos (RF-17)"
            columnas={columnasMovimientos}
            datos={movimientos}
            cargando={cargando}
            esFiltroActivo={Boolean(tipoMovimiento)}
            alLimpiarFiltros={() => setTipoMovimiento('')}
            mensajeVacio="No se registraron movimientos en el historial."
          />
        </div>
      )}
    </div>
  );
}
