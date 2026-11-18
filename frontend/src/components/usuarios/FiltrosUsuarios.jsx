// Barra compacta de filtros para catálogo de usuarios · Fidelidad ReservaUPLA · WCAG 2.2 AA
import TextInput from '../formulario/TextInput';
import SelectInput from '../formulario/SelectInput';
import Button from '../ui/Button';
import Icono from '../ui/Icono';
import { ETIQUETAS_ROL } from '../../constants/etiquetas';

const OPCIONES_ROL = [
  { valor: '', etiqueta: 'Todos los roles' },
  ...Object.entries(ETIQUETAS_ROL).map(([k, v]) => ({ valor: k, etiqueta: v }))
];

const OPCIONES_ESTADO = [
  { valor: '', etiqueta: 'Todos los estados' },
  { valor: 'activos', etiqueta: 'Activos' },
  { valor: 'inactivos', etiqueta: 'Inactivos' }
];

export default function FiltrosUsuarios({
  texto = '',
  rol = '',
  estado = '',
  totalResultados = 0,
  alCambiarTexto,
  alCambiarRol,
  alCambiarEstado,
  alLimpiar
}) {
  const hayFiltrosActivos = Boolean(texto.trim() || rol || estado);
  const etiquetaConteo = totalResultados === 1 ? '1 usuario encontrado' : `${totalResultados} usuarios encontrados`;

  return (
    <section aria-label="Filtros del catálogo de usuarios" className="p-2 sm:p-2.5 rounded-tarjeta border border-borde bg-superficie shadow-xs">
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3">
        <div className="flex-1 min-w-[200px]">
          <TextInput
            id="campo-filtro-texto-usuarios"
            nombre="filtro-texto-usuarios"
            etiqueta=""
            aria-label="Buscar usuario"
            obligatorio={false}
            tipo="search"
            tamano="sm"
            valor={texto}
            alCambiar={(e) => alCambiarTexto?.(e.target.value)}
            placeholder="Buscar por nombre, correo o área…"
          />
        </div>
        <div className="w-full sm:w-56 shrink-0">
          <SelectInput
            id="filtro-rol-usuarios"
            nombre="filtro-rol-usuarios"
            etiqueta=""
            aria-label="Rol de usuario"
            obligatorio={false}
            tamano="sm"
            valor={rol}
            alCambiar={(e) => alCambiarRol?.(e.target.value)}
            opciones={OPCIONES_ROL}
            placeholder="Todos los roles"
          />
        </div>
        <div className="w-full sm:w-48 shrink-0">
          <SelectInput
            id="filtro-estado-usuarios"
            nombre="filtro-estado-usuarios"
            etiqueta=""
            aria-label="Estado de usuario"
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
