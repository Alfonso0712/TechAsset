// Nielsen 1 · Nielsen 4 · Shneiderman 1 · Shneiderman 2 · Norman · CardIndicador
import { Link } from 'react-router-dom';
import Icono from './Icono';

const CONFIG_TONOS = {
  primario: {
    fondo: 'bg-primario-suave',
    texto: 'text-primario dark:text-primario-hover',
    borde: 'border-primario/20'
  },
  exito: {
    fondo: 'bg-exito-fondo',
    texto: 'text-exito-texto',
    borde: 'border-exito-borde'
  },
  info: {
    fondo: 'bg-info-fondo',
    texto: 'text-info-texto',
    borde: 'border-info-borde'
  },
  advertencia: {
    fondo: 'bg-advertencia-fondo',
    texto: 'text-advertencia-texto',
    borde: 'border-advertencia-borde'
  },
  peligro: {
    fondo: 'bg-peligro-fondo',
    texto: 'text-peligro-texto',
    borde: 'border-peligro-borde'
  },
  acento: {
    fondo: 'bg-superficie-2',
    texto: 'text-primario-enlace',
    borde: 'border-borde'
  },
  'marca-oscuro': {
    fondo: 'bg-marca-oscuro',
    texto: 'text-white',
    borde: 'border-marca-oscuro'
  }
};

export default function CardIndicador({
  etiqueta,
  titulo,
  valor,
  descripcion,
  subtitulo,
  icono = 'Laptop',
  tono = 'primario',
  destino = '',
  textoAccion = 'Ver',
  compacto = true,
  ariaLabel = ''
}) {
  const txtEtiqueta = etiqueta || titulo || '';
  const txtDescripcion = descripcion || subtitulo || '';
  const config = CONFIG_TONOS[tono] || CONFIG_TONOS.primario;
  const chipClases = `${config.fondo} ${config.texto}`;
  const esNumero = typeof valor === 'number' || /^\d+$/.test(String(valor));
  const nombreAccesible = ariaLabel || `${txtEtiqueta}: ${valor}. ${textoAccion}`;

  if (compacto) {
    return (
      <div
        className="card-indicador relative flex flex-col justify-between p-4 rounded-tarjeta border border-borde bg-superficie hover:border-primario focus-within:ring-2 focus-within:ring-anillo-foco focus-within:border-primario transition-colors shadow-xs h-full"
      >
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-semibold text-texto-suave truncate" title={txtEtiqueta}>
              {txtEtiqueta}
            </span>
            <span className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 border ${chipClases}`} aria-hidden="true">
              <Icono nombre={icono} className="w-4 h-4 shrink-0" />
            </span>
          </div>
          <div
            className={`mt-2 font-bold text-texto leading-snug ${
              esNumero
                ? 'text-2xl sm:text-3xl leading-none cifra-tabular truncate'
                : 'text-base sm:text-lg line-clamp-2 break-words'
            }`}
            title={String(valor)}
          >
            {valor}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-borde/40 flex items-center justify-between text-xs">
          {txtDescripcion ? (
            <span className="text-texto-suave truncate" title={txtDescripcion}>
              {txtDescripcion}
            </span>
          ) : (
            <span />
          )}
          {destino && (
            <span className="font-semibold text-primario-enlace inline-flex items-center gap-0.5 ml-auto">
              Ver
              <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {destino && (
          <Link
            to={destino}
            aria-label={nombreAccesible}
            className="focus:outline-none after:absolute after:inset-0 after:content-['']"
          />
        )}
      </div>
    );
  }

  return (
    <div className="card-indicador relative flex flex-col h-full px-5 py-4 rounded-tarjeta border border-borde bg-superficie hover:border-primario focus-within:ring-2 focus-within:ring-anillo-foco focus-within:border-primario transition-colors shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-texto-suave leading-snug">{txtEtiqueta}</span>
        <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${chipClases}`} aria-hidden="true">
          <Icono nombre={icono} className="w-5 h-5 shrink-0" />
        </span>
      </div>
      <div className="min-h-[2.5rem] flex items-center mt-2.5">
        <div className={esNumero ? 'text-3xl font-bold text-texto leading-none cifra-tabular' : 'text-xl font-semibold text-texto leading-snug line-clamp-2 break-words'}>
          {valor}
        </div>
      </div>
      {txtDescripcion && (
        <p className="mt-1 text-sm text-texto-suave leading-snug m-0">{txtDescripcion}</p>
      )}
      <div className="mt-auto pt-2.5 border-t border-borde">
        {destino ? (
          <Link
            to={destino}
            aria-label={nombreAccesible}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primario-enlace hover:underline focus:outline-none after:absolute after:inset-0 after:content-['']"
          >
            <span>{textoAccion}</span>
            <Icono nombre="ChevronRight" className="w-4 h-4 shrink-0" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-texto-suave">
            <span>{textoAccion}</span>
          </span>
        )}
      </div>
    </div>
  );
}
