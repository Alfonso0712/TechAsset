import { NavLink } from 'react-router-dom';
import Icono from '../ui/Icono';
import LogoTechAsset from '../ui/LogoTechAsset';
import { ELEMENTOS_NAVEGACION } from '../../constants/navegacion';
import { useAuth } from '../../hooks/useAuth';

export default function BarraLateral({ abierta = false, alCerrar }) {
  const { puede, usuario } = useAuth();

  const elementosVisibles = ELEMENTOS_NAVEGACION.filter(
    (el) => !el.permiso || puede(el.permiso)
  );

  return (
    <>
      {/* Backdrop en vista móvil */}
      {abierta && (
        <div
          onClick={alCerrar}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Contenedor Lateral */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-lateral-fondo text-lateral-texto flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          abierta ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800 shadow-xl lg:shadow-none`}
      >
        {/* Cabecera Sidebar */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <LogoTechAsset tamano="header" alt="" />
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-base tracking-tight text-white">
                Tech<span className="text-[#38BDF0]">Asset</span>
              </span>
              <span className="text-[0.625rem] font-medium tracking-wider uppercase text-lateral-texto">
                Innovatech Solutions
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={alCerrar}
            aria-label="Cerrar menú lateral"
            className="p-1 rounded-md text-lateral-texto hover:text-white hover:bg-white/10 lg:hidden"
          >
            <Icono nombre="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Info usuario móvil */}
        {usuario && (
          <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-900/30 lg:hidden">
            <p className="text-xs font-semibold text-white truncate">{usuario.nombreCompleto}</p>
            <p className="text-[0.6875rem] text-slate-400 truncate">{usuario.rol}</p>
          </div>
        )}

        {/* Menú de Enlaces */}
        <nav aria-label="Menú principal" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {elementosVisibles.map((item) => (
            <NavLink
              key={item.ruta}
              to={item.ruta}
              onClick={alCerrar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primario text-sobre-primario font-semibold shadow-sm'
                    : 'text-lateral-texto hover:text-white hover:bg-lateral-hover'
                }`
              }
            >
              <Icono nombre={item.icono} className="w-5 h-5 shrink-0" />
              <span>{item.titulo}</span>
            </NavLink>
          ))}
        </nav>

        {/* Pie de Sidebar */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
          <p className="font-semibold text-slate-300">TechAsset v1.0</p>
          <p className="text-[0.6875rem] mt-0.5">Innovatech Solutions S.A.C.</p>
        </div>
      </aside>
    </>
  );
}
