import { useState, useCallback } from 'react';

export function useFormulario({ valoresIniciales = {}, validar, onSubmit }) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mensajeGeneral, setMensajeGeneral] = useState(null);

  const cambiarValor = useCallback((campo, valor) => {
    setValores(prev => ({ ...prev, [campo]: valor }));
    if (validar) {
      setErrores(prev => {
        const nuevosErrores = validar({ ...valores, [campo]: valor });
        return { ...prev, [campo]: nuevosErrores[campo] };
      });
    }
  }, [validar, valores]);

  const marcarTocado = useCallback((campo) => {
    setTocados(prev => ({ ...prev, [campo]: true }));
    if (validar) {
      const errs = validar(valores);
      setErrores(errs);
    }
  }, [validar, valores]);

  const reiniciar = useCallback((nuevosValores = valoresIniciales) => {
    setValores(nuevosValores);
    setErrores({});
    setTocados({});
    setEnviando(false);
    setMensajeGeneral(null);
  }, [valoresIniciales]);

  const manejarEnvio = useCallback(async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (validar) {
      const errs = validar(valores);
      setErrores(errs);
      const todosTocados = Object.keys(valores).reduce((acc, k) => ({ ...acc, [k]: true }), {});
      setTocados(todosTocados);
      if (Object.keys(errs).length > 0) {
        return false;
      }
    }

    setEnviando(true);
    setMensajeGeneral(null);
    try {
      if (onSubmit) {
        await onSubmit(valores);
      }
      return true;
    } catch (err) {
      setMensajeGeneral(err.message || 'Error al procesar el formulario');
      return false;
    } finally {
      setEnviando(false);
    }
  }, [onSubmit, validar, valores]);

  return {
    valores,
    errores,
    tocados,
    enviando,
    mensajeGeneral,
    setMensajeGeneral,
    cambiarValor,
    marcarTocado,
    reiniciar,
    manejarEnvio,
    setValores,
    setErrores
  };
}
