using System;
using TechAsset.Application.DTOs;
using TechAsset.Domain.Enums;
using Xunit;

namespace TechAsset.Tests.Unit;

public class ReporteContratoTests
{
    [Fact]
    public void EquiposMasUtilizadosDto_ExponePropiedadesContratoSinCamposNulos()
    {
        var id = Guid.NewGuid();
        var dto = new EquiposMasUtilizadosDto(
            id,
            "EQ-LAP-001",
            "ThinkPad T14 Gen 4",
            CategoriaEquipo.Laptop,
            7,
            "Lenovo",
            new DateOnly(2026, 11, 15)
        );

        Assert.Equal(id, dto.EquipoId);
        Assert.Equal("EQ-LAP-001", dto.Codigo);
        Assert.Equal("EQ-LAP-001", dto.CodigoPatrimonial);
        Assert.Equal("ThinkPad T14 Gen 4", dto.Nombre);
        Assert.Equal("ThinkPad T14 Gen 4", dto.NombreEquipo);
        Assert.Equal("Lenovo", dto.Marca);
        Assert.Equal(CategoriaEquipo.Laptop, dto.Categoria);
        Assert.Equal(7, dto.TotalPrestamos);
        Assert.NotNull(dto.UltimoPrestamo);
    }

    [Fact]
    public void MovimientoEquipoDto_ExponeFechaHoraYFechaMovimiento()
    {
        var id = Guid.NewGuid();
        var equipoId = Guid.NewGuid();
        var usuarioId = Guid.NewGuid();
        var fecha = DateTime.UtcNow;

        var dto = new MovimientoEquipoDto(
            id,
            equipoId,
            "EQ-LAP-001",
            "ThinkPad T14 Gen 4",
            usuarioId,
            "Elena Huamán Rojas",
            TipoMovimientoEquipo.PrestamoAprobado,
            "Disponible",
            "Prestado",
            "Aprobado conforme.",
            fecha
        );

        Assert.Equal(fecha, dto.FechaMovimiento);
        Assert.Equal(fecha, dto.FechaHora);
        Assert.Equal("EQ-LAP-001", dto.EquipoCodigo);
        Assert.Equal("Elena Huamán Rojas", dto.UsuarioNombre);
    }

    [Fact]
    public void PrestamosPorAreaDto_CalculaPorcentajeSeguroSinNaN()
    {
        var dtoConCero = new PrestamosPorAreaDto("Data Center & Infraestructura", 0, 0, 0, 0, 0.0);
        Assert.Equal(0.0, dtoConCero.Porcentaje);
        Assert.False(double.IsNaN(dtoConCero.Porcentaje));

        var dtoConDatos = new PrestamosPorAreaDto("Desarrollo de Software", 13, 4, 9, 0, 52.0);
        Assert.Equal(13, dtoConDatos.TotalPrestamos);
        Assert.Equal("Desarrollo de Software", dtoConDatos.Area);
        Assert.False(double.IsNaN(dtoConDatos.Porcentaje));
    }
}
