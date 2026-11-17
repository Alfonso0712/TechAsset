import { useState, useEffect } from 'react';
import ModalDialog from '../ui/ModalDialog';
import CampoFormulario from '../formulario/CampoFormulario';
import TextInput from '../formulario/TextInput';
import PasswordInput from '../formulario/PasswordInput';
import SelectInput from '../formulario/SelectInput';
import AlertMessage from '../ui/AlertMessage';
import { useFormulario } from '../../hooks/useFormulario';
import { validarUsuario } from '../../validation/reglasUsuario';
import { usuarioService } from '../../services/usuarioService';
import { areaService } from '../../services/areaService';
import { interpretarRespuestaError } from '../../validation/interpretarRespuesta';
import { ROLES } from '../../constants/roles';

const OPCIONES_ROL = [
  { valor: ROLES.COLABORADOR, etiqueta: 'Colaborador (Solicitante)' },
  { valor: ROLES.RESPONSABLE_TECNOLOGIA, etiqueta: 'Responsable de Tecnología (Gestión / Aprobaciones)' },
  { valor: ROLES.ADMINISTRADOR, etiqueta: 'Administrador (Control total del sistema)' }
];

export default function FormularioUsuario({
  abierto = false,
  usuarioAEditar = null,
  alCerrar,
  alGuardarExitoso
}) {
  const esEdicion = Boolean(usuarioAEditar);
  const [areas, setAreas] = useState([]);

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
      nombres: usuarioAEditar?.nombres || '',
      apellidos: usuarioAEditar?.apellidos || '',
      correo: usuarioAEditar?.correo || '',
      contrasena: '',
      rol: usuarioAEditar?.rol || ROLES.COLABORADOR,
      areaId: usuarioAEditar?.areaId || ''
    },
    validar: (vals) => validarUsuario(vals, esEdicion),
    onSubmit: async (datos) => {
      let resp;
      if (esEdicion) {
        resp = await usuarioService.actualizar(usuarioAEditar.id, {
          nombres: datos.nombres,
          apellidos: datos.apellidos,
          areaId: datos.areaId,
          rol: datos.rol
        });
      } else {
        resp = await usuarioService.crear(datos);
      }

      if (resp.estado === 200 || resp.estado === 201) {
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
        nombres: usuarioAEditar?.nombres || '',
        apellidos: usuarioAEditar?.apellidos || '',
        correo: usuarioAEditar?.correo || '',
        contrasena: '',
        rol: usuarioAEditar?.rol || ROLES.COLABORADOR,
        areaId: usuarioAEditar?.areaId || ''
      });

      areaService.listarActivas().then(res => {
        if (res.estado === 200 && Array.isArray(res.datos)) {
          setAreas(res.datos.map(a => ({ valor: a.id, etiqueta: a.nombre })));
        }
      });
    }
  }, [abierto, usuarioAEditar, reiniciar]);

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo={esEdicion ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
      subtitulo={esEdicion ? `Actualice los datos de ${usuarioAEditar.nombreCompleto}` : 'Alta de cuenta corporativa institucional'}
      textoPrimario={esEdicion ? 'Guardar Cambios' : 'Crear Usuario'}
      textoSecundario="Cancelar"
      variantePrimaria="primary"
      enProceso={enviando}
      alConfirmar={manejarEnvio}
      tamano="md"
    >
      <form onSubmit={manejarEnvio} className="space-y-4" noValidate>
        {mensajeGeneral && <AlertMessage variante="peligro" mensaje={mensajeGeneral} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoFormulario
            id="nombres"
            etiqueta="Nombres"
            error={errores.nombres}
            obligatorio
          >
            <TextInput
              id="nombres"
              name="nombres"
              placeholder="Juan Carlos"
              value={valores.nombres}
              onChange={(e) => cambiarValor('nombres', e.target.value)}
              onBlur={() => marcarTocado('nombres')}
              error={Boolean(errores.nombres)}
              disabled={enviando}
            />
          </CampoFormulario>

          <CampoFormulario
            id="apellidos"
            etiqueta="Apellidos"
            error={errores.apellidos}
            obligatorio
          >
            <TextInput
              id="apellidos"
              name="apellidos"
              placeholder="Pérez García"
              value={valores.apellidos}
              onChange={(e) => cambiarValor('apellidos', e.target.value)}
              onBlur={() => marcarTocado('apellidos')}
              error={Boolean(errores.apellidos)}
              disabled={enviando}
            />
          </CampoFormulario>
        </div>

        <CampoFormulario
          id="correoUsuario"
          etiqueta="Correo Corporativo"
          error={errores.correo}
          obligatorio={!esEdicion}
          ayuda={esEdicion ? 'El correo corporativo no puede modificarse.' : 'Debe ser único en el sistema (RN-08).'}
        >
          <TextInput
            id="correoUsuario"
            name="correoUsuario"
            type="email"
            placeholder="usuario@innovatech.com"
            value={valores.correo}
            onChange={(e) => cambiarValor('correo', e.target.value)}
            onBlur={() => marcarTocado('correo')}
            error={Boolean(errores.correo)}
            disabled={esEdicion || enviando}
          />
        </CampoFormulario>

        {!esEdicion && (
          <CampoFormulario
            id="contrasenaUsuario"
            etiqueta="Contraseña Temporal"
            error={errores.contrasena}
            obligatorio
            ayuda="Mínimo 8 caracteres corporativos."
          >
            <PasswordInput
              id="contrasenaUsuario"
              name="contrasenaUsuario"
              placeholder="••••••••"
              value={valores.contrasena}
              onChange={(e) => cambiarValor('contrasena', e.target.value)}
              onBlur={() => marcarTocado('contrasena')}
              error={Boolean(errores.contrasena)}
              disabled={enviando}
            />
          </CampoFormulario>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoFormulario
            id="areaId"
            etiqueta="Área Corporativa"
            error={errores.areaId}
            obligatorio
          >
            <SelectInput
              id="areaId"
              name="areaId"
              placeholder="Seleccione el área"
              opciones={areas}
              value={valores.areaId}
              onChange={(e) => cambiarValor('areaId', e.target.value)}
              onBlur={() => marcarTocado('areaId')}
              error={Boolean(errores.areaId)}
              disabled={enviando}
            />
          </CampoFormulario>

          <CampoFormulario
            id="rol"
            etiqueta="Rol del Usuario"
            error={errores.rol}
            obligatorio
          >
            <SelectInput
              id="rol"
              name="rol"
              placeholder="Seleccione el rol"
              opciones={OPCIONES_ROL}
              value={valores.rol}
              onChange={(e) => cambiarValor('rol', e.target.value)}
              onBlur={() => marcarTocado('rol')}
              error={Boolean(errores.rol)}
              disabled={enviando}
            />
          </CampoFormulario>
        </div>
      </form>
    </ModalDialog>
  );
}
