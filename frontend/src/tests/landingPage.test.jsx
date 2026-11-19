import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';

let mockAutenticado = false;
let mockCargando = false;

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    autenticado: mockAutenticado,
    cargandoSesion: mockCargando,
    usuario: mockAutenticado ? { id: 'usr-1', nombreCompleto: 'Carlos Mendoza Ramos', rol: 'Administrador' } : null,
    puede: () => true
  })
}));

describe('Pruebas de la Landing Page pública (TechAsset)', () => {
  beforeEach(() => {
    mockAutenticado = false;
    mockCargando = false;
  });

  it('1. Renderiza la Landing Page cuando el usuario no está autenticado', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/panel" element={<div>Dashboard Panel</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Hero
    expect(screen.getByRole('heading', { level: 1, name: /gestión y préstamo de equipos tecnológicos/i })).toBeInTheDocument();
    expect(screen.getAllByText(/innovatech solutions s\.a\.c\./i).length).toBeGreaterThanOrEqual(1);

    // Secciones con sus IDs de ancla
    expect(document.getElementById('que-es')).toBeInTheDocument();
    expect(document.getElementById('como-funciona')).toBeInTheDocument();
    expect(document.getElementById('equipos')).toBeInTheDocument();
    expect(document.getElementById('roles')).toBeInTheDocument();
    expect(document.getElementById('reglas')).toBeInTheDocument();
  });

  it('2. Todos los botones de iniciar sesión llevan a /login', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Landing />
      </MemoryRouter>
    );

    const enlacesLogin = screen.getAllByRole('link', { name: /iniciar sesión/i });
    expect(enlacesLogin.length).toBeGreaterThanOrEqual(2);
    enlacesLogin.forEach((enlace) => {
      expect(enlace).toHaveAttribute('href', '/login');
    });
  });

  it('3. NO existe ningún botón ni enlace de registrarse o crear cuenta', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Landing />
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: /registrar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /crear cuenta/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /registrar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /crear cuenta/i })).not.toBeInTheDocument();
  });

  it('4. Si el usuario ya tiene sesión activa, redirige automáticamente a /panel', () => {
    mockAutenticado = true;

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/panel" element={<div>Pantalla de Dashboard / Panel</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Pantalla de Dashboard / Panel')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: /gestión y préstamo de equipos tecnológicos/i })).not.toBeInTheDocument();
  });
});
