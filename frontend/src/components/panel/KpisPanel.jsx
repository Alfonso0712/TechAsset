// Fila de 6 KPIs compactos del Panel · TechAsset (RF-13)
import CardIndicador from '../ui/CardIndicador';
import { RUTAS } from '../../constants/rutas';

export default function KpisPanel({ dashboard }) {
  const totalEquipos = dashboard?.totalEquipos ?? 0;
  const disponibles = dashboard?.equiposDisponibles ?? 0;
  const prestados = dashboard?.equiposPrestados ?? 0;
  const mantenimiento = dashboard?.equiposMantenimiento ?? 0;
  const totalPrestamos = dashboard?.totalPrestamos ?? 0;
  const areaMayorUso = dashboard?.areaMayorUso || 'Sin datos';

  const topAreaItem = Array.isArray(dashboard?.prestamosPorArea) && dashboard.prestamosPorArea.length > 0
    ? dashboard.prestamosPorArea[0]
    : null;
  const textoSubArea = topAreaItem?.totalPrestamos
    ? `${topAreaItem.totalPrestamos} préstamos`
    : 'Mayor volumen de préstamos';

  const kpis = [
    {
      clave: 'totalEquipos',
      etiqueta: 'Total de equipos',
      valor: totalEquipos,
      icono: 'Laptop',
      tono: 'primario',
      destino: RUTAS.EQUIPOS,
      ariaLabel: `Total de equipos: ${totalEquipos}. Ver catálogo completo`
    },
    {
      clave: 'disponibles',
      etiqueta: 'Equipos disponibles',
      valor: disponibles,
      icono: 'CheckCircle2',
      tono: 'exito',
      destino: `${RUTAS.EQUIPOS}?estado=Disponible`,
      ariaLabel: `Equipos disponibles: ${disponibles}. Ver equipos disponibles`
    },
    {
      clave: 'prestados',
      etiqueta: 'Equipos prestados',
      valor: prestados,
      icono: 'UserCheck',
      tono: 'info',
      destino: `${RUTAS.EQUIPOS}?estado=Prestado`,
      ariaLabel: `Equipos prestados: ${prestados}. Ver equipos prestados`
    },
    {
      clave: 'mantenimiento',
      etiqueta: 'Equipos en mantenimiento',
      valor: mantenimiento,
      icono: 'Wrench',
      tono: 'advertencia',
      destino: `${RUTAS.EQUIPOS}?estado=Mantenimiento`,
      ariaLabel: `Equipos en mantenimiento: ${mantenimiento}. Ver equipos en mantenimiento`
    },
    {
      clave: 'totalPrestamos',
      etiqueta: 'Total de préstamos',
      valor: totalPrestamos,
      icono: 'ClipboardList',
      tono: 'acento',
      destino: RUTAS.PRESTAMOS,
      ariaLabel: `Total de préstamos: ${totalPrestamos}. Ver historial de préstamos`
    },
    {
      clave: 'areaMayorUso',
      etiqueta: 'Área con mayor uso',
      valor: areaMayorUso,
      descripcion: textoSubArea,
      icono: 'Building2',
      tono: 'marca-oscuro',
      destino: `${RUTAS.REPORTES}?tab=areas`,
      ariaLabel: `Área con mayor uso: ${areaMayorUso}, ${textoSubArea}`
    }
  ];

  return (
    <section aria-label="Indicadores clave de inventario y préstamos" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <CardIndicador key={kpi.clave} compacto {...kpi} />
      ))}
    </section>
  );
}
