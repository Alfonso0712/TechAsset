using System;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Domain.Enums;
using Xunit;

namespace TechAsset.Tests.Integration;

public class PrestamoFlujoIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public PrestamoFlujoIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task FlujoCompleto_SolicitudAprobacionDevolucionYAuditoria()
    {
        // 1. Iniciar sesión como Colaborador
        var clienteColab = _factory.CreateClient();
        var loginColabRes = await clienteColab.PostAsJsonAsync("/api/auth/login", new LoginDto("colaborador1@innovatech.com", "Colab123*"));
        Assert.Equal(HttpStatusCode.OK, loginColabRes.StatusCode);

        // 2. Obtener un equipo disponible del inventario
        var equiposRes = await clienteColab.GetAsync("/api/equipos?estado=Disponible&tamanoPagina=1");
        Assert.Equal(HttpStatusCode.OK, equiposRes.StatusCode);
        var equiposContent = await equiposRes.Content.ReadAsStringAsync();
        using var equiposDoc = JsonDocument.Parse(equiposContent);
        var items = equiposDoc.RootElement.GetProperty("items");
        Assert.True(items.GetArrayLength() > 0, "Debe existir al menos un equipo disponible en el seeder.");
        var equipoId = items[0].GetProperty("id").GetGuid();

        // 3. Colaborador solicita préstamo
        var fechaHoy = DateOnly.FromDateTime(DateTime.UtcNow);
        var solicitarDto = new SolicitarPrestamoDto(
            equipoId,
            fechaHoy,
            fechaHoy.AddDays(3),
            "Capacitación presencial con equipo portátil institucional"
        );
        var solicitudRes = await clienteColab.PostAsJsonAsync("/api/prestamos", solicitarDto);
        Assert.Equal(HttpStatusCode.Created, solicitudRes.StatusCode);

        var prestamoContent = await solicitudRes.Content.ReadAsStringAsync();
        using var prestamoDoc = JsonDocument.Parse(prestamoContent);
        var prestamoId = prestamoDoc.RootElement.GetProperty("id").GetGuid();
        Assert.Equal("Pendiente", prestamoDoc.RootElement.GetProperty("estado").GetString());

        // 4. Iniciar sesión como Responsable de Tecnología
        var clienteResp = _factory.CreateClient();
        var loginRespRes = await clienteResp.PostAsJsonAsync("/api/auth/login", new LoginDto("resp.tecnologia@innovatech.com", "Resp123*"));
        Assert.Equal(HttpStatusCode.OK, loginRespRes.StatusCode);

        // 5. Responsable aprueba el préstamo
        var aprobarRes = await clienteResp.PatchAsync($"/api/prestamos/{prestamoId}/aprobar", null);
        Assert.Equal(HttpStatusCode.OK, aprobarRes.StatusCode);

        var aprobadoContent = await aprobarRes.Content.ReadAsStringAsync();
        using var aprobadoDoc = JsonDocument.Parse(aprobadoContent);
        Assert.Equal("Activo", aprobadoDoc.RootElement.GetProperty("estado").GetString());

        // Verificar que el equipo ahora figura Prestado
        var equipoConsultadoRes = await clienteResp.GetAsync($"/api/equipos/{equipoId}");
        var equipoConsultadoContent = await equipoConsultadoRes.Content.ReadAsStringAsync();
        using var eqDoc = JsonDocument.Parse(equipoConsultadoContent);
        Assert.Equal("Prestado", eqDoc.RootElement.GetProperty("estado").GetString());

        // 6. Intentar registrar devolución sin observación (RN-10) -> debe fallar con 400
        var devolucionSinObs = new DevolverPrestamoDto("", fechaHoy.AddDays(2));
        var devErrorRes = await clienteResp.PatchAsJsonAsync($"/api/prestamos/{prestamoId}/devolver", devolucionSinObs);
        Assert.Equal(HttpStatusCode.BadRequest, devErrorRes.StatusCode);

        // 7. Responsable registra devolución válida con observación técnica obligatoria
        var devolucionValida = new DevolverPrestamoDto(
            "Equipo retornado en perfecto estado operativo y con cargador original verificado.",
            fechaHoy.AddDays(2)
        );
        var devolverRes = await clienteResp.PatchAsJsonAsync($"/api/prestamos/{prestamoId}/devolver", devolucionValida);
        Assert.Equal(HttpStatusCode.OK, devolverRes.StatusCode);

        var devueltoContent = await devolverRes.Content.ReadAsStringAsync();
        using var devueltoDoc = JsonDocument.Parse(devueltoContent);
        Assert.Equal("Devuelto", devueltoDoc.RootElement.GetProperty("estado").GetString());

        // 8. Verificar que el equipo vuelve a estar Disponible
        var equipoFinalRes = await clienteResp.GetAsync($"/api/equipos/{equipoId}");
        var equipoFinalContent = await equipoFinalRes.Content.ReadAsStringAsync();
        using var eqFinalDoc = JsonDocument.Parse(equipoFinalContent);
        Assert.Equal("Disponible", eqFinalDoc.RootElement.GetProperty("estado").GetString());

        // 9. Auditoría RF-17: Consultar movimientos del equipo y comprobar trazabilidad
        var movRes = await clienteResp.GetAsync($"/api/reportes/movimientos?equipoId={equipoId}");
        Assert.Equal(HttpStatusCode.OK, movRes.StatusCode);
        var movContent = await movRes.Content.ReadAsStringAsync();
        using var movDoc = JsonDocument.Parse(movContent);
        var movItems = movDoc.RootElement.GetProperty("items");
        Assert.True(movItems.GetArrayLength() >= 3, "El historial debe contener al menos 3 movimientos generados en el ciclo de vida.");
    }
}
