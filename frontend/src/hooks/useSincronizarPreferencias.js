import { useState, useCallback } from 'react';
import { usuarioService } from '../services/usuarioService';
import { normalizarTamanoLetra } from '../utils/preferencias';

export function useSincronizarPreferencias(usuario, establecerUsuario) {
  const [alerta, setAlerta] = useState(null);

  const sincronizar = useCallback(async (tema, tamanoFuente) => {
    if (!usuario?.id) return;
    try {
      const letra = normalizarTamanoLetra(tamanoFuente);
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
