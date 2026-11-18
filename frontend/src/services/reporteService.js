import { solicitarApi } from './apiClient';

export const reporteService = {
  async obtenerDashboard(signal) {
    return solicitarApi('/api/reportes/dashboard', { metodo: 'GET', signal });
  },

  async obtenerEquiposPorEstado(signal) {
    return solicitarApi('/api/reportes/equipos-por-estado', { metodo: 'GET', signal });
  },

  async obtenerEquiposMasUtilizados(parametros = {}, signal) {
    const qs = new URLSearchParams();
    const limite = parametros.limite || (typeof parametros === 'number' ? parametros : 10);
    qs.append('limite', limite);
    if (parametros.categoria) qs.append('categoria', parametros.categoria);
    if (parametros.fechaDesde) qs.append('fechaDesde', parametros.fechaDesde);
    if (parametros.fechaHasta) qs.append('fechaHasta', parametros.fechaHasta);

    const query = qs.toString() ? `?${qs.toString()}` : '';
    return solicitarApi(`/api/reportes/equipos-mas-utilizados${query}`, { metodo: 'GET', signal });
  },

  async obtenerPrestamosPorArea(parametros = {}, signal) {
    const qs = new URLSearchParams();
    if (parametros.fechaDesde) qs.append('fechaDesde', parametros.fechaDesde);
    if (parametros.fechaHasta) qs.append('fechaHasta', parametros.fechaHasta);

    const query = qs.toString() ? `?${qs.toString()}` : '';
    return solicitarApi(`/api/reportes/prestamos-por-area${query}`, { metodo: 'GET', signal });
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
