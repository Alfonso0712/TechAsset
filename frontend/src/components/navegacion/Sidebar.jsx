// Nielsen 1 · Nielsen 2 · Nielsen 3 · Shneiderman 2 · Sidebar con navegación accesible
import { useAuth } from '../../hooks/useAuth';
import { obtenerItemsNavegacion } from '../../constants/navegacion';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import ItemNavegacion from './ItemNavegacion';
import LogoTechAsset from '../ui/LogoTechAsset';
import Icono from '../ui/Icono';
import UsuarioLateral from './UsuarioLateral';

export default function Sidebar({ abiertoMovil = false, alCerrarMovil, usuario: propUsuario }) {
  const { usuario: authUsuario, puede } = useAuth();
  const usuario = propUsuario || authUsuario;
  const cajonRef = useTrampaFoco(abiertoMovil, alCerrarMovil);
  const items = obtenerItemsNavegacion(usuario, puede);

  const contenido = (
    <div className="flex flex-col h-full w-64 bg-lateral-fondo text-lateral-texto border-r border-borde/20">
      <div className="p-4 flex-1 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <LogoTechAsset tamano="panel" alt="" />
            <div>
              <span className="block text-[1.125rem] font-bold text-white leading-tight">TechAsset</span>
              <span className="block text-[0.875rem] text-lateral-texto">Gestión de activos</span>
            </div>
          </div>
          {abiertoMovil && (
            <button
              type="button"
              onClick={alCerrarMovil}
              aria-label="Cerrar menú lateral"
              className="lg:hidden h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-2 inline-flex items-center justify-center rounded-full text-lateral-texto hover:text-white hover:bg-white/10"
            >
              <Icono nombre="X" className="w-5 h-5" />
            </button>
          )}
        </div>
        <nav aria-label="Navegación principal" className="mt-6 flex-1">
          <ul className="space-y-1 list-none p-0 m-0">
            {items.map((it) => (
              <li key={it.id}>
                <ItemNavegacion item={it} alCerrarMenuMovil={alCerrarMovil} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <UsuarioLateral alCerrarMenu={alCerrarMovil} usuario={usuario} />
    </div>
  );

  return (
    <>
      <aside aria-label="Navegación lateral" className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-40">
        {contenido}
      </aside>
      {abiertoMovil && (
        <div className="fixed inset-0 z-40 flex lg:hidden bg-black/50 backdrop-blur-sm">
          <aside
            ref={cajonRef}
            id="menu-lateral-principal"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            {contenido}
          </aside>
        </div>
      )}
    </>
  );
}
