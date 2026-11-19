using System;
using System.ComponentModel.DataAnnotations;
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
    [Required(ErrorMessage = "El código patrimonial es obligatorio.")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "El código patrimonial debe tener entre 3 y 50 caracteres.")]
    string CodigoPatrimonial,

    [Required(ErrorMessage = "El nombre del equipo es obligatorio.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre del equipo debe tener entre 3 y 100 caracteres.")]
    string Nombre,

    [EnumDataType(typeof(CategoriaEquipo), ErrorMessage = "La categoría del equipo no es válida.")]
    CategoriaEquipo Categoria,

    [Required(ErrorMessage = "La marca del equipo es obligatoria.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "La marca debe tener entre 2 y 50 caracteres.")]
    string Marca,

    [Required(ErrorMessage = "La ubicación física es obligatoria.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "La ubicación debe tener entre 2 y 100 caracteres.")]
    string Ubicacion,

    [EnumDataType(typeof(EstadoEquipo), ErrorMessage = "El estado inicial no es válido.")]
    EstadoEquipo EstadoInicial = EstadoEquipo.Disponible
);

public record ActualizarEquipoDto(
    [Required(ErrorMessage = "El nombre del equipo es obligatorio.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre del equipo debe tener entre 3 y 100 caracteres.")]
    string Nombre,

    [EnumDataType(typeof(CategoriaEquipo), ErrorMessage = "La categoría del equipo no es válida.")]
    CategoriaEquipo Categoria,

    [Required(ErrorMessage = "La marca del equipo es obligatoria.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "La marca debe tener entre 2 y 50 caracteres.")]
    string Marca,

    [Required(ErrorMessage = "La ubicación física es obligatoria.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "La ubicación debe tener entre 2 y 100 caracteres.")]
    string Ubicacion
);

public record CambiarEstadoEquipoDto(
    [EnumDataType(typeof(EstadoEquipo), ErrorMessage = "El estado especificado no es válido.")]
    EstadoEquipo NuevoEstado,

    [StringLength(500, ErrorMessage = "El motivo no puede exceder los 500 caracteres.")]
    string? Motivo = null
);
