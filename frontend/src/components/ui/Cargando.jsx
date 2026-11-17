import Icono from './Icono';

export default function Cargando({ mensaje = 'Cargando información…', className = 'py-12' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 text-texto-suave ${className}`}
    >
      <Icono nombre="Loader2" className="w-8 h-8 animate-spin text-primario" />
      <span className="text-sm font-medium">{mensaje}</span>
    </div>
  );
}
