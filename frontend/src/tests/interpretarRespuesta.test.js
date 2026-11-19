import { describe, it, expect } from 'vitest';
import { interpretarRespuesta, interpretarRespuestaError } from '../validation/interpretarRespuesta';

describe('interpretarRespuesta · Normalización de errores RFC 7807', () => {
  it('normaliza errores en PascalCase de ASP.NET Core a camelCase para formulario de Usuario', () => {
    const respuesta = {
      estado: 400,
      datos: {
        type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
        title: 'One or more validation errors occurred.',
        status: 400,
        errors: {
          Nombres: ['Los nombres son obligatorios.'],
          Correo: ['El formato del correo corporativo no es válido.'],
          AreaId: ['Debe seleccionar un área válida.']
        }
      }
    };

    const resultado = interpretarRespuesta(respuesta);
    expect(resultado.ok).toBe(false);
    expect(resultado.accion).toBe('corregir');
    expect(resultado.errores).toEqual({
      nombres: 'Los nombres son obligatorios.',
      correo: 'El formato del correo corporativo no es válido.',
      areaId: 'Debe seleccionar un área válida.'
    });
  });

  it('normaliza errores de Equipo con claves PascalCase y prefijos model binding', () => {
    const respuesta = {
      estado: 400,
      datos: {
        errors: {
          CodigoPatrimonial: ['El código patrimonial es obligatorio.'],
          '$.Categoria': ['La categoría del equipo no es válida.'],
          'model.Marca': ['La marca debe tener entre 2 y 50 caracteres.']
        }
      }
    };

    const resultado = interpretarRespuesta(respuesta);
    expect(resultado.errores.codigoPatrimonial).toBe('El código patrimonial es obligatorio.');
    expect(resultado.errores.categoria).toBe('La categoría del equipo no es válida.');
    expect(resultado.errores.marca).toBe('La marca debe tener entre 2 y 50 caracteres.');
  });

  it('normaliza errores de Préstamo y Devolución', () => {
    const respuesta = {
      estado: 400,
      datos: {
        errors: {
          FechaDevolucionEstimada: ['La fecha estimada de devolución debe ser estrictamente posterior a la fecha de préstamo.'],
          Observacion: ['La observación debe tener entre 3 y 500 caracteres.']
        }
      }
    };

    const resultado = interpretarRespuesta(respuesta);
    expect(resultado.errores.fechaDevolucionEstimada).toBe(
      'La fecha estimada de devolución debe ser estrictamente posterior a la fecha de préstamo.'
    );
    expect(resultado.errores.observacion).toBe('La observación debe tener entre 3 y 500 caracteres.');
  });

  it('mapea conflicto 409 con mensaje de código patrimonial duplicado al campo codigoPatrimonial', () => {
    const respuesta = {
      estado: 409,
      datos: {
        error: 'El código patrimonial ingresado ya está registrado para otro equipo en el sistema.',
        mensaje: 'El código patrimonial ingresado ya está registrado para otro equipo en el sistema.'
      }
    };

    const resultado = interpretarRespuesta(respuesta);
    expect(resultado.ok).toBe(false);
    expect(resultado.accion).toBe('conflicto');
    expect(resultado.errores.codigoPatrimonial).toContain('código patrimonial');
  });

  it('mapea conflicto 409 con mensaje de correo duplicado al campo correo', () => {
    const respuesta = {
      estado: 409,
      datos: {
        error: 'El correo electrónico corporativo ya está registrado para otro usuario.',
        mensaje: 'El correo electrónico corporativo ya está registrado para otro usuario.'
      }
    };

    const resultado = interpretarRespuesta(respuesta);
    expect(resultado.errores.correo).toContain('correo electrónico corporativo');
  });

  it('interpretarRespuestaError devuelve el primer error de campo o el error general', () => {
    const error400 = interpretarRespuestaError(400, {
      errors: {
        Observacion: ['Observación técnica requerida.']
      }
    });
    expect(error400).toBe('Observación técnica requerida.');

    const error401 = interpretarRespuestaError(401, {
      error: 'Credenciales incorrectas.'
    });
    expect(error401).toBe('Credenciales incorrectas.');
  });
});
