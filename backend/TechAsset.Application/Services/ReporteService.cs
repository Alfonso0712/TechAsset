using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Application.Mappers;
using TechAsset.Domain.Enums;

namespace TechAsset.Application.Services;

public class ReporteService : IReporteService
{
    private readonly IUnitOfWork _uow;
    private readonly IRelojServicio _reloj;

    public ReporteService(IUnitOfWork uow, IRelojServicio reloj)
    {
        _uow = uow;
        _reloj = reloj;
    }

    public async Task<DashboardDto> ObtenerDashboardAsync(CancellationToken ct = default)
    {
        var totalEquipos = await _uow.Equipos.ContarTotalAsync(ct);
        var estados = await _uow.Equipos.ContarAgrupadoPorEstadoAsync(ct);

        estados.TryGetValue(EstadoEquipo.Disponible, out var disponibles);
        estados.TryGetValue(EstadoEquipo.Prestado, out var prestados);
        estados.TryGetValue(EstadoEquipo.Mantenimiento, out var mantenimiento);
        estados.TryGetValue(EstadoEquipo.Baja, out var baja);

        var totalPrestamos = await _uow.Prestamos.ContarTotalAsync(ct);
        var areaLider = await _uow.Prestamos.ObtenerAreaConMayorUsoAsync(ct);
        var areaMayorUso = areaLider ?? "Sin datos suficientes";

        var distribucion = new List<EquiposPorEstadoDto>
        {
            new(EstadoEquipo.Disponible, "Disponibles", disponibles, totalEquipos > 0 ? Math.Round((double)disponibles / totalEquipos * 100, 1) : 0),
            new(EstadoEquipo.Prestado, "Prestados", prestados, totalEquipos > 0 ? Math.Round((double)prestados / totalEquipos * 100, 1) : 0),
            new(EstadoEquipo.Mantenimiento, "Mantenimiento", mantenimiento, totalEquipos > 0 ? Math.Round((double)mantenimiento / totalEquipos * 100, 1) : 0),
            new(EstadoEquipo.Baja, "Baja", baja, totalEquipos > 0 ? Math.Round((double)baja / totalEquipos * 100, 1) : 0)
        };

        var prestamosPorArea = await _uow.Prestamos.ObtenerPrestamosPorAreaAsync(6, null, null, ct);
        var solicitudesPendientes = await _uow.Prestamos.ObtenerSolicitudesPendientesRecientesAsync(5, ct);

        // Métricas de actividad con reloj en hora de Lima (America/Lima)
        var hoy = _reloj.Hoy;
        var diaSemana = (int)hoy.DayOfWeek;
        var diffLunes = diaSemana == 0 ? -6 : 1 - diaSemana;
        var lunes = hoy.AddDays(diffLunes);
        var domingo = lunes.AddDays(6);

        var (prestamosHoy, devolucionesSemana, prestamosVencidos) =
            await _uow.Prestamos.ObtenerMetricasActividadAsync(hoy, lunes, domingo, ct);

        return new DashboardDto(
            totalEquipos,
            disponibles,
            prestados,
            mantenimiento,
            baja,
            totalPrestamos,
            areaMayorUso,
            distribucion,
            prestamosPorArea,
            solicitudesPendientes.Select(p => p.ToDto()).ToList(),
            prestamosHoy,
            devolucionesSemana,
            prestamosVencidos
        );
    }

    public async Task<IReadOnlyList<EquiposPorEstadoDto>> ObtenerEquiposPorEstadoAsync(CancellationToken ct = default)
    {
        var total = await _uow.Equipos.ContarTotalAsync(ct);
        if (total == 0) return Array.Empty<EquiposPorEstadoDto>();

        var agrupados = await _uow.Equipos.ContarAgrupadoPorEstadoAsync(ct);

        return agrupados.Select(kv => new EquiposPorEstadoDto(
            kv.Key,
            kv.Key.ToString(),
            kv.Value,
            Math.Round((double)kv.Value / total * 100, 1)
        )).ToList();
    }

    public async Task<IReadOnlyList<EquiposMasUtilizadosDto>> ObtenerEquiposMasUtilizadosAsync(
        int limite = 10,
        CategoriaEquipo? categoria = null,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        CancellationToken ct = default)
    {
        return await _uow.Prestamos.ObtenerEquiposMasUtilizadosAsync(limite, categoria, fechaDesde, fechaHasta, ct);
    }

    public async Task<IReadOnlyList<PrestamosPorAreaDto>> ObtenerPrestamosPorAreaAsync(
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        CancellationToken ct = default)
    {
        return await _uow.Prestamos.ObtenerPrestamosPorAreaAsync(null, fechaDesde, fechaHasta, ct);
    }

    public async Task<PaginadoDto<MovimientoEquipoDto>> ObtenerMovimientosAsync(ParametrosConsultaMovimientos parametros, CancellationToken ct = default)
    {
        var (items, totalItems) = await _uow.MovimientosEquipo.ListarPaginadoAsync(parametros, ct);

        var tamano = Math.Clamp(parametros.TamanoPagina, 1, 100);
        var totalPaginas = (int)Math.Ceiling(totalItems / (double)tamano);
        var pagina = Math.Clamp(parametros.Pagina, 1, Math.Max(1, totalPaginas));

        return new PaginadoDto<MovimientoEquipoDto>(
            items.Select(m => m.ToDto()).ToList(),
            pagina,
            tamano,
            totalItems,
            totalPaginas
        );
    }
}
