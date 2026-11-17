using System;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;
using Xunit;

namespace TechAsset.Tests.Unit;

public class RN10_ObservacionDevolucionTests
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("ok")]
    [InlineData("bien")]
    public void RegistrarDevolucion_SinObservacionValida_LanzaDomainException(string? observacionInvalida)
    {
        // Arrange
        var idUsuario = Guid.NewGuid();
        var idEquipo = Guid.NewGuid();
        var idResponsable = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);

        var prestamo = Prestamo.CrearDirecto(idUsuario, idEquipo, idResponsable, hoy.AddDays(-5), hoy.AddDays(5), "Motivo de prueba");

        // Act & Assert
        var ex = Assert.Throws<DomainException>(() =>
            prestamo.RegistrarDevolucion(observacionInvalida!, hoy));
        Assert.Equal(Mensajes.RN10_ObservacionDevolucionRequerida, ex.Message);
    }

    [Fact]
    public void RegistrarDevolucion_ConObservacionValida_PasaAEstadoDevuelto()
    {
        // Arrange
        var idUsuario = Guid.NewGuid();
        var idEquipo = Guid.NewGuid();
        var idResponsable = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);

        var prestamo = Prestamo.CrearDirecto(idUsuario, idEquipo, idResponsable, hoy.AddDays(-5), hoy.AddDays(5), "Motivo de prueba");

        // Act
        prestamo.RegistrarDevolucion("Equipo retornado en perfecto estado de funcionamiento.", hoy);

        // Assert
        Assert.Equal(EstadoPrestamo.Devuelto, prestamo.Est_Prestamo);
        Assert.Equal(hoy, prestamo.Fdr_Prestamo);
        Assert.Equal("Equipo retornado en perfecto estado de funcionamiento.", prestamo.Obs_Prestamo);
    }
}
