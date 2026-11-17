using System;
using System.Threading;
using System.Threading.Tasks;

namespace TechAsset.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IAreaRepository Areas { get; }
    IUsuarioRepository Usuarios { get; }
    IEquipoRepository Equipos { get; }
    IPrestamoRepository Prestamos { get; }
    IMovimientoEquipoRepository MovimientosEquipo { get; }

    Task<int> GuardarCambiosAsync(CancellationToken ct = default);
}
