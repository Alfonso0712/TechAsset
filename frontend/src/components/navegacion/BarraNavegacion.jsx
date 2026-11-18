import { useNavigate } from 'react-router-dom';
import Icono from '../ui/Icono';
import { useAuth } from '../../hooks/useAuth';
import { useTema } from '../../hooks/useTema';
import { useTamanoFuente } from '../../hooks/useTamanoFuente';
import { useMenuDesplegable } from '../../hooks/useMenuDesplegable';
import { obtenerIniciales } from '../../utils/obtenerIniciales';
import { RUTAS } from '../../constants/rutas';

export default function BarraNavegacion({ alAlternarMenu }) {
  const { usuario, cerrarSesion } = useAuth();
  const { tema, alternarTema } = useTema();
  const { tamanoFuente, cambiarTamanoFuente, escalas } = useTamanoFuente();
  const { abierto, alternar, cerrar, referencia } = useMenuDesplegable();
  const navigate = useNavigate();

  const handleCerrarSesion = async () => {
    cerrar();
    await cerrarSesion();
    navigate(RUTAS.INGRESAR);
  };

  return (
    <header className="h-16 border-b border-borde bg-superficie sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={alAlternarMenu}
          aria-label="Abrir menú de navegación"
          className="p-2 rounded-lg text-texto-suave hover:text-texto hover:bg-superficie-2 lg:hidden transition-colors"
        >
          <Icono nombre="Menu" className="w-5 h-5" />
        </button>

        <span className="text-sm font-semibold text-texto hidden sm:inline">
          Gestión de Inventario y Préstamos
        </span>
      </div>

      {/* Controles de accesibilidad y usuario */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Selector de escala de fuente A / A+ / A++ */}
        <div className="flex items-center border border-borde rounded-lg overflow-hidden bg-superficie-2/50 p-0.5">
          {escalas.map((esc) => {
            const activo = tamanoFuente === esc.id || tamanoFuente === esc.porcentaje;
            return (
              <button
                key={esc.id}
                type="button"
                onClick={() => cambiarTamanoFuente(esc.id)}
                aria-label={esc.descripcion}
                aria-pressed={activo}
                className={`h-7 px-2 text-xs font-bold rounded transition-colors ${
                  activo
                    ? 'bg-primario text-sobre-primario shadow-xs'
                    : 'text-texto-suave hover:text-texto'
                }`}
              >
                {esc.etiqueta}
              </button>
            );
          })}
        </div>

        {/* Alternador de tema Claro/Oscuro */}
        <button
          type="button"
          onClick={alternarTema}
          aria-label={`Cambiar a modo ${tema === 'oscuro' ? 'claro' : 'oscuro'}`}
          className="w-9 h-9 rounded-lg border border-borde flex items-center justify-center text-texto-suave hover:text-texto hover:bg-superficie-2 transition-colors"
        >
          <Icono nombre={tema === 'oscuro' ? 'Sun' : 'Moon'} className="w-4 h-4" />
        </button>

        {/* Dropdown de usuario */}
        {usuario && (
          <div ref={referencia} className="relative">
            <button
              type="button"
              onClick={alternar}
              aria-expanded={abierto}
              aria-haspopup="true"
              className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-superficie-2 border border-transparent hover:border-borde transition-colors focus:outline-none focus:ring-2 focus:ring-anillo-foco"
            >
              <div className="w-8 h-8 rounded-full bg-primario-suave text-primario font-bold text-xs flex items-center justify-center border border-primario/20">
                {obtenerIniciales(usuario.nombreCompleto)}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-texto leading-none truncate max-w-[130px]">
                  {usuario.nombres}
                </p>
                <p className="text-[0.625rem] text-texto-suave leading-none mt-1 truncate max-w-[130px]">
                  {usuario.rol}
                </p>
              </div>
              <Icono nombre="ChevronDown" className="w-3.5 h-3.5 text-texto-suave hidden sm:block" />
            </button>

            {abierto && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-borde bg-superficie shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 text-sm">
                <div className="px-4 py-2 border-b border-borde">
                  <p className="font-semibold text-texto truncate">{usuario.nombreCompleto}</p>
                  <p className="text-xs text-texto-suave truncate">{usuario.correo}</p>
                  <span className="inline-block mt-1 text-[0.6875rem] font-bold px-2 py-0.5 rounded-full bg-superficie-2 text-texto-suave border border-borde">
                    {usuario.rol}
                  </span>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleCerrarSesion}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-peligro-texto hover:bg-peligro-fondo flex items-center gap-2 transition-colors"
                  >
                    <Icono nombre="LogOut" className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
