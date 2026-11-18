// Verificador estricto de tokens de diseño para Tailwind CSS
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// 1. Extraer tokens semánticos definidos en tailwind.config.js
const tailwindConfigContent = fs.readFileSync(path.join(rootDir, 'tailwind.config.js'), 'utf-8');
const colorMatches = tailwindConfigContent.matchAll(/['"]?([a-zA-Z0-9_-]+)['"]?:\s*['"]var\(--([a-zA-Z0-9_-]+)\)['"]/g);

const tokensDefinidos = new Set();
for (const match of colorMatches) {
  tokensDefinidos.add(match[1]);
}

// 2. Colores y utilidades estándar permitidas de Tailwind
const coloresEstandar = new Set([
  'white', 'black', 'transparent', 'current', 'inherit',
  'slate-800', 'slate-900', 'slate-950', 'slate-300', 'slate-400'
]);

// 3. Escanear componentes en src
function listarArchivos(dir) {
  const entradas = fs.readdirSync(dir, { withFileTypes: true });
  const archivos = [];
  for (const entrada of entradas) {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      archivos.push(...listarArchivos(ruta));
    } else if (/\.(jsx|js)$/.test(entrada.name) && !entrada.name.includes('.test.')) {
      archivos.push(ruta);
    }
  }
  return archivos;
}

const archivos = listarArchivos(srcDir);
const errores = [];

const prefijosColor = ['text-', 'bg-', 'border-', 'ring-'];

for (const archivo of archivos) {
  const contenido = fs.readFileSync(archivo, 'utf-8');
  // Extraer todas las cadenas de texto dentro de className="..." o className={`...`}
  const classMatches = contenido.matchAll(/className=(?:\{`([\s\S]*?)`\}|"([^"]*)"|'([^']*)')/g);
  for (const match of classMatches) {
    const rawTexto = match[1] || match[2] || match[3] || '';
    // Separar palabras limpiando comillas, interpolaciones de template string y llaves
    const tokens = rawTexto
      .replace(/\$\{[^}]+\}/g, ' ')
      .replace(/['"`,?:]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    for (const rawToken of tokens) {
      const partes = rawToken.split(':');
      let clase = partes[partes.length - 1].trim();

      // Ignorar valores arbitrarios como [#38BDF0], white/10, black/40
      if (clase.includes('[#') || clase.startsWith('text-[') || clase.startsWith('bg-[') || clase.startsWith('border-[') || clase.includes('white/') || clase.includes('black/')) {
        continue;
      }

      // Ignorar utilidades de ring-offset
      if (clase.startsWith('ring-offset-')) continue;

      for (const prefijo of prefijosColor) {
        if (clase.startsWith(prefijo)) {
          let nombreColor = clase.slice(prefijo.length);
          if (nombreColor.includes('/')) {
            nombreColor = nombreColor.split('/')[0];
          }

          // Descartar utilidades estructurales
          if (/^(0|1|2|4|8|t|b|l|r|x|y|t-0|b-0|l-0|r-0|t-2|b-2|l-2|r-2|solid|dashed|dotted|double|none|collapse|separate)$/.test(nombreColor)) continue;
          if (/^[tlrbxy]-\[.+\]$/.test(nombreColor) || /^\[.+\]$/.test(nombreColor)) continue;
          if (/^(xs|sm|base|lg|xl|2xl|3xl|4xl|center|left|right|justify|wrap|nowrap|opacity|clip)$/.test(nombreColor)) continue;
          if (/^(auto|cover|contain|fixed|local|scroll|bottom|top|center)$/.test(nombreColor)) continue;

          if (!tokensDefinidos.has(nombreColor) && !coloresEstandar.has(nombreColor)) {
            errores.push({
              archivo: path.relative(rootDir, archivo),
              clase: rawToken,
              token: nombreColor
            });
          }
        }
      }
    }
  }
}

if (errores.length > 0) {
  console.error(`\x1b[31m[check:tokens] ERROR: Se encontraron ${errores.length} clases de color no registradas en tailwind.config.js:\x1b[0m`);
  for (const err of errores) {
    console.error(`  - ${err.archivo}: "${err.clase}" (color "${err.token}" no está en tailwind.config.js)`);
  }
  process.exit(1);
} else {
  console.log(`\x1b[32m[check:tokens] Éxito: Todos los tokens de color utilizados están correctamente registrados en tailwind.config.js (${tokensDefinidos.size} tokens verificados).\x1b[0m`);
  process.exit(0);
}
