// Shneiderman 2 · WCAG 2.2 AA · Hook para control de tamaño de fuente · normal, grande, extragrande
import { useContext, useState, useEffect, useCallback } from 'react';
import { ContextoPreferencias } from '../context/PreferenciasContext';
import { ESCALAS_FUENTE, normalizarTamanoLetra, aplicarPreferenciasAlDom } from '../utils/preferencias';

export { ESCALAS_FUENTE };

export function useTamanoFuente() {
  const ctx = useContext(ContextoPreferencias);
  const [tamanoLocal, setTamanoLocal] = useState('normal');

  useEffect(() => {
    if (ctx) return;
    aplicarPreferenciasAlDom('claro', tamanoLocal);
  }, [ctx, tamanoLocal]);

  const cambiarTamanoLocal = useCallback((nuevo) => {
    const norm = normalizarTamanoLetra(nuevo);
    setTamanoLocal(norm);
    aplicarPreferenciasAlDom('claro', norm);
  }, []);

  if (ctx) {
    return {
      tamanoFuente: ctx.tamanoFuente,
      tamanoLetra: ctx.tamanoFuente,
      cambiarTamanoFuente: ctx.cambiarTamanoFuente,
      escalas: ctx.escalas || ESCALAS_FUENTE
    };
  }
  return {
    tamanoFuente: tamanoLocal,
    tamanoLetra: tamanoLocal,
    cambiarTamanoFuente: cambiarTamanoLocal,
    escalas: ESCALAS_FUENTE
  };
}
