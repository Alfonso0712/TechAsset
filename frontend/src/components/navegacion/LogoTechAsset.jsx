import LogoTechAssetUi from '../ui/LogoTechAsset';

export default function LogoTechAsset({ className = 'h-8', variante = 'marca' }) {
  if (variante === 'libre') {
    return <LogoTechAssetUi variante="libre" className={className} />;
  }
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoTechAssetUi variante="compacto" />
      <div className="flex flex-col leading-none">
        <span className="font-extrabold text-base tracking-tight text-texto">
          Tech<span className="text-primario">Asset</span>
        </span>
        <span className="text-[0.625rem] font-medium tracking-wider uppercase text-texto-suave">
          Innovatech Solutions
        </span>
      </div>
    </div>
  );
}
