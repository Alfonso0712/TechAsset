import { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoTechAsset from '../../components/ui/LogoTechAsset';
import Icono from '../../components/ui/Icono';
import ConmutadorTema from '../../components/navegacion/ConmutadorTema';
import ControlTamanoFuente from '../../components/navegacion/ControlTamanoFuente';

const ENLACES_NAVEGACION = [
  { href: '#que-es', etiqueta: 'Qué es' },
  { href: '#como-funciona', etiqueta: 'Cómo funciona' },
  { href: '#equipos', etiqueta: 'Equipos' },
  { href: '#roles', etiqueta: 'Roles' },
  { href: '#reglas', etiqueta: 'Reglas' }
];

export default function BarraSuperiorLanding() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Izquierda: Logo y Marca */}
        <Link
          to="/"
          className="flex items-center gap-3 no-underline group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md p-1"
          aria-label="TechAsset - Página principal"
        >
          <LogoTechAsset tamano="header" alt="" />
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-base text-white tracking-tight group-hover:text-primario transition-colors">
              Tech<span className="text-primario">Asset</span>
            </span>
            <span className="text-[11px] text-white/80 font-medium">
              Gestión de activos
            </span>
          </div>
        </Link>

        {/* Centro: Enlaces de ancla en escritorio */}
        <nav
          aria-label="Navegación principal de la landing"
          className="hidden md:flex items-center gap-1 lg:gap-2"
        >
          {ENLACES_NAVEGACION.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              className="px-3 py-1.5 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {enlace.etiqueta}
            </a>
          ))}
        </nav>

        {/* Derecha: Accesibilidad, Modo Oscuro e Iniciar Sesión */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <ControlTamanoFuente />
            <ConmutadorTema />
          </div>

          <div className="flex sm:hidden">
            <ConmutadorTema />
          </div>

          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-white bg-primario hover:bg-primario-hover rounded-control shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0 inline-flex items-center justify-center min-h-[2.5rem]"
          >
            Iniciar sesión
          </Link>

          {/* Botón hamburguesa en móvil */}
          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-expanded={menuAbierto}
            aria-label={menuAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            className="md:hidden p-2 rounded-control text-white/90 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Icono nombre={menuAbierto ? 'X' : 'Menu'} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {menuAbierto && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Navegación
            </span>
            <div className="flex sm:hidden">
              <ControlTamanoFuente />
            </div>
          </div>
          <nav aria-label="Navegación móvil" className="flex flex-col space-y-1">
            {ENLACES_NAVEGACION.map((enlace) => (
              <a
                key={enlace.href}
                href={enlace.href}
                onClick={cerrarMenu}
                className="px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
              >
                {enlace.etiqueta}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
