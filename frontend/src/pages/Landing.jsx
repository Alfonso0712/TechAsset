import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RUTAS } from '../constants/rutas';
import Cargando from '../components/ui/Cargando';
import BarraSuperiorLanding from '../features/landing/BarraSuperiorLanding';
import SeccionHero from '../features/landing/SeccionHero';
import SeccionQueEs from '../features/landing/SeccionQueEs';
import SeccionComoFunciona from '../features/landing/SeccionComoFunciona';
import SeccionEquipos from '../features/landing/SeccionEquipos';
import SeccionRoles from '../features/landing/SeccionRoles';
import SeccionReglas from '../features/landing/SeccionReglas';
import SeccionCierre from '../features/landing/SeccionCierre';
import PiePaginaLanding from '../features/landing/PiePaginaLanding';

export default function Landing() {
  const { autenticado, cargandoSesion } = useAuth();

  if (cargandoSesion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fondo">
        <Cargando mensaje="Cargando TechAsset…" />
      </div>
    );
  }

  if (autenticado) {
    return <Navigate to={RUTAS.PANEL} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-fondo text-texto overflow-x-hidden selection:bg-primario-suave selection:text-primario">
      <BarraSuperiorLanding />
      <main id="contenido-principal" className="flex-1">
        <SeccionHero />
        <SeccionQueEs />
        <SeccionComoFunciona />
        <SeccionEquipos />
        <SeccionRoles />
        <SeccionReglas />
        <SeccionCierre />
      </main>
      <PiePaginaLanding />
    </div>
  );
}
