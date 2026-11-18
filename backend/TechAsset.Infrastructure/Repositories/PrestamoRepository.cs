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

public class PrestamoRepository : IPrestamoRepository
{
    private readonly AppDbContext _context;

    public PrestamoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Prestamo?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Prestamos
            .Include(p => p.Equipo)
            .Include(p => p.Solicitante)
            .Include(p => p.Responsable)
            .FirstOrDefaultAsync(p => p.Id_Prestamo == id, ct);
    }

    public async Task<Prestamo?> ObtenerConDetalleAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Prestamos
            .Include(p => p.Equipo)
            .Include(p => p.Solicitante)
                .ThenInclude(u => u!.Area)
            .Include(p => p.Responsable)
            .FirstOrDefaultAsync(p => p.Id_Prestamo == id, ct);
    }

    public async Task<bool> ExistePrestamoActivoAsync(Guid idEquipo, CancellationToken ct = default)
    {
        return await _context.Prestamos
            .AsNoTracking()
            .AnyAsync(p => p.Ide_Prestamo == idEquipo && p.Est_Prestamo == EstadoPrestamo.Activo, ct);
    }

    public async Task<bool> UsuarioTienePrestamosActivosAsync(Guid idUsuario, CancellationToken ct = default)
    {
        return await _context.Prestamos
            .AsNoTracking()
            .AnyAsync(p => p.Idu_Prestamo == idUsuario && p.Est_Prestamo == EstadoPrestamo.Activo, ct);
    }

    public async Task<IReadOnlyList<Prestamo>> ListarActivosAsync(Guid? idUsuario = null, CancellationToken ct = default)
    {
        var query = _context.Prestamos
            .AsNoTracking()
            .Include(p => p.Equipo)
            .Include(p => p.Solicitante)
            .Include(p => p.Responsable)
            .Where(p => p.Est_Prestamo == EstadoPrestamo.Activo);

        if (idUsuario.HasValue)
        {
            query = query.Where(p => p.Idu_Prestamo == idUsuario.Value);
        }

        return await query.OrderBy(p => p.Fde_Prestamo).ToListAsync(ct);
    }

    public async Task AgregarAsync(Prestamo prestamo, CancellationToken ct = default)
    {
        await _context.Prestamos.AddAsync(prestamo, ct);
    }

    public async Task<(IReadOnlyList<Prestamo> Items, int TotalItems)> ListarPaginadoAsync(
        ParametrosConsultaPrestamos parametros,
        RolUsuario rolActor,
        Guid actorId,
        CancellationToken ct = default)
    {
        var query = _context.Prestamos
            .AsNoTracking()
            .Include(p => p.Equipo)
            .Include(p => p.Solicitante)
                .ThenInclude(u => u!.Area)
            .Include(p => p.Responsable)
            .AsQueryable();

        // Control de Alcance: Si es Colaborador, solo ve sus propios préstamos
        if (rolActor == RolUsuario.Colaborador)
        {
            query = query.Where(p => p.Idu_Prestamo == actorId);
        }
        else if (parametros.ColaboradorId.HasValue)
        {
            query = query.Where(p => p.Idu_Prestamo == parametros.ColaboradorId.Value);
        }

        if (parametros.Estado.HasValue)
        {
            query = query.Where(p => p.Est_Prestamo == parametros.Estado.Value);
        }

        if (parametros.EquipoId.HasValue)
        {
            query = query.Where(p => p.Ide_Prestamo == parametros.EquipoId.Value);
        }

        if (parametros.FechaDesde.HasValue)
        {
            query = query.Where(p => p.Fpr_Prestamo >= parametros.FechaDesde.Value);
        }

        if (parametros.FechaHasta.HasValue)
        {
            query = query.Where(p => p.Fpr_Prestamo <= parametros.FechaHasta.Value);
        }

        var totalItems = await query.CountAsync(ct);
        var tamano = Math.Clamp(parametros.TamanoPagina, 1, 100);
        var totalPaginas = (int)Math.Ceiling(totalItems / (double)tamano);
        var pagina = Math.Clamp(parametros.Pagina, 1, Math.Max(1, totalPaginas));

        var items = await query
            .OrderByDescending(p => p.Fpr_Prestamo)
            .ThenByDescending(p => p.Fre_Creacion)
            .Skip((pagina - 1) * tamano)
            .Take(tamano)
            .ToListAsync(ct);

        return (items, totalItems);
    }

    public async Task<int> ContarTotalAsync(CancellationToken ct = default)
    {
        return await _context.Prestamos.AsNoTracking().CountAsync(ct);
    }

    public async Task<string?> ObtenerAreaConMayorUsoAsync(CancellationToken ct = default)
    {
        var areas = await _context.Prestamos
            .AsNoTracking()
            .Where(p => p.Solicitante != null && p.Solicitante.Area != null)
            .Select(p => p.Solicitante!.Area!.Nom_Area)
            .ToListAsync(ct);

        return areas
            .GroupBy(a => a)
            .Select(g => new { Area = g.Key, Total = g.Count() })
            .OrderByDescending(x => x.Total)
            .Select(x => x.Area)
            .FirstOrDefault();
    }

    public async Task<IReadOnlyList<PrestamosPorAreaDto>> ObtenerPrestamosPorAreaAsync(int? limite = null, CancellationToken ct = default)
    {
        var areas = await _context.Prestamos
            .AsNoTracking()
            .Where(p => p.Solicitante != null && p.Solicitante.Area != null)
            .Select(p => p.Solicitante!.Area!.Nom_Area)
            .ToListAsync(ct);

        var query = areas
            .GroupBy(a => a)
            .Select(g => new PrestamosPorAreaDto(g.Key, g.Count()))
            .OrderByDescending(x => x.TotalPrestamos);

        if (limite.HasValue)
        {
            return query.Take(limite.Value).ToList();
        }

        return query.ToList();
    }

    public async Task<IReadOnlyList<EquiposMasUtilizadosDto>> ObtenerEquiposMasUtilizadosAsync(int limite = 10, CancellationToken ct = default)
    {
        var datos = await _context.Prestamos
            .AsNoTracking()
            .Where(p => p.Equipo != null)
            .Select(p => new
            {
                p.Ide_Prestamo,
                p.Equipo!.Cop_Equipo,
                p.Equipo.Nom_Equipo,
                p.Equipo.Cat_Equipo
            })
            .ToListAsync(ct);

        return datos
            .GroupBy(p => new { p.Ide_Prestamo, p.Cop_Equipo, p.Nom_Equipo, p.Cat_Equipo })
            .Select(g => new EquiposMasUtilizadosDto(
                g.Key.Ide_Prestamo,
                g.Key.Cop_Equipo,
                g.Key.Nom_Equipo,
                g.Key.Cat_Equipo,
                g.Count()
            ))
            .OrderByDescending(x => x.TotalPrestamos)
            .Take(limite)
            .ToList();
    }

    public async Task<IReadOnlyList<Prestamo>> ObtenerSolicitudesPendientesRecientesAsync(int limite = 5, CancellationToken ct = default)
    {
        return await _context.Prestamos
            .AsNoTracking()
            .Include(p => p.Equipo)
            .Include(p => p.Solicitante)
                .ThenInclude(u => u!.Area)
            .Where(p => p.Est_Prestamo == EstadoPrestamo.Pendiente)
            .OrderBy(p => p.Fpr_Prestamo)
            .Take(limite)
            .ToListAsync(ct);
    }
}
