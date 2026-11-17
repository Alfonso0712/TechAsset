using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Application.Mappers;

namespace TechAsset.Application.Services;

public class AreaService : IAreaService
{
    private readonly IUnitOfWork _uow;

    public AreaService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<IReadOnlyList<AreaDto>> ListarActivasAsync(CancellationToken ct = default)
    {
        var areas = await _uow.Areas.ListarActivasAsync(ct);
        return areas.Select(a => a.ToDto()).ToList();
    }
}
