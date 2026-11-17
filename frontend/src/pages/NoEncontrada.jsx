import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';
import { RUTAS } from '../constants/rutas';

export default function NoEncontrada() {
  return (
    <div className="min-h-screen bg-fondo flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-superficie-2 flex items-center justify-center text-primario mb-4 shadow-sm border border-borde">
        <Icono nombre="AlertTriangle" className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-texto mb-2">404</h1>
      <h2 className="text-lg font-semibold text-texto mb-2">Página no encontrada</h2>
      <p className="text-sm text-texto-suave max-w-sm mb-6">
        La ruta solicitada no existe o no se encuentra disponible en la plataforma TechAsset.
      </p>
      <Link to={RUTAS.PANEL}>
        <Button variante="primary" icono="ArrowLeft">
          Volver al Panel Principal
        </Button>
      </Link>
    </div>
  );
}
