import { useState } from 'react';
import ModalConfirmacion from '../ui/ModalConfirmacion';
import { prestamoService } from '../../services/prestamoService';
import { interpretarRespuestaError } from '../../validation/interpretarRespuesta';

export default function ModalAprobarPrestamo({
  abierto = false,
  prestamo = null,
  alCerrar,
  alExito
}) {
  const [enProceso, setEnProceso] = useState(false);
  const [error, setError] = useState(null);

  if (!prestamo) return null;

  const handleAprobar = async () => {
    setEnProceso(true);
    setError(null);
    try {
      const resp = await prestamoService.aprobar(prestamo.id);
      if (resp.estado === 200) {
        alExito?.(resp.datos);
        alCerrar();
      } else {
        setError(interpretarRespuestaError(resp.estado, resp.datos));
      }
    } catch {
      setError('Error al procesar la aprobación del préstamo.');
    } finally {
      setEnProceso(false);
    }
  };

  return (
    <ModalConfirmacion
      abierto={abierto}
      titulo="Aprobar Solicitud de Préstamo"
      textoConfirmar="Aprobar Préstamo"
      variante="exito"
      icono="CheckCircle2"
      enProceso={enProceso}
      alConfirmar={handleAprobar}
      alCancelar={alCerrar}
    >
      <div className="space-y-2 text-xs">
        <p className="text-sm font-semibold text-texto">
          ¿Desea aprobar la solicitud y entregar en custodia el equipo?
        </p>
        <div className="p-3 rounded-lg bg-superficie-2 space-y-1 text-texto-suave">
          <p><span className="font-semibold text-texto">Equipo:</span> {prestamo.equipoCodigo} - {prestamo.equipoNombre}</p>
          <p><span className="font-semibold text-texto">Solicitante:</span> {prestamo.solicitanteNombre}</p>
          <p><span className="font-semibold text-texto">Devolución estimada:</span> {prestamo.fechaDevolucionEstimada}</p>
        </div>
        <p className="text-texto-suave">
          El equipo pasará automáticamente al estado <strong className="text-prestado-texto">Prestado</strong> y usted quedará registrado como el Responsable de Tecnología asignado (RN-05).
        </p>
        {error && <p className="text-error-texto font-medium">{error}</p>}
      </div>
    </ModalConfirmacion>
  );
}
