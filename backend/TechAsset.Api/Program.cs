using System.IO;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TechAsset.Api.Extensions;
using TechAsset.Api.Middlewares;
using TechAsset.Application.Extensions;
using TechAsset.Infrastructure.Data;
using TechAsset.Infrastructure.Extensions;

// Cargar variables de entorno desde archivo .env si existen
var directorioActual = Directory.GetCurrentDirectory();
var posiblesRutasEnv = new[]
{
    Path.Combine(directorioActual, ".env"),
    Path.Combine(directorioActual, "..", ".env"),
    Path.Combine(directorioActual, "..", "..", ".env")
};
foreach (var rutaEnv in posiblesRutasEnv)
{
    if (File.Exists(rutaEnv))
    {
        foreach (var linea in File.ReadAllLines(rutaEnv))
        {
            var trimmed = linea.Trim();
            if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith("#")) continue;
            var partes = trimmed.Split('=', 2);
            if (partes.Length == 2)
            {
                var clave = partes[0].Trim();
                var valor = partes[1].Trim();
                if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable(clave)))
                {
                    Environment.SetEnvironmentVariable(clave, valor);
                }
            }
        }
        break;
    }
}

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Extension methods de arquitectura
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddFrontendCors();
builder.Services.AddAuthCookie(builder.Environment);
builder.Services.AddPoliticasDeAcceso();
builder.Services.AddLoginRateLimiting(builder.Environment);

var app = builder.Build();

app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(ApiExtensions.CorsPolicyName);

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seeder inicial
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (dbContext.Database.IsRelational())
    {
        await dbContext.Database.MigrateAsync();
    }
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
}

app.Run();

// Requerido para WebApplicationFactory en pruebas de integración
public partial class Program { }
