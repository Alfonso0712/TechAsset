import { solicitarApi } from './apiClient';

export const prestamoService = {
  async listar(parametros = {}, signal) {
    const qs = new URLSearchParams();
    if (parametros.estado) qs.append('estado', parametros.estado);
    if (parametros.equipoId) qs.append('equipoId', parametros.equipoId);
    if (parametros.colaboradorId) qs.append('colaboradorId', parametros.colaboradorId);
    if (parametros.fechaDesde) qs.append('fechaDesde', parametros.fechaDesde);
    if (parametros.fechaHasta) qs.append('fechaHasta', parametros.fechaHasta);
    if (parametros.pagina) qs.append('pagina', parametros.pagina);
    if (parametros.tamanoPagina) qs.append('tamanoPagina', parametros.tamanoPagina);

    const query = qs.toString() ? `?${qs.toString()}` : '';
    return solicitarApi(`/api/prestamos${query}`, { metodo: 'GET', signal });
  },

  async listarActivos(signal) {
    return solicitarApi('/api/prestamos/activos', { metodo: 'GET', signal });
  },

  async obtenerPorId(id, signal) {
    return solicitarApi(`/api/prestamos/${id}`, { metodo: 'GET', signal });
  },

  async solicitar(datos, signal) {
    return solicitarApi('/api/prestamos', { metodo: 'POST', cuerpo: datos, signal });
  },

  async crearDirecto(datos, signal) {
    return solicitarApi('/api/prestamos/directo', { metodo: 'POST', cuerpo: datos, signal });
  },

  async aprobar(id, signal) {
    return solicitarApi(`/api/prestamos/${id}/aprobar`, { metodo: 'PATCH', signal });
  },

  async rechazar(id, motivo, signal) {
    return solicitarApi(`/api/prestamos/${id}/rechazar`, {
      metodo: 'PATCH',
      cuerpo: { motivo },
      signal
    });
  },

  async registrarDevolucion(id, observacion, fechaDevolucionReal = null, signal) {
    return solicitarApi(`/api/prestamos/${id}/devolver`, {
      metodo: 'PATCH',
      cuerpo: { observacion, fechaDevolucionReal },
      signal
    });
  }
};
