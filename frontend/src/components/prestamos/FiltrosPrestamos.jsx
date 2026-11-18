// Barra compacta de filtros de préstamos en una sola fila · Nielsen 1, 6 · Fidelidad ReservaUPLA
import TextInput from '../formulario/TextInput';
import DateInput from '../formulario/DateInput';
import Button from '../ui/Button';
import Icono from '../ui/Icono';

export default function FiltrosPrestamos({
  texto = '',
  estado = '',
  fechaDesde = '',
  fechaHasta = '',
  totalResultados = 0,
  alCambiarTexto,
  alCambiarFechaDesde,
  alCambiarFechaHasta,
  alLimpiar
}) {
  const hayFiltros = Boolean(texto.trim() || estado || fechaDesde || fechaHasta);
  const etiqueta = totalResultados === 1 ? '1 préstamo encontrado' : `${totalResultados} préstamos encontrados`;

  return (
    <section aria-label="Filtros de préstamos" className="p-2 sm:p-2.5 rounded-tarjeta border border-borde bg-superficie shadow-xs">
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3">
        <div className="flex-1 min-w-[200px]">
          <TextInput
            id="campo-filtro-texto-prestamos"
            nombre="filtro-texto-prestamos"
            etiqueta=""
            aria-label="Buscar préstamo"
            obligatorio={false}
            tipo="search"
            tamano="sm"
            valor={texto}
            alCambiar={(e) => alCambiarTexto?.(e.target.value)}
            placeholder="Solicitante, equipo o motivo…"
          />
        </div>
        <div className="flex items-center gap-1.5 shrink-0" role="group" aria-label="Rango de fechas de préstamo">
          <DateInput
            id="filtro-fecha-desde"
            aria-label="Fecha desde"
            etiqueta=""
            ayuda=""
            obligatorio={false}
            tamano="sm"
            valor={fechaDesde}
            alCambiar={(e) => alCambiarFechaDesde?.(e.target.value)}
          />
          <span className="text-xs text-texto-suave" aria-hidden="true">—</span>
          <DateInput
            id="filtro-fecha-hasta"
            aria-label="Fecha hasta"
            etiqueta=""
            ayuda=""
            obligatorio={false}
            tamano="sm"
            valor={fechaHasta}
            alCambiar={(e) => alCambiarFechaHasta?.(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <span role="status" aria-live="polite" className="text-xs font-semibold text-texto-suave cifra-tabular">
            {etiqueta}
          </span>
          {hayFiltros && (
            <Button
              variante="ghost"
              tamano="sm"
              aria-label="Limpiar filtros"
              alHacerClic={alLimpiar}
            >
              <Icono nombre="RotateCcw" className="w-3.5 h-3.5 mr-1" />
              <span>Limpiar filtros</span>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
