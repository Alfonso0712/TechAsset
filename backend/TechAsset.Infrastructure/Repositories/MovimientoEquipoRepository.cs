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

public class MovimientoEquipoRepository : IMovimientoEquipoRepository
{
    private readonly AppDbContext _context;

    public MovimientoEquipoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AgregarAsync(MovimientoEquipo movimiento, CancellationToken ct = default)
    {
        await _context.MovimientosEquipo.AddAsync(movimiento, ct);
    }

    public async Task<IReadOnlyList<MovimientoEquipo>> ListarPorEquipoAsync(Guid idEquipo, CancellationToken ct = default)
    {
        return await _context.MovimientosEquipo
            .AsNoTracking()
            .Include(m => m.Usuario)
            .Where(m => m.Ide_Movimiento == idEquipo)
            .OrderByDescending(m => m.Fec_Movimiento)
            .ToListAsync(ct);
    }
}
