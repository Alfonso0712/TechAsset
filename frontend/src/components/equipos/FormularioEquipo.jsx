import { useEffect } from 'react';
import ModalDialog from '../ui/ModalDialog';
import CampoFormulario from '../formulario/CampoFormulario';
import TextInput from '../formulario/TextInput';
import SelectInput from '../formulario/SelectInput';
import AlertMessage from '../ui/AlertMessage';
import { useFormulario } from '../../hooks/useFormulario';
import { validarEquipo } from '../../validation/reglasEquipo';
import { equipoService } from '../../services/equipoService';
import { interpretarRespuestaError } from '../../validation/interpretarRespuesta';
import { CATEGORIAS_EQUIPO, ESTADOS_EQUIPO } from '../../constants/estados';

const OPCIONES_CATEGORIA = Object.entries(CATEGORIAS_EQUIPO).map(([_, valor]) => ({
  valor,
  etiqueta: valor
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
      codigoPatrimonial: equipoAEditar?.codigoPatrimonial || '',
      nombre: equipoAEditar?.nombre || '',
      categoria: equipoAEditar?.categoria || '',
      marca: equipoAEditar?.marca || '',
      ubicacion: equipoAEditar?.ubicacion || '',
      estadoInicial: equipoAEditar?.estado || ESTADOS_EQUIPO.DISPONIBLE
    },
    validar: (vals) => validarEquipo(vals, esEdicion),
    onSubmit: async (datos) => {
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
        codigoPatrimonial: equipoAEditar?.codigoPatrimonial || '',
        nombre: equipoAEditar?.nombre || '',
        categoria: equipoAEditar?.categoria || '',
        marca: equipoAEditar?.marca || '',
        ubicacion: equipoAEditar?.ubicacion || '',
        estadoInicial: equipoAEditar?.estado || ESTADOS_EQUIPO.DISPONIBLE
      });
    }
  }, [abierto, equipoAEditar, reiniciar]);

  return (
    <ModalDialog
      abierto={abierto}
      alCerrar={alCerrar}
      titulo={esEdicion ? 'Editar Equipo Tecnológico' : 'Registrar Nuevo Equipo'}
      subtitulo={esEdicion ? `Actualice los datos del equipo ${equipoAEditar.codigoPatrimonial}` : 'Ingrese los datos para dar de alta un equipo en inventario'}
      textoPrimario={esEdicion ? 'Guardar Cambios' : 'Registrar Equipo'}
      textoSecundario="Cancelar"
      variantePrimaria="primary"
      enProceso={enviando}
      alConfirmar={manejarEnvio}
      tamano="md"
    >
      <form onSubmit={manejarEnvio} className="space-y-4" noValidate>
        {mensajeGeneral && (
          <AlertMessage variante="peligro" mensaje={mensajeGeneral} />
        )}

        <CampoFormulario
          id="codigoPatrimonial"
          etiqueta="Código Patrimonial"
          error={errores.codigoPatrimonial}
          obligatorio={!esEdicion}
          ayuda={esEdicion ? 'El código patrimonial no puede modificarse una vez registrado.' : 'Identificador único patrimonial (ej. INNO-LAP-099).'}
        >
          <TextInput
            id="codigoPatrimonial"
            name="codigoPatrimonial"
            placeholder="INNO-LAP-001"
            value={valores.codigoPatrimonial}
            onChange={(e) => cambiarValor('codigoPatrimonial', e.target.value.toUpperCase())}
            onBlur={() => marcarTocado('codigoPatrimonial')}
            error={Boolean(errores.codigoPatrimonial)}
            disabled={esEdicion || enviando}
          />
        </CampoFormulario>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoFormulario
            id="nombre"
            etiqueta="Nombre del Equipo"
            error={errores.nombre}
            obligatorio
          >
            <TextInput
              id="nombre"
              name="nombre"
              placeholder="ThinkPad T14 Gen 4"
              value={valores.nombre}
              onChange={(e) => cambiarValor('nombre', e.target.value)}
              onBlur={() => marcarTocado('nombre')}
              error={Boolean(errores.nombre)}
              disabled={enviando}
            />
          </CampoFormulario>

          <CampoFormulario
            id="categoria"
            etiqueta="Categoría"
            error={errores.categoria}
            obligatorio
          >
            <SelectInput
              id="categoria"
              name="categoria"
              placeholder="Seleccionar categoría"
              opciones={OPCIONES_CATEGORIA}
              value={valores.categoria}
              onChange={(e) => cambiarValor('categoria', e.target.value)}
              onBlur={() => marcarTocado('categoria')}
              error={Boolean(errores.categoria)}
              disabled={enviando}
            />
          </CampoFormulario>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoFormulario
            id="marca"
            etiqueta="Marca"
            error={errores.marca}
            obligatorio
          >
            <TextInput
              id="marca"
              name="marca"
              placeholder="Lenovo / Dell / HP"
              value={valores.marca}
              onChange={(e) => cambiarValor('marca', e.target.value)}
              onBlur={() => marcarTocado('marca')}
              error={Boolean(errores.marca)}
              disabled={enviando}
            />
          </CampoFormulario>

          <CampoFormulario
            id="ubicacion"
            etiqueta="Ubicación Física"
            error={errores.ubicacion}
            obligatorio
          >
            <TextInput
              id="ubicacion"
              name="ubicacion"
              placeholder="Almacén Central TI - Estante B"
              value={valores.ubicacion}
              onChange={(e) => cambiarValor('ubicacion', e.target.value)}
              onBlur={() => marcarTocado('ubicacion')}
              error={Boolean(errores.ubicacion)}
              disabled={enviando}
            />
          </CampoFormulario>
        </div>

        {!esEdicion && (
          <CampoFormulario
            id="estadoInicial"
            etiqueta="Estado Inicial de Alta"
            error={errores.estadoInicial}
          >
            <SelectInput
              id="estadoInicial"
              name="estadoInicial"
              placeholder="Estado inicial"
              opciones={OPCIONES_ESTADO_INICIAL}
              value={valores.estadoInicial}
              onChange={(e) => cambiarValor('estadoInicial', e.target.value)}
              disabled={enviando}
            />
          </CampoFormulario>
        )}
      </form>
    </ModalDialog>
  );
}
