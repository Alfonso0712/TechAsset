import Icono from '../../components/ui/Icono';

const PUNTOS_ANTES = [
  'Información dispersa y duplicada en hojas de cálculo y chats informales.',
  'Sin control de préstamos ni seguimiento a fechas estimadas de devolución.',
  'Ubicación física de los equipos desconocida o desactualizada.',
  'Procesos lentos y manuales de entrega, recepción y verificación.'
];

const PUNTOS_AHORA = [
  'Inventario único, consolidado y actualizado en tiempo real.',
  'Préstamos formalmente registrados con responsable de entrega asignado.',
  'Ubicación física y estado operativo visibles con un solo clic.',
  'Historial inmutable de trazabilidad y reportes para la toma de decisiones.'
];

export default function SeccionQueEs() {
  return (
    <section
      id="que-es"
      className="scroll-mt-20 py-16 sm:py-20 bg-fondo text-texto border-b border-borde/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la sección */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold text-primario tracking-wider uppercase mb-2 block">
            Centralización y control
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-texto tracking-tight mb-4">
            ¿Qué es TechAsset?
          </h2>
          <p className="text-base sm:text-lg text-texto-suave leading-relaxed font-normal m-0">
            TechAsset es la plataforma corporativa oficial diseñada para reemplazar las hojas de cálculo y registros manuales de Innovatech Solutions. Centraliza todo el inventario de equipamiento tecnológico y la gestión de préstamos en una solución integral, segura y auditable.
          </p>
        </div>

        {/* Bloque Antes vs. Con TechAsset */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Tarjeta Antes */}
          <div className="p-6 sm:p-8 rounded-2xl bg-superficie border border-borde shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-peligro-fondo text-peligro-texto flex items-center justify-center shrink-0">
                  <Icono nombre="XCircle" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-texto m-0">Antes</h3>
                  <p className="text-xs text-texto-suave m-0">Gestión manual y dispersa</p>
                </div>
              </div>
              <ul className="space-y-3.5 list-none p-0 m-0">
                {PUNTOS_ANTES.map((punto) => (
                  <li key={punto} className="flex items-start gap-3 text-sm text-texto-suave">
                    <span className="w-1.5 h-1.5 rounded-full bg-peligro-borde mt-2 shrink-0" aria-hidden="true" />
                    <span className="leading-relaxed">{punto}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-borde/60 text-xs text-texto-suave font-medium">
              Riesgo permanente de pérdida de equipos y falta de trazabilidad.
            </div>
          </div>

          {/* Tarjeta Ahora: Con TechAsset */}
          <div className="p-6 sm:p-8 rounded-2xl bg-superficie border-2 border-primario/40 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primario-suave text-primario text-[11px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Solución recomendada
            </div>
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-exito-fondo text-exito-texto flex items-center justify-center shrink-0">
                  <Icono nombre="CheckCircle2" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-texto m-0">Con TechAsset</h3>
                  <p className="text-xs text-texto-suave m-0">Control total e institucional</p>
                </div>
              </div>
              <ul className="space-y-3.5 list-none p-0 m-0">
                {PUNTOS_AHORA.map((punto) => (
                  <li key={punto} className="flex items-start gap-3 text-sm text-texto">
                    <span className="w-1.5 h-1.5 rounded-full bg-exito-borde mt-2 shrink-0" aria-hidden="true" />
                    <span className="leading-relaxed font-medium">{punto}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-borde/60 text-xs text-primario font-semibold">
              Garantía de custodia segura, inventario confiable y cumplimiento normativo.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
