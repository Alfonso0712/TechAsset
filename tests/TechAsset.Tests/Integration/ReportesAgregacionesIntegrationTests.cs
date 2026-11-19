using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using Xunit;

namespace TechAsset.Tests.Integration;

public class ReportesAgregacionesIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };

    public ReportesAgregacionesIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Dashboard_ObtenerAreaMayorUso_CalculadaCorrectamenteEnBaseDeDatos()
    {
        var cliente = _factory.CreateClient();
        var loginRes = await cliente.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@innovatech.com", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);

        var respuesta = await cliente.GetAsync("/api/reportes/dashboard");
        Assert.Equal(HttpStatusCode.OK, respuesta.StatusCode);

        var contenido = await respuesta.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(contenido);
        var root = doc.RootElement;

        var areaMayorUso = root.GetProperty("areaMayorUso").GetString();
        Assert.NotNull(areaMayorUso);
        Assert.NotEmpty(areaMayorUso);
        Assert.NotEqual("Sin datos suficientes", areaMayorUso);
        Assert.Equal("Desarrollo de Software", areaMayorUso);

        var totalEquipos = root.GetProperty("totalEquipos").GetInt32();
        var totalPrestamos = root.GetProperty("totalPrestamos").GetInt32();
        Assert.True(totalEquipos > 0);
        Assert.True(totalPrestamos > 0);
    }

    [Fact]
    public async Task PrestamosPorArea_AgrupacionSql_OrdenadaDescendentePorTotal()
    {
        var cliente = _factory.CreateClient();
        var loginRes = await cliente.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@innovatech.com", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);

        var respuesta = await cliente.GetAsync("/api/reportes/prestamos-por-area");
        Assert.Equal(HttpStatusCode.OK, respuesta.StatusCode);

        var areas = await respuesta.Content.ReadFromJsonAsync<IReadOnlyList<PrestamosPorAreaDto>>(_jsonOptions);
        Assert.NotNull(areas);
        Assert.NotEmpty(areas);

        // Verificar que está ordenada descendente por TotalPrestamos
        for (int i = 0; i < areas.Count - 1; i++)
        {
            Assert.True(areas[i].TotalPrestamos >= areas[i + 1].TotalPrestamos,
                $"El área {areas[i].AreaNombre} ({areas[i].TotalPrestamos}) debe ser >= {areas[i + 1].AreaNombre} ({areas[i + 1].TotalPrestamos})");
        }

        // El área líder debe ser Desarrollo de Software
        Assert.Equal("Desarrollo de Software", areas[0].AreaNombre);
        Assert.True(areas[0].TotalPrestamos > 0);
        Assert.True(areas[0].Porcentaje > 0);
    }

    [Fact]
    public async Task EquiposMasUtilizados_AgrupacionSql_DevuelveMasFrecuentes()
    {
        var cliente = _factory.CreateClient();
        var loginRes = await cliente.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@innovatech.com", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);

        var respuesta = await cliente.GetAsync("/api/reportes/equipos-mas-utilizados?limite=5");
        var cuerpo = await respuesta.Content.ReadAsStringAsync();
        Assert.True(respuesta.StatusCode == HttpStatusCode.OK, $"Respuesta falló con {respuesta.StatusCode}: {cuerpo}");

        var equipos = await respuesta.Content.ReadFromJsonAsync<IReadOnlyList<EquiposMasUtilizadosDto>>(_jsonOptions);
        Assert.NotNull(equipos);
        Assert.NotEmpty(equipos);
        Assert.True(equipos.Count <= 5);

        for (int i = 0; i < equipos.Count - 1; i++)
        {
            Assert.True(equipos[i].TotalPrestamos >= equipos[i + 1].TotalPrestamos);
        }
    }
}
