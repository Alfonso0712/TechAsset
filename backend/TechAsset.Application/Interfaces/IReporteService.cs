using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;

namespace TechAsset.Application.Interfaces;

public interface IReporteService
{
    Task<DashboardDto> ObtenerDashboardAsync(CancellationToken ct = default);
    Task<IReadOnlyList<EquiposPorEstadoDto>> ObtenerEquiposPorEstadoAsync(CancellationToken ct = default);
    Task<IReadOnlyList<EquiposMasUtilizadosDto>> ObtenerEquiposMasUtilizadosAsync(int limite = 10, CancellationToken ct = default);
    Task<IReadOnlyList<PrestamosPorAreaDto>> ObtenerPrestamosPorAreaAsync(CancellationToken ct = default);
    Task<PaginadoDto<MovimientoEquipoDto>> ObtenerMovimientosAsync(ParametrosConsultaMovimientos parametros, CancellationToken ct = default);
}
