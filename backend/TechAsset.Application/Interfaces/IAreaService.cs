using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;

namespace TechAsset.Application.Interfaces;

public interface IAreaService
{
    Task<IReadOnlyList<AreaDto>> ListarActivasAsync(CancellationToken ct = default);
}
