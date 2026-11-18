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
          variante === 'peligro' ? 'bg-peligro-fondo text-peligro-texto' :
          variante === 'exito' ? 'bg-exito-fondo text-exito-texto' :
          'bg-primario-suave text-primario'
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
