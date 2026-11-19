// Skeletons con la forma exacta del contenido del Panel · Nielsen 1 · WCAG 2.2 AA
export default function PanelSkeleton() {
  return (
    <div className="space-y-5 animate-pulse" aria-busy="true" aria-label="Cargando contenido del panel">
      {/* Skeleton Zona Atención */}
      <div className="p-4 rounded-tarjeta border border-borde bg-superficie space-y-3">
        <div className="h-5 bg-superficie-2 rounded w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-superficie-2/70 rounded-control" />
          ))}
        </div>
      </div>

      {/* Skeleton 6 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 rounded-tarjeta border border-borde bg-superficie space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-superficie-2 rounded w-32" />
              <div className="w-9 h-9 rounded-md bg-superficie-2" />
            </div>
            <div className="h-8 bg-superficie-2 rounded w-20" />
            <div className="h-3 bg-superficie-2 rounded w-28 pt-2" />
          </div>
        ))}
      </div>

      {/* Skeleton Gráfico y Demanda */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-tarjeta border border-borde bg-superficie space-y-4 h-64">
          <div className="h-5 bg-superficie-2 rounded w-40" />
          <div className="flex items-center justify-around h-40">
            <div className="w-32 h-32 rounded-full bg-superficie-2" />
            <div className="space-y-2 w-36">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-3 bg-superficie-2 rounded w-full" />
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-tarjeta border border-borde bg-superficie space-y-4 h-64">
          <div className="h-5 bg-superficie-2 rounded w-44" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((k) => (
              <div key={k} className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-3 bg-superficie-2 rounded w-32" />
                  <div className="h-3 bg-superficie-2 rounded w-12" />
                </div>
                <div className="h-2 bg-superficie-2 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton Préstamos Activos */}
      <div className="p-5 rounded-tarjeta border border-borde bg-superficie space-y-3">
        <div className="h-5 bg-superficie-2 rounded w-48" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3].map((m) => (
            <div key={m} className="flex justify-between items-center py-2 border-b border-borde/40">
              <div className="space-y-1.5">
                <div className="h-4 bg-superficie-2 rounded w-40" />
                <div className="h-3 bg-superficie-2 rounded w-56" />
              </div>
              <div className="h-6 bg-superficie-2 rounded-full w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
