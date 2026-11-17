using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
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
    Task<(IReadOnlyList<Prestamo> Items, int TotalItems)> ListarPaginadoAsync(
        ParametrosConsultaPrestamos parametros,
        RolUsuario rolActor,
        Guid actorId,
        CancellationToken ct = default);
    Task<int> ContarTotalAsync(CancellationToken ct = default);
    Task<string?> ObtenerAreaConMayorUsoAsync(CancellationToken ct = default);
    Task<IReadOnlyList<PrestamosPorAreaDto>> ObtenerPrestamosPorAreaAsync(int? limite = null, CancellationToken ct = default);
    Task<IReadOnlyList<EquiposMasUtilizadosDto>> ObtenerEquiposMasUtilizadosAsync(int limite = 10, CancellationToken ct = default);
    Task<IReadOnlyList<Prestamo>> ObtenerSolicitudesPendientesRecientesAsync(int limite = 5, CancellationToken ct = default);
}
