using System;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;

namespace TechAsset.Application.Interfaces;

public interface IEquipoService
{
    Task<PaginadoDto<EquipoDto>> ListarAsync(ParametrosConsultaEquipos parametros, CancellationToken ct = default);
    Task<EquipoDto> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<EquipoDto> CrearAsync(CrearEquipoDto dto, CancellationToken ct = default);
    Task<EquipoDto> ActualizarAsync(Guid id, ActualizarEquipoDto dto, CancellationToken ct = default);
    Task<EquipoDto> CambiarEstadoAsync(Guid id, CambiarEstadoEquipoDto dto, CancellationToken ct = default);
}
