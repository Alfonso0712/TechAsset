using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Domain.Constants;
using Xunit;

namespace TechAsset.Tests.Integration;

public class AuthIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public AuthIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Login_CredencialesIncorrectas_Retorna401()
    {
        var client = _factory.CreateClient();
        var dto = new LoginDto("inexistente@innovatech.com", "ClaveInvalida123*");

        var response = await client.PostAsJsonAsync("/api/auth/login", dto);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_AdminCorrecto_Retorna200YSetCookie()
    {
        var client = _factory.CreateClient();
        var dto = new LoginDto("admin@innovatech.com", "Admin123*");

        var response = await client.PostAsJsonAsync("/api/auth/login", dto);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(response.Headers.Contains("Set-Cookie"), "La respuesta debe emitir una cookie de autenticación.");

        var content = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(content);
        var root = doc.RootElement;

        Assert.True(root.TryGetProperty("usuario", out var userEl));
        Assert.Equal("admin@innovatech.com", userEl.GetProperty("correo").GetString());
        Assert.True(root.TryGetProperty("permisos", out var permisosEl));
        Assert.True(permisosEl.GetArrayLength() > 0);
    }

    [Fact]
    public async Task Me_SinAutenticacion_Retorna401()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Me_ConAutenticacion_Retorna200YUsuario()
    {
        var client = _factory.CreateClient();
        var loginDto = new LoginDto("admin@innovatech.com", "Admin123*");

        var loginRes = await client.PostAsJsonAsync("/api/auth/login", loginDto);
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);

        var meRes = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, meRes.StatusCode);

        var content = await meRes.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(content);
        Assert.Equal("admin@innovatech.com", doc.RootElement.GetProperty("usuario").GetProperty("correo").GetString());
    }

    [Fact]
    public async Task Usuarios_ColaboradorIntentaListar_Retorna403()
    {
        var client = _factory.CreateClient();
        var loginDto = new LoginDto("colaborador1@innovatech.com", "Colab123*");

        var loginRes = await client.PostAsJsonAsync("/api/auth/login", loginDto);
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);

        var usuariosRes = await client.GetAsync("/api/usuarios");
        Assert.Equal(HttpStatusCode.Forbidden, usuariosRes.StatusCode);
    }

    [Fact]
    public async Task Logout_CierraSesion_Retorna200YBloqueaMe()
    {
        var client = _factory.CreateClient();
        var loginDto = new LoginDto("admin@innovatech.com", "Admin123*");

        await client.PostAsJsonAsync("/api/auth/login", loginDto);

        var logoutRes = await client.PostAsync("/api/auth/logout", null);
        Assert.Equal(HttpStatusCode.OK, logoutRes.StatusCode);

        var meRes = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.Unauthorized, meRes.StatusCode);
    }
}
