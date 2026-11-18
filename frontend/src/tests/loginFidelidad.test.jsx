import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Ingresar from '../pages/Ingresar';
import InterruptorSwitch from '../components/formulario/InterruptorSwitch';

const mockIniciarSesion = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    iniciarSesion: mockIniciarSesion,
    usuario: null,
    autenticado: false
  })
}));

describe('Pruebas de fidelidad visual y funcional del Login (TechAsset)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('1. Al cargar el login NO hay ningún mensaje de error visible ni de ayuda permanente', () => {
    render(
      <MemoryRouter>
        <Ingresar />
      </MemoryRouter>
    );

    // No debe existir ningún banner ni mensaje con role="alert" al montar
    const alertas = screen.queryAllByRole('alert');
    expect(alertas).toHaveLength(0);

    // Los mensajes de validación no deben existir antes de interactuar
    expect(screen.queryByText(/ingrese su correo corporativo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ingrese su contraseña para continuar/i)).not.toBeInTheDocument();
  });

  it('2. Correo inválido tras blur muestra mensaje con role="alert", token error-texto y borde de error', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Ingresar />
      </MemoryRouter>
    );

    const inputCorreo = screen.getByLabelText(/correo corporativo/i);
    await user.type(inputCorreo, 'invalido@externo.com');
    await user.tab(); // Dispara blur

    // Mensaje de error visible con role="alert"
    const alertaError = await screen.findByRole('alert');
    expect(alertaError).toBeInTheDocument();
    expect(alertaError).toHaveTextContent(/ingrese un correo corporativo válido/i);
    expect(alertaError).toHaveClass('text-error-texto');

    // Input con borde de error de 2px
    expect(inputCorreo).toHaveClass('border-error-borde');
    expect(inputCorreo).toHaveAttribute('aria-invalid', 'true');
  });

  it('3. Correo corporativo válido tras blur aplica borde exito-borde e ícono de confirmación', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Ingresar />
      </MemoryRouter>
    );

    const inputCorreo = screen.getByLabelText(/correo corporativo/i);
    await user.type(inputCorreo, 'admin@innovatech.com');
    await user.tab(); // Dispara blur

    // No hay alertas de error
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // Input adquiere borde verde semántico
    expect(inputCorreo).toHaveClass('border-exito-borde');
    expect(inputCorreo).toHaveAttribute('aria-invalid', 'false');
  });

  it('4. Credenciales incorrectas muestra banner con tokens de error (bg-error-fondo, text-error-banner-texto, border-error-borde)', async () => {
    mockIniciarSesion.mockResolvedValueOnce({
      ok: false,
      errores: {},
      errorGeneral: 'Credenciales incorrectas.',
      accion: 'reautenticar'
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Ingresar />
      </MemoryRouter>
    );

    const inputCorreo = screen.getByLabelText(/correo corporativo/i);
    const inputContrasena = screen.getByPlaceholderText(/ingresar contraseña/i);
    const botonSubmit = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(inputCorreo, 'admin@innovatech.com');
    await user.type(inputContrasena, 'ContrasenaErronea123!');
    await user.click(botonSubmit);

    // Esperar a que el banner aparezca
    const banner = await screen.findByRole('alert');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent('Credenciales incorrectas.');

    // Validar clases semánticas de tokens
    expect(banner).toHaveClass('bg-error-fondo');
    expect(banner).toHaveClass('text-error-banner-texto');
    expect(banner).toHaveClass('border-error-borde');
  });

  it('5. El interruptor InterruptorSwitch se activa con clic y con Space, y persiste el correo recordado', async () => {
    const user = userEvent.setup();
    let activo = false;
    const alCambiar = vi.fn((val) => { activo = val; });

    const { rerender } = render(
      <InterruptorSwitch
        id="test-switch"
        etiqueta="Recordar correo en este equipo"
        activo={activo}
        alCambiar={alCambiar}
      />
    );

    const switchEl = screen.getByRole('switch', { name: /recordar correo en este equipo/i });
    expect(switchEl).not.toBeChecked();

    // Activar con clic
    await user.click(switchEl);
    expect(alCambiar).toHaveBeenCalledWith(true);

    // Rerender con estado actualizado
    rerender(
      <InterruptorSwitch
        id="test-switch"
        etiqueta="Recordar correo en este equipo"
        activo={true}
        alCambiar={alCambiar}
      />
    );
    expect(switchEl).toBeChecked();

    // Activar/desactivar con tecla Space
    switchEl.focus();
    expect(switchEl).toHaveFocus();
    await user.keyboard(' ');
    expect(alCambiar).toHaveBeenCalledWith(false);
  });

  it('6. La línea "¿Olvidaste tu contraseña?..." no tiene href ni es enfocable con Tab', () => {
    render(
      <MemoryRouter>
        <Ingresar />
      </MemoryRouter>
    );

    const textoOlvido = screen.getByText(/¿olvidaste tu contraseña\? pruébalo aquí/i);
    expect(textoOlvido).toBeInTheDocument();

    const parrafo = textoOlvido.closest('p');
    expect(parrafo).toBeInTheDocument();
    expect(parrafo.tagName).toBe('P');
    expect(parrafo).not.toHaveAttribute('href');
    expect(parrafo).not.toHaveAttribute('tabindex');
    expect(parrafo).not.toHaveAttribute('tabIndex');
  });
});
