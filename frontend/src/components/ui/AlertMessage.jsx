// Nielsen 1 · Nielsen 9 · Shneiderman 4 · WCAG 2.2 AA · Alerta accesible con foco opcional · E-23..26
import { forwardRef, useEffect, useRef } from 'react';
import Icono from './Icono';

const CONFIG_VARIANTE = {
  error: { clases: 'bg-error-fondo text-error-banner-texto border-error-borde font-medium', claseIcono: 'text-error-texto', icono: 'AlertCircle', rolDefecto: 'alert' },
  peligro: { clases: 'bg-error-fondo text-error-banner-texto border-error-borde font-medium', claseIcono: 'text-error-texto', icono: 'AlertCircle', rolDefecto: 'alert' },
  exito: { clases: 'bg-exito-fondo text-exito-texto border-exito-borde font-medium', claseIcono: 'text-exito-borde', icono: 'CheckCircle2', rolDefecto: 'status' },
  advertencia: { clases: 'bg-advertencia-fondo text-advertencia-texto border-advertencia-borde font-medium', claseIcono: 'text-advertencia-borde', icono: 'AlertTriangle', rolDefecto: 'status' },
  info: { clases: 'bg-info-fondo text-info-texto border-info-borde font-medium', claseIcono: 'text-info-borde', icono: 'Info', rolDefecto: 'status' }
};

const AlertMessage = forwardRef(function AlertMessage(
  {
    variante = 'error',
    titulo = '',
    mensaje = '',
    children,
    accion = null,
    role,
    rol,
    enfocarAlAparecer = false,
    alCerrar = null,
    className = '',
    compacto = false,
    _modoToast = false,
    ...props
  },
  refExterna
) {
  const refInterna = useRef(null);
  const textoContenido = mensaje || children;

  useEffect(() => {
    if (enfocarAlAparecer && (titulo || textoContenido)) {
      refInterna.current?.focus();
    }
  }, [enfocarAlAparecer, titulo, textoContenido]);

  if (!titulo && !textoContenido) return null;

  const config = CONFIG_VARIANTE[variante] || CONFIG_VARIANTE.error;
  const rolFinal = rol || role || config.rolDefecto;
  const estiloBase = _modoToast
    ? `flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-control border shadow-lg text-sm max-w-md w-full transition-all ${config.clases}`
    : `flex flex-wrap items-start justify-between ${
        compacto ? 'gap-2 p-2 sm:p-2.5 text-xs sm:text-sm' : 'gap-3 py-3 px-4 text-base'
      } rounded-control border outline-none ${config.clases}`;
  const estiloIcono = config.claseIcono || '';

  return (
    <div
      ref={(nodo) => {
        refInterna.current = nodo;
        if (typeof refExterna === 'function') refExterna(nodo);
        else if (refExterna) refExterna.current = nodo;
      }}
      role={rolFinal}
      tabIndex={-1}
      className={`${estiloBase} ${className}`.trim()}
      {...props}
    >
      <div className={`flex items-${_modoToast ? 'center' : 'start'} ${compacto || _modoToast ? 'gap-2.5' : 'gap-3'} min-w-0`}>
        <Icono nombre={config.icono} className={`${compacto ? 'w-4 h-4' : 'w-5 h-5'} ${config.claseIcono || estiloIcono} mt-0.5 shrink-0`} />
        <div className={compacto || _modoToast ? 'text-xs sm:text-sm leading-snug' : 'text-base leading-relaxed'}>
          {titulo && <strong className="block font-semibold">{titulo}</strong>}
          {textoContenido && <div>{textoContenido}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-center">
        {accion}
        {alCerrar && (
          <button
            type="button"
            onClick={alCerrar}
            aria-label="Cerrar notificación"
            className="p-1 rounded-full text-texto-suave hover:text-texto"
          >
            <Icono nombre="X" className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
});

export default AlertMessage;
