// Nielsen 5 · Norman · Control de fecha accesible sobre CampoFormulario · Fidelidad ReservaUPLA
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';

const DateInput = forwardRef(function DateInput(
  {
    id,
    name,
    nombre,
    etiqueta = '',
    obligatorio = false,
    ayuda = '',
    error = '',
    value,
    valor,
    min,
    max,
    onChange,
    alCambiar,
    onBlur,
    alSalir,
    readOnly = false,
    soloLectura = false,
    className = '',
    tamano = 'md',
    claseInput = '',
    ...props
  },
  ref
) {
  const idGenerado = useId();
  const nombreCampo = nombre || name || '';
  const idFinal = id || `fecha-${nombreCampo || idGenerado}`;
  const valorActual = valor !== undefined ? valor : (value ?? '');
  const manejarCambio = alCambiar || onChange;
  const manejarSalida = alSalir || onBlur;
  const esSoloLectura = Boolean(soloLectura || readOnly);
  const describedBy = construirDescribedBy(idFinal, ayuda, error);
  const tieneError = Boolean(error);
  const estiloTamano = tamano === 'sm' ? 'h-9 px-2 text-xs sm:text-sm' : 'h-10 px-3.5 py-2 text-sm sm:text-base';

  return (
    <CampoFormulario id={idFinal} etiqueta={etiqueta} obligatorio={obligatorio} ayuda={ayuda} error={error} className={className}>
      <input
        ref={ref}
        id={idFinal}
        name={nombreCampo}
        type="date"
        value={valorActual}
        min={min}
        max={max}
        onChange={esSoloLectura ? undefined : manejarCambio}
        onBlur={manejarSalida}
        readOnly={esSoloLectura}
        aria-invalid={tieneError}
        aria-describedby={describedBy}
        className={`w-full ${estiloTamano} rounded-control border bg-superficie text-texto cifra-tabular transition-colors read-only:bg-superficie-2 ${
          tieneError ? 'border-error-borde focus:border-error-borde focus:ring-2 focus:ring-error-borde/20' : 'border-borde hover:border-borde-control focus:border-primario-enlace focus:ring-2 focus:ring-primario/20'
        } focus:outline-none ${claseInput}`.trim()}
        {...props}
      />
    </CampoFormulario>
  );
});

export default DateInput;
