using System;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;
using Xunit;

namespace TechAsset.Tests.Unit;

public class RN05_CustodiaResponsableTests
{
    [Fact]
    public void CrearDirecto_SinResponsable_LanzaDomainException()
    {
        // Arrange
        var idUsuario = Guid.NewGuid();
        var idEquipo = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);

        // Act & Assert
        var ex = Assert.Throws<DomainException>(() =>
            Prestamo.CrearDirecto(idUsuario, idEquipo, Guid.Empty, hoy, hoy.AddDays(5), "Motivo válido"));
        Assert.Equal(Mensajes.RN05_ResponsableRequeridoEnActivo, ex.Message);
    }

    [Fact]
    public void Aprobar_SinResponsableValido_LanzaDomainException()
    {
        // Arrange
        var idUsuario = Guid.NewGuid();
        var idEquipo = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);
        var prestamo = Prestamo.CrearSolicitud(idUsuario, idEquipo, hoy, hoy.AddDays(5), "Motivo válido");

        // Act & Assert
        var ex = Assert.Throws<DomainException>(() => prestamo.Aprobar(Guid.Empty));
        Assert.Equal(Mensajes.RN05_ResponsableRequeridoEnActivo, ex.Message);
    }

    [Fact]
    public void Aprobar_ConResponsableValido_TransicionaAEstadoActivo()
    {
        // Arrange
        var idUsuario = Guid.NewGuid();
        var idEquipo = Guid.NewGuid();
        var idResponsable = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);
        var prestamo = Prestamo.CrearSolicitud(idUsuario, idEquipo, hoy, hoy.AddDays(5), "Motivo válido");

        // Act
        prestamo.Aprobar(idResponsable);

        // Assert
        Assert.Equal(EstadoPrestamo.Activo, prestamo.Est_Prestamo);
        Assert.Equal(idResponsable, prestamo.Idr_Prestamo);
    }
}
