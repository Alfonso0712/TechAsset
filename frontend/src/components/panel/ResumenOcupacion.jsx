// Franja compacta de resumen de actividad corporativa · TechAsset · America/Lima
import { Link } from 'react-router-dom';
import Icono from '../ui/Icono';
import { RUTAS } from '../../constants/rutas';
import { fechaHoyLima, obtenerRangoSemanaLima, esPrestamoVencido } from '../../utils/fechas';

export default function ResumenOcupacion({ prestamos = [], metricas = null }) {
  const hoyIso = fechaHoyLima();
  const { lunesIso, domingoIso } = obtenerRangoSemanaLima();

  const hoyRegistradosCalc = prestamos.filter((p) => {
    const fPrestamo = p.fechaPrestamo || (p.fechaCreacion && p.fechaCreacion.slice(0, 10));
    return fPrestamo === hoyIso;
  }).length;

  const devolucionesSemanaCalc = prestamos.filter((p) => {
    const fDevEst = p.fechaDevolucionEstimada || p.fde_Prestamo;
    return (
      (p.estado === 'Activo' || p.estado === 'Prestado') &&
      fDevEst >= lunesIso &&
      fDevEst <= domingoIso
    );
  }).length;

  const vencidosCalc = prestamos.filter((p) => esPrestamoVencido(p)).length;

  const hoyRegistrados = metricas?.prestamosHoy ?? hoyRegistradosCalc;
  const devolucionesSemana = metricas?.devolucionesSemana ?? devolucionesSemanaCalc;
  const vencidos = metricas?.prestamosVencidos ?? vencidosCalc;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 rounded-control border border-borde bg-superficie text-xs sm:text-sm shadow-xs">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-semibold text-texto flex items-center gap-1.5">
          <Icono nombre="Info" className="w-4 h-4 text-primario-enlace" />
          <span>Resumen de actividad:</span>
        </span>
        <span className="text-texto-suave">
          • Hoy: <strong className="font-bold text-texto cifra-tabular">{hoyRegistrados}</strong> {hoyRegistrados === 1 ? 'préstamo registrado' : 'préstamos registrados'}
        </span>
        <span className="text-texto-suave">
          • Esta semana: <strong className="font-bold text-texto cifra-tabular">{devolucionesSemana}</strong> {devolucionesSemana === 1 ? 'devolución prevista' : 'devoluciones previstas'}
        </span>
        <span className={vencidos > 0 ? 'text-peligro-texto font-bold' : 'text-texto-suave'}>
          • <strong className={`font-bold cifra-tabular ${vencidos > 0 ? 'text-peligro-texto' : 'text-texto'}`}>{vencidos}</strong> {vencidos === 1 ? 'vencido' : 'vencidos'}
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
