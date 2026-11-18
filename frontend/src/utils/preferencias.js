// Utilidades de mapeo y persistencia de preferencias · TechAsset
export const TEMA_DEFECTO = 'claro';
export const TAMANO_DEFECTO = 'normal';

export const ESCALAS_FUENTE = [
  { id: 'normal', etiqueta: 'A', porcentaje: '100%', descripcion: 'Tamaño de letra 100%' },
  { id: 'grande', etiqueta: 'A+', porcentaje: '112.5%', descripcion: 'Tamaño de letra 112%' },
  { id: 'extragrande', etiqueta: 'A++', porcentaje: '125%', descripcion: 'Tamaño de letra 125%' }
];

export const MAPA_LETRA_A_PCT = {
  normal: '100%',
  grande: '112.5%',
  extragrande: '125%'
};

export const MAPA_PCT_A_LETRA = {
  '100%': 'normal',
  '112.5%': 'grande',
  '125%': 'extragrande'
};

export function normalizarTamanoLetra(valor) {
  if (!valor) return 'normal';
  const v = valor.toString().trim().toLowerCase();
  if (v === 'extragrande' || v === '125%' || v === 'a++') return 'extragrande';
  if (v === 'grande' || v === '112.5%' || v === 'a+') return 'grande';
  return 'normal';
}

export function aplicarPreferenciasAlDom(tema, tamanoLetra) {
  if (typeof document === 'undefined') return;
  const t = tema === 'oscuro' ? 'oscuro' : 'claro';
  const normalizado = normalizarTamanoLetra(tamanoLetra);
  const porcentaje = MAPA_LETRA_A_PCT[normalizado] || '100%';

  document.documentElement.setAttribute('data-tema', t);
  document.documentElement.setAttribute('data-tamano', normalizado);
  document.documentElement.setAttribute('data-tamano-fuente', porcentaje);
  document.documentElement.style.fontSize = porcentaje;
}

export function obtenerPrefAlmacenadas(usuarioId) {
  try {
    const clave = usuarioId ? `techasset_pref_${usuarioId}` : 'techasset_pref_invitado';
    const raw = localStorage.getItem(clave);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function guardarPrefAlmacenadas(usuarioId, datos) {
  try {
    const clave = usuarioId ? `techasset_pref_${usuarioId}` : 'techasset_pref_invitado';
    localStorage.setItem(clave, JSON.stringify(datos));
    if (usuarioId) {
      localStorage.setItem('techasset_pref_activa', JSON.stringify({ usuarioId, ...datos }));
    }
    if (datos.tema) localStorage.setItem('techasset_tema', datos.tema);
    if (datos.tamanoFuente) localStorage.setItem('techasset_tamano_fuente', datos.tamanoFuente);
    if (datos.tamanoLetra) localStorage.setItem('techasset_tamano_letra', datos.tamanoLetra);
  } catch {
    // Almacenamiento restringido
  }
}

export function limpiarPrefActiva() {
  try {
    localStorage.removeItem('techasset_pref_activa');
  } catch {
    // Almacenamiento restringido
  }
}
