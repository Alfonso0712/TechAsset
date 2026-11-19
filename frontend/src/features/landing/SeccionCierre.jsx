import { Link } from 'react-router-dom';
import Icono from '../../components/ui/Icono';

export default function SeccionCierre() {
  return (
    <section
      aria-label="Llamado a la acción"
      className="py-16 sm:py-20 bg-superficie-2/50 text-texto border-b border-borde/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-superficie border border-borde shadow-md text-center max-w-4xl mx-auto relative overflow-hidden">
          {/* Acento decorativo sutil */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 bg-primario"
            aria-hidden="true"
          />

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-texto tracking-tight mb-4">
            ¿Listo para empezar?
          </h2>

          <p className="text-sm sm:text-base text-texto-suave max-w-xl mx-auto leading-relaxed mb-8 font-normal">
            Ingrese con su cuenta corporativa. Si no tiene acceso, solicítelo al Administrador del sistema.
          </p>

          <div className="flex justify-center">
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-control bg-primario hover:bg-primario-hover text-white font-semibold text-base shadow-lg transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anillo-foco min-h-[3rem]"
            >
              Iniciar sesión
              <Icono nombre="ArrowRight" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
