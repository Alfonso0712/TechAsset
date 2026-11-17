export default function LogoTechAsset({ className = 'h-8' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-primario flex items-center justify-center text-white shadow-sm font-bold text-base tracking-wider">
        TA
      </div>
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
