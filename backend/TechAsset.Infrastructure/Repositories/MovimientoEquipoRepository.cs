using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechAsset.Application.DTOs;
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

    public async Task<(IReadOnlyList<MovimientoEquipo> Items, int TotalItems)> ListarPaginadoAsync(
        ParametrosConsultaMovimientos parametros,
        CancellationToken ct = default)
    {
        var query = _context.MovimientosEquipo
            .AsNoTracking()
            .Include(m => m.Equipo)
            .Include(m => m.Usuario)
            .AsQueryable();

        if (parametros.EquipoId.HasValue)
        {
            query = query.Where(m => m.Ide_Movimiento == parametros.EquipoId.Value);
        }

        if (parametros.UsuarioId.HasValue)
        {
            query = query.Where(m => m.Idu_Movimiento == parametros.UsuarioId.Value);
        }

        if (parametros.Tipo.HasValue)
        {
            query = query.Where(m => m.Tip_Movimiento == parametros.Tipo.Value);
        }

        var totalItems = await query.CountAsync(ct);
        var tamano = Math.Clamp(parametros.TamanoPagina, 1, 100);
        var totalPaginas = (int)Math.Ceiling(totalItems / (double)tamano);
        var pagina = Math.Clamp(parametros.Pagina, 1, Math.Max(1, totalPaginas));

        var items = await query
            .OrderByDescending(m => m.Fec_Movimiento)
            .Skip((pagina - 1) * tamano)
            .Take(tamano)
            .ToListAsync(ct);

        return (items, totalItems);
    }
}
