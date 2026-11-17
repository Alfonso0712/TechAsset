using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;

namespace TechAsset.Application.Interfaces;

public interface IEquipoRepository
{
    Task<Equipo?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<Equipo?> ObtenerPorCodigoPatrimonialAsync(string codigo, CancellationToken ct = default);
    Task<bool> ExisteCodigoPatrimonialAsync(string codigo, Guid? excluirId = null, CancellationToken ct = default);
    Task AgregarAsync(Equipo equipo, CancellationToken ct = default);
}
