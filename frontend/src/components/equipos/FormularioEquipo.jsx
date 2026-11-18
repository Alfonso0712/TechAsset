import { useEffect } from 'react';
import ModalDialog from '../ui/ModalDialog';
import CampoFormulario from '../formulario/CampoFormulario';
import TextInput from '../formulario/TextInput';
import SelectInput from '../formulario/SelectInput';
import AlertMessage from '../ui/AlertMessage';
import { useFormulario } from '../../hooks/useFormulario';
import { validarEquipo } from '../../validation/reglasEquipo';
import { equipoService } from '../../services/equipoService';
import { interpretarRespuesta } from '../../validation/interpretarRespuesta';
import { CATEGORIAS_EQUIPO, ESTADOS_EQUIPO } from '../../constants/estados';
import { MAPA_CATEGORIAS_EQUIPO } from '../../constants/etiquetas';

const OPCIONES_CATEGORIA = Object.entries(CATEGORIAS_EQUIPO).map(([_, valor]) => ({
  valor,
  etiqueta: MAPA_CATEGORIAS_EQUIPO?.[valor] || valor
}));

const OPCIONES_ESTADO_INICIAL = [
  { valor: ESTADOS_EQUIPO.DISPONIBLE, etiqueta: 'Disponible' },
  { valor: ESTADOS_EQUIPO.MANTENIMIENTO, etiqueta: 'Mantenimiento' }
];

export default function FormularioEquipo({
  abierto = false,
  equipoAEditar = null,
  alCerrar,
  alGuardarExitoso
}) {
  const esEdicion = Boolean(equipoAEditar);

  const form = useFormulario({
    valoresIniciales: {
      codigoPatrimonial: equipoAEditar?.codigoPatrimonial || '',
      nombre: equipoAEditar?.nombre || '',
      categoria: equipoAEditar?.categoria || '',
      marca: equipoAEditar?.marca || '',
      ubicacion: equipoAEditar?.ubicacion || '',
      estadoInicial: equipoAEditar?.estado || ESTADOS_EQUIPO.DISPONIBLE
    },
    validar: (vals) => validarEquipo(vals, esEdicion),
    alEnviar: async (datos, { setErrores, setErrorGeneral, enfocarPrimerError }) => {
      let resp;
      if (esEdicion) {
        resp = await equipoService.actualizar(equipoAEditar.id, {
          nombre: datos.nombre,
          categoria: datos.categoria,
          marca: datos.marca,
          ubicacion: datos.ubicacion
        });
      } else {
        resp = await equipoService.crear(datos);
      }

      const res = interpretarRespuesta(resp);
      if (res.ok) {
        alGuardarExitoso?.(esEdicion ? 'Equipo actualizado con éxito.' : 'Equipo registrado con éxito.', res.datos);
        alCerrar();
        return;
      }

      if (res.errores && Object.keys(res.errores).length > 0) {
        setErrores(res.errores);
        enfocarPrimerError(res.errores);
        return;
      }

      setErrorGeneral(res.errorGeneral || 'No se pudo guardar el equipo.');
    }
  });

  useEffect(() => {
    if (abierto) {
      form.setValores({
        codigoPatrimonial: equipoAEditar?.codigoPatrimonial || '',
        nombre: equipoAEditar?.nombre || '',
        categoria: equipoAEditar?.categoria || '',
        marca: equipoAEditar?.marca || '',
        ubicacion: equipoAEditar?.ubicacion || '',
        estadoInicial: equipoAEditar?.estado || ESTADOS_EQUIPO.DISPONIBLE
      });
      form.setErrores({});
      form.setErrorGeneral('');
    }
  }, [abierto, equipoAEditar]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo={esEdicion ? 'Editar equipo' : 'Nuevo equipo'}
      subtitulo={esEdicion ? `Actualice los datos del equipo ${equipoAEditar.codigoPatrimonial}` : 'Ingrese los datos para dar de alta un equipo en inventario'}
      textoPrimario={esEdicion ? 'Guardar cambios' : 'Registrar equipo'}
      textoSecundario="Cancelar"
      variantePrimaria="primary"
      enProceso={form.enProceso}
      alConfirmar={form.manejarEnvio}
      tamano="md"
    >
      <form onSubmit={form.manejarEnvio} className="space-y-4" noValidate>
        {form.errorGeneral && (
          <AlertMessage variante="error" rol="alert" mensaje={form.errorGeneral} />
        )}

        <CampoFormulario
          id="codigoPatrimonial"
          etiqueta="Código patrimonial"
          error={form.errores.codigoPatrimonial}
          obligatorio={!esEdicion}
          ayuda={esEdicion ? 'El código patrimonial no puede modificarse una vez registrado.' : 'Identificador único patrimonial (ej. EQ-LAP-099).'}
        >
          <TextInput
            ref={form.registrarRef('codigoPatrimonial')}
            id="codigoPatrimonial"
            nombre="codigoPatrimonial"
            placeholder="EQ-LAP-001"
            valor={form.valores.codigoPatrimonial}
            alCambiar={(e) => form.cambiarValor('codigoPatrimonial', e.target.value.toUpperCase())}
            alSalir={() => form.manejarBlur('codigoPatrimonial')}
            error={form.errores.codigoPatrimonial}
            soloLectura={esEdicion || form.enProceso}
          />
        </CampoFormulario>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoFormulario
            id="nombre"
            etiqueta="Nombre del equipo"
            error={form.errores.nombre}
            obligatorio
          >
            <TextInput
              ref={form.registrarRef('nombre')}
              id="nombre"
              nombre="nombre"
              placeholder="ThinkPad T14 Gen 4"
              valor={form.valores.nombre}
              alCambiar={(e) => form.cambiarValor('nombre', e.target.value)}
              alSalir={() => form.manejarBlur('nombre')}
              error={form.errores.nombre}
              soloLectura={form.enProceso}
            />
          </CampoFormulario>

          <CampoFormulario
            id="categoria"
            etiqueta="Categoría"
            error={form.errores.categoria}
            obligatorio
          >
            <SelectInput
              ref={form.registrarRef('categoria')}
              id="categoria"
              nombre="categoria"
              placeholder="Seleccionar categoría"
              opciones={OPCIONES_CATEGORIA}
              valor={form.valores.categoria}
              alCambiar={(e) => form.cambiarValor('categoria', e.target.value)}
              alSalir={() => form.manejarBlur('categoria')}
              error={form.errores.categoria}
              soloLectura={form.enProceso}
            />
          </CampoFormulario>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoFormulario
            id="marca"
            etiqueta="Marca"
            error={form.errores.marca}
            obligatorio
          >
            <TextInput
              ref={form.registrarRef('marca')}
              id="marca"
              nombre="marca"
              placeholder="Lenovo / Dell / HP"
              valor={form.valores.marca}
              alCambiar={(e) => form.cambiarValor('marca', e.target.value)}
              alSalir={() => form.manejarBlur('marca')}
              error={form.errores.marca}
              soloLectura={form.enProceso}
            />
          </CampoFormulario>

          <CampoFormulario
            id="ubicacion"
            etiqueta="Ubicación física"
            error={form.errores.ubicacion}
            obligatorio
          >
            <TextInput
              ref={form.registrarRef('ubicacion')}
              id="ubicacion"
              nombre="ubicacion"
              placeholder="Almacén Central TI - Estante B"
              valor={form.valores.ubicacion}
              alCambiar={(e) => form.cambiarValor('ubicacion', e.target.value)}
              alSalir={() => form.manejarBlur('ubicacion')}
              error={form.errores.ubicacion}
              soloLectura={form.enProceso}
            />
          </CampoFormulario>
        </div>

        {!esEdicion && (
          <CampoFormulario
            id="estadoInicial"
            etiqueta="Estado inicial de alta"
            error={form.errores.estadoInicial}
          >
            <SelectInput
              ref={form.registrarRef('estadoInicial')}
              id="estadoInicial"
              nombre="estadoInicial"
              placeholder="Estado inicial"
              opciones={OPCIONES_ESTADO_INICIAL}
              valor={form.valores.estadoInicial}
              alCambiar={(e) => form.cambiarValor('estadoInicial', e.target.value)}
              error={form.errores.estadoInicial}
              soloLectura={form.enProceso}
            />
          </CampoFormulario>
        )}
      </form>
    </ModalDialog>
  );
}
