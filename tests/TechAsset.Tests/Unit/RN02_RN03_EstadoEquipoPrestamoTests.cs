using System;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;
using Xunit;

namespace TechAsset.Tests.Unit;

public class RN02_RN03_EstadoEquipoPrestamoTests
{
    [Fact]
    public void RN02_PuedePrestarse_CuandoEstaEnMantenimiento_RetornaFalse()
    {
        // Arrange
        var equipo = Equipo.Crear("EQ-MNT-01", "Monitor 4K", CategoriaEquipo.Monitor, "LG", "Taller", EstadoEquipo.Mantenimiento);

        // Act & Assert
        Assert.False(equipo.PuedePrestarse());
        var ex = Assert.Throws<DomainException>(() => equipo.MarcarComoPrestado());
        Assert.Equal(Mensajes.RN02_EquipoEnMantenimiento, ex.Message);
    }

    [Fact]
    public void RN03_PuedePrestarse_CuandoEstaEnBaja_RetornaFalse()
    {
        // Arrange
        var equipo = Equipo.Crear("EQ-BAJ-01", "Impresora Antigua", CategoriaEquipo.Impresora, "HP", "Depósito", EstadoEquipo.Baja);

        // Act & Assert
        Assert.False(equipo.PuedePrestarse());
        var ex = Assert.Throws<DomainException>(() => equipo.MarcarComoPrestado());
        Assert.Equal(Mensajes.RN03_EquipoEnBaja, ex.Message);
    }

    [Fact]
    public void RN02_RN03_PuedePrestarse_CuandoEstaDisponible_RetornaTrue()
    {
        // Arrange
        var equipo = Equipo.Crear("EQ-DIS-01", "Tablet Pro", CategoriaEquipo.Tablet, "Apple", "Almacén", EstadoEquipo.Disponible);

        // Act & Assert
        Assert.True(equipo.PuedePrestarse());
    }
}
