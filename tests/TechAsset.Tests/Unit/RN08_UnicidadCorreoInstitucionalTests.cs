using System;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;
using Xunit;

namespace TechAsset.Tests.Unit;

public class RN08_UnicidadCorreoInstitucionalTests
{
    [Fact]
    public void Crear_CorreoNormalizado_SeConvierteAMinusculasYSinEspacios()
    {
        // Act
        var usuario = Usuario.Crear("Juan", "Pérez", "  JUAN.PEREZ@innovatech.com  ", "Hash123", RolUsuario.Colaborador, Guid.NewGuid());

        // Assert
        Assert.Equal("juan.perez@innovatech.com", usuario.Cor_Usuario);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData("correosinformat")]
    [InlineData("correo@")]
    [InlineData("@innovatech.com")]
    public void Crear_CorreoConFormatoInvalido_LanzaDomainException(string correoInvalido)
    {
        // Act & Assert
        Assert.Throws<DomainException>(() =>
            Usuario.Crear("Juan", "Pérez", correoInvalido, "Hash123", RolUsuario.Colaborador, Guid.NewGuid()));
    }
}
