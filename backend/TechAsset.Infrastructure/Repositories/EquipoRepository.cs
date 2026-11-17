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

public class EquipoRepository : IEquipoRepository
{
    private readonly AppDbContext _context;

    public EquipoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Equipo?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Equipos.FirstOrDefaultAsync(e => e.Id_Equipo == id, ct);
    }

    public async Task<Equipo?> ObtenerPorCodigoPatrimonialAsync(string codigo, CancellationToken ct = default)
    {
        var cod = codigo.Trim().ToUpperInvariant();
        return await _context.Equipos.FirstOrDefaultAsync(e => e.Cop_Equipo.ToUpper() == cod, ct);
    }

    public async Task<bool> ExisteCodigoPatrimonialAsync(string codigo, Guid? excluirId = null, CancellationToken ct = default)
    {
        var cod = codigo.Trim().ToUpperInvariant();
        var query = _context.Equipos.AsNoTracking().Where(e => e.Cop_Equipo.ToUpper() == cod);
        if (excluirId.HasValue)
        {
            query = query.Where(e => e.Id_Equipo != excluirId.Value);
        }
        return await query.AnyAsync(ct);
    }

    public async Task AgregarAsync(Equipo equipo, CancellationToken ct = default)
    {
        await _context.Equipos.AddAsync(equipo, ct);
    }
}
