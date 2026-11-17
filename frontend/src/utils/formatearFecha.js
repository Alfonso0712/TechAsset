export function formatearFecha(cadenaFecha) {
  if (!cadenaFecha) return '-';
  try {
    const partes = cadenaFecha.split('T')[0].split('-');
    if (partes.length === 3) {
      const [y, m, d] = partes;
      return `${d}/${m}/${y}`;
    }
    const d = new Date(cadenaFecha);
    return isNaN(d.getTime()) ? cadenaFecha : d.toLocaleDateString('es-PE');
  } catch {
    return cadenaFecha;
  }
}

export function formatearFechaHora(cadenaFechaHora) {
  if (!cadenaFechaHora) return '-';
  try {
    const d = new Date(cadenaFechaHora);
    if (isNaN(d.getTime())) return cadenaFechaHora;
    return d.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return cadenaFechaHora;
  }
}
