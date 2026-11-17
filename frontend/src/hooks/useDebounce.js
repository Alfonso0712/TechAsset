import { useState, useEffect } from 'react';
import { TIEMPO_ESPERA_DEBOUNCE_MS } from '../constants/reglas';

export function useDebounce(valor, demoraMs = TIEMPO_ESPERA_DEBOUNCE_MS) {
  const [valorDebounceado, setValorDebounceado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setValorDebounceado(valor);
    }, demoraMs);

    return () => clearTimeout(temporizador);
  }, [valor, demoraMs]);

  return valorDebounceado;
}
