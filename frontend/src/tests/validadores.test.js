import { describe, it, expect } from 'vitest';
import {
  esNoVacio,
  esCorreoValido,
  longitudMinima,
  fechaEsPosterior
} from '../validation/validadores';
import { validarLogin } from '../validation/reglasAuth';
import { validarSolicitudPrestamo, validarDevolucion } from '../validation/reglasPrestamo';
import { validarEquipo } from '../validation/reglasEquipo';

describe('Validadores de Dominio y Formularios', () => {
  describe('Funciones atómicas de validación', () => {
    it('esNoVacio valida strings no vacíos y con espacios', () => {
      expect(esNoVacio('hola')).toBe(true);
      expect(esNoVacio('')).toBe(false);
      expect(esNoVacio('   ')).toBe(false);
      expect(esNoVacio(null)).toBe(false);
    });

    it('esCorreoValido valida sintaxis correcta de correo electrónico', () => {
      expect(esCorreoValido('admin@innovatech.com')).toBe(true);
      expect(esCorreoValido('invalido@')).toBe(false);
      expect(esCorreoValido('sin-arroba.com')).toBe(false);
      expect(esCorreoValido('')).toBe(false);
    });

    it('longitudMinima comprueba el largo mínimo', () => {
      expect(longitudMinima('123456', 6)).toBe(true);
      expect(longitudMinima('12345', 6)).toBe(false);
    });

    it('fechaEsPosterior comprueba que fechaFin sea estrictamente mayor que fechaInicio', () => {
      expect(fechaEsPosterior('2026-11-20', '2026-11-18')).toBe(true);
      expect(fechaEsPosterior('2026-11-18', '2026-11-20')).toBe(false);
      expect(fechaEsPosterior('2026-11-18', '2026-11-18')).toBe(false);
    });
  });

  describe('validarLogin', () => {
    it('retorna errores cuando los campos están vacíos', () => {
      const errores = validarLogin({ correo: '', contrasena: '' });
      expect(errores.correo).toBeDefined();
      expect(errores.contrasena).toBeDefined();
    });

    it('retorna error si el correo no tiene formato válido', () => {
      const errores = validarLogin({ correo: 'test', contrasena: '123456' });
      expect(errores.correo).toContain('formato');
      expect(errores.contrasena).toBeUndefined();
    });

    it('retorna vacío cuando las credenciales son válidas', () => {
      const errores = validarLogin({ correo: 'admin@innovatech.com', contrasena: 'Admin123!' });
      expect(Object.keys(errores)).toHaveLength(0);
    });
  });

  describe('validarSolicitudPrestamo (RN-04)', () => {
    it('retorna error cuando fecha estimada no es posterior a fecha de préstamo', () => {
      const errores = validarSolicitudPrestamo({
        idEquipo: 'eq-1',
        fechaPrestamo: '2026-11-20',
        fechaDevolucionEstimada: '2026-11-19',
        motivo: 'Desarrollo de software'
      });
      expect(errores.fechaDevolucionEstimada).toContain('estrictamente posterior');
    });

    it('pasa la validación cuando todos los campos son válidos', () => {
      const errores = validarSolicitudPrestamo({
        idEquipo: 'eq-1',
        fechaPrestamo: '2026-11-20',
        fechaDevolucionEstimada: '2026-11-25',
        motivo: 'Pruebas de rendimiento'
      });
      expect(Object.keys(errores)).toHaveLength(0);
    });
  });

  describe('validarDevolucion (RN-10)', () => {
    it('exige observación técnica no vacía y descriptiva', () => {
      const errVacio = validarDevolucion({ observacion: '' });
      expect(errVacio.observacion).toContain('RN-10');

      const errCorto = validarDevolucion({ observacion: 'Ok' });
      expect(errCorto.observacion).toContain('mínimo 5 caracteres');
    });

    it('acepta observación técnica completa', () => {
      const errores = validarDevolucion({
        observacion: 'Equipo devuelto en óptimas condiciones físicas y funcionales.'
      });
      expect(Object.keys(errores)).toHaveLength(0);
    });
  });

  describe('validarEquipo (RN-07)', () => {
    it('exige código patrimonial en creación pero no en edición', () => {
      const errCreacion = validarEquipo({
        codigoPatrimonial: '',
        nombre: 'Laptop Dell',
        categoria: 'Laptop',
        marca: 'Dell',
        ubicacion: 'Oficina 101'
      }, false);
      expect(errCreacion.codigoPatrimonial).toBeDefined();

      const errEdicion = validarEquipo({
        codigoPatrimonial: '',
        nombre: 'Laptop Dell',
        categoria: 'Laptop',
        marca: 'Dell',
        ubicacion: 'Oficina 101'
      }, true);
      expect(errEdicion.codigoPatrimonial).toBeUndefined();
    });
  });
});
