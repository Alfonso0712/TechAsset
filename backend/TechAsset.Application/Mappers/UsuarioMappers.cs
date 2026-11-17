using TechAsset.Application.DTOs;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Mappers;

public static class UsuarioMappers
{
    public static UsuarioDto ToDto(this Usuario usuario) =>
        new(
            usuario.Id_Usuario,
            usuario.Nom_Usuario,
            usuario.Ape_Usuario,
            $"{usuario.Nom_Usuario} {usuario.Ape_Usuario}".Trim(),
            usuario.Cor_Usuario,
            usuario.Rol_Usuario,
            usuario.Ida_Usuario,
            usuario.Area?.Nom_Area,
            usuario.Act_Usuario,
            usuario.Tema,
            usuario.Tamano_Letra
        );
}
