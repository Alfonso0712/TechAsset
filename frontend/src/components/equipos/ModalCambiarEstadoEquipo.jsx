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
  const [enProceso, setEnProceso] = useState(false);
  const [error, setError] = useState(null);

  if (!equipo) return null;

  const opcionesEstado = [
    { valor: ESTADOS_EQUIPO.DISPONIBLE, etiqueta: 'Disponible (Operativo en inventario)' },
    { valor: ESTADOS_EQUIPO.MANTENIMIENTO, etiqueta: 'Mantenimiento (Reparación / Revisión técnica)' },
    { valor: ESTADOS_EQUIPO.BAJA, etiqueta: 'Baja técnica (Inoperativo / Desecho patrimonial)' }
  ].filter(opt => opt.valor !== equipo.estado);

  const handleConfirmar = async () => {
    if (!nuevoEstado) {
      setError('Debe seleccionar el nuevo estado operativo.');
      return;
    }

    if (nuevoEstado === ESTADOS_EQUIPO.BAJA && (!motivo || motivo.trim().length < 5)) {
      setError('Dar de baja un equipo exige un motivo técnico descriptivo (mínimo 5 caracteres).');
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
      textoPrimario="Actualizar Estado"
      textoSecundario="Cancelar"
      variantePrimaria={nuevoEstado === ESTADOS_EQUIPO.BAJA ? 'peligro' : 'primary'}
      enProceso={enProceso}
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
          obligatorio={nuevoEstado === ESTADOS_EQUIPO.BAJA}
          ayuda={nuevoEstado === ESTADOS_EQUIPO.BAJA ? 'Obligatorio para la justificación de baja patrimonial.' : 'Opcional para cambios a disponible o mantenimiento.'}
        >
          <TextAreaInput
            id="motivoEstado"
            name="motivoEstado"
            placeholder="Describa el motivo del cambio de estado operativo…"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            disabled={enProceso}
            rows={3}
          />
        </CampoFormulario>
      </div>
    </ModalDialog>
  );
}
