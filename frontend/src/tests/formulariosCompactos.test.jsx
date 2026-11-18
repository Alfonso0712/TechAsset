import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CampoFormulario, { CLASES_FORMULARIO, construirDescribedBy } from '../components/formulario/CampoFormulario';
import TextInput from '../components/formulario/TextInput';

describe('Formularios Compactos y CampoFormulario (Bloque 1)', () => {
  it('a) sin error ni ayuda: no renderiza ningún nodo inferior ni espacio reservado bajo el input', () => {
    const { container } = render(
      <CampoFormulario id="campo-test" etiqueta="Código patrimonial">
        <input id="campo-test" defaultValue="EQ-001" />
      </CampoFormulario>
    );

    // El input está presente
    expect(screen.getByLabelText(/código patrimonial/i)).toBeInTheDocument();

    // No existe contenedor con la clase mensajeInferior (mt-1.5) ni nodos de alerta
    expect(container.querySelector('.mt-1\\.5')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(container.querySelector('span[id$="-ayuda"]')).toBeNull();
  });

  it('b) con error: renderiza un único mensaje con role="alert" y aria-describedby apuntando al input', () => {
    const errorTexto = 'El código patrimonial es obligatorio.';
    render(
      <CampoFormulario id="campo-codigo" etiqueta="Código patrimonial" error={errorTexto}>
        <input
          id="campo-codigo"
          defaultValue=""
          aria-describedby="campo-codigo-error"
        />
      </CampoFormulario>
    );

    const input = screen.getByLabelText(/código patrimonial/i);
    const mensajeAlerta = screen.getByRole('alert');

    expect(mensajeAlerta).toBeInTheDocument();
    expect(mensajeAlerta).toHaveTextContent(errorTexto);
    expect(mensajeAlerta).toHaveAttribute('id', 'campo-codigo-error');
    expect(input).toHaveAttribute('aria-describedby', 'campo-codigo-error');
    expect(mensajeAlerta).toHaveClass('animacion-aparicion-error');
    expect(mensajeAlerta).toHaveClass('text-error-texto');
  });

  it('c) con ayuda y luego error: la ayuda desaparece y el error toma su lugar sin duplicarse', () => {
    const { rerender } = render(
      <CampoFormulario
        id="campo-correo"
        etiqueta="Correo"
        ayuda="Use su correo corporativo @innovatech.com"
      >
        <input id="campo-correo" defaultValue="" />
      </CampoFormulario>
    );

    expect(screen.getByText('Use su correo corporativo @innovatech.com')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();

    // Rerender con error
    rerender(
      <CampoFormulario
        id="campo-correo"
        etiqueta="Correo"
        ayuda="Use su correo corporativo @innovatech.com"
        error="El correo corporativo es obligatorio."
      >
        <input id="campo-correo" defaultValue="" />
      </CampoFormulario>
    );

    // La ayuda ya NO debe estar renderizada
    expect(screen.queryByText('Use su correo corporativo @innovatech.com')).toBeNull();

    // El error toma su lugar exactamente una vez
    const alertas = screen.getAllByRole('alert');
    expect(alertas).toHaveLength(1);
    expect(alertas[0]).toHaveTextContent('El correo corporativo es obligatorio.');
  });

  it('d) en fila de 2 columnas: utiliza items-start para que el campo hermano no se deforme si uno tiene error', () => {
    const { container } = render(
      <div className={CLASES_FORMULARIO.filaDoble}>
        <CampoFormulario id="col-1" etiqueta="Columna 1" error="Error en campo 1">
          <input id="col-1" defaultValue="" />
        </CampoFormulario>
        <CampoFormulario id="col-2" etiqueta="Columna 2">
          <input id="col-2" defaultValue="Valor ok" />
        </CampoFormulario>
      </div>
    );

    const fila = container.firstElementChild;
    expect(fila).toHaveClass('items-start');
    expect(fila).toHaveClass('grid');
    expect(fila).toHaveClass('sm:grid-cols-2');
    expect(fila).toHaveClass('gap-x-4');
    expect(fila).toHaveClass('gap-y-4');
  });

  it('e) TextInput encapsula CampoFormulario de manera compacta', () => {
    render(
      <TextInput
        id="input-standalone"
        etiqueta="Nombre"
        error="El nombre es obligatorio."
        valor=""
        alCambiar={() => {}}
      />
    );

    const alertas = screen.getAllByRole('alert');
    expect(alertas).toHaveLength(1);
    expect(alertas[0]).toHaveTextContent('El nombre es obligatorio.');
  });

  it('construirDescribedBy genera los IDs semánticos de forma coherente', () => {
    expect(construirDescribedBy('input1', '', '')).toBeUndefined();
    expect(construirDescribedBy('input1', 'ayuda texto', '')).toBe('input1-ayuda');
    expect(construirDescribedBy('input1', 'ayuda texto', 'error texto')).toBe('input1-error');
  });
});
