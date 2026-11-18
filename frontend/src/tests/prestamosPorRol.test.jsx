import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EncabezadoPanel from '../components/panel/EncabezadoPanel';

describe('Acciones de Préstamo por Rol en Panel (Bloque 4 / RF-09)', () => {
  it('Responsable TI ve el botón "+ Registrar préstamo" y ejecuta su acción correspondiente', () => {
    const handleRegistrar = vi.fn();
    const handleSolicitar = vi.fn();

    render(
      <EncabezadoPanel
        puedeRegistrarDirecto={true}
        puedeSolicitar={false}
        alRegistrarPrestamo={handleRegistrar}
        alSolicitarPrestamo={handleSolicitar}
      />
    );

    const btnRegistrar = screen.getByRole('button', { name: /registrar préstamo/i });
    expect(btnRegistrar).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /solicitar préstamo/i })).toBeNull();

    fireEvent.click(btnRegistrar);
    expect(handleRegistrar).toHaveBeenCalledTimes(1);
    expect(handleSolicitar).not.toHaveBeenCalled();
  });

  it('Colaborador ve el botón "+ Solicitar préstamo" y ejecuta su acción correspondiente', () => {
    const handleRegistrar = vi.fn();
    const handleSolicitar = vi.fn();

    render(
      <EncabezadoPanel
        puedeRegistrarDirecto={false}
        puedeSolicitar={true}
        alRegistrarPrestamo={handleRegistrar}
        alSolicitarPrestamo={handleSolicitar}
      />
    );

    const btnSolicitar = screen.getByRole('button', { name: /solicitar préstamo/i });
    expect(btnSolicitar).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /registrar préstamo/i })).toBeNull();

    fireEvent.click(btnSolicitar);
    expect(handleSolicitar).toHaveBeenCalledTimes(1);
    expect(handleRegistrar).not.toHaveBeenCalled();
  });

  it('Administrador NO ve ningún botón de préstamo en el panel (rol supervisor y de auditoría)', () => {
    render(
      <EncabezadoPanel
        puedeRegistrarDirecto={false}
        puedeSolicitar={false}
        alRegistrarPrestamo={() => {}}
        alSolicitarPrestamo={() => {}}
      />
    );

    expect(screen.queryByRole('button', { name: /registrar préstamo/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /solicitar préstamo/i })).toBeNull();
  });
});
