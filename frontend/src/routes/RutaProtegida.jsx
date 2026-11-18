import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RUTAS } from '../constants/rutas';
import Cargando from '../components/ui/Cargando';
import EstadoVacio from '../components/ui/EstadoVacio';

export default function RutaProtegida({ children, permiso }) {
  const { autenticado, cargandoSesion, puede } = useAuth();
  const location = useLocation();

  if (cargandoSesion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fondo">
        <Cargando mensaje="Validando credenciales de acceso…" />
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to={RUTAS.INGRESAR} state={{ from: location }} replace />;
  }

  if (permiso && !puede(permiso)) {
    return (
      <div className="py-12">
        <EstadoVacio
          icono="Ban"
          titulo="Acceso Restringido"
          descripcion="Su rol de usuario no cuenta con las autorizaciones requeridas para visualizar este módulo corporativo."
          accionTexto="Volver al Panel"
          alAccionar={() => window.history.back()}
        />
      </div>
    );
  }

  return children;
}
