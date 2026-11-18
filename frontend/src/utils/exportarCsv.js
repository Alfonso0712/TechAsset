// Exportador de archivos CSV con encoding UTF-8 y Byte Order Mark (BOM) para compatibilidad con Excel
/* global Blob, URL */
export function exportarCsv(nombreArchivo, encabezados, filas) {
  const lineas = [
    encabezados.map((e) => `"${String(e).replace(/"/g, '""')}"`).join(','),
    ...filas.map((fila) =>
      fila
        .map((celda) => {
          const val = celda === null || celda === undefined ? '' : String(celda);
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    )
  ];

  const contenido = '\uFEFF' + lineas.join('\r\n');
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.setAttribute('href', url);
  enlace.setAttribute('download', `${nombreArchivo}.csv`);
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
