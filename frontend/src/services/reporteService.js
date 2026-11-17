import { solicitarApi } from './apiClient';

export const reporteService = {
  async obtenerDashboard(signal) {
    return solicitarApi('/api/reportes/dashboard', { metodo: 'GET', signal });
  },

  async obtenerEquiposPorEstado(signal) {
    return solicitarApi('/api/reportes/equipos-por-estado', { metodo: 'GET', signal });
  },

  async obtenerEquiposMasUtilizados(limite = 10, signal) {
    return solicitarApi(`/api/reportes/equipos-mas-utilizados?limite=${limite}`, { metodo: 'GET', signal });
  },

  async obtenerPrestamosPorArea(signal) {
    return solicitarApi('/api/reportes/prestamos-por-area', { metodo: 'GET', signal });
  },

  async obtenerMovimientos(parametros = {}, signal) {
    const qs = new URLSearchParams();
    if (parametros.equipoId) qs.append('equipoId', parametros.equipoId);
    if (parametros.usuarioId) qs.append('usuarioId', parametros.usuarioId);
    if (parametros.tipo) qs.append('tipo', parametros.tipo);
    if (parametros.pagina) qs.append('pagina', parametros.pagina);
    if (parametros.tamanoPagina) qs.append('tamanoPagina', parametros.tamanoPagina);

    const query = qs.toString() ? `?${qs.toString()}` : '';
    return solicitarApi(`/api/reportes/movimientos${query}`, { metodo: 'GET', signal });
  }
};
