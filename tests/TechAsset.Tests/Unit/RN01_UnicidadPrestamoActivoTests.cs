using System;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;
using Xunit;

namespace TechAsset.Tests.Unit;

public class RN01_UnicidadPrestamoActivoTests
{
    [Fact]
    public void MarcarComoPrestado_CuandoYaEstaPrestado_LanzaDomainException()
    {
        // Arrange
        var equipo = Equipo.Crear("EQ-001", "Laptop Pro", CategoriaEquipo.Laptop, "Dell", "Lab 1", EstadoEquipo.Prestado);

        // Act & Assert
        var ex = Assert.Throws<DomainException>(() => equipo.MarcarComoPrestado());
        Assert.Equal(Mensajes.RN01_EquipoConPrestamoActivo, ex.Message);
    }

    [Fact]
    public void MarcarComoPrestado_CuandoEstaDisponible_CambiaAEstadoPrestado()
    {
        // Arrange
        var equipo = Equipo.Crear("EQ-002", "Laptop Dev", CategoriaEquipo.Laptop, "Lenovo", "Lab 1", EstadoEquipo.Disponible);

        // Act
        equipo.MarcarComoPrestado();

        // Assert
        Assert.Equal(EstadoEquipo.Prestado, equipo.Est_Equipo);
    }
}
