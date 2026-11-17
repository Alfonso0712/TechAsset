import { solicitarApi } from './apiClient';

export const equipoService = {
  async listar(parametros = {}, signal) {
    const qs = new URLSearchParams();
    if (parametros.texto) qs.append('texto', parametros.texto);
    if (parametros.categoria) qs.append('categoria', parametros.categoria);
    if (parametros.estado) qs.append('estado', parametros.estado);
    if (parametros.ubicacion) qs.append('ubicacion', parametros.ubicacion);
    if (parametros.pagina) qs.append('pagina', parametros.pagina);
    if (parametros.tamanoPagina) qs.append('tamanoPagina', parametros.tamanoPagina);

    const query = qs.toString() ? `?${qs.toString()}` : '';
    return solicitarApi(`/api/equipos${query}`, { metodo: 'GET', signal });
  },

  async obtenerPorId(id, signal) {
    return solicitarApi(`/api/equipos/${id}`, { metodo: 'GET', signal });
  },

  async crear(datos, signal) {
    return solicitarApi('/api/equipos', { metodo: 'POST', cuerpo: datos, signal });
  },

  async actualizar(id, datos, signal) {
    return solicitarApi(`/api/equipos/${id}`, { metodo: 'PUT', cuerpo: datos, signal });
  },

  async cambiarEstado(id, nuevoEstado, motivo = '', signal) {
    return solicitarApi(`/api/equipos/${id}/estado`, {
      metodo: 'PATCH',
      cuerpo: { nuevoEstado, motivo },
      signal
    });
  }
};
