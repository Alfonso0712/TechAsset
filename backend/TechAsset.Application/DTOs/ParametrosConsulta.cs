using System;
using TechAsset.Domain.Enums;

namespace TechAsset.Application.DTOs;

public record ParametrosConsultaUsuarios(
    string? Texto = null,
    RolUsuario? Rol = null,
    bool? Activo = null,
    Guid? AreaId = null,
    int Pagina = 1,
    int TamanoPagina = 10
);

public record ParametrosConsultaEquipos(
    string? Texto = null,
    CategoriaEquipo? Categoria = null,
    EstadoEquipo? Estado = null,
    string? Ubicacion = null,
    int Pagina = 1,
    int TamanoPagina = 10
);

public record ParametrosConsultaPrestamos(
    EstadoPrestamo? Estado = null,
    Guid? ColaboradorId = null,
    Guid? EquipoId = null,
    DateOnly? FechaDesde = null,
    DateOnly? FechaHasta = null,
    int Pagina = 1,
    int TamanoPagina = 10
);

public record ParametrosConsultaMovimientos(
    Guid? EquipoId = null,
    Guid? UsuarioId = null,
    TipoMovimientoEquipo? Tipo = null,
    int Pagina = 1,
    int TamanoPagina = 10
);
