import Icono from './Icono';

const VARIANTES = {
  primario: 'bg-primario-suave text-primario dark:text-primario-hover',
  exito: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  advertencia: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
  peligro: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400',
  informacion: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
};

export default function CardIndicador({
  titulo,
  valor,
  subtitulo,
  icono = 'BarChart3',
  variante = 'primario',
  onClick,
  className = ''
}) {
  const claseColor = VARIANTES[variante] || VARIANTES.primario;

  const contenido = (
    <div className={`p-5 rounded-xl border border-borde bg-superficie shadow-sm flex items-start justify-between gap-4 transition-all ${onClick ? 'cursor-pointer hover:border-primario hover:shadow-md' : ''} ${className}`}>
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-texto-suave">
          {titulo}
        </span>
        <div className="mt-1 text-2xl font-bold text-texto cifra-tabular">
          {valor}
        </div>
        {subtitulo && (
          <p className="mt-1 text-xs text-texto-suave">
            {subtitulo}
          </p>
        )}
      </div>
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${claseColor}`}>
        <Icono nombre={icono} className="w-5 h-5" />
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-anillo-foco rounded-xl"
      >
        {contenido}
      </button>
    );
  }

  return contenido;
}
