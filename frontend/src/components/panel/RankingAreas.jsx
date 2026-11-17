export default function RankingAreas({ areas = [] }) {
  if (!areas || areas.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-texto-suave">
        No hay registros de préstamos por área aún.
      </div>
    );
  }

  const maxPrestamos = Math.max(...areas.map(a => a.totalPrestamos), 1);

  return (
    <div className="space-y-3.5">
      {areas.map((a, idx) => {
        const porcentaje = Math.round((a.totalPrestamos / maxPrestamos) * 100);
        return (
          <div key={a.area} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-texto truncate max-w-[200px]">
                {idx + 1}. {a.area}
              </span>
              <span className="font-bold text-primario cifra-tabular">
                {a.totalPrestamos} {a.totalPrestamos === 1 ? 'préstamo' : 'préstamos'}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-superficie-2 overflow-hidden">
              <div
                className="h-full bg-primario rounded-full transition-all duration-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
