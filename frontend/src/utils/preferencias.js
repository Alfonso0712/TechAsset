// Utilidades de mapeo y persistencia de preferencias · TechAsset
export const TEMA_DEFECTO = 'claro';
export const TAMANO_DEFECTO = '100%';

export const ESCALAS_FUENTE = [
  { id: 'normal', etiqueta: 'A−', porcentaje: '87.5%', descripcion: 'Tamaño de fuente estándar (87.5 %)' },
  { id: 'grande', etiqueta: 'A', porcentaje: '100%', descripcion: 'Tamaño de fuente mediano (100 %)' },
  { id: 'extra', etiqueta: 'A+', porcentaje: '112.5%', descripcion: 'Tamaño de fuente grande (112.5 %)' }
];

export const MAPA_LETRA_A_PCT = { Pequena: '87.5%', Normal: '100%', Grande: '112.5%' };
export const MAPA_PCT_A_LETRA = { '87.5%': 'Pequena', '100%': 'Normal', '112.5%': 'Grande' };

export function aplicarPreferenciasAlDom(tema, tamanoFuente) {
  if (typeof document === 'undefined') return;
  const t = tema === 'oscuro' ? 'oscuro' : 'claro';
  const f = MAPA_PCT_A_LETRA[tamanoFuente] ? tamanoFuente : '100%';
  document.documentElement.setAttribute('data-tema', t);
  document.documentElement.setAttribute('data-tamano-fuente', f);
  document.documentElement.style.fontSize = f;
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
