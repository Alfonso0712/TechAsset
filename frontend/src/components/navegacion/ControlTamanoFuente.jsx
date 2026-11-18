// Shneiderman 2 · WCAG 2.2 AA · Control de tamaño de fuente (A, A+, A++) · normal, grande, extragrande
import { useTamanoFuente, ESCALAS_FUENTE } from '../../hooks/useTamanoFuente';

export default function ControlTamanoFuente({ tamanoActual, alCambiar, mimetizado = false }) {
  const { tamanoFuente, cambiarTamanoFuente } = useTamanoFuente();
  const actual = tamanoActual || tamanoFuente;
  const manejarCambio = alCambiar || cambiarTamanoFuente;
  const estiloCaja = mimetizado ? 'border-white/25 bg-white/10 backdrop-blur-md' : 'border-borde bg-superficie';

  return (
    <div
      role="group"
      aria-label="Tamaño de fuente"
      className={`h-[38px] inline-flex items-center gap-0.5 p-0.5 rounded-pill border ${estiloCaja}`}
    >
      {ESCALAS_FUENTE.map((escala) => {
        const activo = actual === escala.id || actual === escala.porcentaje;
        const estiloActivo = mimetizado
          ? 'bg-white text-[#091E3E] font-bold shadow-sm'
          : 'bg-primario text-sobre-primario font-bold shadow-sm';
        const estiloInactivo = mimetizado
          ? 'bg-transparent text-[#D3E3F2] hover:text-white hover:bg-white/15'
          : 'bg-transparent text-texto hover:bg-superficie-2';

        return (
          <button
            key={escala.id}
            type="button"
            aria-label={escala.descripcion}
            aria-pressed={activo}
            onClick={() => manejarCambio?.(escala.id)}
            className={`h-full px-2.5 rounded-pill text-xs font-semibold transition-colors cursor-pointer inline-flex items-center justify-center ${
              activo ? estiloActivo : estiloInactivo
            }`}
          >
            {escala.etiqueta}
          </button>
        );
      })}
    </div>
  );
}
