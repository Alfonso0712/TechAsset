import { Link } from 'react-router-dom';
import { RUTA_IMAGEN_FONDO_LOGIN } from '../../constants/rutas';
import Icono from '../../components/ui/Icono';

const TARJETAS_DESTACADAS = [
  {
    icono: 'CircleCheck',
    titulo: 'Disponibilidad en tiempo real',
    descripcion: 'Consulte al instante qué activos están libres y listos para ser asignados.'
  },
  {
    icono: 'RefreshCw',
    titulo: 'Préstamos y devoluciones',
    descripcion: 'Control integral de solicitudes, custodias activas y recepciones técnicas.'
  },
  {
    icono: 'History',
    titulo: 'Historial por equipo',
    descripcion: 'Trazabilidad inmutable de cada movimiento y cambio de estado registrado.'
  }
];

export default function SeccionHero() {
  return (
    <section
      aria-label="Presentación principal de TechAsset"
      className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24 text-white bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${RUTA_IMAGEN_FONDO_LOGIN})` }}
    >
      {/* Overlay multi-capa: degradado direccional neutro reforzado + degradado vertical inferior para tarjetas + tinte cian sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to top, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.20) 35%, transparent 65%),
            linear-gradient(to right, color-mix(in srgb, var(--primario) 12%, transparent) 0%, color-mix(in srgb, var(--primario) 3%, transparent) 100%),
            linear-gradient(to right, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.58) 45%, rgba(0, 0, 0, 0.20) 100%)
          `
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl [text-shadow:_0_1px_3px_rgba(0,0,0,0.7)]">
          {/* Insignia */}
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-pill bg-white/[0.12] border border-white/25 text-xs font-semibold text-white backdrop-blur-xs mb-5">
            Sistema corporativo · Innovatech Solutions S.A.C.
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] lg:text-[3rem] font-extrabold text-white tracking-tight leading-tight sm:leading-[1.18] mb-6">
            Gestión y préstamo de equipos tecnológicos, en un solo lugar
          </h1>

          {/* Texto Descriptivo */}
          <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed mb-8 max-w-2xl font-normal">
            Controle el inventario de laptops, monitores, impresoras y más, sepa siempre qué equipo está disponible y dónde está, y registre cada préstamo y devolución con trazabilidad completa.
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-wrap items-center gap-4 mb-14">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-control bg-primario hover:bg-primario-hover text-white font-semibold text-base shadow-lg transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-h-[3rem]"
            >
              Iniciar sesión
              <Icono nombre="ArrowRight" className="w-5 h-5" />
            </Link>

            <a
              href="#como-funciona"
              className="px-6 py-3.5 rounded-control bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/30 backdrop-blur-xs transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-h-[3rem]"
            >
              Ver cómo funciona
            </a>
          </div>
        </div>

        {/* 3 Tarjetas pequeñas debajo con fondo neutro translúcido fijo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-4">
          {TARJETAS_DESTACADAS.map((tarjeta) => (
            <div
              key={tarjeta.titulo}
              className="p-5 rounded-xl bg-black/45 backdrop-blur-md border border-white/15 shadow-xl transition-transform hover:-translate-y-0.5 text-white"
            >
              <div className="w-10 h-10 rounded-lg bg-primario-suave text-primario flex items-center justify-center shrink-0 mb-3">
                <Icono nombre={tarjeta.icono} className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-white m-0 mb-1">
                {tarjeta.titulo}
              </h2>
              <p className="text-xs text-white/85 m-0 leading-relaxed font-normal">
                {tarjeta.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
