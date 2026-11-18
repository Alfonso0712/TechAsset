import { useState, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useFormulario } from '../../hooks/useFormulario';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import { validarSolicitudPrestamo } from '../../validation/reglasPrestamo';
import { prestamoService } from '../../services/prestamoService';
import { equipoService } from '../../services/equipoService';
import { interpretarRespuesta } from '../../validation/interpretarRespuesta';
import { ESTADOS_EQUIPO } from '../../constants/estados';
import { MENSAJES } from '../../constants/mensajes';
import SelectInput from '../formulario/SelectInput';
import DateInput from '../formulario/DateInput';
import TextAreaInput from '../formulario/TextAreaInput';
import Button from '../ui/Button';
import AlertMessage from '../ui/AlertMessage';
import Icono from '../ui/Icono';

export default function FormularioSolicitarPrestamo({
  abierto = false,
  equipoPreseleccionadoId = '',
  alCerrar,
  alExito,
  alGuardarExitoso
}) {
  const idTitulo = useId();
  const callbackExito = alExito || alGuardarExitoso;
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  const [cargandoEquipos, setCargandoEquipos] = useState(false);

  const hoyIso = new Date().toISOString().split('T')[0];

  const form = useFormulario({
    valoresIniciales: {
      idEquipo: equipoPreseleccionadoId || '',
      fechaPrestamo: hoyIso,
      fechaDevolucionEstimada: '',
      motivo: ''
    },
    validar: (vals) => validarSolicitudPrestamo(vals),
    alEnviar: async (vals, { setErrores, setErrorGeneral, enfocarPrimerError }) => {
      const resp = await prestamoService.solicitar({
        idEquipo: vals.idEquipo,
        fechaPrestamo: vals.fechaPrestamo,
        fechaDevolucionEstimada: vals.fechaDevolucionEstimada,
        motivo: vals.motivo
      });

      const res = interpretarRespuesta(resp);
      if (res.ok) {
        callbackExito?.(res.datos || vals, MENSAJES.PRESTAMO_REGISTRADO_EXITO || 'Solicitud de préstamo enviada exitosamente');
        alCerrar?.();
        return;
      }

      if (res.errores && Object.keys(res.errores).length > 0) {
        setErrores(res.errores);
        enfocarPrimerError(res.errores);
        return;
      }

      setErrorGeneral(res.errorGeneral || 'No se pudo registrar la solicitud de préstamo.');
    }
  });

  const modalRef = useTrampaFoco(abierto, () => {
    if (!form.enProceso) alCerrar?.();
  }, 'select, input');

  useEffect(() => {
    if (!abierto) return;

    form.setValores({
      idEquipo: equipoPreseleccionadoId || '',
      fechaPrestamo: hoyIso,
      fechaDevolucionEstimada: '',
      motivo: ''
    });
    form.setErrores({});
    form.setErrorGeneral('');

    setCargandoEquipos(true);
    equipoService.listar({ estado: ESTADOS_EQUIPO.DISPONIBLE, tamanoPagina: 100 }).then((res) => {
      const resp = interpretarRespuesta(res);
      if (resp.ok && resp.datos?.items) {
        setEquiposDisponibles(
          resp.datos.items.map((e) => ({
            valor: e.id,
            etiqueta: `${e.codigoPatrimonial} - ${e.nombre} (${e.marca})`
          }))
        );
      }
      setCargandoEquipos(false);
    });
  }, [abierto, equipoPreseleccionadoId, hoyIso]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!abierto) return null;

  const modalElement = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-tarjeta border border-borde bg-superficie text-texto shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-borde">
          <div>
            <h2 id={idTitulo} className="text-xl font-bold text-texto tracking-tight m-0">
              Solicitar préstamo
            </h2>
            <p className="text-xs sm:text-sm text-texto-suave mt-0.5 m-0">
              Seleccione el equipo requerido e indique el período de uso corporativo.
            </p>
          </div>
          <button
            type="button"
            onClick={alCerrar}
            disabled={form.enProceso}
            aria-label="Cerrar ventana de solicitar préstamo"
            className="h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-2 inline-flex items-center justify-center rounded-full text-texto-suave hover:bg-superficie-2 hover:text-texto transition-colors"
          >
            <Icono nombre="X" className="w-5 h-5" />
          </button>
        </div>

        <div role="status" aria-live="polite" className="sr-only">
          {form.resumenEstado}
        </div>

        {form.errorGeneral && (
          <div className="mb-4">
            <AlertMessage
              variante="error"
              rol="alert"
              mensaje={form.errorGeneral}
              compacto
              enfocarAlAparecer
            />
          </div>
        )}

        <form onSubmit={form.manejarEnvio} noValidate className="space-y-4">
          <SelectInput
            ref={form.registrarRef('idEquipo')}
            nombre="idEquipo"
            etiqueta="Equipo tecnológico disponible"
            obligatorio
            valor={form.valores.idEquipo}
            alCambiar={(e) => form.cambiarValor('idEquipo', e.target.value)}
            alSalir={() => form.manejarBlur('idEquipo')}
            opciones={equiposDisponibles}
            placeholder={cargandoEquipos ? 'Cargando equipos disponibles…' : 'Seleccione un equipo disponible'}
            error={form.errores.idEquipo}
            soloLectura={form.enProceso || cargandoEquipos}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DateInput
              ref={form.registrarRef('fechaPrestamo')}
              nombre="fechaPrestamo"
              etiqueta="Fecha de préstamo"
              obligatorio
              min={hoyIso}
              valor={form.valores.fechaPrestamo}
              alCambiar={(e) => form.cambiarValor('fechaPrestamo', e.target.value)}
              alSalir={() => form.manejarBlur('fechaPrestamo')}
              error={form.errores.fechaPrestamo}
              soloLectura={form.enProceso}
            />

            <DateInput
              ref={form.registrarRef('fechaDevolucionEstimada')}
              nombre="fechaDevolucionEstimada"
              etiqueta="Fecha estimada de devolución"
              obligatorio
              min={form.valores.fechaPrestamo || hoyIso}
              valor={form.valores.fechaDevolucionEstimada}
              alCambiar={(e) => form.cambiarValor('fechaDevolucionEstimada', e.target.value)}
              alSalir={() => form.manejarBlur('fechaDevolucionEstimada')}
              error={form.errores.fechaDevolucionEstimada}
              soloLectura={form.enProceso}
            />
          </div>

          <TextAreaInput
            ref={form.registrarRef('motivo')}
            nombre="motivo"
            etiqueta="Motivo del préstamo"
            obligatorio
            filas={3}
            valor={form.valores.motivo}
            alCambiar={(e) => form.cambiarValor('motivo', e.target.value)}
            alSalir={() => form.manejarBlur('motivo')}
            error={form.errores.motivo}
            placeholder="Describa la actividad corporativa o proyecto donde se utilizará el equipo…"
            soloLectura={form.enProceso}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-borde">
            <Button
              tipo="button"
              variante="secundario"
              deshabilitado={form.enProceso}
              alHacerClic={alCerrar}
            >
              Cancelar
            </Button>
            <Button
              tipo="submit"
              variante="primario"
              enProceso={form.enProceso}
            >
              Solicitar préstamo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : modalElement;
}
