// Franja compacta de resumen de actividad corporativa · TechAsset
import { Link } from 'react-router-dom';
import Icono from '../ui/Icono';
import { RUTAS } from '../../constants/rutas';

export default function ResumenOcupacion({ prestamos = [] }) {
  const hoyIso = new Date().toISOString().split('T')[0];

  // Inicio y fin de la semana en curso (Lunes a Domingo)
  const ahora = new Date();
  const diaSemana = ahora.getDay() || 7;
  const lunes = new Date(ahora);
  lunes.setDate(ahora.getDate() - diaSemana + 1);
  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);
  const lunesIso = lunes.toISOString().split('T')[0];
  const domingoIso = domingo.toISOString().split('T')[0];

  const hoyRegistrados = prestamos.filter(
    (p) => p.fechaPrestamo === hoyIso || (p.fechaCreacion && p.fechaCreacion.startsWith(hoyIso))
  ).length;

  const devolucionesSemana = prestamos.filter(
    (p) =>
      p.estado === 'Prestado' &&
      p.fechaDevolucionEstimada >= lunesIso &&
      p.fechaDevolucionEstimada <= domingoIso
  ).length;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 rounded-control border border-borde bg-superficie text-xs sm:text-sm shadow-xs">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-semibold text-texto flex items-center gap-1.5">
          <Icono nombre="Activity" className="w-4 h-4 text-primario-enlace" />
          <span>Resumen de actividad:</span>
        </span>
        <span className="text-texto-suave">
          • Hoy: <strong className="font-bold text-texto cifra-tabular">{hoyRegistrados}</strong> {hoyRegistrados === 1 ? 'préstamo registrado' : 'préstamos registrados'}
        </span>
        <span className="text-texto-suave">
          • Esta semana: <strong className="font-bold text-texto cifra-tabular">{devolucionesSemana}</strong> {devolucionesSemana === 1 ? 'devolución prevista' : 'devoluciones previstas'}
        </span>
      </div>
      <Link
        to={RUTAS.PRESTAMOS}
        className="font-semibold text-primario-enlace hover:underline inline-flex items-center gap-1 shrink-0"
      >
        <span>Ver movimientos</span>
        <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
