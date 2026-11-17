import { MENSAJES } from '../constants/mensajes';

export function interpretarRespuestaError(estado, datos) {
  if (estado === 0) {
    return MENSAJES.ERROR_CONEXION;
  }
  if (estado === 401) {
    return datos?.mensaje || datos?.detail || MENSAJES.SESION_EXPIRADA;
  }
  if (estado === 403) {
    return datos?.mensaje || datos?.detail || MENSAJES.ACCESO_DENEGADO;
  }
  if (estado === 404) {
    return datos?.mensaje || datos?.detail || 'El recurso solicitado no fue encontrado.';
  }
  if (estado === 409) {
    return datos?.mensaje || datos?.detail || 'Conflicto detectado con los datos ingresados.';
  }
  if (estado === 429) {
    return datos?.detail || 'Demasiados intentos. Por favor espere un momento antes de reintentar.';
  }
  if (estado >= 400 && estado < 500) {
    return datos?.mensaje || datos?.detail || datos?.error || MENSAJES.CAMPOS_OBLIGATORIOS;
  }
  return datos?.detail || datos?.mensaje || MENSAJES.ERROR_GENERICO;
}
