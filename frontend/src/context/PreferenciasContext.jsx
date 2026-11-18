import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSincronizarPreferencias } from '../hooks/useSincronizarPreferencias';
import {
  TEMA_DEFECTO, TAMANO_DEFECTO, ESCALAS_FUENTE, normalizarTamanoLetra,
  aplicarPreferenciasAlDom, obtenerPrefAlmacenadas,
  guardarPrefAlmacenadas, limpiarPrefActiva
} from '../utils/preferencias';
import AlertMessage from '../components/ui/AlertMessage';

export const ContextoPreferencias = createContext(null);

function resolverInicial(u) {
  if (!u) return { t: TEMA_DEFECTO, f: TAMANO_DEFECTO };
  const g = obtenerPrefAlmacenadas(u.id);
  const t = g?.tema || u.tema || TEMA_DEFECTO;
  const f = normalizarTamanoLetra(g?.tamanoLetra || g?.tamanoFuente || u.tamanoLetra || TAMANO_DEFECTO);
  aplicarPreferenciasAlDom(t, f);
  return { t, f };
}

export function PreferenciasProvider({ children }) {
  const { usuario, establecerUsuario } = useAuth();
  const [tema, setTema] = useState(() => resolverInicial(usuario).t);
  const [tamanoFuente, setTamanoFuente] = useState(() => resolverInicial(usuario).f);
  const { alerta, setAlerta, sincronizar } = useSincronizarPreferencias(usuario, establecerUsuario);

  useEffect(() => {
    if (!usuario) {
      aplicarPreferenciasAlDom(TEMA_DEFECTO, TAMANO_DEFECTO);
      limpiarPrefActiva();
      setTema(TEMA_DEFECTO);
      setTamanoFuente(TAMANO_DEFECTO);
      return;
    }
    const { t, f } = resolverInicial(usuario);
    guardarPrefAlmacenadas(usuario.id, { tema: t, tamanoLetra: f, tamanoFuente: f });
    setTema(t);
    setTamanoFuente(f);
  }, [usuario]);

  const cambiarTema = useCallback((nuevo) => {
    const res = (typeof nuevo === 'function' ? nuevo(tema) : nuevo) === 'oscuro' ? 'oscuro' : 'claro';
    setTema(res);
    aplicarPreferenciasAlDom(res, tamanoFuente);
    guardarPrefAlmacenadas(usuario?.id, { tema: res, tamanoLetra: tamanoFuente, tamanoFuente });
    sincronizar(res, tamanoFuente);
  }, [tema, tamanoFuente, usuario?.id, sincronizar]);

  const alternarTema = useCallback(() => cambiarTema(tema === 'oscuro' ? 'claro' : 'oscuro'), [cambiarTema, tema]);

  const cambiarTamano = useCallback((nuevo) => {
    const norm = normalizarTamanoLetra(nuevo);
    setTamanoFuente(norm);
    aplicarPreferenciasAlDom(tema, norm);
    guardarPrefAlmacenadas(usuario?.id, { tema, tamanoLetra: norm, tamanoFuente: norm });
    sincronizar(tema, norm);
  }, [tema, usuario?.id, sincronizar]);

  const valor = useMemo(() => ({
    tema, setTema: cambiarTema, alternarTema, tamanoFuente,
    cambiarTamanoFuente: cambiarTamano, escalas: ESCALAS_FUENTE
  }), [tema, cambiarTema, alternarTema, tamanoFuente, cambiarTamano]);

  return (
    <ContextoPreferencias.Provider value={valor}>
      {children}
      {alerta && (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-auto max-w-sm" role="status" aria-live="polite">
          <AlertMessage modoToast variante="advertencia" mensaje={alerta} alCerrar={() => setAlerta(null)} />
        </div>
      )}
    </ContextoPreferencias.Provider>
  );
}

export const usePreferencias = () => useContext(ContextoPreferencias);
