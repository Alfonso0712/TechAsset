using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Entities;
using TechAsset.Infrastructure.Data;

namespace TechAsset.Infrastructure.Repositories;

public class AreaRepository : IAreaRepository
{
    private readonly AppDbContext _context;

    public AreaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Area?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Areas.FirstOrDefaultAsync(a => a.Id_Area == id, ct);
    }

    public async Task<Area?> ObtenerPorNombreAsync(string nombre, CancellationToken ct = default)
    {
        var n = nombre.Trim().ToLower();
        return await _context.Areas.FirstOrDefaultAsync(a => a.Nom_Area.ToLower() == n, ct);
    }

    public async Task<IReadOnlyList<Area>> ListarActivasAsync(CancellationToken ct = default)
    {
        return await _context.Areas
            .AsNoTracking()
            .Where(a => a.Act_Area)
            .OrderBy(a => a.Nom_Area)
            .ToListAsync(ct);
    }

    public async Task AgregarAsync(Area area, CancellationToken ct = default)
    {
        await _context.Areas.AddAsync(area, ct);
    }
}
