import { useEffect, useRef } from 'react';

const SELECTOR_FOCO = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useTrampaFoco(activo = true) {
  const contenedorRef = useRef(null);
  const elementoPrevioRef = useRef(null);

  useEffect(() => {
    if (!activo) return undefined;

    elementoPrevioRef.current = document.activeElement;
    const nodo = contenedorRef.current;
    if (!nodo) return undefined;

    const elementosEnfocables = nodo.querySelectorAll(SELECTOR_FOCO);
    if (elementosEnfocables.length > 0) {
      elementosEnfocables[0].focus();
    }

    function manejarKeyDown(e) {
      if (e.key !== 'Tab') return;

      const enfocables = Array.from(nodo.querySelectorAll(SELECTOR_FOCO));
      if (enfocables.length === 0) {
        e.preventDefault();
        return;
      }

      const primerElemento = enfocables[0];
      const ultimoElemento = enfocables[enfocables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === primerElemento) {
          e.preventDefault();
          ultimoElemento.focus();
        }
      } else {
        if (document.activeElement === ultimoElemento) {
          e.preventDefault();
          primerElemento.focus();
        }
      }
    }

    document.addEventListener('keydown', manejarKeyDown);
    return () => {
      document.removeEventListener('keydown', manejarKeyDown);
      if (elementoPrevioRef.current && typeof elementoPrevioRef.current.focus === 'function') {
        elementoPrevioRef.current.focus();
      }
    };
  }, [activo]);

  return contenedorRef;
}
