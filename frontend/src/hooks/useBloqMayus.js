import { useState, useCallback } from 'react';

export function useBloqMayus() {
  const [bloqMayusActivo, setBloqMayusActivo] = useState(false);

  const verificarBloqMayus = useCallback((evento) => {
    if (typeof evento.getModifierState === 'function') {
      setBloqMayusActivo(evento.getModifierState('CapsLock'));
    }
  }, []);

  return { bloqMayusActivo, verificarBloqMayus };
}
