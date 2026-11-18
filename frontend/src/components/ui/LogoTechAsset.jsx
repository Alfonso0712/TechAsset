// Nielsen 4 · Componente único de Logo TechAsset institucional · Innovatech Solutions S.A.C.
import logoImg from '../../assets/logo-techasset.png';

const MAPA_ALTURAS = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12', // 48px (cabecera del panel)
  xl: 'h-14 w-14', // 56px (tarjeta de login)
  panel: 'h-12 w-12',
  tarjeta: 'h-14 w-14',
  sidebar: 'h-9 w-9',
  header: 'h-8 w-8'
};

export default function LogoTechAsset({
  tamano = 'md',
  className = '',
  alt = 'Logo TechAsset'
}) {
  const dimension = MAPA_ALTURAS[tamano] || tamano;

  return (
    <img
      src={logoImg}
      alt={alt}
      className={`shrink-0 object-contain select-none pointer-events-none ${dimension} ${className}`.trim()}
      loading="eager"
    />
  );
}
