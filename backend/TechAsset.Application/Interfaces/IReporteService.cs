using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Domain.Enums;

namespace TechAsset.Application.Interfaces;

public interface IReporteService
{
    Task<DashboardDto> ObtenerDashboardAsync(CancellationToken ct = default);
    Task<IReadOnlyList<EquiposPorEstadoDto>> ObtenerEquiposPorEstadoAsync(CancellationToken ct = default);
    Task<IReadOnlyList<EquiposMasUtilizadosDto>> ObtenerEquiposMasUtilizadosAsync(
        int limite = 10,
        CategoriaEquipo? categoria = null,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        CancellationToken ct = default);
    Task<IReadOnlyList<PrestamosPorAreaDto>> ObtenerPrestamosPorAreaAsync(
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        CancellationToken ct = default);
    Task<PaginadoDto<MovimientoEquipoDto>> ObtenerMovimientosAsync(ParametrosConsultaMovimientos parametros, CancellationToken ct = default);
}
