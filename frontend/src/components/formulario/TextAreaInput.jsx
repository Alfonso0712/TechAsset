import { forwardRef } from 'react';

const TextAreaInput = forwardRef(function TextAreaInput(
  {
    id,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    rows = 3,
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
    <textarea
      ref={ref}
      id={id}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={Boolean(error)}
      className={`w-full p-3.5 rounded-md border bg-superficie text-sm text-texto placeholder:text-texto-suave/60 outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-y ${bordeClase} ${className}`}
      {...props}
    />
  );
});

export default TextAreaInput;
