// Modal accesible con normativa y reglas visuales del sistema de préstamos
import { Info, Clock, CalendarCheck, Layers, ClipboardList, ShieldCheck, Lock } from 'lucide-react';
import { INTRODUCCION_GUIA, REGLAS_NORMATIVA } from '../../constants/guiaNormativa';
import ModalDialog from '../ui/ModalDialog';

const ICONOS_MAPA = { Clock, CalendarCheck, Layers, ClipboardList, ShieldCheck, Lock };

export default function ModalGuiaNormativa({ abierto = false, alCerrar }) {
  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Guía y normativa de préstamos"
      subtitulo="Reglas corporativas de custodia y préstamo de activos de Innovatech Solutions"
      textoPrimario="Entendido"
      textoSecundario=""
      variantePrimaria="primary"
      alConfirmar={alCerrar}
      tamano="lg"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-2.5 p-3 rounded-lg border border-primario-enlace/20 bg-primario-suave text-texto text-sm leading-relaxed">
          <Info className="w-4 h-4 text-primario dark:text-primario-enlace shrink-0 mt-0.5" aria-hidden="true" strokeWidth={1.8} />
          <p className="text-sm text-texto leading-relaxed m-0">{INTRODUCCION_GUIA}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REGLAS_NORMATIVA.map((regla) => {
            const IconoCard = ICONOS_MAPA[regla.icono];
            return (
              <div
                key={regla.numero}
                className={`p-3.5 rounded-tarjeta border border-borde border-l-[3px] ${regla.colorBarra} bg-superficie-2 transition-all duration-150 hover:shadow-sm hover:border-borde-control`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${regla.colorIcono}`}>
                    {IconoCard && <IconoCard className="w-3.5 h-3.5" aria-hidden="true" strokeWidth={1.8} />}
                  </div>
                  <h3 className="text-sm font-semibold text-texto leading-tight m-0">{regla.titulo}</h3>
                </div>
                <p className="text-xs text-texto-suave leading-relaxed m-0">{regla.descripcion}</p>
              </div>
            );
          })}
        </div>
      </div>
    </ModalDialog>
  );
}
