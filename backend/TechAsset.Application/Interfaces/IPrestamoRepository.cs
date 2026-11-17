using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;

namespace TechAsset.Application.Interfaces;

public interface IPrestamoRepository
{
    Task<Prestamo?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<Prestamo?> ObtenerConDetalleAsync(Guid id, CancellationToken ct = default);
    Task<bool> ExistePrestamoActivoAsync(Guid idEquipo, CancellationToken ct = default);
    Task<bool> UsuarioTienePrestamosActivosAsync(Guid idUsuario, CancellationToken ct = default);
    Task<IReadOnlyList<Prestamo>> ListarActivosAsync(Guid? idUsuario = null, CancellationToken ct = default);
    Task AgregarAsync(Prestamo prestamo, CancellationToken ct = default);
}
