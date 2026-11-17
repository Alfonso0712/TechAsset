import Icono from './Icono';
import Button from './Button';

export default function EstadoVacio({
  icono = 'Search',
  titulo = 'No se encontraron resultados',
  descripcion = 'Prueba ajustando los filtros de búsqueda o agrega un nuevo registro.',
  accionTexto,
  alAccionar,
  className = 'py-12'
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-borde bg-superficie ${className}`}>
      <div className="w-12 h-12 rounded-full bg-superficie-2 flex items-center justify-center text-texto-suave mb-3">
        <Icono nombre={icono} className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-texto mb-1">{titulo}</h3>
      <p className="text-sm text-texto-suave max-w-sm mb-4">{descripcion}</p>
      {accionTexto && alAccionar && (
        <Button variante="primary" onClick={alAccionar}>
          {accionTexto}
        </Button>
      )}
    </div>
  );
}
