import { useEffect, useRef } from 'react';

export function useFocoAlMontar() {
  const elementoRef = useRef(null);

  useEffect(() => {
    if (elementoRef.current && typeof elementoRef.current.focus === 'function') {
      elementoRef.current.focus();
    }
  }, []);

  return elementoRef;
}
