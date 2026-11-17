import { forwardRef } from 'react';

const DateInput = forwardRef(function DateInput(
  {
    id,
    name,
    value,
    onChange,
    onBlur,
    min,
    max,
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
    <input
      ref={ref}
      id={id}
      name={name}
      type="date"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      min={min}
      max={max}
      disabled={disabled}
      aria-invalid={Boolean(error)}
      className={`w-full h-11 px-3.5 rounded-md border bg-superficie text-sm text-texto outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${bordeClase} ${className}`}
      {...props}
    />
  );
});

export default DateInput;
