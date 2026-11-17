import { useState, useEffect } from 'react';
import ModalDialog from '../ui/ModalDialog';
import CampoFormulario from '../formulario/CampoFormulario';
import SelectInput from '../formulario/SelectInput';
import DateInput from '../formulario/DateInput';
import TextAreaInput from '../formulario/TextAreaInput';
import AlertMessage from '../ui/AlertMessage';
import { useFormulario } from '../../hooks/useFormulario';
import { validarSolicitudPrestamo } from '../../validation/reglasPrestamo';
import { prestamoService } from '../../services/prestamoService';
import { equipoService } from '../../services/equipoService';
import { interpretarRespuestaError } from '../../validation/interpretarRespuesta';
import { ESTADOS_EQUIPO } from '../../constants/estados';

export default function FormularioSolicitarPrestamo({
  abierto = false,
  alCerrar,
  alGuardarExitoso
}) {
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  const [cargandoEquipos, setCargandoEquipos] = useState(false);

  const hoyStr = new Date().toISOString().split('T')[0];

  const {
    valores,
    errores,
    enviando,
    mensajeGeneral,
    setMensajeGeneral,
    cambiarValor,
    marcarTocado,
    reiniciar,
    manejarEnvio
  } = useFormulario({
    valoresIniciales: {
      idEquipo: '',
      fechaPrestamo: hoyStr,
      fechaDevolucionEstimada: '',
      motivo: ''
    },
    validar: validarSolicitudPrestamo,
    onSubmit: async (datos) => {
      const resp = await prestamoService.solicitar({
        idEquipo: datos.idEquipo,
        fechaPrestamo: datos.fechaPrestamo,
        fechaDevolucionEstimada: datos.fechaDevolucionEstimada,
        motivo: datos.motivo
      });

      if (resp.estado === 201 || resp.estado === 200) {
        alGuardarExitoso?.(resp.datos);
        alCerrar();
      } else {
        setMensajeGeneral(interpretarRespuestaError(resp.estado, resp.datos));
      }
    }
  });

  useEffect(() => {
    if (abierto) {
      reiniciar({
        idEquipo: '',
        fechaPrestamo: hoyStr,
        fechaDevolucionEstimada: '',
        motivo: ''
      });

      setCargandoEquipos(true);
      equipoService.listar({ estado: ESTADOS_EQUIPO.DISPONIBLE, tamanoPagina: 100 }).then(res => {
        if (res.estado === 200 && res.datos?.items) {
          setEquiposDisponibles(res.datos.items.map(e => ({
            valor: e.id,
            etiqueta: `${e.codigoPatrimonial} - ${e.nombre} (${e.marca})`
          })));
        }
        setCargandoEquipos(false);
      });
    }
  }, [abierto, hoyStr, reiniciar]);

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Solicitar Préstamo de Equipo"
      subtitulo="Seleccione el equipo requerido e indique el período estimado de uso institucional"
      textoPrimario="Enviar Solicitud"
      textoSecundario="Cancelar"
      variantePrimaria="primary"
      enProceso={enviando}
      alConfirmar={manejarEnvio}
      tamano="md"
    >
      <form onSubmit={manejarEnvio} className="space-y-4" noValidate>
        {mensajeGeneral && <AlertMessage variante="peligro" mensaje={mensajeGeneral} />}

        <CampoFormulario
          id="idEquipo"
          etiqueta="Equipo Tecnológico Disponible"
          error={errores.idEquipo}
          obligatorio
        >
          <SelectInput
            id="idEquipo"
            name="idEquipo"
            placeholder={cargandoEquipos ? 'Cargando equipos disponibles…' : 'Seleccione un equipo disponible'}
            opciones={equiposDisponibles}
            value={valores.idEquipo}
            onChange={(e) => cambiarValor('idEquipo', e.target.value)}
            onBlur={() => marcarTocado('idEquipo')}
            error={Boolean(errores.idEquipo)}
            disabled={enviando || cargandoEquipos}
          />
        </CampoFormulario>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoFormulario
            id="fechaPrestamo"
            etiqueta="Fecha de Préstamo"
            error={errores.fechaPrestamo}
            obligatorio
          >
            <DateInput
              id="fechaPrestamo"
              name="fechaPrestamo"
              value={valores.fechaPrestamo}
              onChange={(e) => cambiarValor('fechaPrestamo', e.target.value)}
              onBlur={() => marcarTocado('fechaPrestamo')}
              error={Boolean(errores.fechaPrestamo)}
              disabled={enviando}
              min={hoyStr}
            />
          </CampoFormulario>

          <CampoFormulario
            id="fechaDevolucionEstimada"
            etiqueta="Fecha Estimada de Devolución"
            error={errores.fechaDevolucionEstimada}
            obligatorio
            ayuda="Debe ser posterior a la fecha de préstamo (RN-04)."
          >
            <DateInput
              id="fechaDevolucionEstimada"
              name="fechaDevolucionEstimada"
              value={valores.fechaDevolucionEstimada}
              onChange={(e) => cambiarValor('fechaDevolucionEstimada', e.target.value)}
              onBlur={() => marcarTocado('fechaDevolucionEstimada')}
              error={Boolean(errores.fechaDevolucionEstimada)}
              disabled={enviando}
              min={valores.fechaPrestamo || hoyStr}
            />
          </CampoFormulario>
        </div>

        <CampoFormulario
          id="motivo"
          etiqueta="Motivo del Préstamo"
          error={errores.motivo}
          obligatorio
        >
          <TextAreaInput
            id="motivo"
            name="motivo"
            placeholder="Describa el trabajo, proyecto o actividad corporativa donde utilizará el equipo…"
            value={valores.motivo}
            onChange={(e) => cambiarValor('motivo', e.target.value)}
            onBlur={() => marcarTocado('motivo')}
            error={Boolean(errores.motivo)}
            disabled={enviando}
            rows={3}
          />
        </CampoFormulario>
      </form>
    </ModalDialog>
  );
}
