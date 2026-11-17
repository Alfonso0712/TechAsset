import { esNoVacio, fechaEsPosterior } from './validadores';

export function validarSolicitudPrestamo(valores) {
  const errores = {};

  if (!valores.idEquipo) {
    errores.idEquipo = 'Debe seleccionar un equipo tecnológico.';
  }

  if (!esNoVacio(valores.fechaPrestamo)) {
    errores.fechaPrestamo = 'La fecha de inicio del préstamo es obligatoria.';
  }

  if (!esNoVacio(valores.fechaDevolucionEstimada)) {
    errores.fechaDevolucionEstimada = 'La fecha estimada de devolución es obligatoria.';
  } else if (valores.fechaPrestamo && !fechaEsPosterior(valores.fechaDevolucionEstimada, valores.fechaPrestamo)) {
    errores.fechaDevolucionEstimada = 'La fecha de devolución estimada debe ser estrictamente posterior a la fecha de inicio.';
  }

  if (!esNoVacio(valores.motivo)) {
    errores.motivo = 'Debe ingresar el motivo de la solicitud del equipo.';
  }

  return errores;
}

export function validarDevolucion(valores) {
  const errores = {};
  if (!esNoVacio(valores.observacion)) {
    errores.observacion = 'La observación técnica sobre el estado del equipo es obligatoria (RN-10).';
  } else if (valores.observacion.trim().length < 5) {
    errores.observacion = 'La observación técnica debe ser descriptiva (mínimo 5 caracteres).';
  }
  return errores;
}
