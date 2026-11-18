// Reglas y límites de validación TechAsset
export const DOMINIO_CORREO_CORPORATIVO = 'innovatech.com';
export const PATRON_CORREO_CORPORATIVO = new RegExp(`^[^\\s@]+@${DOMINIO_CORREO_CORPORATIVO.replace('.', '\\.')}$`);
export const PATRON_NOMBRE_COMPLETO = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

export const MIN_LONGITUD_NOMBRE = 3;
export const MAX_LONGITUD_NOMBRE = 150;
export const MAX_LONGITUD_CORREO = 254;
export const MIN_LONGITUD_CONTRASENA = 8;
export const MAX_LONGITUD_CONTRASENA = 64;

export const TIMEOUT_PETICION_MS = 10000;
export const TAMANO_PAGINA_DEFECTO = 10;
export const OPCIONES_TAMANO_PAGINA = Object.freeze([10, 25, 50]);
export const TIEMPO_ESPERA_DEBOUNCE_MS = 300;
export const DEBOUNCE_BUSQUEDA_MS = 300;
export const MIN_CARACTERES_BUSQUEDA = 2;
export const CLAVE_SESION_MOCK = 'techasset_sesion_id';
