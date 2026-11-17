export default function CampoFormulario({
  id,
  etiqueta,
  error,
  ayuda,
  obligatorio = false,
  children,
  className = ''
}) {
  const idError = error ? `${id}-error` : undefined;
  const idAyuda = ayuda ? `${id}-ayuda` : undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {etiqueta && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-texto uppercase tracking-wider"
        >
          {etiqueta}
          {obligatorio && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      {children}

      {ayuda && !error && (
        <p id={idAyuda} className="text-xs text-texto-suave">
          {ayuda}
        </p>
      )}

      {error && (
        <p id={idError} role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
