using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
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
}
