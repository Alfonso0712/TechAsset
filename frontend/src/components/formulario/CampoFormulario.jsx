// Nielsen 4 · Nielsen 6 · Nielsen 9 · WCAG 2.2 AA · E-26
import Icono from '../ui/Icono';

export const CLASES_FORMULARIO = Object.freeze({
  campo: 'flex flex-col gap-1.5 w-full',
  filaDoble: 'grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 items-start',
  formulario: 'space-y-4',
  cuerpoModal: 'p-6',
  mensajeInferior: 'mt-1.5 flex flex-wrap items-center justify-between gap-1.5'
});

export function construirDescribedBy(id, ayuda, error, extraId = '') {
  const ids = [];
  if (error) {
    ids.push(`${id}-error`);
  } else if (ayuda) {
    ids.push(`${id}-ayuda`);
  }
  if (extraId) ids.push(extraId);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

export default function CampoFormulario({
  id,
  etiqueta,
  obligatorio = true,
  ayuda = '',
  error = '',
  contador = null,
  avisoExtra = null,
  children,
  className = '',
  mostrarOpcional = false
}) {
  if (!etiqueta && !ayuda && !error && !contador && !avisoExtra && !className) {
    return children;
  }

  const tieneInferior = Boolean(error || ayuda || contador);

  return (
    <div className={`${CLASES_FORMULARIO.campo} ${className}`.trim()}>
      {etiqueta && (
        <label htmlFor={id} className="text-sm font-semibold text-texto leading-none">
          <span>{etiqueta}</span>
          {obligatorio ? (
            <>
              <span className="ml-1 text-xs font-semibold text-error-texto" aria-hidden="true">(*)</span>
              <span className="sr-only"> (obligatorio)</span>
            </>
          ) : mostrarOpcional ? (
            <span className="ml-1 text-xs font-normal text-texto-suave" title="Campo opcional">(opcional)</span>
          ) : null}
        </label>
      )}

      {children}

      {tieneInferior && (
        <div className={CLASES_FORMULARIO.mensajeInferior}>
          {error ? (
            <p
              id={`${id}-error`}
              role="alert"
              className="animacion-aparicion-error flex items-center gap-1.5 text-sm font-medium text-error-texto m-0 motion-reduce:animate-none"
            >
              <Icono nombre="AlertCircle" className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </p>
          ) : ayuda ? (
            <span id={`${id}-ayuda`} className="text-sm text-texto-suave">
              {ayuda}
            </span>
          ) : null}
          {contador && (
            <span className="text-sm text-texto-suave cifra-tabular ml-auto">
              {contador}
            </span>
          )}
        </div>
      )}

      {avisoExtra}
    </div>
  );
}
