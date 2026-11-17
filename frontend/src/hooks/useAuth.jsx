import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';
import { interpretarRespuestaError } from '../validation/interpretarRespuesta';
import { PreferenciasProvider } from '../context/PreferenciasContext';

export const ContextoAuth = createContext(null);

export function AuthProvider({ children, usuarioInicial = null }) {
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [permisos, setPermisos] = useState(usuarioInicial?.permisos || []);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    if (usuarioInicial) {
      setCargandoSesion(false);
      return undefined;
    }

    const ctrl = new AbortController();
    authService.me(ctrl.signal).then(({ estado, datos }) => {
      if (ctrl.signal.aborted) return;
      if (estado === 200 && datos?.usuario) {
        setUsuario(datos.usuario);
        setPermisos(datos.permisos || []);
      } else {
        setUsuario(null);
        setPermisos([]);
      }
      setCargandoSesion(false);
    });

    return () => ctrl.abort();
  }, [usuarioInicial]);

  const iniciarSesion = useCallback(async (correo, contrasena, signal) => {
    const { estado, datos } = await authService.login(correo, contrasena, signal);
    if (estado === 200 && datos?.usuario) {
      setUsuario(datos.usuario);
      setPermisos(datos.permisos || []);
      return { ok: true, usuario: datos.usuario };
    }
    const errorMsg = interpretarRespuestaError(estado, datos);
    return { ok: false, error: errorMsg, estado };
  }, []);

  const cerrarSesion = useCallback(async (signal) => {
    await authService.logout(signal);
    setUsuario(null);
    setPermisos([]);
  }, []);

  const puede = useCallback((permiso) => {
    if (!permisos || permisos.length === 0) return false;
    return permisos.includes(permiso);
  }, [permisos]);

  const valor = useMemo(() => ({
    usuario,
    permisos,
    puede,
    autenticado: Boolean(usuario),
    cargandoSesion,
    iniciarSesion,
    cerrarSesion,
    establecerUsuario: setUsuario
  }), [usuario, permisos, puede, cargandoSesion, iniciarSesion, cerrarSesion]);

  return (
    <ContextoAuth.Provider value={valor}>
      <PreferenciasProvider>
        {children}
      </PreferenciasProvider>
    </ContextoAuth.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(ContextoAuth);
  if (!contexto) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider.');
  }
  return contexto;
}
