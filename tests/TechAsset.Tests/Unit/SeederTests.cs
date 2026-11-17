using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechAsset.Domain.Enums;
using TechAsset.Infrastructure.Data;
using TechAsset.Infrastructure.Security;
using Xunit;

namespace TechAsset.Tests.Unit;

public class SeederTests
{
    [Fact]
    public async Task SeedAsync_PueblaBaseDeDatosConDatosDemo()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        using var context = new AppDbContext(options);
        var hasher = new PasswordHasherService();
        var seeder = new DatabaseSeeder(context, hasher);

        // Act
        await seeder.SeedAsync();

        // Assert
        var totalAreas = await context.Areas.CountAsync();
        var totalUsuarios = await context.Usuarios.CountAsync();
        var totalEquipos = await context.Equipos.CountAsync();
        var totalPrestamos = await context.Prestamos.CountAsync();
        var totalMovimientos = await context.MovimientosEquipo.CountAsync();

        Assert.Equal(6, totalAreas);
        Assert.Equal(11, totalUsuarios);
        Assert.Equal(31, totalEquipos);
        Assert.Equal(25, totalPrestamos);
        Assert.Equal(25, totalMovimientos);

        // Verificar roles
        Assert.Equal(1, await context.Usuarios.CountAsync(u => u.Rol_Usuario == RolUsuario.Administrador));
        Assert.Equal(2, await context.Usuarios.CountAsync(u => u.Rol_Usuario == RolUsuario.ResponsableTecnologia));
        Assert.Equal(8, await context.Usuarios.CountAsync(u => u.Rol_Usuario == RolUsuario.Colaborador));

        // Verificar estados de préstamo
        Assert.Equal(8, await context.Prestamos.CountAsync(p => p.Est_Prestamo == EstadoPrestamo.Activo));
        Assert.Equal(3, await context.Prestamos.CountAsync(p => p.Est_Prestamo == EstadoPrestamo.Pendiente));
        Assert.Equal(2, await context.Prestamos.CountAsync(p => p.Est_Prestamo == EstadoPrestamo.Rechazado));
        Assert.Equal(12, await context.Prestamos.CountAsync(p => p.Est_Prestamo == EstadoPrestamo.Devuelto));
    }
}
