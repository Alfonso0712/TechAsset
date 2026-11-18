// Fila de 6 KPIs compactos del Panel · TechAsset
import CardIndicador from '../ui/CardIndicador';
import { RUTAS } from '../../constants/rutas';

export default function KpisPanel({ dashboard }) {
  const totalEquipos = dashboard?.totalEquipos ?? 0;
  const disponibles = dashboard?.equiposDisponibles ?? 0;
  const prestados = dashboard?.equiposPrestados ?? 0;
  const mantenimiento = dashboard?.equiposMantenimiento ?? 0;
  const totalPrestamos = dashboard?.totalPrestamos ?? 0;
  const areaMayorUso = dashboard?.areaMayorUso || 'Sin datos suficientes';

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
      etiqueta: 'Disponibles',
      valor: disponibles,
      icono: 'CheckCircle2',
      tono: 'exito',
      destino: `${RUTAS.EQUIPOS}?estado=Disponible`,
      ariaLabel: `Equipos disponibles: ${disponibles}. Ver equipos disponibles`
    },
    {
      clave: 'prestados',
      etiqueta: 'Prestados',
      valor: prestados,
      icono: 'PackageCheck',
      tono: 'info',
      destino: `${RUTAS.EQUIPOS}?estado=Prestado`,
      ariaLabel: `Equipos prestados: ${prestados}. Ver equipos prestados`
    },
    {
      clave: 'mantenimiento',
      etiqueta: 'En mantenimiento',
      valor: mantenimiento,
      icono: 'AlertTriangle',
      tono: 'advertencia',
      destino: `${RUTAS.EQUIPOS}?estado=Mantenimiento`,
      acento: mantenimiento > 0,
      ariaLabel: `Equipos en mantenimiento: ${mantenimiento}. Ver equipos en mantenimiento`
    },
    {
      clave: 'totalPrestamos',
      etiqueta: 'Total de préstamos',
      valor: totalPrestamos,
      icono: 'ClipboardList',
      tono: 'primario',
      destino: RUTAS.PRESTAMOS,
      ariaLabel: `Total de préstamos: ${totalPrestamos}. Ver historial de préstamos`
    },
    {
      clave: 'areaMayorUso',
      etiqueta: 'Área con mayor uso',
      valor: areaMayorUso,
      descripcion: 'Mayor volumen de préstamos',
      icono: 'TrendingUp',
      tono: 'info',
      destino: `${RUTAS.REPORTES}?tab=areas`,
      ariaLabel: `Área con mayor uso: ${areaMayorUso}`
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
