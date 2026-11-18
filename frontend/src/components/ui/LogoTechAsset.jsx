// Logo corporativo institucional TechAsset
export default function LogoTechAsset({
  variante = 'marca',
  className = '',
  alt = 'Logo de TechAsset - Innovatech Solutions'
}) {
  const clasesTamano = {
    marca: 'w-11 h-11',
    lateral: 'w-9 h-9',
    compacto: 'w-8 h-8',
    libre: ''
  };

  const estiloIcono = clasesTamano[variante] || 'w-10 h-10';

  return (
    <div
      role="img"
      aria-label={alt}
      className={`inline-flex items-center justify-center shrink-0 ${className}`.trim()}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${estiloIcono} drop-shadow-sm`}
      >
        {/* Hexágono corporativo con gradiente Teal */}
        <defs>
          <linearGradient id="gradienteTechAsset" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>
        </defs>
        <path
          d="M24 3L42 13.5V34.5L24 45L6 34.5V13.5L24 3Z"
          fill="url(#gradienteTechAsset)"
          stroke="#2DD4BF"
          strokeWidth="1.5"
        />
        {/* Letras TA en blanco */}
        <text
          x="24"
          y="29"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="16"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.5"
        >
          TA
        </text>
      </svg>
    </div>
  );
}
