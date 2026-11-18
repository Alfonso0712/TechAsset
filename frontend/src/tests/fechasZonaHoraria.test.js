import { describe, it, expect } from 'vitest';
import { fechaHoyLocal, obtenerRangoSemanaLima, esPrestamoVencido } from '../utils/fechas';

describe('Pruebas de zona horaria America/Lima (UTC-5)', () => {
  it('A las 23:36 en Lima (04:36 UTC del día 18), fechaHoyLocal devuelve el día 17 y no 18', () => {
    // 2026-11-18T04:36:00Z corresponde exactamente a las 23:36 del 17 de noviembre en Lima
    const fechaUtc = new Date('2026-11-18T04:36:00Z');
    const hoyLima = fechaHoyLocal(fechaUtc);
    expect(hoyLima).toBe('2026-11-17');
  });

  it('Calcula correctamente el rango de la semana en curso (Lunes a Domingo)', () => {
    const fechaUtc = new Date('2026-11-18T04:36:00Z'); // Martes 17 de noviembre en Lima
    const { lunesIso, domingoIso } = obtenerRangoSemanaLima(fechaUtc);
    expect(lunesIso).toBe('2026-11-16');
    expect(domingoIso).toBe('2026-11-22');
  });

  it('Detecta préstamo vencido cuando la fecha estimada es anterior a hoy en Lima', () => {
    const fechaUtc = new Date('2026-11-18T04:36:00Z'); // 17 de noviembre en Lima
    const prestamoVencido = {
      estado: 'Activo',
      fechaDevolucionEstimada: '2026-11-15'
    };
    const prestamoVigente = {
      estado: 'Activo',
      fechaDevolucionEstimada: '2026-11-20'
    };

    expect(esPrestamoVencido(prestamoVencido, fechaUtc)).toBe(true);
    expect(esPrestamoVencido(prestamoVigente, fechaUtc)).toBe(false);
  });
});
