import Icono from '../../components/ui/Icono';
import Badge from '../../components/ui/Badge';
import { ICONOS_CATEGORIA } from '../../constants/etiquetas';

const CATEGORIAS_EQUIPOS = [
  {
    nombre: 'Laptops',
    icono: ICONOS_CATEGORIA.Laptop,
    descripcion: 'Equipos portátiles para desarrollo, diseño, gestión y trabajo remoto.'
  },
  {
    nombre: 'Computadoras de escritorio',
    icono: ICONOS_CATEGORIA.ComputadoraEscritorio,
    descripcion: 'Estaciones fijas de alto rendimiento para labores especializadas y oficina.'
  },
  {
    nombre: 'Monitores',
    icono: ICONOS_CATEGORIA.Monitor,
    descripcion: 'Pantallas externas ergonómicas de alta resolución para puestos de trabajo.'
  },
  {
    nombre: 'Impresoras',
    icono: ICONOS_CATEGORIA.Impresora,
    descripcion: 'Dispositivos de impresión multifuncional y escaneo en red para oficinas.'
  },
  {
    nombre: 'Tablets',
    icono: ICONOS_CATEGORIA.Tablet,
    descripcion: 'Dispositivos táctiles para pruebas móviles, presentaciones y trabajo de campo.'
  },
  {
    nombre: 'Proyectores multimedia',
    icono: ICONOS_CATEGORIA.Proyector,
    descripcion: 'Equipos audiovisuales para salas de reuniones, capacitaciones y eventos.'
  },
  {
    nombre: 'Equipos de red',
    icono: ICONOS_CATEGORIA.EquipoRed,
    descripcion: 'Switches, routers y puntos de acceso para conectividad e infraestructura.'
  }
];

const ESTADOS_EXPLICACION = [
  {
    estado: 'Disponible',
    descripcion: 'Equipo operativo y custodiado en almacén o sala, listo para asignación.'
  },
  {
    estado: 'Prestado',
    descripcion: 'Activo en uso temporal por un colaborador con fecha de devolución vigente.'
  },
  {
    estado: 'Mantenimiento',
    descripcion: 'En soporte técnico preventivo o correctivo; inhabilitado para préstamos.'
  },
  {
    estado: 'Baja',
    descripcion: 'Desincorporado definitivamente por daño irreparable u obsolescencia técnica.'
  }
];

export default function SeccionEquipos() {
  return (
    <section
      id="equipos"
      className="scroll-mt-20 py-16 sm:py-20 bg-fondo text-texto border-b border-borde/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold text-primario tracking-wider uppercase mb-2 block">
            Catálogo Corporativo
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-texto tracking-tight mb-4">
            Equipos que gestiona
          </h2>
          <p className="text-base sm:text-lg text-texto-suave leading-relaxed font-normal m-0">
            Inventario integral y categorizado para satisfacer los requerimientos de hardware de todas las áreas de Innovatech Solutions.
          </p>
        </div>

        {/* Cuadrícula de categorías con el mismo ícono que la tabla de Equipos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {CATEGORIAS_EQUIPOS.map((cat) => (
            <div
              key={cat.nombre}
              className="p-5 rounded-xl bg-superficie border border-borde shadow-xs hover:border-primario/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-superficie-2 border border-borde flex items-center justify-center shrink-0 text-texto mb-3">
                  <Icono nombre={cat.icono} className="w-5 h-5 text-texto-suave" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-bold text-texto mb-1">
                  {cat.nombre}
                </h3>
                <p className="text-xs text-texto-suave leading-relaxed font-normal m-0">
                  {cat.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bloque de estados posibles con los mismos badges del sistema */}
        <div className="p-6 sm:p-8 rounded-2xl bg-superficie-2/60 border border-borde">
          <div className="max-w-2xl mb-6">
            <h3 className="text-lg font-bold text-texto m-0 mb-1">
              Ciclo de vida y estados operativos
            </h3>
            <p className="text-xs sm:text-sm text-texto-suave m-0 font-normal">
              Cada equipo cuenta con un estado unívoco que determina su disponibilidad física y lógica en el sistema.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ESTADOS_EXPLICACION.map((item) => (
              <div
                key={item.estado}
                className="p-4 rounded-xl bg-superficie border border-borde/70 flex flex-col items-start gap-2.5 shadow-xs"
              >
                <Badge estado={item.estado} />
                <p className="text-xs text-texto-suave leading-relaxed m-0 font-normal">
                  {item.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
