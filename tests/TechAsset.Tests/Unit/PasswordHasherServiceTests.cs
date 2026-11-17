using TechAsset.Infrastructure.Security;
using Xunit;

namespace TechAsset.Tests.Unit;

public class PasswordHasherServiceTests
{
    private readonly PasswordHasherService _hasher = new();

    [Fact]
    public void HashYVerify_ContrasenaCorrecta_RetornaTrue()
    {
        // Arrange
        var password = "SuperPasswordSegura123*";

        // Act
        var hash = _hasher.HashPassword(password);
        var esValido = _hasher.VerifyPassword(hash, password);

        // Assert
        Assert.True(esValido);
        Assert.NotEqual(password, hash);
    }

    [Fact]
    public void Verify_ContrasenaIncorrecta_RetornaFalse()
    {
        // Arrange
        var hash = _hasher.HashPassword("PasswordReal123*");

        // Act
        var esValido = _hasher.VerifyPassword(hash, "PasswordFalsa123*");

        // Assert
        Assert.False(esValido);
    }

    [Fact]
    public void Verify_SinAtajosNiBackdoors_ContrasenasQuemadasNoAutentican()
    {
        // Arrange (hash aleatorio de un usuario común)
        var hash = _hasher.HashPassword("MiClaveUnica987!");

        // Act & Assert (Las contraseñas de testing antiguas no deben autenticar)
        Assert.False(_hasher.VerifyPassword(hash, "Admin123*"));
        Assert.False(_hasher.VerifyPassword(hash, "AdminUpla2026!"));
        Assert.False(_hasher.VerifyPassword(hash, "RespUpla2026!"));
    }
}
