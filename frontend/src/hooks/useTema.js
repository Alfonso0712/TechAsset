import { useContext } from 'react';
import { ContextoPreferencias } from '../context/PreferenciasContext';

export function useTema() {
  const ctx = useContext(ContextoPreferencias);
  return {
    tema: ctx?.tema || 'claro',
    alternarTema: ctx?.alternarTema || (() => {}),
    setTema: ctx?.setTema || (() => {})
  };
}
