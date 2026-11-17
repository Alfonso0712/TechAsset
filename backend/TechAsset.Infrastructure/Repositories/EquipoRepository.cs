using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
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

    public async Task<(IReadOnlyList<Equipo> Items, int TotalItems)> ListarPaginadoAsync(ParametrosConsultaEquipos parametros, CancellationToken ct = default)
    {
        var query = _context.Equipos.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(parametros.Texto))
        {
            var t = parametros.Texto.Trim().ToLower();
            query = query.Where(e => e.Cop_Equipo.ToLower().Contains(t)
                                  || e.Nom_Equipo.ToLower().Contains(t)
                                  || e.Mar_Equipo.ToLower().Contains(t));
        }

        if (parametros.Categoria.HasValue)
        {
            query = query.Where(e => e.Cat_Equipo == parametros.Categoria.Value);
        }

        if (parametros.Estado.HasValue)
        {
            query = query.Where(e => e.Est_Equipo == parametros.Estado.Value);
        }

        if (!string.IsNullOrWhiteSpace(parametros.Ubicacion))
        {
            var u = parametros.Ubicacion.Trim().ToLower();
            query = query.Where(e => e.Ubi_Equipo.ToLower().Contains(u));
        }

        var totalItems = await query.CountAsync(ct);
        var tamano = Math.Clamp(parametros.TamanoPagina, 1, 100);
        var totalPaginas = (int)Math.Ceiling(totalItems / (double)tamano);
        var pagina = Math.Clamp(parametros.Pagina, 1, Math.Max(1, totalPaginas));

        var items = await query
            .OrderBy(e => e.Nom_Equipo)
            .Skip((pagina - 1) * tamano)
            .Take(tamano)
            .ToListAsync(ct);

        return (items, totalItems);
    }

    public async Task<int> ContarTotalAsync(CancellationToken ct = default)
    {
        return await _context.Equipos.AsNoTracking().CountAsync(ct);
    }

    public async Task<int> ContarPorEstadoAsync(EstadoEquipo estado, CancellationToken ct = default)
    {
        return await _context.Equipos.AsNoTracking().CountAsync(e => e.Est_Equipo == estado, ct);
    }

    public async Task<IReadOnlyDictionary<EstadoEquipo, int>> ContarAgrupadoPorEstadoAsync(CancellationToken ct = default)
    {
        var grouped = await _context.Equipos
            .AsNoTracking()
            .GroupBy(e => e.Est_Equipo)
            .Select(g => new { Estado = g.Key, Cantidad = g.Count() })
            .ToListAsync(ct);

        return grouped.ToDictionary(g => g.Estado, g => g.Cantidad);
    }
}
