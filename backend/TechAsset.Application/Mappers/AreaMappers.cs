using TechAsset.Application.DTOs;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Mappers;

public static class AreaMappers
{
    public static AreaDto ToDto(this Area area) =>
        new(area.Id_Area, area.Nom_Area, area.Act_Area);
}
