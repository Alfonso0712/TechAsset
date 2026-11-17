using System;
using System.Collections.Generic;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Enums;

namespace TechAsset.Domain.Security;

public static class PoliticaDeAcceso
{
    private static readonly Dictionary<RolUsuario, HashSet<string>> MapaPermisos = new()
    {
        [RolUsuario.Administrador] = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            Permisos.DashboardVer,
            Permisos.ReportesVer,
            Permisos.UsuariosListar,
            Permisos.UsuariosCrear,
            Permisos.UsuariosEditar,
            Permisos.UsuariosCambiarEstado,
            Permisos.UsuariosListarResponsables,
            Permisos.EquiposVer,
            Permisos.EquiposCrear,
            Permisos.EquiposEditar,
            Permisos.EquiposCambiarEstado,
            Permisos.PrestamosVer,
            Permisos.PrestamosSolicitar
        },
        [RolUsuario.ResponsableTecnologia] = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            Permisos.DashboardVer,
            Permisos.ReportesVer,
            Permisos.UsuariosListarResponsables,
            Permisos.EquiposVer,
            Permisos.EquiposCrear,
            Permisos.EquiposEditar,
            Permisos.EquiposCambiarEstado,
            Permisos.PrestamosVer,
            Permisos.PrestamosSolicitar,
            Permisos.PrestamosAprobarRechazar,
            Permisos.PrestamosDevolver
        },
        [RolUsuario.Colaborador] = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            Permisos.DashboardVer,
            Permisos.EquiposVer,
            Permisos.PrestamosVer,
            Permisos.PrestamosSolicitar
        }
    };

    public static bool Tiene(RolUsuario rol, string permiso)
    {
        if (string.IsNullOrWhiteSpace(permiso)) return false;
        return MapaPermisos.TryGetValue(rol, out var permisos) && permisos.Contains(permiso);
    }

    public static IReadOnlyCollection<string> ObtenerPermisos(RolUsuario rol)
    {
        return MapaPermisos.TryGetValue(rol, out var permisos)
            ? permisos
            : Array.Empty<string>();
    }
}
