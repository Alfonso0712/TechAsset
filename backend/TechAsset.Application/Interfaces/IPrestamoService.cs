using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;

namespace TechAsset.Application.Interfaces;

public interface IPrestamoService
{
    Task<PaginadoDto<PrestamoDto>> ListarAsync(ParametrosConsultaPrestamos parametros, CancellationToken ct = default);
    Task<IReadOnlyList<PrestamoDto>> ListarActivosAsync(CancellationToken ct = default);
    Task<PrestamoDto> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<PrestamoDto> SolicitarAsync(SolicitarPrestamoDto dto, CancellationToken ct = default);
    Task<PrestamoDto> CrearDirectoAsync(CrearPrestamoDirectoDto dto, CancellationToken ct = default);
    Task<PrestamoDto> AprobarAsync(Guid id, CancellationToken ct = default);
    Task<PrestamoDto> RechazarAsync(Guid id, RechazarPrestamoDto dto, CancellationToken ct = default);
    Task<PrestamoDto> RegistrarDevolucionAsync(Guid id, DevolverPrestamoDto dto, CancellationToken ct = default);
}
