import { solicitarApi } from './apiClient';

export const areaService = {
  async listarActivas(signal) {
    return solicitarApi('/api/areas', {
      metodo: 'GET',
      signal
    });
  }
};
