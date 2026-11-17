using TechAsset.Application.DTOs;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Mappers;

public static class EquipoMappers
{
    public static EquipoDto ToDto(this Equipo equipo) =>
        new(
            equipo.Id_Equipo,
            equipo.Cop_Equipo,
            equipo.Nom_Equipo,
            equipo.Cat_Equipo,
            equipo.Mar_Equipo,
            equipo.Est_Equipo,
            equipo.Ubi_Equipo,
            equipo.PuedePrestarse()
        );
}
