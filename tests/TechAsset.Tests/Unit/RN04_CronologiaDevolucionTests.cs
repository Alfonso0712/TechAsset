using System;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Exceptions;
using Xunit;

namespace TechAsset.Tests.Unit;

public class RN04_CronologiaDevolucionTests
{
    [Fact]
    public void CrearSolicitud_FechaDevolucionMenorOIgualAPrestamo_LanzaDomainException()
    {
        // Arrange
        var idUsuario = Guid.NewGuid();
        var idEquipo = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);

        // Act & Assert (Devolución misma fecha)
        var exMismaFecha = Assert.Throws<DomainException>(() =>
            Prestamo.CrearSolicitud(idUsuario, idEquipo, hoy, hoy, "Motivo válido de préstamo"));
        Assert.Equal(Mensajes.RN04_FechaDevolucionInvalida, exMismaFecha.Message);

        // Act & Assert (Devolución anterior)
        var exAnterior = Assert.Throws<DomainException>(() =>
            Prestamo.CrearSolicitud(idUsuario, idEquipo, hoy, hoy.AddDays(-1), "Motivo válido de préstamo"));
        Assert.Equal(Mensajes.RN04_FechaDevolucionInvalida, exAnterior.Message);
    }

    [Fact]
    public void RegistrarDevolucion_FechaDevolucionRealAnteriorAPrestamo_LanzaDomainException()
    {
        // Arrange
        var idUsuario = Guid.NewGuid();
        var idEquipo = Guid.NewGuid();
        var idResponsable = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);

        var prestamo = Prestamo.CrearDirecto(idUsuario, idEquipo, idResponsable, hoy, hoy.AddDays(7), "Motivo válido");

        // Act & Assert
        var ex = Assert.Throws<DomainException>(() =>
            prestamo.RegistrarDevolucion("Observación válida de retorno", hoy.AddDays(-2)));
        Assert.Equal(Mensajes.RN04_FechaDevolucionRealInvalida, ex.Message);
    }

    [Fact]
    public void CrearSolicitud_FechaDevolucionPosterior_CreaPrestamoExitosamente()
    {
        // Arrange
        var idUsuario = Guid.NewGuid();
        var idEquipo = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);

        // Act
        var prestamo = Prestamo.CrearSolicitud(idUsuario, idEquipo, hoy, hoy.AddDays(5), "Desarrollo de módulos");

        // Assert
        Assert.NotNull(prestamo);
        Assert.Equal(hoy, prestamo.Fpr_Prestamo);
        Assert.Equal(hoy.AddDays(5), prestamo.Fde_Prestamo);
    }
}
