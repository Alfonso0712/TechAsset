import { useState, useEffect, useMemo } from 'react';
import EstadoVacio from './EstadoVacio';
import PaginacionTabla from './PaginacionTabla';
import { ordenarDatos } from '../../utils/ordenarDatos';

export default function TableList({
  caption,
  columnas = [],
  datos = [],
  claveFila = 'id',
  cargando = false,
  mensajeVacio = 'No se encontraron registros.',
  descripcionVacia = '',
  accionVacia = null,
  paginacion = true,
  tamanoPaginaInicial = 10,
  esFiltroActivo = false,
  alLimpiarFiltros = null,
  obtenerClaseFila = null
}) {
  const [paginaActual, setPaginaActual] = useState(1);
  const [tamano, setTamano] = useState(tamanoPaginaInicial);
  const [orden, setOrden] = useState({ clave: null, dir: 'asc' });

  useEffect(() => {
    setPaginaActual(1);
  }, [datos.length]);

  const datosOrdenados = useMemo(() => ordenarDatos(datos, orden.clave, orden.dir), [datos, orden]);

  if (!cargando && (!datos || datos.length === 0)) {
    if (esFiltroActivo && alLimpiarFiltros) {
      return (
        <EstadoVacio
          icono="Search"
          titulo="No se encontraron resultados para los filtros aplicados"
          descripcion="Pruebe modificando los términos de búsqueda o limpie los filtros activos."
          accionTexto="Limpiar filtros"
          alAccionar={alLimpiarFiltros}
        />
      );
    }
    return (
      <EstadoVacio
        titulo={mensajeVacio}
        descripcion={descripcionVacia}
        accionTexto={accionVacia?.texto}
        alAccionar={accionVacia?.accion}
      />
    );
  }

  const alternar = (k) => {
    setOrden((p) =>
      p.clave === k
        ? p.dir === 'asc'
          ? { clave: k, dir: 'desc' }
          : { clave: null, dir: 'asc' }
        : { clave: k, dir: 'asc' }
    );
  };

  const totalPaginas = Math.max(1, Math.ceil(datos.length / tamano));
  const paginaSegura = Math.min(Math.max(1, paginaActual), totalPaginas);
  const datosVisibles = paginacion
    ? datosOrdenados.slice((paginaSegura - 1) * tamano, paginaSegura * tamano)
    : datosOrdenados;

  return (
    <div className="w-full rounded-xl border border-borde bg-superficie shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-left tabla-responsiva">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-superficie-2 border-b border-borde">
            <tr>
              {columnas.map((col) => {
                const activo = orden.clave === col.clave;
                const ariaSort = col.ordenable
                  ? activo
                    ? orden.dir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                  : undefined;
                return (
                  <th
                    key={col.clave}
                    scope="col"
                    aria-sort={ariaSort}
                    className={`whitespace-nowrap py-3 px-4 text-xs font-semibold uppercase tracking-wider text-texto-suave align-middle ${col.claseEncabezado || ''}`.trim()}
                  >
                    {col.ordenable ? (
                      <button
                        type="button"
                        onClick={() => alternar(col.clave)}
                        className="inline-flex items-center gap-1.5 font-semibold text-texto-suave hover:text-texto focus:outline-none focus:underline"
                        aria-label={`Ordenar por ${col.encabezado}`}
                      >
                        <span>{col.encabezado}</span>
                        {activo && (
                          <span className="text-primario">
                            {orden.dir === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    ) : (
                      col.encabezado
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-borde text-sm">
            {cargando ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skel-${i}`} className="h-14 animate-pulse">
                  {columnas.map((c, ci) => (
                    <td key={c.clave || ci} className="px-4 py-3">
                      <div className="h-4 bg-superficie-2 rounded w-4/5" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              datosVisibles.map((fila, indice) => (
                <tr
                  key={fila[claveFila] ?? indice}
                  className={`h-14 hover:bg-superficie-2/50 transition-colors ${
                    obtenerClaseFila ? obtenerClaseFila(fila) : ''
                  }`.trim()}
                >
                  {columnas.map((col) => (
                    <td
                      key={col.clave}
                      data-label={col.encabezado}
                      className={`px-4 py-3 align-middle ${col.claseCelda || ''}`.trim()}
                    >
                      {col.render ? col.render(fila[col.clave], fila) : fila[col.clave]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginacion && datos.length > 0 && (
        <PaginacionTabla
          paginaActual={paginaSegura}
          totalPaginas={totalPaginas}
          totalRegistros={datos.length}
          tamanoPagina={tamano}
          alCambiarPagina={setPaginaActual}
          alCambiarTamanoPagina={(nuevoTamano) => {
            setTamano(nuevoTamano);
            setPaginaActual(1);
          }}
        />
      )}
    </div>
  );
}
