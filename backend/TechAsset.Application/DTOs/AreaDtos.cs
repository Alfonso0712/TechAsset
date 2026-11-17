using System;

namespace TechAsset.Application.DTOs;

public record AreaDto(Guid Id, string Nombre, bool Activo);
public record CrearAreaDto(string Nombre);
