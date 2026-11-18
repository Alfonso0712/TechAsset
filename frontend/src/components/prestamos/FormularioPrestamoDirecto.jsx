import { useState, useEffect } from 'react';
import ModalDialog from '../ui/ModalDialog';
import CampoFormulario from '../formulario/CampoFormulario';
import SelectInput from '../formulario/SelectInput';
import DateInput from '../formulario/DateInput';
import TextAreaInput from '../formulario/TextAreaInput';
import AlertMessage from '../ui/AlertMessage';
import { useFormulario } from '../../hooks/useFormulario';
import { prestamoService } from '../../services/prestamoService';
import { equipoService } from '../../services/equipoService';
import { usuarioService } from '../../services/usuarioService';
import { interpretarRespuestaError } from '../../validation/interpretarRespuesta';
import { ESTADOS_EQUIPO } from '../../constants/estados';

export default function FormularioPrestamoDirecto({
  abierto = false,
  alCerrar,
  alGuardarExitoso
}) {
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);

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
      idUsuario: '',
      idEquipo: '',
      fechaPrestamo: hoyStr,
      fechaDevolucionEstimada: '',
      motivo: ''
    },
    validar: (vals) => {
      const errs = {};
      if (!vals.idUsuario) errs.idUsuario = 'Debe seleccionar al colaborador solicitante.';
      if (!vals.idEquipo) errs.idEquipo = 'Debe seleccionar un equipo disponible.';
      if (!vals.fechaPrestamo) errs.fechaPrestamo = 'La fecha de préstamo es obligatoria.';
      if (!vals.fechaDevolucionEstimada) errs.fechaDevolucionEstimada = 'La fecha de devolución es obligatoria.';
      if (!vals.motivo?.trim()) errs.motivo = 'El motivo del préstamo es obligatorio.';
      return errs;
    },
    onSubmit: async (datos) => {
      const resp = await prestamoService.crearDirecto(datos);
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
        idUsuario: '',
        idEquipo: '',
        fechaPrestamo: hoyStr,
        fechaDevolucionEstimada: '',
        motivo: ''
      });

      setCargandoDatos(true);
      Promise.all([
        equipoService.listar({ estado: ESTADOS_EQUIPO.DISPONIBLE, tamanoPagina: 100 }),
        usuarioService.listar({ activo: true, tamanoPagina: 100 })
      ]).then(([resEq, resUs]) => {
        if (resEq.estado === 200 && resEq.datos?.items) {
          setEquipos(resEq.datos.items.map(e => ({
            valor: e.id,
            etiqueta: `${e.codigoPatrimonial} - ${e.nombre}`
          })));
        }
        if (resUs.estado === 200 && resUs.datos?.items) {
          setUsuarios(resUs.datos.items.map(u => ({
            valor: u.id,
            etiqueta: `${u.nombreCompleto} (${u.areaNombre || u.rol})`
          })));
        }
        setCargandoDatos(false);
      });
    }
  }, [abierto, hoyStr, reiniciar]);

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Otorgar Préstamo Directo"
      subtitulo="Asignación directa de equipo a un colaborador (se registra en estado Activo)"
      textoPrimario="Otorgar Préstamo"
      textoSecundario="Cancelar"
      variantePrimaria="primary"
      enProceso={enviando}
      alConfirmar={manejarEnvio}
      tamano="md"
    >
      <form onSubmit={manejarEnvio} className="space-y-4" noValidate>
        {mensajeGeneral && <AlertMessage variante="peligro" mensaje={mensajeGeneral} />}

        <CampoFormulario
          id="idUsuario"
          etiqueta="Colaborador Beneficiario"
          error={errores.idUsuario}
          obligatorio
        >
          <SelectInput
            id="idUsuario"
            name="idUsuario"
            placeholder={cargandoDatos ? 'Cargando usuarios…' : 'Seleccione al colaborador'}
            opciones={usuarios}
            value={valores.idUsuario}
            onChange={(e) => cambiarValor('idUsuario', e.target.value)}
            onBlur={() => marcarTocado('idUsuario')}
            error={Boolean(errores.idUsuario)}
            disabled={enviando || cargandoDatos}
          />
        </CampoFormulario>

        <CampoFormulario
          id="idEquipoDirecto"
          etiqueta="Equipo Tecnológico Disponible"
          error={errores.idEquipo}
          obligatorio
        >
          <SelectInput
            id="idEquipoDirecto"
            name="idEquipoDirecto"
            placeholder={cargandoDatos ? 'Cargando equipos…' : 'Seleccione el equipo'}
            opciones={equipos}
            value={valores.idEquipo}
            onChange={(e) => cambiarValor('idEquipo', e.target.value)}
            onBlur={() => marcarTocado('idEquipo')}
            error={Boolean(errores.idEquipo)}
            disabled={enviando || cargandoDatos}
          />
        </CampoFormulario>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoFormulario
            id="fechaPrestamoDirecto"
            etiqueta="Fecha de Préstamo"
            error={errores.fechaPrestamo}
            obligatorio
          >
            <DateInput
              id="fechaPrestamoDirecto"
              name="fechaPrestamoDirecto"
              value={valores.fechaPrestamo}
              onChange={(e) => cambiarValor('fechaPrestamo', e.target.value)}
              disabled={enviando}
            />
          </CampoFormulario>

          <CampoFormulario
            id="fechaDevolucionDirecto"
            etiqueta="Fecha Estimada Devolución"
            error={errores.fechaDevolucionEstimada}
            obligatorio
          >
            <DateInput
              id="fechaDevolucionDirecto"
              name="fechaDevolucionDirecto"
              value={valores.fechaDevolucionEstimada}
              onChange={(e) => cambiarValor('fechaDevolucionEstimada', e.target.value)}
              disabled={enviando}
              min={valores.fechaPrestamo || hoyStr}
            />
          </CampoFormulario>
        </div>

        <CampoFormulario
          id="motivoDirecto"
          etiqueta="Motivo / Proyecto"
          error={errores.motivo}
          obligatorio
        >
          <TextAreaInput
            id="motivoDirecto"
            name="motivoDirecto"
            placeholder="Justificación del préstamo directo…"
            value={valores.motivo}
            onChange={(e) => cambiarValor('motivo', e.target.value)}
            disabled={enviando}
            rows={2}
          />
        </CampoFormulario>
      </form>
    </ModalDialog>
  );
}
