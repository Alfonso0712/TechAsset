import Icono from './Icono';

const VARIANTES = {
  primario: 'bg-primario-suave text-primario dark:text-primario-hover',
  exito: 'bg-exito-fondo text-exito-texto',
  advertencia: 'bg-advertencia-fondo text-advertencia-texto',
  peligro: 'bg-peligro-fondo text-peligro-texto',
  informacion: 'bg-info-fondo text-info-texto'
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
