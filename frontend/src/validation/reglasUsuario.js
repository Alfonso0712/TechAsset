// RF-01 · Validaciones de Usuario y Login TechAsset
import {
  PATRON_CORREO_CORPORATIVO,
  PATRON_NOMBRE_COMPLETO,
  MIN_LONGITUD_NOMBRE,
  MAX_LONGITUD_NOMBRE,
  MAX_LONGITUD_CORREO,
  MIN_LONGITUD_CONTRASENA,
  MAX_LONGITUD_CONTRASENA
} from '../constants/reglas';
import { MENSAJES } from '../constants/mensajes';
import { normalizarCorreo, normalizarTexto } from '../utils/normalizarTexto';

export function validarCorreoCorporativo(correo) {
  const limpio = normalizarCorreo(correo);
  if (!limpio) return MENSAJES.CORREO_OBLIGATORIO;
  if (limpio.length > MAX_LONGITUD_CORREO) return MENSAJES.CORREO_LONGITUD_MAXIMA;
  if (!PATRON_CORREO_CORPORATIVO.test(limpio)) return MENSAJES.CORREO_FORMATO_INVALIDO;
  return '';
}

export function validarNombreCompleto(nombre) {
  const limpio = normalizarTexto(nombre);
  if (!limpio) return MENSAJES.NOMBRE_OBLIGATORIO;
  if (limpio.length < MIN_LONGITUD_NOMBRE || limpio.length > MAX_LONGITUD_NOMBRE) {
    return MENSAJES.NOMBRE_LONGITUD_INVALIDA;
  }
  if (!PATRON_NOMBRE_COMPLETO.test(limpio)) return MENSAJES.NOMBRE_FORMATO_INVALIDO;
  return '';
}

export function validarContrasenaLogin(contrasena) {
  if (!contrasena || typeof contrasena !== 'string') return MENSAJES.CONTRASENA_OBLIGATORIA;
  if (contrasena.length > MAX_LONGITUD_CONTRASENA) return MENSAJES.CONTRASENA_LONGITUD_INVALIDA;
  return '';
}

export function validarContrasenaRegistro(contrasena) {
  if (!contrasena || typeof contrasena !== 'string') return MENSAJES.CONTRASENA_OBLIGATORIA;
  if (contrasena.length < MIN_LONGITUD_CONTRASENA || contrasena.length > MAX_LONGITUD_CONTRASENA) {
    return MENSAJES.CONTRASENA_LONGITUD_INVALIDA;
  }
  return '';
}

export function validarLogin({ correo = '', contrasena = '' } = {}) {
  const errores = {};
  const errorCorreo = validarCorreoCorporativo(correo);
  const errorContrasena = validarContrasenaLogin(contrasena);
  if (errorCorreo) errores.correo = errorCorreo;
  if (errorContrasena) errores.contrasena = errorContrasena;
  return {
    valido: Object.keys(errores).length === 0,
    errores,
    correoNormalizado: normalizarCorreo(correo)
  };
}

export function validarUsuario({ nombres = '', apellidos = '', correo = '', idArea = '', rol = '' } = {}) {
  const errores = {};
  const errorNombre = validarNombreCompleto(`${nombres} ${apellidos}`.trim());
  const errorCorreo = validarCorreoCorporativo(correo);
  if (errorNombre) errores.nombres = errorNombre;
  if (errorCorreo) errores.correo = errorCorreo;
  if (!idArea) errores.idArea = 'Debe seleccionar un área de trabajo.';
  if (!rol) errores.rol = 'Debe seleccionar un rol.';
  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
}
