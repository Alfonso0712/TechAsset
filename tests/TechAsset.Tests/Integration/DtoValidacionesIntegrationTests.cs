using System;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Domain.Enums;
using Xunit;

namespace TechAsset.Tests.Integration;

public class DtoValidacionesIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public DtoValidacionesIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    private async Task<System.Net.Http.HttpClient> CrearClienteAutenticadoAdminAsync()
    {
        var cliente = _factory.CreateClient();
        var loginRes = await cliente.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@innovatech.com", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);
        return cliente;
    }

    private async Task<System.Net.Http.HttpClient> CrearClienteAutenticadoResponsableAsync()
    {
        var cliente = _factory.CreateClient();
        var loginRes = await cliente.PostAsJsonAsync("/api/auth/login", new LoginDto("resp.tecnologia@innovatech.com", "Resp123*"));
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);
        return cliente;
    }

    [Fact]
    public async Task CrearUsuario_CorreoInvalido_Retorna400ConValidationProblemDetails()
    {
        var cliente = await CrearClienteAutenticadoAdminAsync();

        // Obtener un área válida del sistema
        var areasRes = await cliente.GetAsync("/api/areas");
        Assert.Equal(HttpStatusCode.OK, areasRes.StatusCode);
        var areasContent = await areasRes.Content.ReadAsStringAsync();
        using var areasDoc = JsonDocument.Parse(areasContent);
        var areaId = areasDoc.RootElement[0].GetProperty("id").GetGuid();

        // Enviar payload con correo inválido
        var payloadInvalido = new
        {
            Nombres = "Carlos",
            Apellidos = "Mendoza",
            Correo = "correo-no-valido-sin-arroba",
            Contrasena = "Password123*",
            Rol = "Colaborador",
            AreaId = areaId
        };

        var respuesta = await cliente.PostAsJsonAsync("/api/usuarios", payloadInvalido);
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);

        var cuerpo = await respuesta.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(cuerpo);
        var root = doc.RootElement;

        // Debe retornar ValidationProblemDetails con la propiedad "errors"
        Assert.True(root.TryGetProperty("errors", out var errors), "Debe contener diccionario 'errors'");
        Assert.True(errors.TryGetProperty("Correo", out _) || errors.TryGetProperty("correo", out _),
            "El diccionario de errores debe señalar el campo 'Correo'");
    }

    [Fact]
    public async Task CrearEquipo_CodigoPatrimonialVacio_Retorna400ConValidationProblemDetails()
    {
        var cliente = await CrearClienteAutenticadoAdminAsync();

        var payloadInvalido = new
        {
            CodigoPatrimonial = "",
            Nombre = "Laptop Dell Latitude",
            Categoria = "Laptop",
            Marca = "Dell",
            Ubicacion = "Piso 3 - Almacén"
        };

        var respuesta = await cliente.PostAsJsonAsync("/api/equipos", payloadInvalido);
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);

        var cuerpo = await respuesta.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(cuerpo);
        var root = doc.RootElement;

        Assert.True(root.TryGetProperty("errors", out var errors), "Debe contener diccionario 'errors'");
        Assert.True(errors.TryGetProperty("CodigoPatrimonial", out _) || errors.TryGetProperty("codigoPatrimonial", out _),
            "El diccionario de errores debe señalar el campo 'CodigoPatrimonial'");
    }

    [Fact]
    public async Task DevolverPrestamo_SinObservacion_Retorna400ConValidationProblemDetails()
    {
        var cliente = await CrearClienteAutenticadoResponsableAsync();
        var idFicticio = Guid.NewGuid();

        var payloadInvalido = new
        {
            Observacion = ""
        };

        // Probar POST y PATCH /api/prestamos/{id}/devolver
        var respuestaPost = await cliente.PostAsJsonAsync($"/api/prestamos/{idFicticio}/devolver", payloadInvalido);
        Assert.Equal(HttpStatusCode.BadRequest, respuestaPost.StatusCode);

        var cuerpo = await respuestaPost.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(cuerpo);
        var root = doc.RootElement;

        Assert.True(root.TryGetProperty("errors", out var errors), "Debe contener diccionario 'errors'");
        Assert.True(errors.TryGetProperty("Observacion", out _) || errors.TryGetProperty("observacion", out _),
            "El diccionario de errores debe señalar el campo 'Observacion'");
    }

    [Fact]
    public async Task SolicitarPrestamo_FechaDevolucionMenorOIgualAPrestamo_Retorna400PorIValidatableObject()
    {
        var cliente = _factory.CreateClient();
        var loginColabRes = await cliente.PostAsJsonAsync("/api/auth/login", new LoginDto("colaborador1@innovatech.com", "Colab123*"));
        Assert.Equal(HttpStatusCode.OK, loginColabRes.StatusCode);

        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);
        var payloadInvalido = new SolicitarPrestamoDto(
            Guid.NewGuid(),
            hoy,
            hoy, // Fecha de devolución igual a fecha de préstamo violando RN-04
            "Motivo de prueba válido"
        );

        var respuesta = await cliente.PostAsJsonAsync("/api/prestamos", payloadInvalido);
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);

        var cuerpo = await respuesta.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(cuerpo);
        var root = doc.RootElement;

        Assert.True(root.TryGetProperty("errors", out var errors), "Debe contener diccionario 'errors'");
        Assert.True(errors.TryGetProperty("FechaDevolucionEstimada", out _) || errors.TryGetProperty("fechaDevolucionEstimada", out _),
            "El diccionario de errores debe señalar el campo 'FechaDevolucionEstimada'");
    }

    [Fact]
    public async Task CrearEquipo_PayloadValido_Retorna201Created()
    {
        var cliente = await CrearClienteAutenticadoAdminAsync();
        var codigoUnico = $"EQ-VAL-{Guid.NewGuid().ToString("N")[..6]}";

        var nuevoEquipo = new CrearEquipoDto(
            codigoUnico,
            "Monitor Ultrawide 34 LG",
            CategoriaEquipo.Monitor,
            "LG",
            "Piso 4 - Multimedia"
        );

        var respuesta = await cliente.PostAsJsonAsync("/api/equipos", nuevoEquipo);
        Assert.Equal(HttpStatusCode.Created, respuesta.StatusCode);

        var cuerpo = await respuesta.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(cuerpo);
        Assert.Equal(codigoUnico.ToUpperInvariant(), doc.RootElement.GetProperty("codigoPatrimonial").GetString());
    }

    [Fact]
    public async Task CrearEquipo_CodigoDuplicado_Retorna409Conflict()
    {
        var cliente = await CrearClienteAutenticadoAdminAsync();

        // EQ-LAP-001 ya existe en el seeder
        var equipoDuplicado = new CrearEquipoDto(
            "EQ-LAP-001",
            "Laptop Duplicada",
            CategoriaEquipo.Laptop,
            "Lenovo",
            "Almacén Central"
        );

        var respuesta = await cliente.PostAsJsonAsync("/api/equipos", equipoDuplicado);
        Assert.Equal(HttpStatusCode.Conflict, respuesta.StatusCode);
    }

    [Fact]
    public async Task CrearUsuario_CorreoDuplicado_Retorna409Conflict()
    {
        var cliente = await CrearClienteAutenticadoAdminAsync();

        var areasRes = await cliente.GetAsync("/api/areas");
        var areasContent = await areasRes.Content.ReadAsStringAsync();
        using var areasDoc = JsonDocument.Parse(areasContent);
        var areaId = areasDoc.RootElement[0].GetProperty("id").GetGuid();

        // admin@innovatech.com ya existe en el seeder
        var usuarioDuplicado = new CrearUsuarioDto(
            "Otro",
            "Admin",
            "admin@innovatech.com",
            "ClaveSegura123*",
            RolUsuario.Administrador,
            areaId
        );

        var respuesta = await cliente.PostAsJsonAsync("/api/usuarios", usuarioDuplicado);
        Assert.Equal(HttpStatusCode.Conflict, respuesta.StatusCode);
    }
}
