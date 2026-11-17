import { useState, forwardRef } from 'react';
import Icono from '../ui/Icono';
import { useBloqMayus } from '../../hooks/useBloqMayus';

const PasswordInput = forwardRef(function PasswordInput(
  {
    id,
    name,
    value,
    onChange,
    onBlur,
    placeholder = '••••••••',
    disabled = false,
    error = false,
    className = '',
    ...props
  },
  ref
) {
  const [mostrar, setMostrar] = useState(false);
  const { bloqMayusActivo, verificarBloqMayus } = useBloqMayus();

  const bordeClase = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-borde focus:ring-anillo-foco focus:border-primario';

  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          ref={ref}
          id={id}
          name={name}
          type={mostrar ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={verificarBloqMayus}
          onKeyUp={verificarBloqMayus}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`w-full h-11 pl-3.5 pr-11 rounded-md border bg-superficie text-sm text-texto placeholder:text-texto-suave/60 outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${bordeClase} ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setMostrar(prev => !prev)}
          tabIndex={-1}
          aria-label={mostrar ? 'Ocultar contraseña' : 'Ver contraseña'}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-texto-suave hover:text-texto focus:outline-none"
        >
          <Icono nombre={mostrar ? 'EyeOff' : 'Eye'} className="w-4 h-4" />
        </button>
      </div>

      {bloqMayusActivo && (
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
          <Icono nombre="AlertTriangle" className="w-3.5 h-3.5 shrink-0" />
          Bloq Mayús está activado
        </p>
      )}
    </div>
  );
});

export default PasswordInput;
