import Icono from './Icono';

const VARIANTES = {
  peligro: {
    fondo: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900',
    texto: 'text-red-800 dark:text-red-200',
    icono: 'AlertTriangle'
  },
  advertencia: {
    fondo: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
    texto: 'text-amber-800 dark:text-amber-200',
    icono: 'AlertTriangle'
  },
  exito: {
    fondo: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
    texto: 'text-emerald-800 dark:text-emerald-200',
    icono: 'CheckCircle2'
  },
  informacion: {
    fondo: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900',
    texto: 'text-teal-800 dark:text-teal-200',
    icono: 'Info'
  }
};

export default function AlertMessage({
  variante = 'peligro',
  titulo,
  mensaje,
  _modoToast = false,
  alCerrar,
  className = ''
}) {
  const cfg = VARIANTES[variante] || VARIANTES.peligro;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 p-3.5 rounded-lg border text-sm ${cfg.fondo} ${cfg.texto} ${className}`}
    >
      <Icono nombre={cfg.icono} className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        {titulo && <h4 className="font-semibold text-sm mb-1">{titulo}</h4>}
        <p className="text-sm leading-relaxed">{mensaje}</p>
      </div>
      {alCerrar && (
        <button
          type="button"
          onClick={alCerrar}
          aria-label="Cerrar notificación"
          className="shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Icono nombre="X" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
