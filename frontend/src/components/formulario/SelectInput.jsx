import { forwardRef } from 'react';
import Icono from '../ui/Icono';

const SelectInput = forwardRef(function SelectInput(
  {
    id,
    name,
    value,
    onChange,
    onBlur,
    opciones = [],
    placeholder = 'Seleccione una opción',
    disabled = false,
    error = false,
    className = '',
    ...props
  },
  ref
) {
  const bordeClase = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-borde focus:ring-anillo-foco focus:border-primario';

  return (
    <div className="relative">
      <select
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={`w-full h-11 pl-3.5 pr-10 rounded-md border bg-superficie text-sm text-texto outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer ${bordeClase} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {opciones.map((opt) => (
          <option key={opt.valor} value={opt.valor}>
            {opt.etiqueta}
          </option>
        ))}
      </select>
      <Icono
        nombre="ChevronDown"
        className="w-4 h-4 text-texto-suave absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
      />
    </div>
  );
});

export default SelectInput;
