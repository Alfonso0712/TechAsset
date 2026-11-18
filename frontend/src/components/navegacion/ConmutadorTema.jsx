// Shneiderman 2 · WCAG 2.2 AA · Conmutador de tema claro/oscuro con persistencia
import { useTema } from '../../hooks/useTema';
import Icono from '../ui/Icono';

export default function ConmutadorTema({ tema: temaProp, alAlternar, className = '', mimetizado = false }) {
  const { tema: temaHook, alternarTema } = useTema();
  const temaActual = temaProp || temaHook;
  const manejarAlternar = alAlternar || alternarTema;
  const esOscuro = temaActual === 'oscuro';
  const etiqueta = esOscuro ? 'Modo claro' : 'Modo oscuro';
  const ariaLabel = esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

  const estiloFondo = mimetizado
    ? 'border-white/25 bg-white/10 backdrop-blur-md text-[#D3E3F2] hover:text-white hover:bg-white/15'
    : 'border-borde bg-superficie text-texto hover:bg-superficie-2';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={manejarAlternar}
      className={`h-[38px] inline-flex items-center gap-1.5 px-3 rounded-pill border ${estiloFondo} text-xs font-semibold transition-colors cursor-pointer ${className}`.trim()}
    >
      <Icono nombre={esOscuro ? 'Sun' : 'Moon'} className="w-3.5 h-3.5 text-[#38BDF0]" />
      <span>{etiqueta}</span>
    </button>
  );
}
