using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TechAsset.Application.Validation;
using TechAsset.Domain.Constants;
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
    [Required(ErrorMessage = "El equipo es obligatorio.")]
    [NotEmptyGuid(ErrorMessage = "Debe seleccionar un equipo válido.")]
    Guid IdEquipo,

    [Required(ErrorMessage = "La fecha de préstamo es obligatoria.")]
    DateOnly FechaPrestamo,

    [Required(ErrorMessage = "La fecha estimada de devolución es obligatoria.")]
    DateOnly FechaDevolucionEstimada,

    [Required(ErrorMessage = "El motivo de la solicitud es obligatorio.")]
    [StringLength(500, MinimumLength = 5, ErrorMessage = "El motivo debe tener entre 5 y 500 caracteres.")]
    string Motivo
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (FechaDevolucionEstimada <= FechaPrestamo)
        {
            yield return new ValidationResult(
                Mensajes.RN04_FechaDevolucionInvalida,
                new[] { nameof(FechaDevolucionEstimada) }
            );
        }
    }
}

public record CrearPrestamoDirectoDto(
    [Required(ErrorMessage = "El usuario solicitante es obligatorio.")]
    [NotEmptyGuid(ErrorMessage = "Debe seleccionar un usuario válido.")]
    Guid IdUsuario,

    [Required(ErrorMessage = "El equipo es obligatorio.")]
    [NotEmptyGuid(ErrorMessage = "Debe seleccionar un equipo válido.")]
    Guid IdEquipo,

    [Required(ErrorMessage = "La fecha de préstamo es obligatoria.")]
    DateOnly FechaPrestamo,

    [Required(ErrorMessage = "La fecha estimada de devolución es obligatoria.")]
    DateOnly FechaDevolucionEstimada,

    [Required(ErrorMessage = "El motivo del préstamo es obligatorio.")]
    [StringLength(500, MinimumLength = 5, ErrorMessage = "El motivo debe tener entre 5 y 500 caracteres.")]
    string Motivo
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (FechaDevolucionEstimada <= FechaPrestamo)
        {
            yield return new ValidationResult(
                Mensajes.RN04_FechaDevolucionInvalida,
                new[] { nameof(FechaDevolucionEstimada) }
            );
        }
    }
}

public record DevolverPrestamoDto(
    [Required(ErrorMessage = "La observación de devolución es obligatoria.")]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "La observación debe tener entre 3 y 500 caracteres.")]
    string Observacion,

    DateOnly? FechaDevolucionReal = null
);

public record RechazarPrestamoDto(
    [Required(ErrorMessage = "El motivo de rechazo es obligatorio.")]
    [StringLength(500, MinimumLength = 5, ErrorMessage = "El motivo debe tener entre 5 y 500 caracteres.")]
    string Motivo
);
