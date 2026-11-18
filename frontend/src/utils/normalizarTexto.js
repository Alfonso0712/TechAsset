// Normalización accesible de texto y correos
export function normalizarTexto(valor) {
  if (typeof valor !== 'string') return '';
  return valor.trim().replace(/\s+/g, ' ');
}

export function normalizarCorreo(valor) {
  if (typeof valor !== 'string') return '';
  return valor.trim().toLowerCase();
}
