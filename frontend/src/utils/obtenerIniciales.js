export function obtenerIniciales(nombreCompleto) {
  if (!nombreCompleto || typeof nombreCompleto !== 'string') return 'TA';
  const partes = nombreCompleto.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
