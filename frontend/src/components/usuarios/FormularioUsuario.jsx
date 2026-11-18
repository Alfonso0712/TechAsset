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
import { interpretarRespuesta } from '../../validation/interpretarRespuesta';
import { ROLES } from '../../constants/roles';

const OPCIONES_ROL = [
  { valor: ROLES.COLABORADOR, etiqueta: 'Colaborador (Solicitante)' },
  { valor: ROLES.RESPONSABLE_TECNOLOGIA, etiqueta: 'Responsable de Tecnología' },
  { valor: ROLES.ADMINISTRADOR, etiqueta: 'Administrador' }
];

export default function FormularioUsuario({
  abierto = false,
  usuarioAEditar = null,
  alCerrar,
  alGuardarExitoso
}) {
  const esEdicion = Boolean(usuarioAEditar);
  const [areas, setAreas] = useState([]);

  const form = useFormulario({
    valoresIniciales: {
      nombres: usuarioAEditar?.nombres || '',
      apellidos: usuarioAEditar?.apellidos || '',
      correo: usuarioAEditar?.correo || '',
      contrasena: '',
      rol: usuarioAEditar?.rol || ROLES.COLABORADOR,
      areaId: usuarioAEditar?.areaId || ''
    },
    validar: (vals) => validarUsuario(vals, esEdicion),
    alEnviar: async (datos, { setErrores, setErrorGeneral, enfocarPrimerError }) => {
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

      const res = interpretarRespuesta(resp);
      if (res.ok) {
        alGuardarExitoso?.(esEdicion ? 'Usuario actualizado con éxito.' : 'Usuario registrado con éxito.', res.datos);
        alCerrar();
        return;
      }

      if (res.errores && Object.keys(res.errores).length > 0) {
        setErrores(res.errores);
        enfocarPrimerError(res.errores);
        return;
      }

      setErrorGeneral(res.errorGeneral || 'No se pudo guardar el usuario.');
    }
  });

  useEffect(() => {
    if (abierto) {
      form.setValores({
        nombres: usuarioAEditar?.nombres || '',
        apellidos: usuarioAEditar?.apellidos || '',
        correo: usuarioAEditar?.correo || '',
        contrasena: '',
        rol: usuarioAEditar?.rol || ROLES.COLABORADOR,
        areaId: usuarioAEditar?.areaId || ''
      });
      form.setErrores({});
      form.setErrorGeneral('');

      areaService.listarActivas().then((res) => {
        const resp = interpretarRespuesta(res);
        if (resp.ok && Array.isArray(resp.datos)) {
          setAreas(resp.datos.map((a) => ({ valor: a.id, etiqueta: a.nombre })));
        }
      });
    }
  }, [abierto, usuarioAEditar]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo={esEdicion ? 'Editar usuario' : 'Nuevo usuario'}
      subtitulo={esEdicion ? `Actualice los datos de ${usuarioAEditar.nombreCompleto}` : 'Alta de cuenta corporativa'}
      textoPrimario={esEdicion ? 'Guardar cambios' : 'Crear usuario'}
      textoSecundario="Cancelar"
      variantePrimaria="primary"
      enProceso={form.enProceso}
      alConfirmar={form.manejarEnvio}
      tamano="md"
    >
      <form onSubmit={form.manejarEnvio} className="space-y-4" noValidate>
        {form.errorGeneral && <AlertMessage variante="error" rol="alert" mensaje={form.errorGeneral} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoFormulario
            id="nombres"
            etiqueta="Nombres"
            error={form.errores.nombres}
            obligatorio
          >
            <TextInput
              ref={form.registrarRef('nombres')}
              id="nombres"
              nombre="nombres"
              placeholder="Juan Carlos"
              valor={form.valores.nombres}
              alCambiar={(e) => form.cambiarValor('nombres', e.target.value)}
              alSalir={() => form.manejarBlur('nombres')}
              error={form.errores.nombres}
              soloLectura={form.enProceso}
            />
          </CampoFormulario>

          <CampoFormulario
            id="apellidos"
            etiqueta="Apellidos"
            error={form.errores.apellidos}
            obligatorio
          >
            <TextInput
              ref={form.registrarRef('apellidos')}
              id="apellidos"
              nombre="apellidos"
              placeholder="Pérez García"
              valor={form.valores.apellidos}
              alCambiar={(e) => form.cambiarValor('apellidos', e.target.value)}
              alSalir={() => form.manejarBlur('apellidos')}
              error={form.errores.apellidos}
              soloLectura={form.enProceso}
            />
          </CampoFormulario>
        </div>

        <CampoFormulario
          id="correoUsuario"
          etiqueta="Correo corporativo"
          error={form.errores.correo}
          obligatorio={!esEdicion}
          ayuda={esEdicion ? 'El correo corporativo no puede modificarse.' : 'Debe ser único en la organización.'}
        >
          <TextInput
            ref={form.registrarRef('correo')}
            id="correoUsuario"
            nombre="correo"
            type="email"
            placeholder="usuario@innovatech.com"
            valor={form.valores.correo}
            alCambiar={(e) => form.cambiarValor('correo', e.target.value)}
            alSalir={() => form.manejarBlur('correo')}
            error={form.errores.correo}
            soloLectura={esEdicion || form.enProceso}
          />
        </CampoFormulario>

        {!esEdicion && (
          <CampoFormulario
            id="contrasenaUsuario"
            etiqueta="Contraseña temporal"
            error={form.errores.contrasena}
            obligatorio
            ayuda="Mínimo 8 caracteres corporativos."
          >
            <PasswordInput
              ref={form.registrarRef('contrasena')}
              id="contrasenaUsuario"
              nombre="contrasena"
              placeholder="••••••••"
              valor={form.valores.contrasena}
              alCambiar={(e) => form.cambiarValor('contrasena', e.target.value)}
              alSalir={() => form.manejarBlur('contrasena')}
              error={form.errores.contrasena}
              soloLectura={form.enProceso}
            />
          </CampoFormulario>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoFormulario
            id="areaId"
            etiqueta="Área corporativa"
            error={form.errores.areaId}
            obligatorio
          >
            <SelectInput
              ref={form.registrarRef('areaId')}
              id="areaId"
              nombre="areaId"
              placeholder="Seleccione el área"
              opciones={areas}
              valor={form.valores.areaId}
              alCambiar={(e) => form.cambiarValor('areaId', e.target.value)}
              alSalir={() => form.manejarBlur('areaId')}
              error={form.errores.areaId}
              soloLectura={form.enProceso}
            />
          </CampoFormulario>

          <CampoFormulario
            id="rol"
            etiqueta="Rol del usuario"
            error={form.errores.rol}
            obligatorio
          >
            <SelectInput
              ref={form.registrarRef('rol')}
              id="rol"
              nombre="rol"
              placeholder="Seleccione el rol"
              opciones={OPCIONES_ROL}
              valor={form.valores.rol}
              alCambiar={(e) => form.cambiarValor('rol', e.target.value)}
              alSalir={() => form.manejarBlur('rol')}
              error={form.errores.rol}
              soloLectura={form.enProceso}
            />
          </CampoFormulario>
        </div>
      </form>
    </ModalDialog>
  );
}
