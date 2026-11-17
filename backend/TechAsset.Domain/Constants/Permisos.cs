using System.Collections.Generic;

namespace TechAsset.Domain.Constants;

public static class Permisos
{
    // Dashboard y Reportes
    public const string DashboardVer = "dashboard.ver";
    public const string ReportesVer = "reportes.ver";

    // Usuarios
    public const string UsuariosListar = "usuarios.listar";
    public const string UsuariosCrear = "usuarios.crear";
    public const string UsuariosEditar = "usuarios.editar";
    public const string UsuariosCambiarEstado = "usuarios.cambiarEstado";
    public const string UsuariosListarResponsables = "usuarios.listarResponsables";

    // Equipos
    public const string EquiposVer = "equipos.ver";
    public const string EquiposCrear = "equipos.crear";
    public const string EquiposEditar = "equipos.editar";
    public const string EquiposCambiarEstado = "equipos.cambiarEstado";

    // Préstamos
    public const string PrestamosVer = "prestamos.ver";
    public const string PrestamosSolicitar = "prestamos.solicitar";
    public const string PrestamosAprobarRechazar = "prestamos.aprobarRechazar";
    public const string PrestamosDevolver = "prestamos.devolver";

    public static readonly IReadOnlyList<string> Todos = new[]
    {
        DashboardVer,
        ReportesVer,
        UsuariosListar,
        UsuariosCrear,
        UsuariosEditar,
        UsuariosCambiarEstado,
        UsuariosListarResponsables,
        EquiposVer,
        EquiposCrear,
        EquiposEditar,
        EquiposCambiarEstado,
        PrestamosVer,
        PrestamosSolicitar,
        PrestamosAprobarRechazar,
        PrestamosDevolver
    };
}
