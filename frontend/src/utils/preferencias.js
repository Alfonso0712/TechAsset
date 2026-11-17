export const TEMA_DEFECTO = 'claro';
export const TAMANO_DEFECTO = '100%';

export const ESCALAS_FUENTE = Object.freeze([
  { clave: 'A-', etiqueta: 'A-', valor: '87.5%' },
  { clave: 'A', etiqueta: 'A', valor: '100%' },
  { clave: 'A+', etiqueta: 'A+', valor: '112.5%' }
]);

export const MAPA_LETRA_A_PCT = Object.freeze({
  Pequena: '87.5%',
  Normal: '100%',
  Grande: '112.5%'
});

export const MAPA_PCT_A_LETRA = Object.freeze({
  '87.5%': 'Pequena',
  '100%': 'Normal',
  '112.5%': 'Grande'
});

export function aplicarPreferenciasAlDom(tema, tamanoFuente) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-tema', tema || TEMA_DEFECTO);
  root.setAttribute('data-tamano-fuente', tamanoFuente || TAMANO_DEFECTO);
}

export function obtenerPrefAlmacenadas(usuarioId) {
  try {
    const key = usuarioId ? `techasset_pref_${usuarioId}` : 'techasset_pref_anon';
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function guardarPrefAlmacenadas(usuarioId, pref) {
  try {
    const key = usuarioId ? `techasset_pref_${usuarioId}` : 'techasset_pref_anon';
    localStorage.setItem(key, JSON.stringify(pref));
  } catch {
    // Ignore storage errors
  }
}

export function limpiarPrefActiva() {
  try {
    localStorage.removeItem('techasset_pref_anon');
  } catch {
    // Ignore
  }
}
