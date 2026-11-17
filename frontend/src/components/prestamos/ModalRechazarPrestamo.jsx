import { useState } from 'react';
import ModalDialog from '../ui/ModalDialog';
import CampoFormulario from '../formulario/CampoFormulario';
import TextAreaInput from '../formulario/TextAreaInput';
import AlertMessage from '../ui/AlertMessage';
import { prestamoService } from '../../services/prestamoService';
import { interpretarRespuestaError } from '../../validation/interpretarRespuesta';

export default function ModalRechazarPrestamo({
  abierto = false,
  prestamo = null,
  alCerrar,
  alExito
}) {
  const [motivo, setMotivo] = useState('');
  const [enProceso, setEnProceso] = useState(false);
  const [error, setError] = useState(null);

  if (!prestamo) return null;

  const handleRechazar = async () => {
    if (!motivo || motivo.trim().length < 5) {
      setError('Debe especificar un motivo descriptivo del rechazo (mínimo 5 caracteres).');
      return;
    }

    setEnProceso(true);
    setError(null);
    try {
      const resp = await prestamoService.rechazar(prestamo.id, motivo);
      if (resp.estado === 200) {
        alExito?.(resp.datos);
        alCerrar();
      } else {
        setError(interpretarRespuestaError(resp.estado, resp.datos));
      }
    } catch {
      setError('Error al procesar el rechazo de la solicitud.');
    } finally {
      setEnProceso(false);
    }
  };

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Rechazar Solicitud de Préstamo"
      subtitulo={`Solicitante: ${prestamo.solicitanteNombre} | Equipo: ${prestamo.equipoCodigo}`}
      textoPrimario="Confirmar Rechazo"
      textoSecundario="Cancelar"
      variantePrimaria="danger"
      enProceso={enProceso}
      alConfirmar={handleRechazar}
      tamano="sm"
    >
      <div className="space-y-4">
        {error && <AlertMessage variante="peligro" mensaje={error} />}

        <p className="text-sm text-texto-suave">
          El equipo permanecerá disponible en inventario y el colaborador recibirá la notificación del rechazo.
        </p>

        <CampoFormulario
          id="motivoRechazo"
          etiqueta="Motivo de Rechazo"
          obligatorio
          ayuda="Indique el motivo técnico u operativo por el cual no procede la solicitud."
        >
          <TextAreaInput
            id="motivoRechazo"
            name="motivoRechazo"
            placeholder="Ejemplo: El equipo solicitado se encuentra asignado a mantenimiento preventivo programado…"
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              setError(null);
            }}
            disabled={enProceso}
            rows={3}
          />
        </CampoFormulario>
      </div>
    </ModalDialog>
  );
}
