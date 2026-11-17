using System;
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
    string Nombres,
    string Apellidos,
    string Correo,
    string Contrasena,
    RolUsuario Rol,
    Guid AreaId
);

public record ActualizarUsuarioDto(
    string Nombres,
    string Apellidos,
    Guid AreaId,
    RolUsuario? Rol = null
);

public record ActualizarPreferenciasDto(
    string? Tema,
    string? TamanoLetra
);

public record CambiarEstadoUsuarioDto(
    bool Activo
);

public record LoginDto(
    string Correo,
    string Contrasena,
    bool RecordarCorreo = false
);

public record LoginRespuestaDto(
    UsuarioDto Usuario,
    IReadOnlyCollection<string> Permisos
);
