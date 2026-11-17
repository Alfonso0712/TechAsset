import { useContext } from 'react';
import { ContextoPreferencias } from '../context/PreferenciasContext';

export function useTamanoFuente() {
  const ctx = useContext(ContextoPreferencias);
  return {
    tamanoFuente: ctx?.tamanoFuente || '100%',
    cambiarTamanoFuente: ctx?.cambiarTamanoFuente || (() => {}),
    escalas: ctx?.escalas || []
  };
}
