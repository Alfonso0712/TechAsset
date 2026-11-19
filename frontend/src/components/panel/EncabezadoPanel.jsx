// Encabezado del Panel · TechAsset · WCAG 2.2 AA · Nielsen 1 · Shneiderman 1
import PropTypes from 'prop-types';
import { useFocoAlMontar } from '../../hooks/useFocoAlMontar';
import Button from '../ui/Button';
import Icono from '../ui/Icono';

export default function EncabezadoPanel({
  puedeRegistrarDirecto = false,
  puedeSolicitar = false,
  alRegistrarPrestamo,
  alSolicitarPrestamo,
  ultimaActualizacion = '',
  alActualizar = null,
  cargando = false
}) {
  const refTitulo = useFocoAlMontar(true, 'Panel');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
      <div>
        <h1
          ref={refTitulo}
          tabIndex={-1}
          className="text-2xl sm:text-3xl font-bold text-texto tracking-tight outline-none m-0"
        >
          Panel
        </h1>
        <p className="mt-1 text-sm sm:text-base text-texto-suave leading-relaxed m-0">
          Resumen general del inventario y los préstamos de equipos.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {ultimaActualizacion && (
          <div className="flex items-center gap-1.5 text-xs text-texto-suave bg-superficie border border-borde px-2.5 py-1.5 rounded-control shadow-2xs" aria-live="polite">
            <Icono nombre="Clock" className="w-3.5 h-3.5 text-primario" />
            <span>Actualizado a las {ultimaActualizacion}</span>
            {alActualizar && (
              <button
                type="button"
                onClick={alActualizar}
                disabled={cargando}
                aria-label="Actualizar datos del panel"
                className="p-1 rounded-full text-texto-suave hover:text-primario hover:bg-superficie-2 transition-colors cursor-pointer disabled:opacity-50 ml-0.5"
                title="Actualizar datos del panel"
              >
                <Icono
                  nombre="RefreshCw"
                  className={`w-3.5 h-3.5 ${cargando ? 'animate-spin text-primario' : ''}`}
                />
              </button>
            )}
          </div>
        )}

        {puedeRegistrarDirecto ? (
          <Button variante="primario" alHacerClic={alRegistrarPrestamo}>
            <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Registrar préstamo</span>
          </Button>
        ) : puedeSolicitar ? (
          <Button variante="primario" alHacerClic={alSolicitarPrestamo}>
            <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Solicitar préstamo</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

EncabezadoPanel.propTypes = {
  puedeRegistrarDirecto: PropTypes.bool,
  puedeSolicitar: PropTypes.bool,
  alRegistrarPrestamo: PropTypes.func,
  alSolicitarPrestamo: PropTypes.func,
  ultimaActualizacion: PropTypes.string,
  alActualizar: PropTypes.func,
  cargando: PropTypes.bool
};
