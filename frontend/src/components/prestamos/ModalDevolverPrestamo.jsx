import { useState } from 'react';
import ModalDialog from '../ui/ModalDialog';
import DateInput from '../formulario/DateInput';
import TextAreaInput from '../formulario/TextAreaInput';
import AlertMessage from '../ui/AlertMessage';
import { prestamoService } from '../../services/prestamoService';
import { interpretarRespuestaError } from '../../validation/interpretarRespuesta';
import { fechaHoyLima } from '../../utils/fechas';

export default function ModalDevolverPrestamo({
  abierto = false,
  prestamo = null,
  alCerrar,
  alExito
}) {
  const hoyStr = fechaHoyLima();
  const [fechaDevolucionReal, setFechaDevolucionReal] = useState(hoyStr);
  const [observacion, setObservacion] = useState('');
  const [confirmarDevolucion, setConfirmarDevolucion] = useState(false);
  const [enProceso, setEnProceso] = useState(false);
  const [error, setError] = useState(null);

  if (!prestamo) return null;

  const longitud = (observacion || '').trim().length;

  const handleDevolver = async () => {
    // RN-10: Exigencia estricta de observación técnica entre 10 y 500 caracteres
    if (longitud < 10 || longitud > 500) {
      setError('La observación técnica es obligatoria (entre 10 y 500 caracteres). Describa la condición física y funcional del equipo.');
      return;
    }

    if (fechaDevolucionReal < prestamo.fechaPrestamo) {
      setError('La fecha de devolución real no puede ser anterior a la fecha de inicio del préstamo.');
      return;
    }

    if (!confirmarDevolucion) {
      setError('Debe confirmar la recepción del equipo tecnológico.');
      return;
    }

    setEnProceso(true);
    setError(null);
    try {
      const resp = await prestamoService.registrarDevolucion(
        prestamo.id,
        observacion.trim(),
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
      subtitulo={`Equipo: ${prestamo.equipoCodigo || ''} - ${prestamo.equipoNombre || ''}`}
      textoPrimario="Registrar Devolución"
      textoSecundario="Cancelar"
      variantePrimaria="exito"
      enProceso={enProceso}
      deshabilitado={!confirmarDevolucion || longitud < 10 || longitud > 500}
      alConfirmar={handleDevolver}
      tieneCambiosSinGuardar={longitud > 0}
      tamano="md"
    >
      <div className="space-y-4">
        {error && <AlertMessage variante="peligro" mensaje={error} />}

        <div className="p-3.5 rounded-lg bg-superficie-2 text-xs space-y-1 text-texto-suave">
          <p><span className="font-semibold text-texto">Colaborador:</span> {prestamo.solicitanteNombre}</p>
          <p><span className="font-semibold text-texto">Fecha de inicio:</span> {prestamo.fechaPrestamo}</p>
          <p><span className="font-semibold text-texto">Devolución estimada:</span> {prestamo.fechaDevolucionEstimada}</p>
        </div>

        <DateInput
          id="fechaDevolucionReal"
          nombre="fechaDevolucionReal"
          etiqueta="Fecha de Devolución Real"
          obligatorio
          valor={fechaDevolucionReal}
          alCambiar={(e) => setFechaDevolucionReal(e.target.value)}
          deshabilitado={enProceso}
          min={prestamo.fechaPrestamo}
        />

        <TextAreaInput
          id="observacionDevolucion"
          nombre="observacionDevolucion"
          etiqueta="Observación técnica"
          obligatorio
          ayuda="Detalle la condición física y funcional del equipo (mínimo 10 caracteres)."
          placeholder="Ejemplo: Equipo retornado en excelente estado físico. Pantalla sin rayones, cargador original operativo y teclado verificado…"
          value={observacion}
          onChange={(e) => {
            setObservacion(e.target.value);
            setError(null);
          }}
          filas={4}
          disabled={enProceso}
          maxLength={500}
          contador={`${longitud}/500`}
        />

        <div className="p-3 rounded-control bg-superficie-2 border border-borde">
          <label className="flex items-start gap-2 text-xs text-texto font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={confirmarDevolucion}
              onChange={(e) => {
                setConfirmarDevolucion(e.target.checked);
                setError(null);
              }}
              className="mt-0.5 rounded text-primario focus:ring-anillo-foco"
            />
            <span>Confirmo que he recibido y verificado técnicamente el equipo tecnológico devuelto (el equipo retornará al estado Disponible).</span>
          </label>
        </div>
      </div>
    </ModalDialog>
  );
}
