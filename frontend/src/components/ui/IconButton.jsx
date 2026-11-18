import { forwardRef } from 'react';
import Icono from './Icono';

const VARIANTES_ICON_BUTTON = {
  editar: {
    clases: 'bg-ib-editar-fondo border-ib-editar-borde text-ib-editar-texto hover:brightness-95 dark:hover:brightness-125',
    iconoDefault: 'Pencil'
  },
  'cambiar-estado': {
    clases: 'bg-ib-cambiar-fondo border-ib-cambiar-borde text-ib-cambiar-texto hover:brightness-95 dark:hover:brightness-125',
    iconoDefault: 'RefreshCw'
  },
  deshabilitar: {
    clases: 'bg-ib-deshabilitar-fondo border-ib-deshabilitar-borde text-ib-deshabilitar-texto hover:brightness-95 dark:hover:brightness-125',
    iconoDefault: 'Ban'
  },
  habilitar: {
    clases: 'bg-ib-habilitar-fondo border-ib-habilitar-borde text-ib-habilitar-texto hover:brightness-95 dark:hover:brightness-125',
    iconoDefault: 'Check'
  },
  detalle: {
    clases: 'bg-superficie-2 border-borde text-texto hover:border-borde-control hover:text-primario',
    iconoDefault: 'Eye'
  },
  historial: {
    clases: 'bg-superficie-2 border-borde text-texto hover:border-borde-control hover:text-primario',
    iconoDefault: 'History'
  }
};

const IconButton = forwardRef(function IconButton(
  {
    icono,
    etiqueta,
    'aria-label': ariaLabelProp,
    variante = 'detalle',
    tooltip,
    disabled = false,
    deshabilitado = false,
    className = '',
    onClick,
    alHacerClic,
    tipo = 'button',
    type = 'button',
    ...props
  },
  ref
) {
  const conf = VARIANTES_ICON_BUTTON[variante] || VARIANTES_ICON_BUTTON.detalle;
  const nombreIcono = icono || conf.iconoDefault;
  const label = ariaLabelProp || etiqueta || tooltip || 'Acción';
  const textoTooltip = tooltip || etiqueta;
  const estaBloqueado = Boolean(disabled || deshabilitado);
  const handlerClick = alHacerClic || onClick;

  return (
    <button
      ref={ref}
      type={tipo || type}
      disabled={estaBloqueado}
      aria-label={label}
      onClick={(e) => {
        if (estaBloqueado) {
          e.preventDefault();
          return;
        }
        handlerClick?.(e);
      }}
      className={`group relative inline-flex items-center justify-center h-11 w-11 min-h-[2.75rem] min-w-[2.75rem] rounded-full border transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-anillo-foco disabled:opacity-50 disabled:cursor-not-allowed ${conf.clases} ${className}`.trim()}
      {...props}
    >
      <Icono nombre={nombreIcono} className="w-[18px] h-[18px]" />
      {textoTooltip && (
        <span
          role="tooltip"
          className="pointer-events-none hidden group-hover:block group-focus-visible:block absolute -top-8 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs bg-lateral-fondo text-white shadow-sm transition-opacity"
        >
          {textoTooltip}
        </span>
      )}
    </button>
  );
});

export default IconButton;
