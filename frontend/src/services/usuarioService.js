import { solicitarApi } from './apiClient';

export const usuarioService = {
  async listar(parametros = {}, signal) {
    const qs = new URLSearchParams();
    if (parametros.texto) qs.append('texto', parametros.texto);
    if (parametros.rol) qs.append('rol', parametros.rol);
    if (parametros.activo !== undefined && parametros.activo !== '') qs.append('activo', parametros.activo);
    if (parametros.areaId) qs.append('areaId', parametros.areaId);
    if (parametros.pagina) qs.append('pagina', parametros.pagina);
    if (parametros.tamanoPagina) qs.append('tamanoPagina', parametros.tamanoPagina);

    const query = qs.toString() ? `?${qs.toString()}` : '';
    return solicitarApi(`/api/usuarios${query}`, { metodo: 'GET', signal });
  },

  async obtenerPorId(id, signal) {
    return solicitarApi(`/api/usuarios/${id}`, { metodo: 'GET', signal });
  },

  async crear(datos, signal) {
    return solicitarApi('/api/usuarios', { metodo: 'POST', cuerpo: datos, signal });
  },

  async actualizar(id, datos, signal) {
    return solicitarApi(`/api/usuarios/${id}`, { metodo: 'PUT', cuerpo: datos, signal });
  },

  async cambiarEstado(id, activo, signal) {
    return solicitarApi(`/api/usuarios/${id}/estado`, {
      metodo: 'PATCH',
      cuerpo: { activo },
      signal
    });
  },

  async listarResponsables(signal) {
    return solicitarApi('/api/usuarios/responsables', { metodo: 'GET', signal });
  },

  async actualizarPreferencias(tema, tamanoLetra, signal) {
    return solicitarApi('/api/usuarios/preferencias', {
      metodo: 'PUT',
      cuerpo: { tema, tamanoLetra },
      signal
    });
  }
};
