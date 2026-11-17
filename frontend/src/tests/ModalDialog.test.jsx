import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalDialog from '../components/ui/ModalDialog';

describe('Componente ModalDialog (Unificado - Mejora #4)', () => {
  it('no renderiza nada cuando abierto es false', () => {
    const { container } = render(
      <ModalDialog abierto={false} titulo="Test Modal">
        <p>Contenido</p>
      </ModalDialog>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza título, contenido y botones cuando abierto es true', () => {
    render(
      <ModalDialog abierto titulo="Registrar Equipo" subtitulo="Ingrese los datos requeridos">
        <p>Cuerpo del formulario</p>
      </ModalDialog>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Registrar Equipo')).toBeInTheDocument();
    expect(screen.getByText('Ingrese los datos requeridos')).toBeInTheDocument();
    expect(screen.getByText('Cuerpo del formulario')).toBeInTheDocument();
  });

  it('ejecuta alCerrar al hacer clic en el botón de cerrar', () => {
    const handleCerrar = vi.fn();
    render(
      <ModalDialog abierto alCerrar={handleCerrar} titulo="Modal prueba">
        <p>Contenido</p>
      </ModalDialog>
    );

    const botonCerrar = screen.getByLabelText('Cerrar ventana modal');
    fireEvent.click(botonCerrar);
    expect(handleCerrar).toHaveBeenCalledTimes(1);
  });

  it('ejecuta alConfirmar al hacer clic en el botón primario', () => {
    const handleConfirmar = vi.fn();
    render(
      <ModalDialog
        abierto
        titulo="Confirmación"
        textoPrimario="Aceptar"
        alConfirmar={handleConfirmar}
      >
        <p>¿Desea continuar?</p>
      </ModalDialog>
    );

    const botonConfirmar = screen.getByRole('button', { name: /aceptar/i });
    fireEvent.click(botonConfirmar);
    expect(handleConfirmar).toHaveBeenCalledTimes(1);
  });

  it('cierra el diálogo al presionar la tecla Escape', () => {
    const handleCerrar = vi.fn();
    render(
      <ModalDialog abierto alCerrar={handleCerrar} titulo="Escape test">
        <p>Contenido</p>
      </ModalDialog>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleCerrar).toHaveBeenCalledTimes(1);
  });
});
