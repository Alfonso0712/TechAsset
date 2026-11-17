using System;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;
using Xunit;

namespace TechAsset.Tests.Unit;

public class RN07_UnicidadCodigoPatrimonialTests
{
    [Fact]
    public void Crear_CodigoPatrimonialNormalizado_SeConvierteAMayusculasYSinEspacios()
    {
        // Act
        var equipo = Equipo.Crear("  eq-lap-099  ", "Laptop Test", CategoriaEquipo.Laptop, "Dell", "Piso 1");

        // Assert
        Assert.Equal("EQ-LAP-099", equipo.Cop_Equipo);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData("1")]
    [InlineData("12")]
    public void Crear_CodigoPatrimonialInvalido_LanzaDomainException(string codigoInvalido)
    {
        // Act & Assert
        Assert.Throws<DomainException>(() =>
            Equipo.Crear(codigoInvalido, "Laptop Test", CategoriaEquipo.Laptop, "Dell", "Piso 1"));
    }
}
