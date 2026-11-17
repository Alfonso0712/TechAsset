import { useMemo } from 'react';

const COLORES = {
  Disponible: '#10B981', // Emerald-500
  Prestado: '#3B82F6',   // Blue-500
  Mantenimiento: '#F59E0B', // Amber-500
  Baja: '#EF4444'        // Red-500
};

export default function GraficoDonaSVG({ datos = [], total = 0, className = '' }) {
  // Calcular arcos de la dona SVG
  const segmentos = useMemo(() => {
    if (!datos || datos.length === 0 || total === 0) return [];

    let anguloAcumulado = -90; // Empezar arriba (12 en punto)
    const radio = 40;
    const circunferencia = 2 * Math.PI * radio;

    return datos.map((item) => {
      const fraccion = item.cantidad / total;
      const longitudArco = fraccion * circunferencia;
      const desfase = circunferencia - longitudArco;
      const rotacion = anguloAcumulado;
      anguloAcumulado += fraccion * 360;

      return {
        ...item,
        color: COLORES[item.estado] || '#64748B',
        longitudArco,
        desfase,
        rotacion,
        circunferencia,
        radio
      };
    });
  }, [datos, total]);

  if (!datos || datos.length === 0 || total === 0) {
    return (
      <div className={`flex items-center justify-center h-48 text-xs text-texto-suave ${className}`}>
        Sin datos suficientes para graficar
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 ${className}`}>
      {/* SVG Donut */}
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            className="text-superficie-2"
          />
          {segmentos.map((seg) => (
            <circle
              key={seg.estado}
              cx="50"
              cy="50"
              r={seg.radio}
              fill="transparent"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${seg.longitudArco} ${seg.circunferencia - seg.longitudArco}`}
              transform={`rotate(${seg.rotacion + 90} 50 50)`}
              className="transition-all duration-500"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-texto cifra-tabular">{total}</span>
          <span className="text-[0.625rem] uppercase font-semibold text-texto-suave">Equipos</span>
        </div>
      </div>

      {/* Leyenda */}
      <div className="space-y-2 text-xs flex-1 w-full max-w-xs">
        {datos.map((d) => (
          <div key={d.estado} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORES[d.estado] || '#64748B' }}
              />
              <span className="font-medium text-texto">{d.nombre || d.estado}</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-texto">{d.cantidad}</span>
              <span className="text-texto-suave">({d.porcentaje}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
