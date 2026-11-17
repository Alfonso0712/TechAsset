using System;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.Interfaces;
using TechAsset.Infrastructure.Data;

namespace TechAsset.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IAreaRepository Areas { get; }
    public IUsuarioRepository Usuarios { get; }
    public IEquipoRepository Equipos { get; }
    public IPrestamoRepository Prestamos { get; }
    public IMovimientoEquipoRepository MovimientosEquipo { get; }

    public UnitOfWork(
        AppDbContext context,
        IAreaRepository areas,
        IUsuarioRepository usuarios,
        IEquipoRepository equipos,
        IPrestamoRepository prestamos,
        IMovimientoEquipoRepository movimientosEquipo)
    {
        _context = context;
        Areas = areas;
        Usuarios = usuarios;
        Equipos = equipos;
        Prestamos = prestamos;
        MovimientosEquipo = movimientosEquipo;
    }

    public async Task<int> GuardarCambiosAsync(CancellationToken ct = default)
    {
        return await _context.SaveChangesAsync(ct);
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}
