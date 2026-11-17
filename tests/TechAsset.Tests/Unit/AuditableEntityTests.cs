using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechAsset.Domain.Common;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using TechAsset.Infrastructure.Data;
using TechAsset.Infrastructure.Interceptors;
using Xunit;

namespace TechAsset.Tests.Unit;

public class AuditableEntityTests
{
    private class TestActorProvider : IActorProvider
    {
        public IActor? Actor => new ActorTechAsset(Guid.NewGuid(), RolUsuario.Administrador, "Carlos Mendoza");
    }

    [Fact]
    public async Task SaveChanges_EntidadNueva_AsignaFechaCreacionYCreadorAutomaticamente()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .AddInterceptors(new AuditoriaInterceptor(new TestActorProvider()))
            .Options;

        using var context = new AppDbContext(options);
        var area = Area.Crear("Innovación");

        // Act
        context.Areas.Add(area);
        await context.SaveChangesAsync();

        // Assert
        Assert.True(area.Fre_Creacion > DateTime.UtcNow.AddMinutes(-1));
        Assert.Equal("Carlos Mendoza", area.Ucr_Creador);
    }
}
