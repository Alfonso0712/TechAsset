// Nielsen 3 · Shneiderman 8 · Migas de pan orientativas · TechAsset
import { Link, useLocation } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import Icono from '../ui/Icono';

function construirMigasPorRuta(pathname) {
  const base = [{ etiqueta: 'Inicio', ruta: RUTAS.PANEL }];

  if (pathname.startsWith('/prestamos/')) {
    return [...base, { etiqueta: 'Préstamos', ruta: RUTAS.PRESTAMOS }, { etiqueta: 'Detalle' }];
  }
  if (pathname.startsWith(RUTAS.PRESTAMOS)) {
    return [...base, { etiqueta: 'Préstamos' }];
  }
  if (pathname.startsWith(RUTAS.EQUIPOS)) {
    return [...base, { etiqueta: 'Equipos' }];
  }
  if (pathname.startsWith(RUTAS.USUARIOS)) {
    return [...base, { etiqueta: 'Usuarios' }];
  }
  if (pathname.startsWith(RUTAS.REPORTES)) {
    return [...base, { etiqueta: 'Reportes' }];
  }
  if (pathname === RUTAS.PANEL || pathname === '/') {
    return [{ etiqueta: 'Inicio' }];
  }
  return [...base, { etiqueta: 'Página no encontrada' }];
}

export default function MigasDePan({ items = null }) {
  const { pathname } = useLocation();
  const lista = items && items.length > 0 ? items : construirMigasPorRuta(pathname);

  if (!lista.length) {
    return null;
  }

  return (
    <nav aria-label="Ruta de navegación" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-texto-suave list-none p-0 m-0">
        {lista.map((item, indice) => {
          const esUltimo = indice === lista.length - 1;
          return (
            <li key={`${item.etiqueta}-${indice}`} className="inline-flex items-center gap-1.5">
              {indice > 0 && <Icono nombre="ChevronRight" className="w-4 h-4 text-texto-suave" />}
              {esUltimo || !item.ruta ? (
                <span aria-current="page" className="font-semibold text-texto">
                  {item.etiqueta}
                </span>
              ) : (
                <Link to={item.ruta} className="text-primario-enlace font-medium hover:underline">
                  {item.etiqueta}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
