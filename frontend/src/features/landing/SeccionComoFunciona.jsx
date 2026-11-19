import Icono from '../../components/ui/Icono';

const PASOS = [
  {
    numero: '1',
    titulo: 'Solicitar',
    icono: 'FileText',
    descripcion: 'El colaborador consulta la disponibilidad del catálogo y solicita un equipo indicando motivo específico y rango de fechas.'
  },
  {
    numero: '2',
    titulo: 'Aprobar',
    icono: 'ShieldCheck',
    descripcion: 'El Responsable de Tecnología evalúa la justificación técnica y operativa de la solicitud, procediendo a aprobarla o rechazarla.'
  },
  {
    numero: '3',
    titulo: 'Entregar',
    icono: 'PackageCheck',
    descripcion: 'El equipo cambia su estado a "Prestado" y queda formalmente vinculado al colaborador solicitante y al responsable de entrega.'
  },
  {
    numero: '4',
    titulo: 'Devolver',
    icono: 'RotateCcw',
    descripcion: 'Se registra la recepción física con observaciones del estado técnico del activo, retornando automáticamente a "Disponible".'
  }
];

export default function SeccionComoFunciona() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 py-16 sm:py-20 bg-superficie-2/50 text-texto border-b border-borde/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-primario tracking-wider uppercase mb-2 block">
            Flujo Operativo Simple
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-texto tracking-tight mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-base sm:text-lg text-texto-suave leading-relaxed font-normal m-0">
            Un ciclo de cuatro pasos claros y estructurados para asegurar la custodia responsable y el retorno seguro de cada activo de la empresa.
          </p>
        </div>

        {/* Pasos en línea en escritorio y apilados en móvil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {PASOS.map((paso, index) => (
            <div
              key={paso.numero}
              className="p-6 rounded-2xl bg-superficie border border-borde shadow-xs flex flex-col justify-between relative group hover:border-primario/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-full bg-primario text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                    {paso.numero}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-superficie-2 text-texto-suave flex items-center justify-center group-hover:text-primario transition-colors">
                    <Icono nombre={paso.icono} className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-texto mb-2">
                  {paso.titulo}
                </h3>
                <p className="text-xs sm:text-sm text-texto-suave leading-relaxed font-normal m-0">
                  {paso.descripcion}
                </p>
              </div>

              {index < PASOS.length - 1 && (
                <div
                  className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-superficie border border-borde text-texto-suave flex items-center justify-center shadow-xs"
                  aria-hidden="true"
                >
                  <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
