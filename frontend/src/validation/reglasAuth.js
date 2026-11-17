import { esNoVacio, esCorreoValido, longitudMinima } from './validadores';

export function validarLogin(valores) {
  const errores = {};
  if (!esNoVacio(valores.correo)) {
    errores.correo = 'El correo electrónico es obligatorio.';
  } else if (!esCorreoValido(valores.correo)) {
    errores.correo = 'El formato del correo electrónico no es válido.';
  }

  if (!esNoVacio(valores.contrasena)) {
    errores.contrasena = 'La contraseña es obligatoria.';
  } else if (!longitudMinima(valores.contrasena, 6)) {
    errores.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return errores;
}
