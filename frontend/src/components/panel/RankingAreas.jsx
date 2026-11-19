// Ranking de demanda por áreas corporativas · TechAsset (RF-13) · WCAG 2.2 AA
import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import Icono from '../ui/Icono';
import Button from '../ui/Button';

// Áreas corporativas oficiales de Innovatech Solutions
const AREAS_INNOVATECH_OFICIALES = [
  'Desarrollo de Software',
  'Aseguramiento de Calidad (QA)',
  'Infraestructura y Redes',
  'Soporte Técnico de TI',
  'Diseño y Experiencia (UX/UI)',
  'Gestión de Proyectos y Operaciones'
];

export default function RankingAreas({ areas = [], prestamos = [] }) {
  const [mostrarTodas, setMostrarTodas] = useState(false);

  // Consolidar conteo dinámico sin duplicar claves ni crear discrepancias
  const ranking = useMemo(() => {
    const mapa = {};
    AREAS_INNOVATECH_OFICIALES.forEach((nom) => {
      mapa[nom] = 0;
    });

    if (Array.isArray(areas) && areas.length > 0) {
      areas.forEach((a) => {
        let nombre = (a.areaNombre || a.area || a.nombre || '').trim();
        // Compatibilidad de alias histórico si vino como Data Center
        if (nombre === 'Data Center & Infraestructura') {
          nombre = 'Infraestructura y Redes';
        }
        if (nombre) {
          mapa[nombre] = (a.totalPrestamos ?? a.cantidad ?? 0);
        }
      });
    } else if (Array.isArray(prestamos) && prestamos.length > 0) {
      prestamos.forEach((p) => {
        let nombre = (p.solicitante?.areaNombre || p.solicitante?.area?.nombre || p.solicitanteArea || '').trim();
        if (nombre === 'Data Center & Infraestructura') {
          nombre = 'Infraestructura y Redes';
        }
        if (nombre) {
          mapa[nombre] = (mapa[nombre] || 0) + 1;
        }
      });
    }

    return Object.entries(mapa)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => {
        // Orden descendente por cantidad; los de 0 al final
        if (b.cantidad !== a.cantidad) return b.cantidad - a.cantidad;
        return a.nombre.localeCompare(b.nombre);
      });
  }, [areas, prestamos]);

  const totalPrestamosAreas = useMemo(() => {
    return ranking.reduce((acc, curr) => acc + curr.cantidad, 0);
  }, [ranking]);

  const maxCant = useMemo(() => {
    return Math.max(1, ranking[0]?.cantidad || 0);
  }, [ranking]);

  const totalAreas = ranking.length;
  const itemsVisibles = mostrarTodas ? ranking : ranking.slice(0, 5);

  return (
    <div className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-borde">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-texto m-0">
            Demanda por áreas
          </h2>
          <span className="text-xs font-semibold text-texto-suave">
            {mostrarTodas ? `${totalAreas} áreas corporativas` : `Top 5 de ${totalAreas} áreas corporativas`}
          </span>
        </div>
        <Link
          to={`${RUTAS.REPORTES}?tab=areas`}
          className="text-xs font-semibold text-primario-enlace hover:underline inline-flex items-center gap-0.5"
        >
          <span>Ver reporte completo</span>
          <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3 my-auto">
        {itemsVisibles.map((item, index) => {
          const esPrimero = index === 0 && item.cantidad > 0;
          const esCero = item.cantidad === 0;
          const pctRelativo = maxCant > 0 && item.cantidad > 0
            ? Math.max(5, Math.round((item.cantidad / maxCant) * 100))
            : 0;
          const pctDelTotal = totalPrestamosAreas > 0
            ? Math.round((item.cantidad / totalPrestamosAreas) * 100)
            : 0;
          const ruta = `${RUTAS.PRESTAMOS}?area=${encodeURIComponent(item.nombre)}`;

          return (
            <div
              key={item.nombre}
              className={`space-y-1 transition-opacity ${esCero ? 'opacity-60' : 'opacity-100'}`}
            >
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      esPrimero
                        ? 'bg-primario text-white'
                        : esCero
                          ? 'bg-superficie-2 text-texto-suave/70'
                          : 'bg-superficie-2 text-texto-suave'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <Link
                    to={ruta}
                    aria-label={`Filtrar préstamos para el área ${item.nombre}: ${item.cantidad} préstamos`}
                    className="font-semibold text-texto hover:text-primario-enlace hover:underline truncate"
                  >
                    {item.nombre}
                  </Link>
                  {esPrimero && (
                    <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-pill text-[10px] font-bold bg-primario-suave text-primario">
                      Mayor demanda
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className="font-semibold text-texto cifra-tabular">
                    {item.cantidad} {item.cantidad === 1 ? 'préstamo' : 'préstamos'}
                  </span>
                  <span className="text-texto-suave text-xs font-normal cifra-tabular">
                    ({pctDelTotal}%)
                  </span>
                </div>
              </div>

              <div className="h-2 w-full rounded-pill bg-superficie-2 overflow-hidden">
                <div
                  className={`h-full rounded-pill transition-all duration-300 ${
                    esPrimero ? 'bg-primario' : esCero ? 'bg-transparent' : 'bg-grafico-marca'
                  }`}
                  style={{ width: `${pctRelativo}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalAreas > 5 && (
        <div className="pt-2 border-t border-borde/60 flex items-center justify-center">
          <Button
            variante="fantasma"
            tamano="sm"
            aria-expanded={mostrarTodas}
            alHacerClic={() => setMostrarTodas((prev) => !prev)}
            aria-label={mostrarTodas ? 'Ver solo las 5 áreas con mayor demanda' : 'Desplegar todas las áreas corporativas'}
          >
            <span>{mostrarTodas ? 'Ver menos (Top 5)' : `Ver todas las áreas (${totalAreas})`}</span>
            <Icono
              nombre={mostrarTodas ? 'ChevronUp' : 'ChevronDown'}
              className="w-3.5 h-3.5 ml-1 transition-transform"
            />
          </Button>
        </div>
      )}
    </div>
  );
}

RankingAreas.propTypes = {
  areas: PropTypes.arrayOf(PropTypes.object),
  prestamos: PropTypes.arrayOf(PropTypes.object)
};
