// Encabezado del Panel · TechAsset · WCAG 2.2 AA
import { useFocoAlMontar } from '../../hooks/useFocoAlMontar';
import Button from '../ui/Button';
import Icono from '../ui/Icono';

export default function EncabezadoPanel({ puedeSolicitar = false, alSolicitarPrestamo }) {
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
      {puedeSolicitar && (
        <div className="flex items-center gap-2.5 shrink-0">
          <Button variante="primario" alHacerClic={alSolicitarPrestamo}>
            <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Solicitar préstamo</span>
          </Button>
        </div>
      )}
    </div>
  );
}
