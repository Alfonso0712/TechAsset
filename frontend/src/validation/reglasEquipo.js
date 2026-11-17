import { esNoVacio } from './validadores';

export function validarEquipo(valores, esEdicion = false) {
  const errores = {};

  if (!esEdicion) {
    if (!esNoVacio(valores.codigoPatrimonial)) {
      errores.codigoPatrimonial = 'El código patrimonial es obligatorio.';
    } else if (valores.codigoPatrimonial.trim().length < 3) {
      errores.codigoPatrimonial = 'El código patrimonial debe tener al menos 3 caracteres.';
    }
  }

  if (!esNoVacio(valores.nombre)) {
    errores.nombre = 'El nombre del equipo es obligatorio.';
  }

  if (!esNoVacio(valores.categoria)) {
    errores.categoria = 'Debe seleccionar una categoría de equipo.';
  }

  if (!esNoVacio(valores.marca)) {
    errores.marca = 'La marca del equipo es obligatoria.';
  }

  if (!esNoVacio(valores.ubicacion)) {
    errores.ubicacion = 'La ubicación física del equipo es obligatoria.';
  }

  return errores;
}
