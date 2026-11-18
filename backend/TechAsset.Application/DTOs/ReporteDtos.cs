using System;
using System.Collections.Generic;
using TechAsset.Domain.Enums;

namespace TechAsset.Application.DTOs;

public record MovimientoEquipoDto(
    Guid Id,
    Guid EquipoId,
    string EquipoCodigo,
    string EquipoNombre,
    Guid UsuarioId,
    string UsuarioNombre,
    TipoMovimientoEquipo Tipo,
    string EstadoAnterior,
    string EstadoNuevo,
    string Detalle,
    DateTime FechaMovimiento
)
{
    public DateTime FechaHora => FechaMovimiento;
}

public record DashboardDto(
    int TotalEquipos,
    int EquiposDisponibles,
    int EquiposPrestados,
    int EquiposMantenimiento,
    int EquiposBaja,
    int TotalPrestamos,
    string AreaMayorUso,
    IReadOnlyList<EquiposPorEstadoDto> DistribucionEquipos,
    IReadOnlyList<PrestamosPorAreaDto> PrestamosPorArea,
    IReadOnlyList<PrestamoDto> SolicitudesPendientes,
    int PrestamosHoy = 0,
    int DevolucionesSemana = 0,
    int PrestamosVencidos = 0
);

public record EquiposPorEstadoDto(
    EstadoEquipo Estado,
    string EstadoNombre,
    int Cantidad,
    double Porcentaje
);

public record EquiposMasUtilizadosDto(
    Guid EquipoId,
    string Codigo,
    string Nombre,
    CategoriaEquipo Categoria,
    int TotalPrestamos,
    string? Marca = null,
    DateOnly? UltimoPrestamo = null
)
{
    public string CodigoPatrimonial => Codigo;
    public string NombreEquipo => Nombre;
}

public record PrestamosPorAreaDto(
    string AreaNombre,
    int TotalPrestamos,
    int Activos = 0,
    int Devueltos = 0,
    int Pendientes = 0,
    double Porcentaje = 0
)
{
    public string Area => AreaNombre;
}
