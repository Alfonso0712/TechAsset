using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;

namespace TechAsset.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<Usuario?> ObtenerPorCorreoAsync(string correo, CancellationToken ct = default);
    Task<bool> ExisteCorreoAsync(string correo, Guid? excluirId = null, CancellationToken ct = default);
    Task<IReadOnlyList<Usuario>> ListarResponsablesAsync(CancellationToken ct = default);
    Task AgregarAsync(Usuario usuario, CancellationToken ct = default);
    Task<(IReadOnlyList<Usuario> Items, int TotalItems)> ListarPaginadoAsync(ParametrosConsultaUsuarios parametros, CancellationToken ct = default);
}
