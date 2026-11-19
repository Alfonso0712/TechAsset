// Metadato de categoría de equipo tecnológico: texto e ícono discreto sin fondo ni borde · ISO 9241-110 · TechAsset
import Icono from './Icono';
import { ETIQUETAS_CATEGORIA, ICONOS_CATEGORIA } from '../../constants/etiquetas';

export default function CategoriaEquipoChip({ categoria }) {
  if (!categoria) return null;
  const etiqueta = ETIQUETAS_CATEGORIA[categoria] || categoria;
  const nombreIcono = ICONOS_CATEGORIA[categoria] || 'Laptop';

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-texto whitespace-nowrap" title={etiqueta}>
      <Icono nombre={nombreIcono} className="w-4 h-4 text-texto-suave shrink-0" strokeWidth={1.75} />
      <span>{etiqueta}</span>
    </span>
  );
}
