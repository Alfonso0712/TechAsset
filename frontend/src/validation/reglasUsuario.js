import { esNoVacio, esCorreoValido, longitudMinima } from './validadores';

export function validarUsuario(valores, esEdicion = false) {
  const errores = {};

  if (!esNoVacio(valores.nombres)) {
    errores.nombres = 'Los nombres son obligatorios.';
  }

  if (!esNoVacio(valores.apellidos)) {
    errores.apellidos = 'Los apellidos son obligatorios.';
  }

  if (!esEdicion) {
    if (!esNoVacio(valores.correo)) {
      errores.correo = 'El correo electrónico corporativo es obligatorio.';
    } else if (!esCorreoValido(valores.correo)) {
      errores.correo = 'El formato del correo corporativo no es válido.';
    }

    if (!esNoVacio(valores.contrasena)) {
      errores.contrasena = 'La contraseña es obligatoria.';
    } else if (!longitudMinima(valores.contrasena, 8)) {
      errores.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
    }
  }

  if (!valores.areaId) {
    errores.areaId = 'Debe seleccionar un área corporativa.';
  }

  if (!valores.rol) {
    errores.rol = 'Debe seleccionar un rol para el usuario.';
  }

  return errores;
}
