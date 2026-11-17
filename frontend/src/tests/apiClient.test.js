import { describe, it, expect } from 'vitest';
import { solicitarApi } from '../services/apiClient';

describe('Servicio de API Client (con adaptador Mock)', () => {
  it('ejecuta login exitoso con usuario administrador en modo mock', async () => {
    const respuesta = await solicitarApi('/api/auth/login', {
      metodo: 'POST',
      cuerpo: {
        correo: 'admin@innovatech.com',
        contrasena: 'Admin123!'
      }
    });

    expect(respuesta.estado).toBe(200);
    expect(respuesta.datos?.usuario).toBeDefined();
    expect(respuesta.datos.usuario.correo).toBe('admin@innovatech.com');
    expect(respuesta.datos.usuario.rol).toBe('Administrador');
  });

  it('retorna 401 con credenciales inválidas en modo mock', async () => {
    const respuesta = await solicitarApi('/api/auth/login', {
      metodo: 'POST',
      cuerpo: {
        correo: 'desconocido@innovatech.com',
        contrasena: 'Erronea123'
      }
    });

    expect(respuesta.estado).toBe(401);
    expect(respuesta.datos?.error).toBeDefined();
  });

  it('obtiene lista de equipos paginada en modo mock', async () => {
    const respuesta = await solicitarApi('/api/equipos', { metodo: 'GET' });
    expect(respuesta.estado).toBe(200);
    expect(Array.isArray(respuesta.datos?.items)).toBe(true);
    expect(respuesta.datos.items.length).toBeGreaterThan(0);
  });

  it('obtiene el dashboard con métricas e indicadores de equipos y préstamos', async () => {
    const respuesta = await solicitarApi('/api/reportes/dashboard', { metodo: 'GET' });
    expect(respuesta.estado).toBe(200);
    expect(respuesta.datos?.totalEquipos).toBeDefined();
    expect(respuesta.datos?.equiposDisponibles).toBeDefined();
    expect(respuesta.datos?.equiposPrestados).toBeDefined();
  });
});
