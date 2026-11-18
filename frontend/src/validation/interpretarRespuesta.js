// Nielsen 9 · Contrato { estado, datos } -> { ok, datos, errores, errorGeneral, accion }
import { MENSAJES } from '../constants/mensajes';

function mapearErroresServidor(errors) {
  const resultado = {};
  if (!errors || typeof errors !== 'object') return resultado;
  Object.entries(errors).forEach(([campo, lista]) => {
    const clave = campo.charAt(0).toLowerCase() + campo.slice(1);
    const primerMensaje = Array.isArray(lista) ? lista[0] : String(lista);
    if (primerMensaje) resultado[clave] = primerMensaje;
  });
  return resultado;
}

export function interpretarRespuesta(respuesta) {
  const { estado = 0, datos = null } = respuesta || {};

  if (estado >= 200 && estado < 300) {
    const payload = datos && typeof datos === 'object' && 'data' in datos ? datos.data : datos;
    return {
      ok: true,
      datos: payload,
      mensaje: datos?.message || '',
      errores: {},
      errorGeneral: '',
      accion: 'exito'
    };
  }

  if (estado === 0) {
    return {
      ok: false,
      datos: null,
      errores: {},
      errorGeneral: MENSAJES.SIN_CONEXION,
      accion: 'reintentar'
    };
  }

  if (estado === 400) {
    const errores = mapearErroresServidor(datos?.errors);
    return {
      ok: false,
      datos: null,
      errores,
      errorGeneral: Object.keys(errores).length === 0 ? (datos?.mensaje || datos?.detail || datos?.message || MENSAJES.RESUMEN_ERRORES_FORMULARIO) : '',
      accion: 'corregir'
    };
  }

  if (estado === 401) {
    return {
      ok: false,
      datos: null,
      errores: {},
      errorGeneral: datos?.mensaje || datos?.error || MENSAJES.CREDENCIALES_INVALIDAS,
      accion: 'reautenticar'
    };
  }

  if (estado === 403) {
    return {
      ok: false,
      datos: null,
      errores: {},
      errorGeneral: datos?.mensaje || datos?.detail || datos?.message || MENSAJES.ACCION_DENEGADA,
      accion: 'prohibido'
    };
  }

  if (estado === 409) {
    const errores = mapearErroresServidor(datos?.errors);
    return {
      ok: false,
      datos: null,
      errores,
      errorGeneral: Object.keys(errores).length === 0 ? (datos?.mensaje || datos?.detail || datos?.message || MENSAJES.PRESTAMO_DUPLICADO_ACTIVO) : '',
      accion: 'conflicto'
    };
  }

  if (estado === 429) {
    return {
      ok: false,
      datos: null,
      errores: {},
      errorGeneral: datos?.detail || MENSAJES.LIMITE_INTENTOS,
      accion: 'esperar'
    };
  }

  if (estado === 502 || estado === 503 || estado === 504) {
    return {
      ok: false,
      datos: null,
      errores: {},
      errorGeneral: 'No se pudo comunicar con el servidor backend. Verifique que el servicio esté activo.',
      accion: 'servidor'
    };
  }

  return {
    ok: false,
    datos: null,
    errores: {},
    errorGeneral: datos?.mensaje || datos?.detail || MENSAJES.ERROR_SERVIDOR,
    accion: 'servidor'
  };
}

// Compatibilidad con código previo que llamaba interpretarRespuestaError
export function interpretarRespuestaError(estado, datos) {
  const res = interpretarRespuesta({ estado, datos });
  return res.errorGeneral || MENSAJES.ERROR_GENERICO;
}
