import { useState, useRef, useEffect, useCallback } from 'react';

export function useMenuDesplegable(inicialAbierto = false) {
  const [abierto, setAbierto] = useState(inicialAbierto);
  const referencia = useRef(null);

  const alternar = useCallback(() => setAbierto(prev => !prev), []);
  const cerrar = useCallback(() => setAbierto(false), []);
  const abrir = useCallback(() => setAbierto(true), []);

  useEffect(() => {
    if (!abierto) return undefined;

    function handleClickFuera(e) {
      if (referencia.current && !referencia.current.contains(e.target)) {
        cerrar();
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        cerrar();
      }
    }

    document.addEventListener('mousedown', handleClickFuera);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [abierto, cerrar]);

  return { abierto, alternar, cerrar, abrir, referencia };
}
