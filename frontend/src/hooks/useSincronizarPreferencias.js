import { useState, useCallback } from 'react';
import { usuarioService } from '../services/usuarioService';
import { MAPA_PCT_A_LETRA } from '../utils/preferencias';

export function useSincronizarPreferencias(usuario, establecerUsuario) {
  const [alerta, setAlerta] = useState(null);

  const sincronizar = useCallback(async (tema, tamanoFuente) => {
    if (!usuario?.id) return;
    try {
      const letra = MAPA_PCT_A_LETRA[tamanoFuente] || 'Normal';
      await usuarioService.actualizarPreferencias(tema, letra);
      if (establecerUsuario) {
        establecerUsuario(prev => prev ? { ...prev, tema, tamanoLetra: letra } : null);
      }
    } catch {
      setAlerta('No se pudieron sincronizar las preferencias en el servidor.');
    }
  }, [usuario?.id, establecerUsuario]);

  return { alerta, setAlerta, sincronizar };
}
