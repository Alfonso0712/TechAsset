// Nielsen 5 · Shneiderman 6 · WCAG 2.2 AA · Área de texto accesible · E-26
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';

const TextAreaInput = forwardRef(function TextAreaInput(
  {
    id,
    name,
    nombre,
    etiqueta,
    obligatorio = true,
    ayuda = '',
    error = '',
    contador = null,
    value,
    valor,
    onChange,
    alCambiar,
    onBlur,
    alSalir,
    rows = 3,
    filas,
    placeholder = '',
    disabled = false,
    deshabilitado = false,
    readOnly = false,
    soloLectura = false,
    maxLength,
    className = '',
    claseTextarea = '',
    mostrarOpcional = false,
    ...props
  },
  ref
) {
  const idGenerado = useId();
  const nombreCampo = nombre || name || '';
  const idFinal = id || `textarea-${nombreCampo || idGenerado}`;
  const valorActual = valor !== undefined ? valor : (value ?? '');
  const manejarCambio = alCambiar || onChange;
  const manejarSalida = alSalir || onBlur;
  const esBloqueado = Boolean(disabled || deshabilitado || soloLectura || readOnly);
  const describedBy = construirDescribedBy(idFinal, ayuda, error);
  const tieneError = Boolean(error);
  const numeroFilas = filas !== undefined ? filas : rows;

  return (
    <CampoFormulario
      id={idFinal}
      etiqueta={etiqueta}
      obligatorio={obligatorio}
      ayuda={ayuda}
      error={error}
      contador={contador}
      className={className}
      mostrarOpcional={mostrarOpcional}
    >
      <textarea
        ref={ref}
        id={idFinal}
        name={nombreCampo}
        rows={numeroFilas}
        value={valorActual}
        onChange={esBloqueado ? undefined : manejarCambio}
        onBlur={manejarSalida}
        disabled={esBloqueado}
        readOnly={esBloqueado}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={tieneError}
        aria-describedby={describedBy}
        className={`w-full p-3 rounded-control text-sm sm:text-base transition-colors duration-150 resize-y read-only:bg-superficie-2 read-only:cursor-not-allowed ${
          tieneError
            ? 'border-2 border-error-borde bg-superficie text-texto focus:border-error-borde focus:ring-2 focus:ring-error-borde/20 focus:outline-none'
            : 'border border-borde bg-superficie text-texto hover:border-borde-control focus:bg-superficie focus:border-primario-enlace focus:ring-2 focus:ring-primario/20 focus:outline-none'
        } ${claseTextarea}`.trim()}
        {...props}
      />
    </CampoFormulario>
  );
});

export default TextAreaInput;
