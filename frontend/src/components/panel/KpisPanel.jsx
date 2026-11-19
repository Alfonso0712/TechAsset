// Fila de 6 KPIs principales del Panel · TechAsset (RF-13) · WCAG 2.2 AA
import PropTypes from 'prop-types';
import CardIndicador from '../ui/CardIndicador';
import { RUTAS } from '../../constants/rutas';

export default function KpisPanel({ dashboard }) {
  const totalEquipos = dashboard?.totalEquipos ?? 0;
  const disponibles = dashboard?.equiposDisponibles ?? 0;
  const prestados = dashboard?.equiposPrestados ?? 0;
  const mantenimiento = dashboard?.equiposMantenimiento ?? 0;
  const totalPrestamos = dashboard?.totalPrestamos ?? 0;
  const areaMayorUso = dashboard?.areaMayorUso || 'Sin solicitudes';

  const pctDisponibles = totalEquipos > 0 ? Math.round((disponibles / totalEquipos) * 100) : 0;
  const pctPrestados = totalEquipos > 0 ? Math.round((prestados / totalEquipos) * 100) : 0;

  const topAreaItem = Array.isArray(dashboard?.prestamosPorArea) && dashboard.prestamosPorArea.length > 0
    ? dashboard.prestamosPorArea[0]
    : null;
  const textoSubArea = topAreaItem?.totalPrestamos
    ? `${topAreaItem.totalPrestamos} ${topAreaItem.totalPrestamos === 1 ? 'préstamo' : 'préstamos'} registrados`
    : 'Mayor demanda de equipos';

  const kpis = [
    {
      clave: 'totalEquipos',
      etiqueta: 'Total de equipos',
      valor: totalEquipos,
      descripcion: 'Catálogo patrimonial registrado',
      icono: 'Laptop',
      tono: 'primario',
      destino: RUTAS.EQUIPOS,
      ariaLabel: `Total de equipos: ${totalEquipos}. Catálogo patrimonial registrado. Ir a equipos`
    },
    {
      clave: 'disponibles',
      etiqueta: 'Equipos disponibles',
      valor: disponibles,
      descripcion: `${pctDisponibles}% del inventario`,
      icono: 'CheckCircle2',
      tono: 'exito',
      destino: `${RUTAS.EQUIPOS}?estado=Disponible`,
      ariaLabel: `Equipos disponibles: ${disponibles}. ${pctDisponibles}% del inventario. Ir a equipos disponibles`
    },
    {
      clave: 'prestados',
      etiqueta: 'Equipos prestados',
      valor: prestados,
      descripcion: `${pctPrestados}% en uso activo`,
      icono: 'UserCheck',
      tono: 'info',
      destino: `${RUTAS.EQUIPOS}?estado=Prestado`,
      ariaLabel: `Equipos prestados: ${prestados}. ${pctPrestados}% en uso activo. Ir a equipos prestados`
    },
    {
      clave: 'mantenimiento',
      etiqueta: 'Equipos en mantenimiento',
      valor: mantenimiento,
      descripcion: mantenimiento > 0 ? 'Requieren revisión técnica' : 'Sin incidencias técnicas',
      icono: 'Wrench',
      tono: 'advertencia',
      destino: `${RUTAS.EQUIPOS}?estado=Mantenimiento`,
      ariaLabel: `Equipos en mantenimiento: ${mantenimiento}. ${mantenimiento > 0 ? 'Requieren revisión técnica' : 'Sin incidencias técnicas'}. Ir a equipos en mantenimiento`
    },
    {
      clave: 'totalPrestamos',
      etiqueta: 'Total de préstamos',
      valor: totalPrestamos,
      descripcion: 'Histórico acumulado',
      icono: 'ClipboardList',
      tono: 'acento',
      destino: RUTAS.PRESTAMOS,
      ariaLabel: `Total de préstamos: ${totalPrestamos}. Histórico acumulado. Ir a préstamos`
    },
    {
      clave: 'areaMayorUso',
      etiqueta: 'Área con mayor uso',
      valor: areaMayorUso,
      descripcion: textoSubArea,
      icono: 'Building2',
      tono: 'primario',
      destino: `${RUTAS.REPORTES}?tab=areas`,
      ariaLabel: `Área con mayor uso: ${areaMayorUso}. ${textoSubArea}. Ir a reporte de áreas`
    }
  ];

  return (
    <section aria-label="Indicadores clave de inventario y préstamos" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <CardIndicador key={kpi.clave} compacto {...kpi} />
      ))}
    </section>
  );
}

KpisPanel.propTypes = {
  dashboard: PropTypes.shape({
    totalEquipos: PropTypes.number,
    equiposDisponibles: PropTypes.number,
    equiposPrestados: PropTypes.number,
    equiposMantenimiento: PropTypes.number,
    totalPrestamos: PropTypes.number,
    areaMayorUso: PropTypes.string,
    prestamosPorArea: PropTypes.arrayOf(PropTypes.object)
  })
};
