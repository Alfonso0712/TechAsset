// Formulario para solicitar préstamo de equipo tecnológico · Colaborador
import { useState, useEffect } from 'react';
import ModalDialog from '../ui/ModalDialog';
import SelectInput from '../formulario/SelectInput';
import DateInput from '../formulario/DateInput';
import TextAreaInput from '../formulario/TextAreaInput';
import AlertMessage from '../ui/AlertMessage';
import { useFormulario } from '../../hooks/useFormulario';
import { validarSolicitudPrestamo } from '../../validation/reglasPrestamo';
import { prestamoService } from '../../services/prestamoService';
import { equipoService } from '../../services/equipoService';
import { interpretarRespuesta } from '../../validation/interpretarRespuesta';
import { ESTADOS_EQUIPO } from '../../constants/estados';
import { MENSAJES } from '../../constants/mensajes';
import { fechaHoyLocal } from '../../utils/fechas';
import { CLASES_FORMULARIO } from '../formulario/CampoFormulario';

export default function FormularioSolicitarPrestamo({
  abierto = false,
  equipoPreseleccionadoId = '',
  alCerrar,
  alExito,
  alGuardarExitoso
}) {
  const callbackExito = alExito || alGuardarExitoso;
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  const [cargandoEquipos, setCargandoEquipos] = useState(false);

  const hoyIso = fechaHoyLocal();

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

  useEffect(() => {
    if (!abierto) return;

    form.reiniciar({
      idEquipo: equipoPreseleccionadoId || '',
      fechaPrestamo: hoyIso,
      fechaDevolucionEstimada: '',
      motivo: ''
    });

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

  const tieneCambios = Boolean(
    form.valores.idEquipo !== (equipoPreseleccionadoId || '') ||
    form.valores.fechaDevolucionEstimada ||
    form.valores.motivo
  );

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Solicitar préstamo"
      subtitulo="Seleccione el equipo requerido e indique el período de uso corporativo."
      textoPrimario="Solicitar préstamo"
      textoSecundario="Cancelar"
      variantePrimaria="primary"
      enProceso={form.enProceso}
      alConfirmar={form.manejarEnvio}
      tieneCambiosSinGuardar={tieneCambios}
      tamano="md"
    >
      <form onSubmit={form.manejarEnvio} noValidate className={CLASES_FORMULARIO.formulario}>
        <div role="status" aria-live="polite" className="sr-only">
          {form.resumenEstado}
        </div>

        {form.errorGeneral && (
          <AlertMessage
            variante="error"
            rol="alert"
            mensaje={form.errorGeneral}
            compacto
            enfocarAlAparecer
          />
        )}

        <SelectInput
          ref={form.registrarRef('idEquipo')}
          id="solicitarIdEquipo"
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

        <div className={CLASES_FORMULARIO.filaDoble}>
          <DateInput
            ref={form.registrarRef('fechaPrestamo')}
            id="solicitarFechaPrestamo"
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
            id="solicitarFechaDevolucion"
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
          id="solicitarMotivo"
          nombre="motivo"
          etiqueta="Motivo"
          obligatorio
          rows={3}
          maxLength={300}
          contador={`${(form.valores.motivo || '').length}/300`}
          valor={form.valores.motivo}
          alCambiar={(e) => form.cambiarValor('motivo', e.target.value)}
          alSalir={() => form.manejarBlur('motivo')}
          error={form.errores.motivo}
          placeholder="Describa la actividad corporativa o proyecto donde se utilizará el equipo…"
          soloLectura={form.enProceso}
        />
      </form>
    </ModalDialog>
  );
}
