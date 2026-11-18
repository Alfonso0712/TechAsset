// Logo corporativo institucional TechAsset · Cuadrado redondeado Azul Marino (#091E3E) + Cian (#06A3DA)
export default function LogoTechAsset({
  variante = 'marca',
  className = '',
  alt = 'Logo TechAsset - Innovatech Solutions'
}) {
  const clasesTamano = {
    marca: 'w-11 h-11 text-lg',
    lateral: 'w-9 h-9 text-base',
    compacto: 'w-8 h-8 text-sm',
    libre: 'w-10 h-10 text-base'
  };

  const tamano = clasesTamano[variante] || 'w-10 h-10 text-base';

  return (
    <div
      role="img"
      aria-label={alt}
      className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#091E3E] text-[#06A3DA] border border-[#06A3DA]/40 font-extrabold tracking-wider shadow-sm select-none ${tamano} ${className}`.trim()}
    >
      TA
    </div>
  );
}
