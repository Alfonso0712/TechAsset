using System;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;
using Xunit;

namespace TechAsset.Tests.Unit;

public class RN06_BajaLogicaEquiposTests
{
    [Fact]
    public void CambiarEstado_ABaja_ActualizaEstadoABaja()
    {
        // Arrange
        var equipo = Equipo.Crear("EQ-001", "Laptop Antigua", CategoriaEquipo.Laptop, "HP", "Depósito", EstadoEquipo.Disponible);

        // Act
        equipo.CambiarEstado(EstadoEquipo.Baja);

        // Assert
        Assert.Equal(EstadoEquipo.Baja, equipo.Est_Equipo);
    }

    [Fact]
    public void CambiarEstado_CuandoYaEstaEnBaja_NoPermiteReactivacion()
    {
        // Arrange
        var equipo = Equipo.Crear("EQ-001", "Laptop Antigua", CategoriaEquipo.Laptop, "HP", "Depósito", EstadoEquipo.Baja);

        // Act & Assert
        var ex = Assert.Throws<DomainException>(() => equipo.CambiarEstado(EstadoEquipo.Disponible));
        Assert.Equal(Mensajes.RN03_EquipoEnBaja, ex.Message);
    }

    [Fact]
    public void CambiarEstado_ConPrestamoActivo_LanzaDomainException()
    {
        // Arrange
        var equipo = Equipo.Crear("EQ-002", "Laptop Activa", CategoriaEquipo.Laptop, "Dell", "Piso 1", EstadoEquipo.Prestado);

        // Act & Assert
        var exMantenimiento = Assert.Throws<DomainException>(() =>
            equipo.CambiarEstado(EstadoEquipo.Mantenimiento, tienePrestamoActivo: true));
        Assert.Contains("No es posible pasar a Mantenimiento o Baja un equipo con un préstamo activo", exMantenimiento.Message);

        var exBaja = Assert.Throws<DomainException>(() =>
            equipo.CambiarEstado(EstadoEquipo.Baja, tienePrestamoActivo: true));
        Assert.Contains("No es posible pasar a Mantenimiento o Baja un equipo con un préstamo activo", exBaja.Message);
    }
}
