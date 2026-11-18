// Constantes y contenido textual de la guía y normativa de préstamos de TechAsset
export const INTRODUCCION_GUIA = 'Antes de solicitar un equipo, revise las políticas corporativas que aplica el sistema.';

export const REGLAS_NORMATIVA = [
  {
    numero: 1,
    icono: 'Layers',
    colorIcono: 'bg-primario-suave text-primario dark:text-primario-enlace',
    colorBarra: 'border-l-primario',
    titulo: 'Estados del equipo',
    descripcion: 'Los activos pueden encontrarse en estado Disponible, Prestado, en Mantenimiento o de Baja técnica.'
  },
  {
    numero: 2,
    icono: 'ShieldCheck',
    colorIcono: 'bg-exito-fondo text-exito-texto',
    colorBarra: 'border-l-exito-borde',
    titulo: 'Un equipo, un préstamo activo',
    descripcion: 'Un equipo tecnológico no puede tener más de una solicitud o préstamo activo en forma simultánea.'
  },
  {
    numero: 3,
    icono: 'Lock',
    colorIcono: 'bg-peligro-fondo text-peligro-texto',
    colorBarra: 'border-l-peligro-borde',
    titulo: 'Equipos no prestables',
    descripcion: 'Los equipos en mantenimiento o dados de baja no pueden ser solicitados ni entregados en préstamo.'
  },
  {
    numero: 4,
    icono: 'CalendarCheck',
    colorIcono: 'bg-advertencia-fondo text-advertencia-texto',
    colorBarra: 'border-l-advertencia-borde',
    titulo: 'Fechas válidas',
    descripcion: 'La fecha estimada de devolución debe ser igual o posterior a la fecha de inicio del préstamo.'
  },
  {
    numero: 5,
    icono: 'ClipboardList',
    colorIcono: 'bg-info-fondo text-info-texto',
    colorBarra: 'border-l-info-borde',
    titulo: 'Devolución con observación',
    descripcion: 'Al registrar el retorno de un equipo se evalúa su estado físico y se registra la conformidad técnica.'
  },
  {
    numero: 6,
    icono: 'Clock',
    colorIcono: 'bg-superficie-2 text-primario dark:text-primario-enlace',
    colorBarra: 'border-l-acento',
    titulo: 'Aprobación técnica',
    descripcion: 'Solo el Responsable de Tecnología puede evaluar, aprobar, rechazar y registrar la devolución de equipos.'
  }
];
