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
  alExito,
  alGuardarExitoso
}) {
  const callbackExito = alExito || alGuardarExitoso;
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
        callbackExito?.(resp.datos);
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

        <SelectInput
          id="idUsuario"
          nombre="idUsuario"
          etiqueta="Colaborador Beneficiario"
          placeholder={cargandoDatos ? 'Cargando usuarios…' : 'Seleccione al colaborador'}
          opciones={usuarios}
          valor={valores.idUsuario}
          alCambiar={(e) => cambiarValor('idUsuario', e.target.value)}
          alSalir={() => marcarTocado('idUsuario')}
          error={errores.idUsuario}
          obligatorio
          deshabilitado={enviando || cargandoDatos}
        />

        <SelectInput
          id="idEquipoDirecto"
          nombre="idEquipoDirecto"
          etiqueta="Equipo Tecnológico Disponible"
          placeholder={cargandoDatos ? 'Cargando equipos…' : 'Seleccione el equipo'}
          opciones={equipos}
          valor={valores.idEquipo}
          alCambiar={(e) => cambiarValor('idEquipo', e.target.value)}
          alSalir={() => marcarTocado('idEquipo')}
          error={errores.idEquipo}
          obligatorio
          deshabilitado={enviando || cargandoDatos}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateInput
            id="fechaPrestamoDirecto"
            nombre="fechaPrestamoDirecto"
            etiqueta="Fecha de Préstamo"
            valor={valores.fechaPrestamo}
            alCambiar={(e) => cambiarValor('fechaPrestamo', e.target.value)}
            error={errores.fechaPrestamo}
            obligatorio
            deshabilitado={enviando}
          />

          <DateInput
            id="fechaDevolucionDirecto"
            nombre="fechaDevolucionDirecto"
            etiqueta="Fecha Estimada Devolución"
            valor={valores.fechaDevolucionEstimada}
            alCambiar={(e) => cambiarValor('fechaDevolucionEstimada', e.target.value)}
            error={errores.fechaDevolucionEstimada}
            obligatorio
            deshabilitado={enviando}
            min={valores.fechaPrestamo || hoyStr}
          />
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
