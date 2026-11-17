using TechAsset.Application.DTOs;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Mappers;

public static class MovimientoMappers
{
    public static MovimientoEquipoDto ToDto(this MovimientoEquipo m) =>
        new(
            m.Id_Movimiento,
            m.Ide_Movimiento,
            m.Equipo?.Cop_Equipo ?? string.Empty,
            m.Equipo?.Nom_Equipo ?? string.Empty,
            m.Idu_Movimiento,
            $"{m.Usuario?.Nom_Usuario} {m.Usuario?.Ape_Usuario}".Trim(),
            m.Tip_Movimiento,
            m.Est_Anterior,
            m.Est_Nuevo,
            m.Det_Movimiento,
            m.Fec_Movimiento
        );
}
