// Pestaña 2 de Reportes: Equipos más utilizados · TechAsset
import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { reporteService } from '../../services/reporteService';
import { exportarCsv } from '../../utils/exportarCsv';
import { fechaHoyLima } from '../../utils/fechas';
import { obtenerEtiquetaCategoria } from '../../constants/etiquetas';
import { obtenerEstiloMedalla, OPCIONES_CATEGORIA_REPORTE } from '../../utils/reportes';
import TableList from '../ui/TableList';
import CardIndicador from '../ui/CardIndicador';
import SelectInput from '../formulario/SelectInput';
import Button from '../ui/Button';
import Icono from '../ui/Icono';

export default function TabMasUtilizados({ fechaDesde, fechaHasta, alRegistrarExportar }) {
  const [cargando, setCargando] = useState(true);
  const [masUtilizados, setMasUtilizados] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const resp = await reporteService.obtenerEquiposMasUtilizados({
        limite: 10,
        categoria: filtroCategoria || undefined,
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined
      });
      setMasUtilizados(resp.estado === 200 && Array.isArray(resp.datos) ? resp.datos : []);
    } catch {
      // Ignorar fallas transitorias de red
    } finally {
      setCargando(false);
    }
  }, [filtroCategoria, fechaDesde, fechaHasta]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const maxUso = useMemo(() => {
    return Math.max(...masUtilizados.map((e) => e.totalPrestamos || 0), 1);
  }, [masUtilizados]);

  const columnasMasUtilizados = useMemo(() => [
    {
      clave: 'ranking',
      encabezado: 'Pos.',
      claseEncabezado: 'w-[1%] whitespace-nowrap pl-4 pr-2 text-center',
      claseCelda: 'w-[1%] whitespace-nowrap pl-4 pr-2 text-center',
      render: (item, index) => {
        const pos = typeof index === 'number' ? index + 1 : 1;
        const claseMedalla = obtenerEstiloMedalla(pos);

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
  ], [maxUso]);

  const exportarCsvTab = useCallback(() => {
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
  }, [masUtilizados]);

  useEffect(() => {
    if (alRegistrarExportar) {
      alRegistrarExportar(exportarCsvTab);
    }
  }, [alRegistrarExportar, exportarCsvTab]);

  return (
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
            opciones={OPCIONES_CATEGORIA_REPORTE}
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
  );
}

TabMasUtilizados.propTypes = {
  fechaDesde: PropTypes.string,
  fechaHasta: PropTypes.string,
  alRegistrarExportar: PropTypes.func
};
