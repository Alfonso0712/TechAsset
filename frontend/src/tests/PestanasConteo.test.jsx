import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PestanasConteo from '../components/ui/PestanasConteo';

describe('PestanasConteo · Componente reutilizable de pestañas con contador', () => {
  const opcionesEjemplo = [
    { valor: '', etiqueta: 'Todos', cantidad: 15 },
    { valor: 'Disponible', etiqueta: 'Disponibles', cantidad: 8 },
    { valor: 'Prestado', etiqueta: 'Prestados', cantidad: 4 },
    { valor: 'Mantenimiento', etiqueta: 'Mantenimiento', cantidad: 3 }
  ];

  it('renderiza la lista de pestañas con sus etiquetas y conteos numéricos', () => {
    render(
      <PestanasConteo
        opciones={opcionesEjemplo}
        seleccionado=""
        alCambiar={() => {}}
      />
    );

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Disponibles')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('marca correctamente aria-selected y clases activas en la opción seleccionada', () => {
    render(
      <PestanasConteo
        opciones={opcionesEjemplo}
        seleccionado="Disponible"
        alCambiar={() => {}}
      />
    );

    const tabDisponible = screen.getByRole('tab', { name: /Disponibles/i });
    expect(tabDisponible).toHaveAttribute('aria-selected', 'true');
    expect(tabDisponible.className).toContain('bg-primario');

    const tabTodos = screen.getByRole('tab', { name: /Todos/i });
    expect(tabTodos).toHaveAttribute('aria-selected', 'false');
  });

  it('ejecuta alCambiar con el valor seleccionado al hacer clic', async () => {
    const user = userEvent.setup();
    const handleCambiar = vi.fn();

    render(
      <PestanasConteo
        opciones={opcionesEjemplo}
        seleccionado=""
        alCambiar={handleCambiar}
      />
    );

    const tabPrestados = screen.getByRole('tab', { name: /Prestados/i });
    await user.click(tabPrestados);

    expect(handleCambiar).toHaveBeenCalledTimes(1);
    expect(handleCambiar).toHaveBeenCalledWith('Prestado');
  });

  it('aplica badges personalizados cuando se suministra claseBadge', () => {
    const opcionesConBadge = [
      {
        valor: 'Pendiente',
        etiqueta: 'Pendientes',
        cantidad: 5,
        claseBadge: (activo, cant) => (cant > 0 ? 'bg-advertencia-fondo text-advertencia-texto' : '')
      }
    ];

    render(
      <PestanasConteo
        opciones={opcionesConBadge}
        seleccionado=""
        alCambiar={() => {}}
      />
    );

    const contador = screen.getByText('5');
    expect(contador.className).toContain('bg-advertencia-fondo');
  });
});
