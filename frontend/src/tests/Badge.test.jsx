import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../components/ui/Badge';
import { ESTADOS_EQUIPO, ESTADOS_PRESTAMO } from '../constants/estados';

describe('Componente Badge', () => {
  it('renderiza el estado como texto', () => {
    render(<Badge estado={ESTADOS_EQUIPO.DISPONIBLE} />);
    expect(screen.getByText('Disponible')).toBeInTheDocument();
  });

  it('aplica estilos de éxito para estado Disponible', () => {
    const { container } = render(<Badge estado={ESTADOS_EQUIPO.DISPONIBLE} />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-disponible-fondo');
    expect(badge).toHaveClass('text-disponible-texto');
  });

  it('aplica estilos de información para estado Prestamo Activo', () => {
    const { container } = render(<Badge estado={ESTADOS_PRESTAMO.ACTIVO} />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-prestado-fondo');
    expect(badge).toHaveClass('text-prestado-texto');
  });

  it('aplica estilos de peligro para estado Baja', () => {
    const { container } = render(<Badge estado={ESTADOS_EQUIPO.BAJA} />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-baja-fondo');
    expect(badge).toHaveClass('text-baja-texto');
  });

  it('aplica variante discreta cuando la prop discreto es true', () => {
    const { container } = render(<Badge estado="Personalizado" discreto />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-superficie-2');
  });
});
