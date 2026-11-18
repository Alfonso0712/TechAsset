// Barra compacta de filtros de equipos en una sola fila · Nielsen 1, 4, 6 · Fidelidad ReservaUPLA
import TextInput from '../formulario/TextInput';
import SelectInput from '../formulario/SelectInput';
import Button from '../ui/Button';
import Icono from '../ui/Icono';
import { ETIQUETAS_CATEGORIA, ETIQUETAS_ESTADO_EQUIPO } from '../../constants/etiquetas';

const OPCIONES_CATEGORIA = [
  { valor: '', etiqueta: 'Todas las categorías' },
  ...Object.entries(ETIQUETAS_CATEGORIA).map(([k, v]) => ({ valor: k, etiqueta: v }))
];

const OPCIONES_ESTADO = [
  { valor: '', etiqueta: 'Todos los estados' },
  ...Object.entries(ETIQUETAS_ESTADO_EQUIPO).map(([k, v]) => ({ valor: k, etiqueta: v }))
];

export default function FiltrosEquipos({
  texto = '',
  categoria = '',
  estado = '',
  totalResultados = 0,
  alCambiarTexto,
  alCambiarCategoria,
  alCambiarEstado,
  alLimpiar
}) {
  const hayFiltrosActivos = Boolean(texto.trim() || categoria || estado);
  const etiquetaConteo = totalResultados === 1 ? '1 equipo encontrado' : `${totalResultados} equipos encontrados`;

  return (
    <section aria-label="Filtros del catálogo de equipos" className="p-2 sm:p-2.5 rounded-tarjeta border border-borde bg-superficie shadow-xs">
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3">
        <div className="flex-1 min-w-[200px]">
          <TextInput
            id="campo-filtro-texto-equipos"
            nombre="filtro-texto-equipos"
            etiqueta=""
            aria-label="Buscar equipo"
            obligatorio={false}
            tipo="search"
            tamano="sm"
            valor={texto}
            alCambiar={(e) => alCambiarTexto?.(e.target.value)}
            placeholder="Buscar por código, nombre o marca…"
          />
        </div>

        <div className="w-full sm:w-52 shrink-0">
          <SelectInput
            id="filtro-categoria-equipos"
            nombre="filtro-categoria-equipos"
            etiqueta=""
            aria-label="Categoría de equipo"
            obligatorio={false}
            tamano="sm"
            valor={categoria}
            alCambiar={(e) => alCambiarCategoria?.(e.target.value)}
            opciones={OPCIONES_CATEGORIA}
            placeholder="Todas las categorías"
          />
        </div>

        <div className="w-full sm:w-44 shrink-0">
          <SelectInput
            id="filtro-estado-equipos"
            nombre="filtro-estado-equipos"
            etiqueta=""
            aria-label="Estado de equipo"
            obligatorio={false}
            tamano="sm"
            valor={estado}
            alCambiar={(e) => alCambiarEstado?.(e.target.value)}
            opciones={OPCIONES_ESTADO}
            placeholder="Todos los estados"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <span role="status" aria-live="polite" className="text-xs font-semibold text-texto-suave cifra-tabular">
            {etiquetaConteo}
          </span>
          {hayFiltrosActivos && (
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
