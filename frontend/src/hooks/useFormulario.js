// Nielsen 5 · Nielsen 9 · Shneiderman 6 · Estado de formulario y bloqueo de doble envío
import { useState, useRef, useCallback } from 'react';
import { MENSAJES } from '../constants/mensajes';

export function useFormulario({ valoresIniciales, validar, alEnviar, onSubmit }) {
  const funcionEnvio = alEnviar || onSubmit;
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [enProceso, setEnProceso] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [resumenEstado, setResumenEstado] = useState('');
  const enProcesoRef = useRef(false);
  const camposRef = useRef({});

  const registrarRef = useCallback((nombre) => (el) => {
    if (el) camposRef.current[nombre] = el;
  }, []);

  const enfocarPrimerError = useCallback((mapa) => {
    const k = Object.keys(mapa).find((c) => Boolean(mapa[c]));
    if (k && camposRef.current[k]?.focus) camposRef.current[k].focus();
  }, []);

  const cambiarValor = useCallback((nombre, valor) => {
    if (enProcesoRef.current) return;
    setValores((prev) => ({ ...prev, [nombre]: valor }));
    setErrores((prev) => (prev[nombre] ? { ...prev, [nombre]: '' } : prev));
    setErrorGeneral('');
    setResumenEstado('');
  }, []);

  const cambiarValores = useCallback((nuevos) => {
    if (enProcesoRef.current) return;
    setValores((prev) => ({ ...prev, ...nuevos }));
    setErrores((prev) => {
      const copia = { ...prev };
      Object.keys(nuevos).forEach((k) => delete copia[k]);
      return copia;
    });
    setErrorGeneral('');
    setResumenEstado('');
  }, []);

  const reiniciar = useCallback((nuevosValores = valoresIniciales) => {
    setValores(nuevosValores);
    setErrores({});
    setTocados({});
    setErrorGeneral('');
    setResumenEstado('');
  }, [valoresIniciales]);

  const marcarTocado = useCallback((nombre) => {
    setTocados((prev) => ({ ...prev, [nombre]: true }));
  }, []);

  const manejarBlur = useCallback((nombre) => {
    if (enProcesoRef.current) return;
    setTocados((prev) => ({ ...prev, [nombre]: true }));
    if (typeof validar === 'function') {
      const res = validar(valores);
      if (res && typeof res === 'object') {
        const err = res.errores ? res.errores[nombre] : res[nombre];
        setErrores((prev) => ({ ...prev, [nombre]: err || '' }));
      }
    }
  }, [validar, valores]);

  const manejarEnvio = useCallback(async (e) => {
    e?.preventDefault();
    if (enProcesoRef.current) return;
    if (typeof validar === 'function') {
      const v = validar(valores);
      const esValido = v && typeof v === 'object' && 'valido' in v ? v.valido : Object.keys(v || {}).length === 0;
      const mapaErrores = v && typeof v === 'object' && 'errores' in v ? v.errores : v;
      if (!esValido) {
        setErrores(mapaErrores || {});
        setResumenEstado(MENSAJES.RESUMEN_ERRORES_FORMULARIO);
        enfocarPrimerError(mapaErrores || {});
        return;
      }
    }
    enProcesoRef.current = true;
    setEnProceso(true);
    setErrorGeneral('');
    setResumenEstado('');
    try {
      await funcionEnvio?.(valores, {
        setErrores,
        setErrorGeneral,
        setValores,
        enfocarPrimerError,
        camposRef
      });
    } finally {
      enProcesoRef.current = false;
      try {
        setEnProceso(false);
      } catch {
        // ignorar
      }
    }
  }, [validar, valores, funcionEnvio, enfocarPrimerError]);

  return {
    valores,
    setValores,
    errores,
    setErrores,
    tocados,
    enProceso,
    enviando: enProceso,
    errorGeneral,
    setErrorGeneral,
    mensajeGeneral: errorGeneral,
    setMensajeGeneral: setErrorGeneral,
    resumenEstado,
    cambiarValor,
    cambiarValores,
    marcarTocado,
    manejarBlur,
    manejarEnvio,
    registrarRef,
    camposRef,
    reiniciar,
    reset: reiniciar
  };
}
