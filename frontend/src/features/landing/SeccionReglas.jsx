import Icono from '../../components/ui/Icono';

const REGLAS = [
  {
    titulo: 'Un solo préstamo activo por equipo',
    descripcion: 'Un equipo solo puede tener un préstamo activo a la vez; no se permite la asignación simultánea para evitar duplicidades.',
    icono: 'CheckCircle2'
  },
  {
    titulo: 'Equipos no prestables según su estado',
    descripcion: 'Los equipos en mantenimiento o dados de baja técnica quedan estrictamente inhabilitados para nuevas solicitudes.',
    icono: 'Ban'
  },
  {
    titulo: 'Devoluciones con observaciones técnicas',
    descripcion: 'Toda devolución se registra formalmente con observaciones para evaluar las condiciones en que el equipo retorna al inventario.',
    icono: 'ClipboardList'
  },
  {
    titulo: 'Responsable formal en cada entrega',
    descripcion: 'Todo préstamo tiene obligatoriamente un responsable registrado que avala y entrega el activo en custodia.',
    icono: 'UserCheck'
  },
  {
    titulo: 'Historial inmutable de auditoría',
    descripcion: 'Los equipos con historial de movimientos y préstamos no se eliminan, preservando la trazabilidad y fiscalización interna.',
    icono: 'History'
  },
  {
    titulo: 'Identificadores estrictamente únicos',
    descripcion: 'Los códigos patrimoniales de cada activo y los correos corporativos de usuarios son únicos en toda la organización.',
    icono: 'ShieldCheck'
  }
];

export default function SeccionReglas() {
  return (
    <section
      id="reglas"
      className="scroll-mt-20 py-16 sm:py-20 bg-fondo text-texto border-b border-borde/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold text-primario tracking-wider uppercase mb-2 block">
            Políticas y Custodia
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-texto tracking-tight mb-4">
            Reglas que protegen el inventario
          </h2>
          <p className="text-base sm:text-lg text-texto-suave leading-relaxed font-normal m-0">
            Reglas operativas del caso práctico implementadas a nivel de sistema para garantizar la seguridad patrimonial y la transparencia en cada transacción.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REGLAS.map((regla) => (
            <div
              key={regla.titulo}
              className="p-6 rounded-2xl bg-superficie border border-borde shadow-xs flex flex-col items-start gap-4 hover:border-primario/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primario-suave text-primario flex items-center justify-center shrink-0">
                <Icono nombre={regla.icono} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-texto mb-2">
                  {regla.titulo}
                </h3>
                <p className="text-xs sm:text-sm text-texto-suave leading-relaxed font-normal m-0">
                  {regla.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
