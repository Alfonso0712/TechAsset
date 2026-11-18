// WCAG 2.2 AA · Switch accesible con input checkbox role="switch"
import { useId } from 'react';

export default function InterruptorSwitch({
  id: idProp,
  etiqueta = 'Recordar correo en este equipo',
  activo = false,
  alCambiar,
  disabled = false,
  className = ''
}) {
  const idGenerado = useId();
  const idFinal = idProp || `switch-${idGenerado}`;

  const manejarCambio = (e) => {
    if (disabled) return;
    alCambiar?.(e.target.checked);
  };

  return (
    <label
      htmlFor={idFinal}
      className={`min-h-[44px] inline-flex items-center gap-3 cursor-pointer select-none text-xs sm:text-sm text-texto-suave hover:text-texto ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`.trim()}
    >
      <span className="relative inline-flex items-center shrink-0">
        <input
          id={idFinal}
          type="checkbox"
          role="switch"
          aria-checked={activo}
          checked={activo}
          onChange={manejarCambio}
          disabled={disabled}
          className="sr-only peer"
        />
        {/* Pista de 44x24px (w-11 h-6) */}
        <span
          aria-hidden="true"
          className={`w-11 h-6 rounded-full transition-colors duration-150 motion-reduce:transition-none peer-focus-visible:ring-2 peer-focus-visible:ring-anillo-foco peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-superficie ${
            activo ? 'bg-primario' : 'bg-borde-control'
          }`}
        />
        {/* Pulgar redondo de 20px (w-5 h-5) */}
        <span
          aria-hidden="true"
          className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-150 motion-reduce:transition-none pointer-events-none ${
            activo ? 'translate-x-5 bg-sobre-primario' : 'translate-x-0 bg-white'
          }`}
        />
      </span>
      <span>{etiqueta}</span>
    </label>
  );
}
