import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IconButton from '../components/ui/IconButton';

describe('Componente IconButton', () => {
  it('renderiza con aria-label obligatorio y tamaño de 44px (touch target WCAG AA)', () => {
    render(<IconButton variante="editar" etiqueta="Editar equipo" />);
    const boton = screen.getByRole('button', { name: /editar equipo/i });
    expect(boton).toBeInTheDocument();
    expect(boton).toHaveClass('h-11');
    expect(boton).toHaveClass('w-11');
    expect(boton).toHaveClass('rounded-lg');
  });

  it('aplica las clases semánticas de la variante cambiar-estado', () => {
    render(<IconButton variante="cambiar-estado" etiqueta="Cambiar estado del equipo" />);
    const boton = screen.getByRole('button', { name: /cambiar estado/i });
    expect(boton).toHaveClass('bg-ib-cambiar-fondo');
    expect(boton).toHaveClass('border-ib-cambiar-borde');
    expect(boton).toHaveClass('text-ib-cambiar-texto');
  });

  it('bloquea la ejecución cuando disabled es true', () => {
    const handleClick = vi.fn();
    render(<IconButton variante="deshabilitar" etiqueta="Deshabilitar" disabled onClick={handleClick} />);
    const boton = screen.getByRole('button', { name: /deshabilitar/i });
    expect(boton).toBeDisabled();
    fireEvent.click(boton);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
