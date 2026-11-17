import { useEffect } from 'react';
import AlertMessage from './AlertMessage';

export default function Toast({ mensaje, variante = 'exito', alCerrar, duracionMs = 4000 }) {
  useEffect(() => {
    if (!alCerrar || duracionMs <= 0) return undefined;
    const timer = setTimeout(alCerrar, duracionMs);
    return () => clearTimeout(timer);
  }, [alCerrar, duracionMs]);

  if (!mensaje) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm shadow-lg animate-in fade-in slide-in-from-bottom-2">
      <AlertMessage
        variante={variante}
        mensaje={mensaje}
        modoToast
        alCerrar={alCerrar}
      />
    </div>
  );
}
