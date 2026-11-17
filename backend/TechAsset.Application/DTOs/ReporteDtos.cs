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
);

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
    IReadOnlyList<PrestamoDto> SolicitudesPendientes
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
    int TotalPrestamos
);

public record PrestamosPorAreaDto(
    string AreaNombre,
    int TotalPrestamos
);
