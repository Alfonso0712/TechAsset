// Nielsen 5 · Shneiderman 2 · WCAG 2.2 AA · Campo de texto accesible · E-26
import { forwardRef, useId, useState } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';
import Icono from '../ui/Icono';

const TextInput = forwardRef(function TextInput(
  {
    id,
    name,
    nombre,
    etiqueta,
    obligatorio = true,
    ayuda = '',
    error = '',
    type,
    tipo,
    value,
    valor,
    onChange,
    alCambiar,
    onBlur,
    alSalir,
    readOnly = false,
    soloLectura = false,
    placeholder = '',
    autoComplete,
    inputMode,
    enterKeyHint,
    maxLength,
    className = '',
    icono,
    mostrarOpcional = false,
    tamano = 'md',
    claseInput = '',
    tocado: tocadoProp,
    mostrarValido = true,
    ...props
  },
  ref
) {
  const [fueTocado, setFueTocado] = useState(false);
  const idGenerado = useId();
  const nombreCampo = nombre || name || '';
  const idFinal = id || `campo-${nombreCampo || idGenerado}`;
  const tipoCampo = tipo || type || 'text';
  const valorActual = valor !== undefined ? valor : (value ?? '');
  const manejarCambio = alCambiar || onChange;
  const manejarSalida = (e) => {
    setFueTocado(true);
    (alSalir || onBlur)?.(e);
  };
  const esSoloLectura = Boolean(soloLectura || readOnly);
  const describedBy = construirDescribedBy(idFinal, ayuda, error);
  const tieneError = Boolean(error);
  const estaTocado = tocadoProp !== undefined ? tocadoProp : fueTocado;
  const esValido = Boolean(mostrarValido && estaTocado && !tieneError && String(valorActual).trim().length > 0);
  const iconoVisible = icono || (tipoCampo === 'search' ? 'Search' : null);
  const altura = tamano === 'sm' ? 'h-9 text-xs sm:text-sm' : 'h-10 text-sm sm:text-base';
  const paddingDerecha = esValido ? 'pr-9' : 'pr-3.5';

  return (
    <CampoFormulario
      id={idFinal}
      etiqueta={etiqueta}
      obligatorio={obligatorio}
      ayuda={ayuda}
      error={error}
      className={className}
      mostrarOpcional={mostrarOpcional}
    >
      <div className="relative flex items-center w-full">
        {iconoVisible && (
          <Icono nombre={iconoVisible} className="w-4 h-4 text-texto-suave absolute left-3 pointer-events-none" />
        )}
        <input
          ref={ref}
          id={idFinal}
          name={nombreCampo}
          type={tipoCampo}
          value={valorActual}
          onChange={esSoloLectura ? undefined : manejarCambio}
          onBlur={manejarSalida}
          readOnly={esSoloLectura}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          maxLength={maxLength}
          aria-invalid={tieneError}
          aria-describedby={describedBy}
          className={`w-full ${altura} ${iconoVisible ? 'pl-9' : 'px-3.5'} ${paddingDerecha} py-2 rounded-control transition-colors duration-150 read-only:bg-superficie-2 read-only:cursor-not-allowed ${
            tieneError
              ? 'border-2 border-error-borde bg-superficie text-texto focus:border-error-borde focus:ring-2 focus:ring-error-borde/20 focus:outline-none'
              : esValido
              ? 'border-2 border-exito-borde bg-superficie text-texto focus:border-exito-borde focus:ring-2 focus:ring-exito-borde/20 focus:outline-none'
              : 'border border-borde bg-superficie text-texto hover:border-borde-control focus:bg-superficie focus:border-primario-enlace focus:ring-2 focus:ring-primario/20 focus:outline-none'
          } ${claseInput}`.trim()}
          {...props}
        />
        {esValido && (
          <Icono
            nombre="CheckCircle2"
            className="w-4 h-4 text-exito-borde absolute right-3 pointer-events-none"
            aria-hidden="true"
          />
        )}
      </div>
    </CampoFormulario>
  );
});

export default TextInput;
