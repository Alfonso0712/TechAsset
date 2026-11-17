using System;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Security;

namespace TechAsset.Domain.Common;

public interface IActor
{
    Guid Id { get; }
    RolUsuario Rol { get; }
    string NombreCompleto { get; }
    bool Tiene(string permiso);
}

public record ActorTechAsset(Guid Id, RolUsuario Rol, string NombreCompleto = "Sistema") : IActor
{
    public bool Tiene(string permiso) => PoliticaDeAcceso.Tiene(Rol, permiso);
}
