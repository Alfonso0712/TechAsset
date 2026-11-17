using System;
using TechAsset.Domain.Enums;

namespace TechAsset.Application.DTOs;

public record PrestamoDto(
    Guid Id,
    DateOnly FechaPrestamo,
    DateOnly FechaDevolucionEstimada,
    DateOnly? FechaDevolucionReal,
    string Motivo,
    string? Observacion,
    EstadoPrestamo Estado,
    Guid SolicitanteId,
    string SolicitanteNombre,
    string SolicitanteCorreo,
    string? SolicitanteArea,
    Guid EquipoId,
    string EquipoCodigo,
    string EquipoNombre,
    CategoriaEquipo EquipoCategoria,
    Guid? ResponsableId,
    string? ResponsableNombre
);

public record SolicitarPrestamoDto(
    Guid IdEquipo,
    DateOnly FechaPrestamo,
    DateOnly FechaDevolucionEstimada,
    string Motivo
);

public record CrearPrestamoDirectoDto(
    Guid IdUsuario,
    Guid IdEquipo,
    DateOnly FechaPrestamo,
    DateOnly FechaDevolucionEstimada,
    string Motivo
);

public record DevolverPrestamoDto(
    string Observacion,
    DateOnly? FechaDevolucionReal = null
);

public record RechazarPrestamoDto(
    string Motivo
);
