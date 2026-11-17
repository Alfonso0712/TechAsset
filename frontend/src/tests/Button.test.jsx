import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/ui/Button';

describe('Componente Button', () => {
  it('renderiza el contenido del botón con variante primaria por defecto', () => {
    render(<Button>Guardar cambios</Button>);
    const boton = screen.getByRole('button', { name: /guardar cambios/i });
    expect(boton).toBeInTheDocument();
    expect(boton).toHaveClass('bg-primario');
  });

  it('aplica las clases correctas para variante peligro / danger', () => {
    render(<Button variante="peligro">Eliminar equipo</Button>);
    const boton = screen.getByRole('button', { name: /eliminar equipo/i });
    expect(boton).toBeInTheDocument();
    expect(boton).toHaveClass('border-[var(--btn-danger-border)]');
  });

  it('ejecuta la función onClick al hacer clic', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Acción</Button>);
    const boton = screen.getByRole('button', { name: /acción/i });
    fireEvent.click(boton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no ejecuta onClick cuando está deshabilitado', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Deshabilitado</Button>);
    const boton = screen.getByRole('button', { name: /deshabilitado/i });
    expect(boton).toBeDisabled();
    fireEvent.click(boton);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('muestra estado de carga y aria-busy cuando enProceso es verdadero', () => {
    const handleClick = vi.fn();
    render(
      <Button enProceso textoProceso="Procesando préstamo..." onClick={handleClick}>
        Confirmar
      </Button>
    );
    const boton = screen.getByRole('button');
    expect(boton).toBeDisabled();
    expect(boton).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Procesando préstamo...')).toBeInTheDocument();
    fireEvent.click(boton);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
