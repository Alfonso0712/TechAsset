import { ROLES } from '../constants/roles';
import { PERMISOS } from '../constants/permisos';
import { ESTADOS_EQUIPO, CATEGORIAS_EQUIPO, ESTADOS_PRESTAMO, TIPOS_MOVIMIENTO } from '../constants/estados';

const areasMock = [
  { id: '11111111-1111-1111-1111-111111111111', nombre: 'Tecnología de la Información', activo: true },
  { id: '22222222-2222-2222-2222-222222222222', nombre: 'Desarrollo de Software', activo: true },
  { id: '33333333-3333-3333-3333-333333333333', nombre: 'Infraestructura y Redes', activo: true }
];

let usuarioSesion = null;

let usuariosMock = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    nombres: 'Carlos',
    apellidos: 'Mendoza Admin',
    nombreCompleto: 'Carlos Mendoza Admin',
    correo: 'admin@innovatech.com',
    rol: ROLES.ADMINISTRADOR,
    areaId: areasMock[0].id,
    areaNombre: areasMock[0].nombre,
    activo: true,
    tema: 'claro',
    tamanoLetra: 'Normal'
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    nombres: 'Elena',
    apellidos: 'Ríos Responsable',
    nombreCompleto: 'Elena Ríos Responsable',
    correo: 'resp.tecnologia@innovatech.com',
    rol: ROLES.RESPONSABLE_TECNOLOGIA,
    areaId: areasMock[0].id,
    areaNombre: areasMock[0].nombre,
    activo: true,
    tema: 'claro',
    tamanoLetra: 'Normal'
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    nombres: 'Luis',
    apellidos: 'Alarcón Colaborador',
    nombreCompleto: 'Luis Alarcón Colaborador',
    correo: 'colaborador1@innovatech.com',
    rol: ROLES.COLABORADOR,
    areaId: areasMock[1].id,
    areaNombre: areasMock[1].nombre,
    activo: true,
    tema: 'claro',
    tamanoLetra: 'Normal'
  }
];

let equiposMock = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    codigoPatrimonial: 'INNO-LAP-001',
    nombre: 'ThinkPad T14 Gen 4',
    categoria: CATEGORIAS_EQUIPO.LAPTOP,
    marca: 'Lenovo',
    estado: ESTADOS_EQUIPO.DISPONIBLE,
    ubicacion: 'Almacén Central TI - Estante A1'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    codigoPatrimonial: 'INNO-LAP-002',
    nombre: 'Latitude 5430 Rugged',
    categoria: CATEGORIAS_EQUIPO.LAPTOP,
    marca: 'Dell',
    estado: ESTADOS_EQUIPO.PRESTADO,
    ubicacion: 'Laboratorio de Pruebas'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000003',
    codigoPatrimonial: 'INNO-MON-001',
    nombre: 'UltraSharp 27" 4K',
    categoria: CATEGORIAS_EQUIPO.MONITOR,
    marca: 'Dell',
    estado: ESTADOS_EQUIPO.DISPONIBLE,
    ubicacion: 'Piso 3 - Área de Diseño'
  }
];

let prestamosMock = [
  {
    id: 'p0000000-0000-0000-0000-000000000001',
    fechaPrestamo: '2026-11-10',
    fechaDevolucionEstimada: '2026-11-20',
    fechaDevolucionReal: null,
    motivo: 'Desarrollo en cliente',
    observacion: null,
    estado: ESTADOS_PRESTAMO.ACTIVO,
    solicitanteId: usuariosMock[2].id,
    solicitanteNombre: usuariosMock[2].nombreCompleto,
    solicitanteCorreo: usuariosMock[2].correo,
    solicitanteArea: usuariosMock[2].areaNombre,
    equipoId: equiposMock[1].id,
    equipoCodigo: equiposMock[1].codigoPatrimonial,
    equipoNombre: equiposMock[1].nombre,
    equipoCategoria: equiposMock[1].categoria,
    responsableId: usuariosMock[1].id,
    responsableNombre: usuariosMock[1].nombreCompleto
  }
];

let movimientosMock = [
  {
    id: 'm0000000-0000-0000-0000-000000000001',
    equipoId: equiposMock[1].id,
    equipoCodigo: equiposMock[1].codigoPatrimonial,
    equipoNombre: equiposMock[1].nombre,
    usuarioId: usuariosMock[1].id,
    usuarioNombre: usuariosMock[1].nombreCompleto,
    tipo: TIPOS_MOVIMIENTO.PRESTAMO_APROBADO,
    estadoAnterior: 'Disponible',
    estadoNuevo: 'Prestado',
    detalle: 'Préstamo aprobado para sprint de desarrollo.',
    fechaHora: '2026-11-17T15:30:00Z',
    fechaMovimiento: '2026-11-17T15:30:00Z'
  },
  {
    id: 'm0000000-0000-0000-0000-000000000002',
    equipoId: equiposMock[0].id,
    equipoCodigo: equiposMock[0].codigoPatrimonial,
    equipoNombre: equiposMock[0].nombre,
    usuarioId: usuariosMock[0].id,
    usuarioNombre: usuariosMock[0].nombreCompleto,
    tipo: TIPOS_MOVIMIENTO.REGISTRO,
    estadoAnterior: '-',
    estadoNuevo: 'Disponible',
    detalle: 'Alta de equipo en inventario corporativo.',
    fechaHora: '2026-11-16T10:00:00Z',
    fechaMovimiento: '2026-11-16T10:00:00Z'
  },
  {
    id: 'm0000000-0000-0000-0000-000000000003',
    equipoId: equiposMock[2].id,
    equipoCodigo: equiposMock[2].codigoPatrimonial,
    equipoNombre: equiposMock[2].nombre,
    usuarioId: usuariosMock[1].id,
    usuarioNombre: usuariosMock[1].nombreCompleto,
    tipo: TIPOS_MOVIMIENTO.DEVOLUCION,
    estadoAnterior: 'Prestado',
    estadoNuevo: 'Disponible',
    detalle: 'Devolución conforme. Equipo en perfecto estado.',
    fechaHora: '2026-11-15T18:00:00Z',
    fechaMovimiento: '2026-11-15T18:00:00Z'
  }
];

export async function ejecutarPeticionMock(ruta, { metodo = 'GET', cuerpo = null } = {}) {
  // Simular latencia de red
  await new Promise(r => setTimeout(r, 60));

  // 1. Auth
  if (ruta === '/api/auth/login' && metodo === 'POST') {
    const usuario = usuariosMock.find(u => u.correo.toLowerCase() === cuerpo.correo.toLowerCase());
    if (!usuario) {
      return { estado: 401, datos: { error: 'CredencialesIncorrectas', mensaje: 'Credenciales incorrectas.' } };
    }
    usuarioSesion = usuario;
    const permisos = Object.values(PERMISOS);
    return { estado: 200, datos: { usuario, permisos } };
  }

  if (ruta === '/api/auth/logout' && metodo === 'POST') {
    usuarioSesion = null;
    return { estado: 200, datos: { mensaje: 'Sesión cerrada' } };
  }

  if (ruta === '/api/auth/me') {
    if (!usuarioSesion) {
      return { estado: 401, datos: { mensaje: 'No autenticado' } };
    }
    return { estado: 200, datos: { usuario: usuarioSesion, permisos: Object.values(PERMISOS) } };
  }

  // 2. Areas
  if (ruta === '/api/areas') {
    return { estado: 200, datos: areasMock };
  }

  // 3. Equipos
  if (ruta.startsWith('/api/equipos') && metodo === 'GET') {
    return {
      estado: 200,
      datos: {
        items: equiposMock,
        pagina: 1,
        tamanoPagina: 10,
        totalItems: equiposMock.length,
        totalPaginas: 1
      }
    };
  }

  // 4. Prestamos
  if (ruta.startsWith('/api/prestamos') && metodo === 'GET') {
    return {
      estado: 200,
      datos: {
        items: prestamosMock,
        pagina: 1,
        tamanoPagina: 10,
        totalItems: prestamosMock.length,
        totalPaginas: 1
      }
    };
  }

  // 5. Dashboard y Reportes
  if (ruta === '/api/reportes/dashboard') {
    const disp = equiposMock.filter(e => e.estado === 'Disponible').length;
    const prest = equiposMock.filter(e => e.estado === 'Prestado').length;
    const mant = equiposMock.filter(e => e.estado === 'Mantenimiento').length;
    const baja = equiposMock.filter(e => e.estado === 'Baja').length;
    return {
      estado: 200,
      datos: {
        totalEquipos: equiposMock.length,
        equiposDisponibles: disp,
        equiposPrestados: prest,
        equiposMantenimiento: mant,
        equiposBaja: baja,
        totalPrestamos: prestamosMock.length,
        areaMayorUso: 'Desarrollo de Software',
        distribucionPorEstado: [
          { estado: 'Disponible', cantidad: disp, porcentaje: 54.8 },
          { estado: 'Prestado', cantidad: prest, porcentaje: 25.8 },
          { estado: 'Mantenimiento', cantidad: mant, porcentaje: 12.9 },
          { estado: 'Baja', cantidad: baja, porcentaje: 6.5 }
        ],
        prestamosPorArea: [
          { area: 'Desarrollo de Software', totalPrestamos: 10 },
          { area: 'Aseguramiento de Calidad (QA)', totalPrestamos: 7 },
          { area: 'Diseño y Experiencia (UX/UI)', totalPrestamos: 5 },
          { area: 'Infraestructura y Redes', totalPrestamos: 3 }
        ],
        solicitudesPendientes: prestamosMock.filter(p => p.estado === 'Pendiente')
      }
    };
  }

  if (ruta === '/api/reportes/equipos-por-estado') {
    return {
      estado: 200,
      datos: [
        { estado: 'Disponible', estadoNombre: 'Disponible', cantidad: 17, porcentaje: 54.8 },
        { estado: 'Prestado', estadoNombre: 'Prestado', cantidad: 8, porcentaje: 25.8 },
        { estado: 'Mantenimiento', estadoNombre: 'Mantenimiento', cantidad: 4, porcentaje: 12.9 },
        { estado: 'Baja', estadoNombre: 'Baja', cantidad: 2, porcentaje: 6.5 }
      ]
    };
  }

  if (ruta.startsWith('/api/reportes/equipos-mas-utilizados')) {
    return {
      estado: 200,
      datos: [
        { idEquipo: '1', codigoPatrimonial: 'EQ-LAP-001', nombreEquipo: 'MacBook Pro 16 M3 Max', categoria: 'Laptop', totalPrestamos: 5 },
        { idEquipo: '2', codigoPatrimonial: 'EQ-LAP-003', nombreEquipo: 'Dell XPS 15 9530', categoria: 'Laptop', totalPrestamos: 4 },
        { idEquipo: '3', codigoPatrimonial: 'EQ-MON-001', nombreEquipo: 'Dell UltraSharp 27 4K', categoria: 'Monitor', totalPrestamos: 3 }
      ]
    };
  }

  if (ruta === '/api/reportes/prestamos-por-area') {
    return {
      estado: 200,
      datos: [
        { area: 'Desarrollo de Software', totalPrestamos: 10 },
        { area: 'Aseguramiento de Calidad (QA)', totalPrestamos: 7 },
        { area: 'Diseño y Experiencia (UX/UI)', totalPrestamos: 5 },
        { area: 'Infraestructura y Redes', totalPrestamos: 3 }
      ]
    };
  }

  // 6. Movimientos de auditoria (RF-17)
  if (ruta.startsWith('/api/reportes/movimientos')) {
    return {
      estado: 200,
      datos: {
        items: movimientosMock,
        pagina: 1,
        tamanoPagina: 10,
        totalItems: movimientosMock.length,
        totalPaginas: 1
      }
    };
  }

  return { estado: 200, datos: {} };
}
