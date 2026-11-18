// ISO 9241-11 · Eficiencia: recuerda solo el correo corporativo, nunca la contraseña
import { useState, useCallback } from 'react';

const CLAVE_CORREO = 'techasset_correo_recordado';

function leerCorreoGuardado() {
  try {
    return localStorage.getItem(CLAVE_CORREO) || '';
  } catch {
    return '';
  }
}

export function useCorreoRecordado() {
  const correoInicial = leerCorreoGuardado();
  const [recordar, setRecordar] = useState(Boolean(correoInicial));

  const guardarCorreo = useCallback((correo, debeRecordar) => {
    try {
      if (debeRecordar && correo) {
        localStorage.setItem(CLAVE_CORREO, correo);
      } else {
        localStorage.removeItem(CLAVE_CORREO);
      }
    } catch {
      // Almacenamiento bloqueado
    }
  }, []);

  return { correoInicial, correoRecordado: correoInicial, recordar, setRecordar, guardarCorreo };
}
