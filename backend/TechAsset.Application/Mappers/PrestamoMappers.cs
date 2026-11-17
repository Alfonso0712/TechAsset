using TechAsset.Application.DTOs;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Mappers;

public static class PrestamoMappers
{
    public static PrestamoDto ToDto(this Prestamo prestamo) =>
        new(
            prestamo.Id_Prestamo,
            prestamo.Fpr_Prestamo,
            prestamo.Fde_Prestamo,
            prestamo.Fdr_Prestamo,
            prestamo.Mot_Prestamo,
            prestamo.Obs_Prestamo,
            prestamo.Est_Prestamo,
            prestamo.Idu_Prestamo,
            $"{prestamo.Solicitante?.Nom_Usuario} {prestamo.Solicitante?.Ape_Usuario}".Trim(),
            prestamo.Solicitante?.Cor_Usuario ?? string.Empty,
            prestamo.Solicitante?.Area?.Nom_Area,
            prestamo.Ide_Prestamo,
            prestamo.Equipo?.Cop_Equipo ?? string.Empty,
            prestamo.Equipo?.Nom_Equipo ?? string.Empty,
            prestamo.Equipo?.Cat_Equipo ?? default,
            prestamo.Idr_Prestamo,
            prestamo.Responsable != null ? $"{prestamo.Responsable.Nom_Usuario} {prestamo.Responsable.Ape_Usuario}".Trim() : null
        );
}
