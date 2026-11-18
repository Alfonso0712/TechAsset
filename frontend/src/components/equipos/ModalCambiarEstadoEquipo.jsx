import { useState } from 'react';
import ModalDialog from '../ui/ModalDialog';
import CampoFormulario from '../formulario/CampoFormulario';
import SelectInput from '../formulario/SelectInput';
import TextAreaInput from '../formulario/TextAreaInput';
import AlertMessage from '../ui/AlertMessage';
import { equipoService } from '../../services/equipoService';
import { interpretarRespuestaError } from '../../validation/interpretarRespuesta';
import { ESTADOS_EQUIPO } from '../../constants/estados';

export default function ModalCambiarEstadoEquipo({
  abierto = false,
  equipo = null,
  alCerrar,
  alExito
}) {
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [motivo, setMotivo] = useState('');
  const [confirmadoBaja, setConfirmadoBaja] = useState(false);
  const [enProceso, setEnProceso] = useState(false);
  const [error, setError] = useState(null);

  if (!equipo) return null;

  const opcionesEstado = [
    { valor: ESTADOS_EQUIPO.DISPONIBLE, etiqueta: 'Disponible (Operativo en inventario)' },
    { valor: ESTADOS_EQUIPO.MANTENIMIENTO, etiqueta: 'Mantenimiento (Reparación / Revisión técnica)' },
    { valor: ESTADOS_EQUIPO.BAJA, etiqueta: 'Baja técnica (Inoperativo / Desecho patrimonial)' }
  ].filter((opt) => opt.valor !== equipo.estado);

  const esBaja = nuevoEstado === ESTADOS_EQUIPO.BAJA;
  const esMantenimiento = nuevoEstado === ESTADOS_EQUIPO.MANTENIMIENTO;
  const requiereMotivo = esBaja || esMantenimiento;

  const handleConfirmar = async () => {
    if (!nuevoEstado) {
      setError('Debe seleccionar el nuevo estado operativo.');
      return;
    }

    if (requiereMotivo && (!motivo || motivo.trim().length < 5)) {
      setError(
        esBaja
          ? 'Dar de baja un equipo exige un motivo técnico descriptivo (mínimo 5 caracteres).'
          : 'El paso a mantenimiento exige especificar el motivo o diagnóstico preliminar (mínimo 5 caracteres).'
      );
      return;
    }

    if (esBaja && !confirmadoBaja) {
      setError('Debe marcar la casilla de confirmación para autorizar la baja técnica.');
      return;
    }

    setEnProceso(true);
    setError(null);
    try {
      const resp = await equipoService.cambiarEstado(equipo.id, nuevoEstado, motivo);
      if (resp.estado === 200) {
        alExito?.(resp.datos);
        alCerrar();
      } else {
        setError(interpretarRespuestaError(resp.estado, resp.datos));
      }
    } catch {
      setError('Error al actualizar el estado del equipo.');
    } finally {
      setEnProceso(false);
    }
  };

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Cambiar Estado Operativo"
      subtitulo={`Equipo: ${equipo.codigoPatrimonial} - ${equipo.nombre}`}
      textoPrimario={esBaja ? 'Dar de baja definitiva' : 'Actualizar Estado'}
      textoSecundario="Cancelar"
      variantePrimaria={esBaja ? 'peligro' : 'primario'}
      enProceso={enProceso}
      deshabilitado={esBaja && !confirmadoBaja}
      alConfirmar={handleConfirmar}
      tamano="sm"
    >
      <div className="space-y-4">
        {error && <AlertMessage variante="peligro" mensaje={error} />}

        <div className="p-3 rounded-lg bg-superficie-2 text-xs text-texto-suave">
          <span className="font-semibold text-texto">Estado actual:</span> {equipo.estado}
        </div>

        <SelectInput
          id="nuevoEstado"
          nombre="nuevoEstado"
          etiqueta="Nuevo Estado"
          obligatorio
          placeholder="Seleccione el nuevo estado"
          opciones={opcionesEstado}
          valor={nuevoEstado}
          alCambiar={(e) => {
            setNuevoEstado(e.target.value);
            setError(null);
          }}
          disabled={enProceso}
        />

        <CampoFormulario
          id="motivoEstado"
          etiqueta="Motivo / Justificación Técnica"
          obligatorio={requiereMotivo}
          ayuda={
            requiereMotivo
              ? 'Obligatorio: detalle la causa del cambio a mantenimiento o baja.'
              : 'Opcional para cambio a disponible.'
          }
        >
          <TextAreaInput
            id="motivoEstado"
            nombre="motivoEstado"
            valor={motivo}
            alCambiar={(e) => {
              setMotivo(e.target.value);
              setError(null);
            }}
            placeholder="Ingrese el diagnóstico técnico o motivo del cambio..."
            filas={3}
            disabled={enProceso}
          />
        </CampoFormulario>

        {esBaja && (
          <div className="p-3 rounded-control bg-peligro-fondo border border-peligro-borde space-y-2">
            <p className="text-xs font-bold text-peligro-texto m-0">
              Advertencia: La baja técnica es una acción definitiva e irreversible.
            </p>
            <label className="flex items-start gap-2 text-xs text-peligro-texto font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={confirmadoBaja}
                onChange={(e) => {
                  setConfirmadoBaja(e.target.checked);
                  setError(null);
                }}
                className="mt-0.5 rounded text-peligro-texto focus:ring-anillo-foco"
              />
              <span>Confirmo explícitamente que deseo dar de baja técnica definitiva a este equipo.</span>
            </label>
          </div>
        )}
      </div>
    </ModalDialog>
  );
}
