// Pestaña 3 de Reportes: Préstamos por área · TechAsset
import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { reporteService } from '../../services/reporteService';
import { exportarCsv } from '../../utils/exportarCsv';
import { fechaHoyLima } from '../../utils/fechas';
import { AREAS_BASE_INNOVATECH } from '../../utils/reportes';
import TableList from '../ui/TableList';
import CardIndicador from '../ui/CardIndicador';

export default function TabPrestamosPorArea({ fechaDesde, fechaHasta, alRegistrarExportar }) {
  const [cargando, setCargando] = useState(true);
  const [porArea, setPorArea] = useState([]);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const resp = await reporteService.obtenerPrestamosPorArea({
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined
      });
      setPorArea(resp.estado === 200 && Array.isArray(resp.datos) ? resp.datos : []);
    } catch {
      // Ignorar fallas transitorias de red
    } finally {
      setCargando(false);
    }
  }, [fechaDesde, fechaHasta]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

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

  const columnasPorArea = useMemo(() => [
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
  ], [totalSolicitudesAreas]);

  const exportarCsvTab = useCallback(() => {
    const headers = ['Area', 'Solicitudes', 'Activos', 'Devueltos', 'Porcentaje'];
    const rows = datosAreaConsolidados.map((item) => {
      const pct = totalSolicitudesAreas > 0
        ? Math.round((item.totalPrestamos / totalSolicitudesAreas) * 100)
        : 0;
      return [item.areaNombre, item.totalPrestamos, item.activos, item.devueltos, `${pct}%`];
    });
    exportarCsv(`prestamos_por_area_${fechaHoyLima()}`, headers, rows);
  }, [datosAreaConsolidados, totalSolicitudesAreas]);

  useEffect(() => {
    if (alRegistrarExportar) {
      alRegistrarExportar(exportarCsvTab);
    }
  }, [alRegistrarExportar, exportarCsvTab]);

  return (
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
  );
}

TabPrestamosPorArea.propTypes = {
  fechaDesde: PropTypes.string,
  fechaHasta: PropTypes.string,
  alRegistrarExportar: PropTypes.func
};
