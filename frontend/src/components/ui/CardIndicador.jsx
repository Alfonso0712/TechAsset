// Nielsen 1 · Nielsen 4 · Shneiderman 1 · Shneiderman 2 · Norman · CardIndicador
import PropTypes from 'prop-types';
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
    fondo: 'bg-primario-suave',
    texto: 'text-primario dark:text-primario-hover',
    borde: 'border-primario/20'
  },
  'marca-oscuro': {
    fondo: 'bg-primario-suave',
    texto: 'text-primario dark:text-primario-hover',
    borde: 'border-primario/20'
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
  textoAccion = '',
  compacto = true,
  ariaLabel = ''
}) {
  const txtEtiqueta = etiqueta || titulo || '';
  const txtDescripcion = descripcion || subtitulo || '';
  const config = CONFIG_TONOS[tono] || CONFIG_TONOS.primario;
  const chipClases = `${config.fondo} ${config.texto} ${config.borde}`;
  const esNumero = typeof valor === 'number' || /^\d+$/.test(String(valor));
  const nombreAccesible = ariaLabel || `${txtEtiqueta}: ${valor}. ${txtDescripcion}`;

  const Contenedor = destino ? Link : 'div';
  const propsContenedor = destino ? { to: destino, 'aria-label': nombreAccesible } : {};

  if (compacto) {
    return (
      <Contenedor
        {...propsContenedor}
        className={`card-indicador group relative flex flex-col justify-between p-4 rounded-tarjeta border border-borde bg-superficie hover:border-primario focus-visible:ring-2 focus-visible:ring-anillo-foco focus-visible:border-primario transition-all shadow-xs h-full no-underline outline-none ${
          destino ? 'cursor-pointer hover:shadow-sm' : ''
        }`}
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
            <span className="text-texto-suave/60 group-hover:text-primario transition-colors inline-flex items-center ml-auto" aria-hidden="true">
              {textoAccion && <span className="font-semibold text-primario-enlace mr-1">{textoAccion}</span>}
              <Icono nombre="ChevronRight" className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </span>
          )}
        </div>
      </Contenedor>
    );
  }

  return (
    <Contenedor
      {...propsContenedor}
      className={`card-indicador group relative flex flex-col h-full px-5 py-4 rounded-tarjeta border border-borde bg-superficie hover:border-primario focus-visible:ring-2 focus-visible:ring-anillo-foco focus-visible:border-primario transition-all shadow-xs no-underline outline-none ${
        destino ? 'cursor-pointer hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-texto-suave leading-snug">{txtEtiqueta}</span>
        <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${chipClases}`} aria-hidden="true">
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
      <div className="mt-auto pt-2.5 border-t border-borde flex items-center justify-between text-xs">
        <span className="text-texto-suave truncate">{txtDescripcion}</span>
        {destino && (
          <span className="text-texto-suave/60 group-hover:text-primario transition-colors inline-flex items-center ml-auto" aria-hidden="true">
            <Icono nombre="ChevronRight" className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </span>
        )}
      </div>
    </Contenedor>
  );
}

CardIndicador.propTypes = {
  etiqueta: PropTypes.string,
  titulo: PropTypes.string,
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  descripcion: PropTypes.string,
  subtitulo: PropTypes.string,
  icono: PropTypes.string,
  tono: PropTypes.string,
  destino: PropTypes.string,
  textoAccion: PropTypes.string,
  compacto: PropTypes.bool,
  ariaLabel: PropTypes.string
};
