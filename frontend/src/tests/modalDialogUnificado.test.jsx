import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalDialog from '../components/ui/ModalDialog';

describe('ModalDialog Unificado a Pantalla Completa (Bloque 2)', () => {
  let rootOriginal;

  beforeEach(() => {
    // Simular contenedor #root de la app
    rootOriginal = document.getElementById('root');
    if (!rootOriginal) {
      const root = document.createElement('div');
      root.id = 'root';
      document.body.appendChild(root);
    }
  });

  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('a) renderiza directamente en document.body (portal) y no como hijo de su contenedor padre', () => {
    const contenedorPadre = document.createElement('div');
    contenedorPadre.id = 'padre-local';
    document.body.appendChild(contenedorPadre);

    render(
      <ModalDialog abierto titulo="Modal en Portal">
        <p>Cuerpo del diálogo</p>
      </ModalDialog>,
      { container: contenedorPadre }
    );

    // El diálogo NO debe estar dentro de contenedorPadre
    expect(contenedorPadre.querySelector('[role="dialog"]')).toBeNull();

    // El diálogo ESTÁ montado directamente en document.body
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(document.body.contains(dialog)).toBe(true);

    document.body.removeChild(contenedorPadre);
  });

  it('b) el overlay cubre 100% del viewport con clase z-[100] y fixed inset-0', () => {
    render(
      <ModalDialog abierto titulo="Modal Pantalla Completa">
        <p>Contenido</p>
      </ModalDialog>
    );

    const dialog = screen.getByRole('dialog');
    const overlay = dialog.closest('.fixed.inset-0');

    expect(overlay).not.toBeNull();
    expect(overlay).toHaveClass('z-[100]');
    expect(overlay).toHaveClass('fixed');
    expect(overlay).toHaveClass('inset-0');
    expect(overlay).toHaveClass('bg-slate-900/75');
  });

  it('c) bloquea el scroll del body al abrir y lo restaura al cerrar', () => {
    const { unmount } = render(
      <ModalDialog abierto titulo="Modal Scroll Lock">
        <p>Contenido</p>
      </ModalDialog>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('d) la tecla Escape cierra el modal cuando no hay cambios sin guardar', () => {
    const handleCerrar = vi.fn();
    render(
      <ModalDialog abierto alCerrar={handleCerrar} titulo="Modal Escape">
        <p>Contenido</p>
      </ModalDialog>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleCerrar).toHaveBeenCalledTimes(1);
  });

  it('e) gestiona atributos aria-hidden e inert en #root durante la apertura', () => {
    const root = document.getElementById('root');
    const { unmount } = render(
      <ModalDialog abierto titulo="Modal Accesibilidad">
        <p>Contenido</p>
      </ModalDialog>
    );

    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('inert');

    unmount();
    expect(root).not.toHaveAttribute('aria-hidden');
    expect(root).not.toHaveAttribute('inert');
  });

  it('f) el botón de fondo (backdrop) descarta el modal al hacer clic afuera', () => {
    const handleCerrar = vi.fn();
    render(
      <ModalDialog abierto alCerrar={handleCerrar} titulo="Modal Fondo">
        <p>Contenido</p>
      </ModalDialog>
    );

    const backdropBtn = screen.getByLabelText(/cerrar modal al hacer clic afuera/i);
    fireEvent.click(backdropBtn);
    expect(handleCerrar).toHaveBeenCalledTimes(1);
  });
});
