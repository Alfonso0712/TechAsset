import { useEffect } from 'react';
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
  tamano = 'md',
  className = ''
}) {
  const contenedorRef = useTrampaFoco(abierto);

  useEffect(() => {
    if (!abierto) return undefined;

    function handleKeyDown(e) {
      if (e.key === 'Escape' && !enProceso) {
        alCerrar?.();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [abierto, enProceso, alCerrar]);

  if (!abierto) return null;

  const clasesTamano = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }[tamano] || 'max-w-lg';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
    >
      <div
        ref={contenedorRef}
        className={`w-full ${clasesTamano} bg-superficie rounded-xl border border-borde shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${className}`}
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between p-5 border-b border-borde bg-superficie-2/50">
          <div>
            <h3 id="modal-titulo" className="text-lg font-bold text-texto">
              {titulo}
            </h3>
            {subtitulo && (
              <p className="mt-1 text-xs text-texto-suave">{subtitulo}</p>
            )}
          </div>
          <button
            type="button"
            onClick={alCerrar}
            disabled={enProceso}
            aria-label="Cerrar ventana modal"
            className="p-1 rounded-md text-texto-suave hover:text-texto hover:bg-superficie-2 transition-colors disabled:opacity-40"
          >
            <Icono nombre="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-5 overflow-y-auto flex-1 text-sm text-texto">
          {children}
        </div>

        {/* Pie de acción */}
        {(textoPrimario || textoSecundario) && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-borde bg-superficie-2/30">
            {textoSecundario && (
              <Button
                variante="secundario"
                onClick={alCerrar}
                disabled={enProceso}
              >
                {textoSecundario}
              </Button>
            )}
            {textoPrimario && (
              <Button
                variante={variantePrimaria}
                onClick={alConfirmar}
                enProceso={enProceso}
                disabled={deshabilitarConfirmar}
              >
                {textoPrimario}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
