import React from 'react';
import LogoTechAsset from './LogoTechAsset';
import Button from './Button';
import Icono from './Icono';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error de renderizado:', error, errorInfo);
  }

  handleReintentar = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleVolverInicio = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <main
          role="main"
          className="min-h-screen bg-fondo text-texto flex items-center justify-center p-4 sm:p-6"
        >
          <div className="w-full max-w-md bg-superficie border border-borde rounded-tarjeta p-6 sm:p-8 shadow-sm text-center space-y-4">
            <div className="flex justify-center">
              <LogoTechAsset tamano="tarjeta" />
            </div>

            <div className="w-12 h-12 rounded-full bg-error-fondo border border-error-borde flex items-center justify-center mx-auto text-error-texto">
              <Icono nombre="AlertTriangle" className="w-6 h-6" aria-hidden="true" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-texto tracking-tight m-0">
              Ocurrió un problema inesperado
            </h1>

            <p className="text-sm text-texto-suave leading-relaxed m-0">
              No te preocupes, tus datos no se han perdido. Puedes reintentar la acción o volver a la página de inicio para continuar navegando.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row gap-2.5 justify-center">
              <Button
                tipo="button"
                variante="secundario"
                alHacerClic={this.handleVolverInicio}
                clase="w-full sm:w-auto"
              >
                Volver al inicio
              </Button>
              <Button
                tipo="button"
                variante="primario"
                alHacerClic={this.handleReintentar}
                clase="w-full sm:w-auto"
              >
                Reintentar
              </Button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
