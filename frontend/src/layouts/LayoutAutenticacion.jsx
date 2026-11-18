// Nielsen 4 · WCAG 2.2 AA · Layout de dos paneles para acceso institucional TechAsset
import { Link, Outlet } from 'react-router-dom';
import { RUTA_IMAGEN_FONDO_LOGIN } from '../constants/rutas';
import LogoTechAsset from '../components/ui/LogoTechAsset';
import Icono from '../components/ui/Icono';
import RedParticulas from '../components/ui/RedParticulas';
import ControlTamanoFuente from '../components/navegacion/ControlTamanoFuente';
import ConmutadorTema from '../components/navegacion/ConmutadorTema';
import SaltarAlContenido from '../components/navegacion/SaltarAlContenido';

const BENEFICIOS = [
  { icono: 'CircleCheck', texto: 'Disponibilidad de equipos en tiempo real' },
  { icono: 'Laptop', texto: 'Laptops, monitores, proyectores y equipos de red' },
  { icono: 'ArrowLeftRight', texto: 'Control de préstamos y devoluciones' },
  { icono: 'History', texto: 'Historial de movimientos por equipo' }
];

export default function LayoutAutenticacion({ children }) {
  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row bg-fondo text-texto overflow-x-hidden overflow-y-auto">
      <SaltarAlContenido />
      <aside
        aria-label="Identidad corporativa"
        className="hidden lg:flex relative lg:w-[68%] lg:h-full p-6 sm:p-8 lg:p-10 flex-col justify-between text-white bg-cover border-b lg:border-b-0 lg:border-r border-borde shrink-0"
        style={{ backgroundImage: `url(${RUTA_IMAGEN_FONDO_LOGIN})`, backgroundPosition: 'right center' }}
      >
        <div className="absolute inset-0 capa-superposicion-login pointer-events-none" aria-hidden="true" />
        <RedParticulas />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <Link
            to="/"
            className="flex items-center gap-3 no-underline group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF0] rounded"
            aria-label="Ir a la página principal de TechAsset"
          >
            <LogoTechAsset tamano="panel" alt="" />
            <div>
              <p className="text-base font-bold text-white leading-tight group-hover:text-[#38BDF0] transition-colors">
                Innovatech Solutions S.A.C.
              </p>
              <p className="text-sm text-[#D3E3F2]">Gestión inteligente de activos tecnológicos</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-[340px] my-auto py-4 space-y-4">
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center px-3 py-1 mb-3 rounded-pill bg-white/[0.12] border border-white/25 text-xs font-semibold text-white">
              Sistema corporativo
            </span>
            <Link
              to="/"
              className="block text-2xl sm:text-3xl font-bold text-white mb-2 no-underline hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF0] rounded"
              aria-label="Ir a la página principal de TechAsset"
            >
              Tech<span className="text-[#38BDF0]">Asset</span>
            </Link>
            <p className="text-sm text-[#D3E3F2] leading-relaxed">
              Plataforma corporativa para la gestión del inventario y el control de préstamos de equipos tecnológicos con trazabilidad en tiempo real.
            </p>
          </div>
          <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-[#D3E3F2] list-none p-0 m-0">
            {BENEFICIOS.map((b) => (
              <li key={b.texto} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#38BDF0]">
                  <Icono nombre={b.icono} className="w-3.5 h-3.5" />
                </div>
                <span className="leading-snug">{b.texto}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <ControlTamanoFuente mimetizado />
          <ConmutadorTema mimetizado />
        </div>
      </aside>

      <div className="flex-1 lg:w-[32%] lg:h-full flex flex-col justify-center bg-fondo text-texto lg:overflow-y-auto">
        <main id="contenido-principal" tabIndex={-1} className="flex-1 flex items-center justify-center p-2 sm:p-4 outline-none">
          <div className="w-full max-w-[370px] my-auto">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
