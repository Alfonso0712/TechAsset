import { useState, useEffect } from 'react';
import ModalDialog from '../ui/ModalDialog';
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
import { fechaHoyLocal } from '../../utils/fechas';
import { CLASES_FORMULARIO } from '../formulario/CampoFormulario';

export default function FormularioPrestamoDirecto({
  abierto = false,
  equipoPreseleccionadoId = '',
  alCerrar,
  alExito,
  alGuardarExitoso
}) {
  const callbackExito = alExito || alGuardarExitoso;
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  const hoyStr = fechaHoyLocal();

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
      idEquipo: equipoPreseleccionadoId || '',
      fechaPrestamo: hoyStr,
      fechaDevolucionEstimada: '',
      motivo: ''
    },
    validar: (vals) => {
      const errs = {};
      if (!vals.idUsuario) errs.idUsuario = 'Debe seleccionar al colaborador solicitante.';
      if (!vals.idEquipo) errs.idEquipo = 'Debe seleccionar un equipo disponible.';
      if (!vals.fechaPrestamo) errs.fechaPrestamo = 'La fecha de préstamo es obligatoria.';
      if (!vals.fechaDevolucionEstimada) {
        errs.fechaDevolucionEstimada = 'La fecha de devolución es obligatoria.';
      } else if (vals.fechaPrestamo && vals.fechaDevolucionEstimada <= vals.fechaPrestamo) {
        errs.fechaDevolucionEstimada = 'La fecha estimada de devolución debe ser estrictamente posterior a la fecha de préstamo (RN-04).';
      }
      if (!vals.motivo?.trim()) {
        errs.motivo = 'El motivo del préstamo es obligatorio.';
      } else if (vals.motivo.length > 300) {
        errs.motivo = 'El motivo no debe superar los 300 caracteres.';
      }
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
        idEquipo: equipoPreseleccionadoId || '',
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
  }, [abierto, equipoPreseleccionadoId, hoyStr, reiniciar]);

  const tieneCambios = Boolean(valores.idUsuario || valores.idEquipo || valores.motivo);

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Registrar préstamo"
      subtitulo="Asignación directa de equipo a un colaborador (nace en estado Activo)"
      textoPrimario="Registrar préstamo"
      textoSecundario="Cancelar"
      variantePrimaria="primary"
      enProceso={enviando}
      alConfirmar={manejarEnvio}
      tieneCambiosSinGuardar={tieneCambios}
      tamano="md"
    >
      <form onSubmit={manejarEnvio} className={CLASES_FORMULARIO.formulario} noValidate>
        {mensajeGeneral && <AlertMessage variante="peligro" mensaje={mensajeGeneral} />}

        <SelectInput
          id="idUsuarioDirecto"
          nombre="idUsuario"
          etiqueta="Colaborador Solicitante"
          placeholder={cargandoDatos ? 'Cargando colaboradores…' : 'Seleccione al colaborador'}
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

        <div className={CLASES_FORMULARIO.filaDoble}>
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

        <TextAreaInput
          id="motivoDirecto"
          nombre="motivoDirecto"
          etiqueta="Motivo"
          obligatorio
          rows={3}
          maxLength={300}
          contador={`${(valores.motivo || '').length}/300`}
          placeholder="Justificación del préstamo directo…"
          valor={valores.motivo}
          alCambiar={(e) => cambiarValor('motivo', e.target.value)}
          alSalir={() => marcarTocado('motivo')}
          error={errores.motivo}
          deshabilitado={enviando}
        />
      </form>
    </ModalDialog>
  );
}
