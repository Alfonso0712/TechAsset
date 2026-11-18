// WCAG 2.2 AA · ISO 9241-11 · ModalDialog unificado con createPortal en document.body
import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import Button from './Button';
import Icono from './Icono';

export default function ModalDialog({
  abierto = false,
  alCerrar,
  titulo,
  subtitulo,
  children,
  textoPrimario,
  textoSecundario = 'Cancelar',
  variantePrimaria = 'primary',
  enProceso = false,
  alConfirmar,
  deshabilitarConfirmar = false,
  tieneCambiosSinGuardar = false,
  tamano = 'md',
  className = ''
}) {
  const idGenerado = useId();
  const idTitulo = `modal-titulo-${idGenerado}`;
  const idSubtitulo = `modal-subtitulo-${idGenerado}`;
  const contenedorRef = useTrampaFoco(abierto);

  useEffect(() => {
    if (!abierto || typeof document === 'undefined') return undefined;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const overflowOriginal = document.body.style.overflow;
    const paddingRightOriginal = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const nodoRoot = document.getElementById('root');
    if (nodoRoot) {
      nodoRoot.setAttribute('aria-hidden', 'true');
      nodoRoot.setAttribute('inert', '');
      try {
        nodoRoot.inert = true;
      } catch {
        // Soporte de navegadores antiguos
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape' && !enProceso) {
        if (tieneCambiosSinGuardar) {
          const confirma = window.confirm('Tiene cambios sin guardar. ¿Desea descartarlos y cerrar?');
          if (!confirma) return;
        }
        alCerrar?.();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflowOriginal;
      document.body.style.paddingRight = paddingRightOriginal;

      if (nodoRoot) {
        nodoRoot.removeAttribute('aria-hidden');
        nodoRoot.removeAttribute('inert');
        try {
          nodoRoot.inert = false;
        } catch {
          // Soporte
        }
      }
    };
  }, [abierto, enProceso, tieneCambiosSinGuardar, alCerrar]);

  if (!abierto) return null;

  const clasesTamano = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }[tamano] || 'max-w-lg';

  const manejarClickFondo = () => {
    if (enProceso) return;
    if (tieneCambiosSinGuardar) {
      const confirma = window.confirm('Tiene cambios sin guardar. ¿Desea descartarlos y cerrar?');
      if (!confirma) return;
    }
    alCerrar?.();
  };

  const modalElement = (
    <div className="fixed inset-0 z-[100] w-screen min-h-[100dvh] overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Cerrar modal al hacer clic afuera"
        className="fixed inset-0 w-full h-full cursor-default bg-transparent border-0 p-0 m-0 -z-10 focus:outline-none"
        onClick={manejarClickFondo}
      />
      <div
        ref={contenedorRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={subtitulo ? idSubtitulo : undefined}
        className={`relative z-10 w-full ${clasesTamano} mx-2 sm:mx-auto max-h-[calc(100dvh-2rem)] bg-superficie rounded-xl border border-borde shadow-2xl overflow-hidden flex flex-col ${className}`.trim()}
      >
        {/* Encabezado fijo */}
        <div className="flex items-start justify-between p-5 border-b border-borde bg-superficie-2/50 shrink-0">
          <div className="pr-2">
            <h2 id={idTitulo} className="text-lg font-bold text-texto tracking-tight m-0">
              {titulo}
            </h2>
            {subtitulo && (
              <p id={idSubtitulo} className="mt-1 text-xs sm:text-sm text-texto-suave m-0 leading-normal">
                {subtitulo}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={alCerrar}
            disabled={enProceso}
            aria-label="Cerrar ventana modal"
            className="h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-1.5 inline-flex items-center justify-center rounded-full text-texto-suave hover:text-texto hover:bg-superficie transition-colors disabled:opacity-40"
          >
            <Icono nombre="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo con scroll interno */}
        <div className="p-6 overflow-y-auto flex-1 text-sm text-texto">
          {children}
        </div>

        {/* Pie fijo */}
        {(textoPrimario || textoSecundario) && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-borde bg-superficie-2/30 shrink-0">
            {textoSecundario && (
              <Button
                tipo="button"
                variante="secundario"
                alHacerClic={alCerrar}
                deshabilitado={enProceso}
              >
                {textoSecundario}
              </Button>
            )}
            {textoPrimario && (
              <Button
                tipo="button"
                variante={variantePrimaria}
                alHacerClic={alConfirmar}
                enProceso={enProceso}
                deshabilitado={deshabilitarConfirmar}
              >
                {textoPrimario}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : modalElement;
}
