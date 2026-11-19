import LogoTechAsset from '../../components/ui/LogoTechAsset';

export default function PiePaginaLanding() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="py-10 bg-superficie text-texto border-t border-borde">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <LogoTechAsset tamano="sm" alt="" />
          <span className="text-sm font-semibold text-texto">
            TechAsset · Innovatech Solutions S.A.C.
          </span>
        </div>

        <p className="text-xs text-texto-suave m-0 font-normal">
          © {anioActual} Innovatech Solutions S.A.C. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
