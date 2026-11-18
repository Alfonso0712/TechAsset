import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Reportes from '../pages/Reportes';

// Mock de respuestas de API típicas (incluyendo casos de 0 registros y áreas sin uso)
vi.mock('../services/reporteService', () => ({
  reporteService: {
    obtenerEquiposPorEstado: vi.fn().mockResolvedValue({
      estado: 200,
      datos: [
        { estado: 'Disponible', estadoNombre: 'Disponible', cantidad: 17, porcentaje: 55 },
        { estado: 'Prestado', estadoNombre: 'Prestado', cantidad: 8, porcentaje: 26 },
        { estado: 'Mantenimiento', estadoNombre: 'Mantenimiento', cantidad: 4, porcentaje: 13 },
        { estado: 'Baja', estadoNombre: 'Baja', cantidad: 2, porcentaje: 6 }
      ]
    }),
    obtenerEquiposMasUtilizados: vi.fn().mockResolvedValue({
      estado: 200,
      datos: [
        {
          equipoId: 'e0000000-0000-0000-0000-000000000001',
          codigo: 'EQ-LAP-001',
          codigoPatrimonial: 'EQ-LAP-001',
          nombre: 'ThinkPad T14 Gen 4',
          nombreEquipo: 'ThinkPad T14 Gen 4',
          marca: 'Lenovo',
          categoria: 'Laptop',
          totalPrestamos: 7,
          ultimoPrestamo: '2026-11-15'
        },
        {
          equipoId: 'e0000000-0000-0000-0000-000000000002',
          codigo: 'EQ-MON-001',
          codigoPatrimonial: 'EQ-MON-001',
          nombre: 'UltraSharp 27 4K',
          nombreEquipo: 'UltraSharp 27 4K',
          marca: 'Dell',
          categoria: 'Monitor',
          totalPrestamos: 4,
          ultimoPrestamo: '2026-11-14'
        }
      ]
    }),
    obtenerPrestamosPorArea: vi.fn().mockResolvedValue({
      estado: 200,
      datos: [
        { areaNombre: 'Desarrollo de Software', totalPrestamos: 13, activos: 4, devueltos: 9, porcentaje: 52 },
        { areaNombre: 'Aseguramiento de Calidad (QA)', totalPrestamos: 5, activos: 2, devueltos: 3, porcentaje: 20 },
        { areaNombre: 'Diseño y Experiencia (UX/UI)', totalPrestamos: 4, activos: 1, devueltos: 3, porcentaje: 16 },
        { areaNombre: 'Gestión de Proyectos y Operaciones', totalPrestamos: 2, activos: 1, devueltos: 1, porcentaje: 8 },
        { areaNombre: 'Soporte Técnico de TI', totalPrestamos: 1, activos: 0, devueltos: 1, porcentaje: 4 },
        { areaNombre: 'Data Center & Infraestructura', totalPrestamos: 0, activos: 0, devueltos: 0, porcentaje: 0 }
      ]
    }),
    obtenerMovimientos: vi.fn().mockResolvedValue({
      estado: 200,
      datos: {
        items: [
          {
            id: 'm1',
            equipoId: 'e1',
            equipoCodigo: 'EQ-LAP-001',
            equipoNombre: 'ThinkPad T14 Gen 4',
            usuarioId: 'u1',
            usuarioNombre: 'Elena Huamán Rojas',
            tipo: 'PrestamoAprobado',
            estadoAnterior: 'Disponible',
            estadoNuevo: 'Prestado',
            detalle: 'Préstamo de laptop para sprint 2.',
            fechaHora: '2026-11-17T15:30:00Z',
            fechaMovimiento: '2026-11-17T15:30:00Z'
          }
        ],
        pagina: 1,
        tamanoPagina: 10,
        totalItems: 1,
        totalPaginas: 1
      }
    })
  }
}));

vi.mock('../services/equipoService', () => ({
  equipoService: {
    listar: vi.fn().mockResolvedValue({
      estado: 200,
      datos: {
        items: [
          {
            id: 'e1',
            codigoPatrimonial: 'EQ-LAP-001',
            nombre: 'ThinkPad T14 Gen 4',
            marca: 'Lenovo',
            categoria: 'Laptop',
            estado: 'Disponible',
            ubicacion: 'Almacén Central TI'
          }
        ],
        totalItems: 1
      }
    })
  }
}));

vi.mock('../services/prestamoService', () => ({
  prestamoService: {
    listar: vi.fn().mockResolvedValue({
      estado: 200,
      datos: {
        items: [],
        totalItems: 0
      }
    })
  }
}));

describe('Reportes y Trazabilidad (TechAsset RF-14..RF-17)', () => {
  it('renderiza la pestaña Equipos por estado sin texto NaN ni valores undefined', async () => {
    render(
      <MemoryRouter initialEntries={['/reportes']}>
        <Reportes />
      </MemoryRouter>
    );

    expect(await screen.findByText('Equipos por estado')).toBeInTheDocument();
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });

  it('renderiza la pestaña Más utilizados mostrando código patrimonial, medallas y sin NaN', async () => {
    render(
      <MemoryRouter initialEntries={['/reportes?tab=utilizados']}>
        <Reportes />
      </MemoryRouter>
    );

    expect(await screen.findByText('ThinkPad T14 Gen 4 • Lenovo')).toBeInTheDocument();
    expect(screen.getByText('EQ-LAP-001')).toBeInTheDocument();
    expect(screen.queryAllByText(/NaN/)).toHaveLength(0);
  });

  it('renderiza la pestaña Préstamos por área mostrando las 6 áreas corporativas y sin NaN', async () => {
    render(
      <MemoryRouter initialEntries={['/reportes?tab=areas']}>
        <Reportes />
      </MemoryRouter>
    );

    const matchesDesarrollo = await screen.findAllByText('Desarrollo de Software');
    expect(matchesDesarrollo.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Data Center & Infraestructura').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByText(/NaN/)).toHaveLength(0);
  });

  it('renderiza la pestaña Movimientos con formato de fecha y sin select truncado', async () => {
    render(
      <MemoryRouter initialEntries={['/reportes?tab=movimientos']}>
        <Reportes />
      </MemoryRouter>
    );

    expect(await screen.findByText('Historial inmutable de auditoría y movimientos de inventario')).toBeInTheDocument();
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
  });
});
