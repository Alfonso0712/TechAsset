using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Interfaces;

public interface IMovimientoEquipoRepository
{
    Task AgregarAsync(MovimientoEquipo movimiento, CancellationToken ct = default);
    Task<IReadOnlyList<MovimientoEquipo>> ListarPorEquipoAsync(Guid idEquipo, CancellationToken ct = default);
    Task<(IReadOnlyList<MovimientoEquipo> Items, int TotalItems)> ListarPaginadoAsync(ParametrosConsultaMovimientos parametros, CancellationToken ct = default);
}
