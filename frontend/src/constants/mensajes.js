// Nielsen 9 · Shneiderman 3 · ISO 9241-11 · Mensajes de validación y estado TechAsset
export const MENSAJES = Object.freeze({
  CORREO_OBLIGATORIO: 'Ingrese su correo corporativo.',
  CORREO_FORMATO_INVALIDO: 'Ingrese un correo corporativo válido.',
  CORREO_LONGITUD_MAXIMA: 'El correo no puede superar los 254 caracteres. Recórtelo e intente de nuevo.',
  CORREO_DUPLICADO: 'Ya existe una cuenta con ese correo corporativo. Inicie sesión o utilice otro correo.',
  NOMBRE_OBLIGATORIO: 'Ingrese su nombre completo (mínimo 3 caracteres).',
  NOMBRE_LONGITUD_INVALIDA: 'El nombre completo debe tener entre 3 y 150 caracteres.',
  NOMBRE_FORMATO_INVALIDO: 'El nombre completo solo puede contener letras, espacios y tildes.',
  CONTRASENA_OBLIGATORIA: 'Ingrese su contraseña para continuar.',
  CONTRASENA_LONGITUD_INVALIDA: 'La contraseña debe tener entre 8 y 64 caracteres.',
  CREDENCIALES_INVALIDAS: 'Correo o contraseña incorrectos. Verifique los datos e intente de nuevo.',
  LIMITE_INTENTOS: 'Demasiados intentos. Espere un momento antes de volver a intentarlo.',
  SIN_CONEXION: 'No se pudo conectar con el servidor. Verifique su conexión e intente de nuevo.',
  ERROR_SERVIDOR: 'Ocurrió un problema inesperado en el servidor. Intente de nuevo en unos momentos.',
  RESUMEN_ERRORES_FORMULARIO: 'Revise los campos marcados con error antes de continuar.',
  VALIDANDO: 'Validando…',
  CARGANDO: 'Cargando información…',
  BLOQ_MAYUS_ACTIVO: 'Bloq Mayús está activado.',

  // Dominio TechAsset (Equipos y Préstamos)
  EQUIPO_CODIGO_OBLIGATORIO: 'El código patrimonial es obligatorio (RN-07).',
  EQUIPO_CODIGO_DUPLICADO: 'Ya existe un equipo con ese código patrimonial.',
  EQUIPO_NOMBRE_OBLIGATORIO: 'El nombre del equipo es obligatorio.',
  EQUIPO_CATEGORIA_OBLIGATORIA: 'Debe seleccionar una categoría de equipo.',
  EQUIPO_MARCA_OBLIGATORIA: 'La marca del equipo es obligatoria.',
  EQUIPO_UBICACION_OBLIGATORIA: 'La ubicación física del equipo es obligatoria.',
  EQUIPO_NO_PRESTABLE: 'No se puede prestar un equipo en mantenimiento o baja (RN-02 / RN-03).',
  
  PRESTAMO_EQUIPO_OBLIGATORIO: 'Seleccione el equipo que desea solicitar.',
  PRESTAMO_FECHA_OBLIGATORIA: 'Seleccione la fecha del préstamo.',
  PRESTAMO_FECHA_DEVOLUCION_INVALIDA: 'La fecha de devolución estimada debe ser estrictamente posterior a la fecha del préstamo (RN-04).',
  PRESTAMO_MOTIVO_OBLIGATORIO: 'Debe ingresar el motivo de la solicitud del equipo.',
  PRESTAMO_OBSERVACION_OBLIGATORIA: 'Debe ingresar una observación técnica detallada sobre la condición del equipo devuelto (RN-10).',
  PRESTAMO_DUPLICADO_ACTIVO: 'El equipo seleccionado ya tiene un préstamo activo en curso (RN-01).',

  ACCION_DENEGADA: 'No cuenta con los permisos necesarios para realizar esta operación.',
  SESION_EXPIRADA: 'Su sesión ha expirado. Por favor, vuelva a ingresar.',
  ERROR_GENERICO: 'Ocurrió un error inesperado. Intente nuevamente más tarde.'
});
