using System;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using Xunit;

namespace TechAsset.Tests.Integration;

public class PrestamoDirectoRolIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public PrestamoDirectoRolIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task CrearDirecto_Anonimo_Retorna401Unauthorized()
    {
        var cliente = _factory.CreateClient();
        var dto = new CrearPrestamoDirectoDto(
            Guid.NewGuid(),
            Guid.NewGuid(),
            DateOnly.FromDateTime(DateTime.UtcNow),
            DateOnly.FromDateTime(DateTime.UtcNow).AddDays(5),
            "Asignación directa sin autenticación"
        );

        var respuesta = await cliente.PostAsJsonAsync("/api/prestamos/directo", dto);
        Assert.Equal(HttpStatusCode.Unauthorized, respuesta.StatusCode);
    }

    [Fact]
    public async Task CrearDirecto_Colaborador_Retorna403Forbidden()
    {
        var cliente = _factory.CreateClient();
        var login = await cliente.PostAsJsonAsync("/api/auth/login", new LoginDto("colaborador1@innovatech.com", "Colab123*"));
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);

        var dto = new CrearPrestamoDirectoDto(
            Guid.NewGuid(),
            Guid.NewGuid(),
            DateOnly.FromDateTime(DateTime.UtcNow),
            DateOnly.FromDateTime(DateTime.UtcNow).AddDays(5),
            "Intento de registro directo como colaborador"
        );

        var respuesta = await cliente.PostAsJsonAsync("/api/prestamos/directo", dto);
        Assert.Equal(HttpStatusCode.Forbidden, respuesta.StatusCode);
    }

    [Fact]
    public async Task CrearDirecto_Administrador_Retorna403Forbidden()
    {
        var cliente = _factory.CreateClient();
        var login = await cliente.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@innovatech.com", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);

        var dto = new CrearPrestamoDirectoDto(
            Guid.NewGuid(),
            Guid.NewGuid(),
            DateOnly.FromDateTime(DateTime.UtcNow),
            DateOnly.FromDateTime(DateTime.UtcNow).AddDays(5),
            "Intento de registro directo como administrador supervisor"
        );

        var respuesta = await cliente.PostAsJsonAsync("/api/prestamos/directo", dto);
        Assert.Equal(HttpStatusCode.Forbidden, respuesta.StatusCode);
    }

    [Fact]
    public async Task CrearDirecto_ResponsableTecnologia_Retorna201CreatedYNaceActivo()
    {
        var cliente = _factory.CreateClient();
        var login = await cliente.PostAsJsonAsync("/api/auth/login", new LoginDto("resp.tecnologia@innovatech.com", "Resp123*"));
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);

        // Obtener un equipo disponible
        var equiposRes = await cliente.GetAsync("/api/equipos?estado=Disponible&tamanoPagina=1");
        Assert.Equal(HttpStatusCode.OK, equiposRes.StatusCode);
        var equiposContent = await equiposRes.Content.ReadAsStringAsync();
        using var eqDoc = JsonDocument.Parse(equiposContent);
        var equipoId = eqDoc.RootElement.GetProperty("items")[0].GetProperty("id").GetGuid();

        // Obtener un usuario colaborador
        var usuariosRes = await cliente.GetAsync("/api/usuarios?activo=true&tamanoPagina=10");
        Assert.Equal(HttpStatusCode.OK, usuariosRes.StatusCode);
        var usuariosContent = await usuariosRes.Content.ReadAsStringAsync();
        using var usDoc = JsonDocument.Parse(usuariosContent);
        var usuarioId = usDoc.RootElement.GetProperty("items")[0].GetProperty("id").GetGuid();

        var fechaHoy = DateOnly.FromDateTime(DateTime.UtcNow);
        var dto = new CrearPrestamoDirectoDto(
            usuarioId,
            equipoId,
            fechaHoy,
            fechaHoy.AddDays(7),
            "Asignación directa y operativa por Responsable TI para proyecto urgente"
        );

        var respuesta = await cliente.PostAsJsonAsync("/api/prestamos/directo", dto);
        Assert.Equal(HttpStatusCode.Created, respuesta.StatusCode);

        var creadoContent = await respuesta.Content.ReadAsStringAsync();
        using var creadoDoc = JsonDocument.Parse(creadoContent);
        Assert.Equal("Activo", creadoDoc.RootElement.GetProperty("estado").GetString());
    }
}
