// Nielsen 1 · Shneiderman 2 · ISO 9241-11 · Ítem de navegación lateral
import { NavLink } from 'react-router-dom';
import Icono from '../ui/Icono';
import { RUTAS } from '../../constants/rutas';

export default function ItemNavegacion({ item, alCerrarMenuMovil }) {
  return (
    <NavLink
      to={item.ruta}
      end={item.ruta === RUTAS.PANEL}
      onClick={() => alCerrarMenuMovil?.()}
      className={({ isActive }) =>
        `w-full min-h-[2.75rem] px-4 py-2.5 rounded-control flex items-center gap-3 text-[1rem] transition-colors no-underline text-left outline-none focus-visible:ring-2 focus-visible:ring-anillo-foco ${
          isActive
            ? 'bg-lateral-activo-fondo text-lateral-activo-texto font-semibold border-l-[3px] border-primario'
            : 'text-lateral-texto font-medium hover:bg-lateral-hover hover:text-texto'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icono
            nombre={item.icono}
            className={`w-5 h-5 shrink-0 ${isActive ? 'text-lateral-activo-texto' : 'text-lateral-icono'}`}
          />
          <span>{item.etiqueta || item.titulo}</span>
        </>
      )}
    </NavLink>
  );
}
