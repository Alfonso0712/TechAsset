// Utilidades de fecha y zona horaria (America/Lima, UTC-5) · TechAsset
export function fechaHoyLima(fecha = new Date()) {
  try {
    const formateador = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formateador.format(fecha);
  } catch {
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    const anio = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
}

export function fechaHoyLocal(fecha = new Date()) {
  return fechaHoyLima(fecha);
}

export function obtenerRangoSemanaLima(fechaReferencia = new Date()) {
  const hoyStr = fechaHoyLima(fechaReferencia);
  const [y, m, d] = hoyStr.split('-').map(Number);
  const fecha = new Date(y, m - 1, d);

  const diaSemana = fecha.getDay() || 7; // 1 = Lunes .. 7 = Domingo
  const lunes = new Date(fecha);
  lunes.setDate(fecha.getDate() - diaSemana + 1);

  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);

  const formatear = (dt) => {
    const anio = dt.getFullYear();
    const mes = String(dt.getMonth() + 1).padStart(2, '0');
    const dia = String(dt.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  };

  return {
    lunesIso: formatear(lunes),
    domingoIso: formatear(domingo)
  };
}

export function esPrestamoVencido(prestamo, fechaReferencia = new Date()) {
  if (!prestamo || prestamo.estado !== 'Activo') return false;
  const hoy = fechaHoyLima(fechaReferencia);
  const fechaEst = prestamo.fechaDevolucionEstimada || prestamo.fde_Prestamo;
  return Boolean(fechaEst && fechaEst < hoy);
}

export function obtenerRangoPeriodo(tipo, fechaReferencia = new Date()) {
  const hoyStr = fechaHoyLima(fechaReferencia);
  const [y, m, d] = hoyStr.split('-').map(Number);

  if (tipo === 'este-mes') {
    const primerDia = `${y}-${String(m).padStart(2, '0')}-01`;
    return { fechaDesde: primerDia, fechaHasta: hoyStr };
  }
  if (tipo === 'ultimos-30') {
    const f = new Date(y, m - 1, d);
    f.setDate(f.getDate() - 30);
    const y30 = f.getFullYear();
    const m30 = String(f.getMonth() + 1).padStart(2, '0');
    const d30 = String(f.getDate()).padStart(2, '0');
    return { fechaDesde: `${y30}-${m30}-${d30}`, fechaHasta: hoyStr };
  }
  return { fechaDesde: '', fechaHasta: '' };
}
