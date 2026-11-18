import { useState, useEffect } from 'react';
import ModalDialog from '../ui/ModalDialog';
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
  usuario = null,
  usuarioAEditar = null,
  alCerrar,
  alExito,
  alGuardarExitoso
}) {
  const targetUsuario = usuarioAEditar || usuario;
  const esEdicion = Boolean(targetUsuario);
  const callbackExito = alExito || alGuardarExitoso;
  const [areas, setAreas] = useState([]);

  const form = useFormulario({
    valoresIniciales: {
      nombres: targetUsuario?.nombres || '',
      apellidos: targetUsuario?.apellidos || '',
      correo: targetUsuario?.correo || '',
      contrasena: '',
      rol: targetUsuario?.rol || ROLES.COLABORADOR,
      areaId: targetUsuario?.areaId || ''
    },
    validar: (vals) => validarUsuario(vals, esEdicion),
    alEnviar: async (datos, { setErrores, setErrorGeneral, enfocarPrimerError }) => {
      let resp;
      if (esEdicion) {
        resp = await usuarioService.actualizar(targetUsuario.id, {
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
        const itemGuardado = (res.datos && typeof res.datos === 'object')
          ? res.datos
          : { ...datos, id: targetUsuario?.id, nombreCompleto: `${datos.nombres} ${datos.apellidos}` };
        callbackExito?.(itemGuardado, esEdicion ? 'Usuario actualizado con éxito.' : 'Usuario registrado con éxito.');
        alCerrar?.();
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
        nombres: targetUsuario?.nombres || '',
        apellidos: targetUsuario?.apellidos || '',
        correo: targetUsuario?.correo || '',
        contrasena: '',
        rol: targetUsuario?.rol || ROLES.COLABORADOR,
        areaId: targetUsuario?.areaId || ''
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
  }, [abierto, targetUsuario]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo={esEdicion ? 'Editar usuario' : 'Nuevo usuario'}
      subtitulo={esEdicion ? `Actualice los datos de ${targetUsuario?.nombreCompleto || 'usuario'}` : 'Alta de cuenta corporativa'}
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
          <TextInput
            ref={form.registrarRef('nombres')}
            id="nombres"
            nombre="nombres"
            etiqueta="Nombres"
            placeholder="Juan Carlos"
            valor={form.valores.nombres}
            alCambiar={(e) => form.cambiarValor('nombres', e.target.value)}
            alSalir={() => form.manejarBlur('nombres')}
            error={form.errores.nombres}
            obligatorio
            soloLectura={form.enProceso}
          />

          <TextInput
            ref={form.registrarRef('apellidos')}
            id="apellidos"
            nombre="apellidos"
            etiqueta="Apellidos"
            placeholder="Pérez García"
            valor={form.valores.apellidos}
            alCambiar={(e) => form.cambiarValor('apellidos', e.target.value)}
            alSalir={() => form.manejarBlur('apellidos')}
            error={form.errores.apellidos}
            obligatorio
            soloLectura={form.enProceso}
          />
        </div>

        <TextInput
          ref={form.registrarRef('correo')}
          id="correoUsuario"
          nombre="correo"
          type="email"
          etiqueta="Correo corporativo"
          placeholder="usuario@innovatech.com"
          valor={form.valores.correo}
          alCambiar={(e) => form.cambiarValor('correo', e.target.value)}
          alSalir={() => form.manejarBlur('correo')}
          error={form.errores.correo}
          obligatorio={!esEdicion}
          ayuda={esEdicion ? 'El correo corporativo no puede modificarse.' : 'Debe ser único en la organización.'}
          soloLectura={esEdicion || form.enProceso}
        />

        {!esEdicion && (
          <PasswordInput
            ref={form.registrarRef('contrasena')}
            id="contrasenaUsuario"
            nombre="contrasena"
            etiqueta="Contraseña temporal"
            placeholder="••••••••"
            valor={form.valores.contrasena}
            alCambiar={(e) => form.cambiarValor('contrasena', e.target.value)}
            alSalir={() => form.manejarBlur('contrasena')}
            error={form.errores.contrasena}
            obligatorio
            ayuda="Mínimo 8 caracteres corporativos."
            soloLectura={form.enProceso}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            ref={form.registrarRef('areaId')}
            id="areaId"
            nombre="areaId"
            etiqueta="Área corporativa"
            placeholder="Seleccione el área"
            opciones={areas}
            valor={form.valores.areaId}
            alCambiar={(e) => form.cambiarValor('areaId', e.target.value)}
            alSalir={() => form.manejarBlur('areaId')}
            error={form.errores.areaId}
            obligatorio
            soloLectura={form.enProceso}
          />

          <SelectInput
            ref={form.registrarRef('rol')}
            id="rol"
            nombre="rol"
            etiqueta="Rol del usuario"
            placeholder="Seleccione el rol"
            opciones={OPCIONES_ROL}
            valor={form.valores.rol}
            alCambiar={(e) => form.cambiarValor('rol', e.target.value)}
            alSalir={() => form.manejarBlur('rol')}
            error={form.errores.rol}
            obligatorio
            soloLectura={form.enProceso}
          />
        </div>
      </form>
    </ModalDialog>
  );
}
