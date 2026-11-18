import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';
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

  const iniciarSesion = useCallback(async (credenciales, signal) => {
    const correo = typeof credenciales === 'object' && credenciales !== null ? credenciales.correo : credenciales;
    const contrasena = typeof credenciales === 'object' && credenciales !== null ? credenciales.contrasena : arguments[1];
    const resp = await authService.login(correo, contrasena, signal);
    const resultado = interpretarRespuesta(resp);
    if (resultado.ok && resultado.datos) {
      const u = resultado.datos.usuario || resultado.datos;
      const p = resultado.datos.permisos || [];
      setUsuario(u);
      setPermisos(p);
      return { ...resultado, usuario: u };
    }
    return resultado;
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
