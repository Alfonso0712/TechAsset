using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Interfaces;

public interface IAreaRepository
{
    Task<Area?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<Area?> ObtenerPorNombreAsync(string nombre, CancellationToken ct = default);
    Task<IReadOnlyList<Area>> ListarActivasAsync(CancellationToken ct = default);
    Task AgregarAsync(Area area, CancellationToken ct = default);
}
