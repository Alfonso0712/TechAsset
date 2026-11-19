// ISO 9241-110 · WCAG 2.2 AA · Selector reutilizable de pestañas/chips con conteo numérico · TechAsset
export default function PestanasConteo({
  opciones = [],
  seleccionado = '',
  alCambiar,
  ariaLabel = 'Filtro por estado',
  tamano = 'sm',
  className = ''
}) {
  const esTamanoMd = tamano === 'md';

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 ${className}`}
    >
      {opciones.map((opt) => {
        const val = opt.valor !== undefined ? opt.valor : opt.clave;
        const etiqueta = opt.etiqueta ?? String(val);
        const cantidad = opt.cantidad !== undefined ? opt.cantidad : (opt.cant ?? 0);
        const esActivo = (seleccionado || '') === (val || '');

        let claseBadge = esActivo
          ? 'bg-white/20 text-white'
          : 'bg-superficie-2 text-texto-suave';

        if (typeof opt.claseBadge === 'function') {
          claseBadge = opt.claseBadge(esActivo, cantidad);
        } else if (typeof opt.claseBadge === 'string') {
          claseBadge = opt.claseBadge;
        }

        return (
          <button
            key={String(val || etiqueta)}
            role="tab"
            type="button"
            aria-selected={esActivo}
            tabIndex={esActivo ? 0 : -1}
            onClick={() => alCambiar?.(val)}
            className={`inline-flex items-center gap-1.5 rounded-pill font-semibold transition-colors whitespace-nowrap cursor-pointer border ${
              esTamanoMd ? 'px-3.5 py-1.5 text-sm' : 'px-3 py-1.5 text-xs'
            } ${
              esActivo
                ? 'bg-primario text-sobre-primario border-primario shadow-xs'
                : 'bg-superficie text-texto-suave border-borde hover:bg-superficie-2 hover:text-texto'
            }`}
          >
            <span>{etiqueta}</span>
            <span
              className={`rounded-full cifra-tabular font-bold ${
                esTamanoMd ? 'px-1.5 py-0.5 text-xs' : 'px-1.5 py-0.2 text-[10px]'
              } ${claseBadge}`}
            >
              {cantidad}
            </span>
          </button>
        );
      })}
    </div>
  );
}
