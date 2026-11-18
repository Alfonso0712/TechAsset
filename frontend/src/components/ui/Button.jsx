import { forwardRef } from 'react';
import Icono from './Icono';

const VARIANTES_BASE = {
  primary: 'bg-primario text-sobre-primario hover:bg-primario-hover border border-transparent font-medium shadow-sm',
  'neutral-info': 'bg-superficie-2 text-primario border border-borde hover:bg-primario-suave font-medium',
  success: 'bg-[var(--btn-success-bg)] text-white border border-[var(--btn-success-border)] hover:bg-[var(--btn-success-hover-bg)] font-semibold shadow-sm',
  danger: 'bg-[var(--btn-danger-bg)] text-white border border-[var(--btn-danger-border)] hover:bg-[var(--btn-danger-hover-bg)] font-semibold shadow-sm',
  'danger-outline': 'bg-superficie text-[var(--btn-danger-bg)] border border-[var(--btn-danger-border)] hover:bg-error-fondo font-semibold',
  warning: 'bg-[var(--btn-warning-bg)] text-white border border-[var(--btn-warning-border)] hover:bg-[var(--btn-warning-hover-bg)] font-medium',
  secondary: 'bg-superficie text-texto border border-borde hover:bg-superficie-2 hover:border-borde-control font-medium',
  ghost: 'bg-transparent text-texto border border-transparent hover:bg-superficie-2 font-medium',
  'icon-only': 'bg-superficie text-texto border border-borde hover:bg-superficie-2 font-medium'
};

const ALIAS_VARIANTES = {
  primario: 'primary',
  info: 'neutral-info',
  peligro: 'danger',
  advertencia: 'warning',
  secundario: 'secondary',
  fantasma: 'ghost'
};

const Button = forwardRef(function Button(
  {
    children,
    type,
    tipo,
    variante = 'primary',
    tamano = 'md',
    enProceso = false,
    textoProceso = 'Cargando…',
    icono = null,
    className = '',
    disabled = false,
    iconOnly = false,
    tooltip = '',
    alineacionTooltip = 'centro',
    'aria-label': ariaLabelProp,
    onClick,
    ...props
  },
  ref
) {
  const tieneChildren = children !== undefined && children !== null && children !== false && children !== '';
  const esIconOnly = iconOnly || variante === 'icon-only';
  const tipoBoton = tipo || type || 'button';
  const bloqueado = disabled || enProceso;
  const clave = ALIAS_VARIANTES[variante] || variante;
  const clasesVariante = VARIANTES_BASE[clave] || VARIANTES_BASE.primary;
  const tamanoIcono = tamano === 'sm' ? 'w-4 h-4' : 'w-[18px] h-[18px]';
  const label = ariaLabelProp || tooltip || (typeof children === 'string' ? children : undefined);

  // WCAG 2.2 touch target mínimo 44px (h-11) o controles compactos de 36px (h-9)
  const clasesTamano = tamano === 'sm'
    ? (esIconOnly ? 'h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-0' : 'h-9 min-h-[2.25rem] px-3.5 text-sm gap-1.5 whitespace-nowrap')
    : (esIconOnly ? 'h-11 w-11 min-h-[2.75rem] min-w-[2.75rem] p-0' : 'h-11 min-h-[2.75rem] px-4 text-[0.9375rem] gap-2 whitespace-nowrap');

  return (
    <button
      ref={ref}
      type={tipoBoton}
      disabled={bloqueado}
      aria-busy={enProceso || undefined}
      aria-label={label}
      onClick={(e) => {
        if (bloqueado) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      className={`group relative inline-flex items-center justify-center ${esIconOnly ? 'rounded-full' : 'rounded-md'} whitespace-nowrap font-medium transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-anillo-foco disabled:opacity-50 disabled:cursor-not-allowed ${clasesTamano} ${clasesVariante} ${className}`.trim()}
      {...props}
    >
      {enProceso ? (
        <Icono nombre="Loader2" className={`${tamanoIcono} animate-spin`} />
      ) : icono ? (
        <Icono nombre={icono} className={tamanoIcono} />
      ) : null}
      {!esIconOnly && tieneChildren && (
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          {enProceso ? textoProceso : children}
        </span>
      )}
      {tooltip && (
        <span
          role="tooltip"
          className={`pointer-events-none hidden group-hover:block group-focus-visible:block absolute -top-8 ${
            alineacionTooltip === 'derecha' ? 'right-0' : alineacionTooltip === 'izquierda' ? 'left-0' : 'left-1/2 -translate-x-1/2'
          } z-50 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs bg-lateral-fondo text-white shadow-sm transition-opacity`}
        >
          {tooltip}
        </span>
      )}
    </button>
  );
});

export default Button;
