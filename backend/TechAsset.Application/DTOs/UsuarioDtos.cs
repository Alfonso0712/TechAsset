using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TechAsset.Application.Validation;
using TechAsset.Domain.Enums;

namespace TechAsset.Application.DTOs;

public record UsuarioDto(
    Guid Id,
    string Nombres,
    string Apellidos,
    string NombreCompleto,
    string Correo,
    RolUsuario Rol,
    Guid AreaId,
    string? AreaNombre,
    bool Activo,
    string Tema,
    string TamanoLetra
);

public record CrearUsuarioDto(
    [Required(ErrorMessage = "Los nombres son obligatorios.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Los nombres deben tener entre 2 y 100 caracteres.")]
    string Nombres,

    [Required(ErrorMessage = "Los apellidos son obligatorios.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Los apellidos deben tener entre 2 y 100 caracteres.")]
    string Apellidos,

    [Required(ErrorMessage = "El correo es obligatorio.")]
    [EmailAddress(ErrorMessage = "El formato del correo corporativo no es válido.")]
    [StringLength(150, ErrorMessage = "El correo no puede exceder los 150 caracteres.")]
    string Correo,

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
    string Contrasena,

    [EnumDataType(typeof(RolUsuario), ErrorMessage = "El rol especificado no es válido.")]
    RolUsuario Rol,

    [Required(ErrorMessage = "El área es obligatoria.")]
    [NotEmptyGuid(ErrorMessage = "Debe seleccionar un área válida.")]
    Guid AreaId
);

public record ActualizarUsuarioDto(
    [Required(ErrorMessage = "Los nombres son obligatorios.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Los nombres deben tener entre 2 y 100 caracteres.")]
    string Nombres,

    [Required(ErrorMessage = "Los apellidos son obligatorios.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Los apellidos deben tener entre 2 y 100 caracteres.")]
    string Apellidos,

    [Required(ErrorMessage = "El área es obligatoria.")]
    [NotEmptyGuid(ErrorMessage = "Debe seleccionar un área válida.")]
    Guid AreaId,

    [EnumDataType(typeof(RolUsuario), ErrorMessage = "El rol especificado no es válido.")]
    RolUsuario? Rol = null
);

public record ActualizarPreferenciasDto(
    [StringLength(20)]
    string? Tema,

    [StringLength(20)]
    string? TamanoLetra
);

public record CambiarEstadoUsuarioDto(
    bool Activo
);

public record LoginDto(
    [Required(ErrorMessage = "El correo corporativo es obligatorio.")]
    [EmailAddress(ErrorMessage = "El formato del correo corporativo no es válido.")]
    [StringLength(150, ErrorMessage = "El correo no puede exceder los 150 caracteres.")]
    string Correo,

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
    string Contrasena,

    bool RecordarCorreo = false
);

public record LoginRespuestaDto(
    UsuarioDto Usuario,
    IReadOnlyCollection<string> Permisos
);
