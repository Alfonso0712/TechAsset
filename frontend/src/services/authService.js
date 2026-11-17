import { solicitarApi } from './apiClient';

export const authService = {
  async login(correo, contrasena, signal) {
    return solicitarApi('/api/auth/login', {
      metodo: 'POST',
      cuerpo: { correo, contrasena },
      signal
    });
  },

  async logout(signal) {
    return solicitarApi('/api/auth/logout', {
      metodo: 'POST',
      signal
    });
  },

  async me(signal) {
    return solicitarApi('/api/auth/me', {
      metodo: 'GET',
      signal
    });
  }
};
