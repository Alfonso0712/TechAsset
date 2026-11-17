using System;
using TechAsset.Domain.Enums;

namespace TechAsset.Application.DTOs;

public record EquipoDto(
    Guid Id,
    string CodigoPatrimonial,
    string Nombre,
    CategoriaEquipo Categoria,
    string Marca,
    EstadoEquipo Estado,
    string Ubicacion,
    bool PuedePrestarse
);

public record CrearEquipoDto(
    string CodigoPatrimonial,
    string Nombre,
    CategoriaEquipo Categoria,
    string Marca,
    string Ubicacion,
    EstadoEquipo EstadoInicial = EstadoEquipo.Disponible
);

public record ActualizarEquipoDto(
    string Nombre,
    CategoriaEquipo Categoria,
    string Marca,
    string Ubicacion
);

public record CambiarEstadoEquipoDto(
    EstadoEquipo NuevoEstado,
    string? Motivo = null
);
