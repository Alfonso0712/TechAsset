// Reportes ejecutivos, analítica de inventario y trazabilidad de movimientos · TechAsset · WCAG 2.2 AA (RF-14 a RF-17)
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { obtenerRangoPeriodo } from '../utils/fechas';
import { PESTANAS_REPORTES, OPCIONES_PERIODO } from '../utils/reportes';

import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import SelectInput from '../components/formulario/SelectInput';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';

import TabEquiposPorEstado from '../components/reportes/TabEquiposPorEstado';
import TabMasUtilizados from '../components/reportes/TabMasUtilizados';
import TabPrestamosPorArea from '../components/reportes/TabPrestamosPorArea';
import TabMovimientos from '../components/reportes/TabMovimientos';

export default function Reportes() {
  const [searchParams, setSearchParams] = useSearchParams();

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
  const [periodo, setPeriodo] = useState('todo');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const fnExportarRef = useRef(null);
  const registrarExportador = useCallback((fn) => {
    fnExportarRef.current = fn;
  }, []);

  useEffect(() => {
    if (periodo === 'personalizado') return;
    const { fechaDesde: d, fechaHasta: h } = obtenerRangoPeriodo(periodo);
    setFechaDesde(d);
    setFechaHasta(h);
  }, [periodo]);

  const cambiarPestana = (nuevaPestana) => {
    setPestana(nuevaPestana);
    const params = new URLSearchParams(searchParams);
    if (nuevaPestana === 'por-estado') params.delete('tab');
    else if (nuevaPestana === 'por-area') params.set('tab', 'areas');
    else if (nuevaPestana === 'mas-utilizados') params.set('tab', 'utilizados');
    else if (nuevaPestana === 'movimientos') params.set('tab', 'movimientos');
    setSearchParams(params, { replace: true });
  };

  const ejecutarExportar = () => {
    if (typeof fnExportarRef.current === 'function') {
      fnExportarRef.current();
    }
  };

  return (
    <div className="space-y-5 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <EncabezadoPagina
          titulo="Reportes"
          descripcion="Métricas de utilización corporativa y registro inmutable de trazabilidad de equipos."
        />

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
            alHacerClic={ejecutarExportar}
            aria-label="Exportar datos a CSV"
          >
            <Icono nombre="Download" className="w-3.5 h-3.5 mr-1" />
            <span>Exportar CSV</span>
          </Button>
        </div>
      </div>

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

      {pestana === 'por-estado' && <TabEquiposPorEstado alRegistrarExportar={registrarExportador} />}
      {pestana === 'mas-utilizados' && (
        <TabMasUtilizados
          fechaDesde={fechaDesde}
          fechaHasta={fechaHasta}
          alRegistrarExportar={registrarExportador}
        />
      )}
      {pestana === 'por-area' && (
        <TabPrestamosPorArea
          fechaDesde={fechaDesde}
          fechaHasta={fechaHasta}
          alRegistrarExportar={registrarExportador}
        />
      )}
      {pestana === 'movimientos' && (
        <TabMovimientos
          equipoIdInicial={equipoIdParam}
          alRegistrarExportar={registrarExportador}
        />
      )}
    </div>
  );
}
