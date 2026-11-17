import ModalDialog from './ModalDialog';
import Icono from './Icono';

export default function ModalConfirmacion({
  abierto = false,
  titulo = 'Confirmar acción',
  mensaje,
  children,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'peligro',
  icono = 'AlertTriangle',
  enProceso = false,
  alConfirmar,
  alCancelar
}) {
  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCancelar}
      titulo={titulo}
      textoPrimario={textoConfirmar}
      textoSecundario={textoCancelar}
      variantePrimaria={variante}
      enProceso={enProceso}
      alConfirmar={alConfirmar}
      tamano="sm"
    >
      <div className="flex items-start gap-4 py-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          variante === 'peligro' ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400' :
          variante === 'exito' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' :
          'bg-teal-100 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400'
        }`}>
          <Icono nombre={icono} className="w-5 h-5" />
        </div>
        <div className="flex-1">
          {mensaje && <p className="text-sm text-texto leading-relaxed">{mensaje}</p>}
          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    </ModalDialog>
  );
}
