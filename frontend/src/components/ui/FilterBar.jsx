import Icono from './Icono';
import Button from './Button';

export default function FilterBar({
  busqueda = '',
  alCambiarBusqueda,
  placeholderBusqueda = 'Buscar…',
  filtros = [],
  alLimpiarFiltros,
  hayFiltrosActivos = false,
  accionDerecha = null,
  className = ''
}) {
  return (
    <div className={`p-4 rounded-xl border border-borde bg-superficie shadow-sm space-y-3 ${className}`}>
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Barra de Búsqueda */}
        {alCambiarBusqueda && (
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-texto-suave">
              <Icono nombre="Search" className="w-4 h-4" />
            </span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => alCambiarBusqueda(e.target.value)}
              placeholder={placeholderBusqueda}
              aria-label={placeholderBusqueda}
              className="w-full h-10 pl-10 pr-3.5 rounded-md border border-borde bg-superficie text-sm text-texto placeholder:text-texto-suave/70 focus:outline-none focus:ring-2 focus:ring-anillo-foco focus:border-primario transition-colors"
            />
          </div>
        )}

        {/* Acción derecha opcional (por ej. botón Agregar) */}
        {accionDerecha && (
          <div className="shrink-0 flex items-center gap-2">
            {accionDerecha}
          </div>
        )}
      </div>

      {/* Selects de filtros dinámicos */}
      {filtros.length > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-borde/50">
          <span className="text-xs font-semibold uppercase tracking-wider text-texto-suave flex items-center gap-1 mr-1">
            <Icono nombre="Filter" className="w-3.5 h-3.5" />
            Filtros:
          </span>

          {filtros.map((filtro) => (
            <div key={filtro.id} className="relative inline-flex items-center">
              <select
                value={filtro.valor}
                onChange={(e) => filtro.alCambiar(e.target.value)}
                aria-label={filtro.etiqueta}
                className="h-9 pl-3 pr-8 rounded-md border border-borde bg-superficie text-xs font-medium text-texto focus:outline-none focus:ring-2 focus:ring-anillo-foco focus:border-primario transition-colors cursor-pointer appearance-none"
              >
                {filtro.opciones.map((opt) => (
                  <option key={opt.valor} value={opt.valor}>
                    {opt.etiqueta}
                  </option>
                ))}
              </select>
              <Icono
                nombre="ChevronDown"
                className="w-3.5 h-3.5 text-texto-suave absolute right-2.5 pointer-events-none"
              />
            </div>
          ))}

          {hayFiltrosActivos && alLimpiarFiltros && (
            <Button
              variante="ghost"
              tamano="sm"
              icono="RotateCcw"
              onClick={alLimpiarFiltros}
              className="text-xs text-primario font-semibold hover:bg-primario-suave/30 ml-auto"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
