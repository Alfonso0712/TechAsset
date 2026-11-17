import { useState } from 'react';
import ModalDialog from '../ui/ModalDialog';
import CampoFormulario from '../formulario/CampoFormulario';
import DateInput from '../formulario/DateInput';
import TextAreaInput from '../formulario/TextAreaInput';
import AlertMessage from '../ui/AlertMessage';
import { prestamoService } from '../../services/prestamoService';
import { interpretarRespuestaError } from '../../validation/interpretarRespuesta';

export default function ModalDevolverPrestamo({
  abierto = false,
  prestamo = null,
  alCerrar,
  alExito
}) {
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fechaDevolucionReal, setFechaDevolucionReal] = useState(hoyStr);
  const [observacion, setObservacion] = useState('');
  const [enProceso, setEnProceso] = useState(false);
  const [error, setError] = useState(null);

  if (!prestamo) return null;

  const handleDevolver = async () => {
    // RN-10: Exigencia estricta de observación técnica
    if (!observacion || observacion.trim().length < 5) {
      setError('La observación técnica es obligatoria (RN-10). Describa la condición física y funcional del equipo.');
      return;
    }

    setEnProceso(true);
    setError(null);
    try {
      const resp = await prestamoService.registrarDevolucion(
        prestamo.id,
        observacion,
        fechaDevolucionReal
      );
      if (resp.estado === 200) {
        alExito?.(resp.datos);
        alCerrar();
      } else {
        setError(interpretarRespuestaError(resp.estado, resp.datos));
      }
    } catch {
      setError('Error al registrar la devolución del equipo.');
    } finally {
      setEnProceso(false);
    }
  };

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Registrar Devolución de Equipo"
      subtitulo={`Equipo: ${prestamo.equipoCodigo} - ${prestamo.equipoNombre}`}
      textoPrimario="Registrar Devolución"
      textoSecundario="Cancelar"
      variantePrimaria="success"
      enProceso={enProceso}
      alConfirmar={handleDevolver}
      tamano="md"
    >
      <div className="space-y-4">
        {error && <AlertMessage variante="peligro" mensaje={error} />}

        <div className="p-3.5 rounded-lg bg-superficie-2 text-xs space-y-1 text-texto-suave">
          <p><span className="font-semibold text-texto">Colaborador:</span> {prestamo.solicitanteNombre}</p>
          <p><span className="font-semibold text-texto">Fecha de inicio:</span> {prestamo.fechaPrestamo}</p>
          <p><span className="font-semibold text-texto">Devolución estimada:</span> {prestamo.fechaDevolucionEstimada}</p>
        </div>

        <CampoFormulario
          id="fechaDevolucionReal"
          etiqueta="Fecha de Devolución Real"
          obligatorio
        >
          <DateInput
            id="fechaDevolucionReal"
            name="fechaDevolucionReal"
            value={fechaDevolucionReal}
            onChange={(e) => setFechaDevolucionReal(e.target.value)}
            disabled={enProceso}
            min={prestamo.fechaPrestamo}
          />
        </CampoFormulario>

        <CampoFormulario
          id="observacionDevolucion"
          etiqueta="Observación Técnica Obligatoria (RN-10)"
          obligatorio
          ayuda="Detalle el estado del hardware, pantalla, cargador y funcionamiento tras la revisión."
        >
          <TextAreaInput
            id="observacionDevolucion"
            name="observacionDevolucion"
            placeholder="Ejemplo: Equipo retornado en excelente estado físico. Pantalla sin rayones, cargador original operativo y teclado verificado…"
            value={observacion}
            onChange={(e) => {
              setObservacion(e.target.value);
              setError(null);
            }}
            disabled={enProceso}
            rows={4}
          />
        </CampoFormulario>
      </div>
    </ModalDialog>
  );
}
