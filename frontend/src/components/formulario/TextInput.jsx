import { forwardRef } from 'react';

const TextInput = forwardRef(function TextInput(
  {
    id,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    disabled = false,
    error = false,
    type = 'text',
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
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={Boolean(error)}
      className={`w-full h-11 px-3.5 rounded-md border bg-superficie text-sm text-texto placeholder:text-texto-suave/60 outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${bordeClase} ${className}`}
      {...props}
    />
  );
});

export default TextInput;
