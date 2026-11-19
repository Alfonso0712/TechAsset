import Icono from '../../components/ui/Icono';

const ROLES = [
  {
    titulo: 'Administrador',
    subtitulo: 'Gestión total del sistema',
    icono: 'ShieldCheck',
    descripcion: 'Gestiona usuarios corporativos y el catálogo completo de equipos. Consulta reportes inmutables de auditoría y supervisa la totalidad de los préstamos en la organización.',
    responsabilidades: [
      'Alta y administración de cuentas de usuario',
      'Edición y baja técnica del catálogo de equipos',
      'Supervisión y control global de préstamos',
      'Acceso a métricas y reportes inmutables'
    ]
  },
  {
    titulo: 'Responsable de Tecnología',
    subtitulo: 'Custodia técnica y operativa',
    icono: 'Wrench',
    descripcion: 'Registra equipos en inventario, evalúa y aprueba solicitudes de préstamo, registra devoluciones técnicas y consulta en tiempo real la custodia de activos.',
    responsabilidades: [
      'Registro inicial de nuevos equipos tecnológicos',
      'Evaluación técnica y aprobación de solicitudes',
      'Recepción y registro técnico de devoluciones',
      'Consulta del inventario físico y trazabilidad'
    ],
    destacado: true
  },
  {
    titulo: 'Colaborador',
    subtitulo: 'Solicitud y uso responsable',
    icono: 'Users',
    descripcion: 'Consulta la disponibilidad del catálogo, solicita préstamos de equipos para sus proyectos y hace seguimiento directo a su historial personal de custodia.',
    responsabilidades: [
      'Consulta del catálogo de equipos disponibles',
      'Solicitud de préstamo con justificación y fechas',
      'Seguimiento al estado de sus solicitudes activas',
      'Historial personal de activos utilizados'
    ]
  }
];

export default function SeccionRoles() {
  return (
    <section
      id="roles"
      className="scroll-mt-20 py-16 sm:py-20 bg-superficie-2/50 text-texto border-b border-borde/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-primario tracking-wider uppercase mb-2 block">
            Segregación de funciones
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-texto tracking-tight mb-4">
            Roles y permisos del sistema
          </h2>
          <p className="text-base sm:text-lg text-texto-suave leading-relaxed font-normal m-0">
            Cada perfil corporativo cuenta con permisos estrictamente acotados a su función operativa dentro de la organización.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {ROLES.map((rol) => (
            <div
              key={rol.titulo}
              className={`p-6 sm:p-8 rounded-2xl bg-superficie border shadow-xs flex flex-col justify-between transition-all ${
                rol.destacado ? 'border-2 border-primario shadow-sm' : 'border-borde hover:border-primario/50'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primario-suave text-primario flex items-center justify-center shrink-0 mb-4">
                  <Icono nombre={rol.icono} className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-bold text-texto mb-1">
                  {rol.titulo}
                </h3>
                <span className="text-xs font-semibold text-primario uppercase tracking-wider block mb-3">
                  {rol.subtitulo}
                </span>
                <p className="text-xs sm:text-sm text-texto-suave leading-relaxed font-normal mb-6">
                  {rol.descripcion}
                </p>

                <div className="space-y-2 pt-4 border-t border-borde/70">
                  <span className="text-xs font-semibold text-texto block mb-2">
                    Funciones principales:
                  </span>
                  <ul className="space-y-2 list-none p-0 m-0">
                    {rol.responsabilidades.map((resp) => (
                      <li key={resp} className="flex items-start gap-2.5 text-xs text-texto-suave">
                        <Icono nombre="Check" className="w-3.5 h-3.5 text-primario shrink-0 mt-0.5" />
                        <span className="leading-snug">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
