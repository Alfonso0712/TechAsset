using System;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using Xunit;

namespace TechAsset.Tests.Unit;

public class RN09_DesactivacionUsuarioTests
{
    [Fact]
    public void DesactivarYActivar_ActualizaEstadoLogicoCorrectamente()
    {
        // Arrange
        var usuario = Usuario.Crear("Carlos", "Ramos", "cramos@innovatech.com", "Hash123", RolUsuario.Colaborador, Guid.NewGuid());
        Assert.True(usuario.Act_Usuario);

        // Act (Desactivar)
        usuario.Desactivar();

        // Assert
        Assert.False(usuario.Act_Usuario);

        // Act (Reactivar)
        usuario.Activar();

        // Assert
        Assert.True(usuario.Act_Usuario);
    }
}
