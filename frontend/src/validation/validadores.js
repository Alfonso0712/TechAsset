// Punto único de exportación de reglas de validación puras
export * from './reglasUsuario';
export * from './reglasEquipo';
export * from './reglasPrestamo';

export function esNoVacio(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

export function esCorreoValido(correo) {
  if (!esNoVacio(correo)) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo.trim());
}

export function longitudMinima(valor, min) {
  return typeof valor === 'string' && valor.trim().length >= min;
}

export function fechaEsPosterior(fechaFin, fechaInicio) {
  if (!fechaFin || !fechaInicio) return false;
  return new Date(fechaFin) > new Date(fechaInicio);
}
