import { useState, useCallback } from 'react';

const CLAVE_CORREO = 'techasset_correo_recordado';

export function useCorreoRecordado() {
  const [correoRecordado, setCorreoRecordado] = useState(() => {
    try {
      return localStorage.getItem(CLAVE_CORREO) || '';
    } catch {
      return '';
    }
  });

  const guardarCorreo = useCallback((correo, recordar) => {
    try {
      if (recordar && correo) {
        localStorage.setItem(CLAVE_CORREO, correo.trim());
        setCorreoRecordado(correo.trim());
      } else {
        localStorage.removeItem(CLAVE_CORREO);
        setCorreoRecordado('');
      }
    } catch {
      // Ignore
    }
  }, []);

  return { correoRecordado, guardarCorreo };
}
