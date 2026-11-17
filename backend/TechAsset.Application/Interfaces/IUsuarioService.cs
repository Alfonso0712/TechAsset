using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;

namespace TechAsset.Application.Interfaces;

public interface IUsuarioService
{
    Task<PaginadoDto<UsuarioDto>> ListarAsync(ParametrosConsultaUsuarios parametros, CancellationToken ct = default);
    Task<UsuarioDto> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<UsuarioDto> CrearAsync(CrearUsuarioDto dto, CancellationToken ct = default);
    Task<UsuarioDto> ActualizarAsync(Guid id, ActualizarUsuarioDto dto, CancellationToken ct = default);
    Task<UsuarioDto> CambiarEstadoAsync(Guid id, CambiarEstadoUsuarioDto dto, CancellationToken ct = default);
    Task<IReadOnlyList<UsuarioDto>> ListarResponsablesAsync(CancellationToken ct = default);
    Task ActualizarPreferenciasAsync(ActualizarPreferenciasDto dto, CancellationToken ct = default);
}
