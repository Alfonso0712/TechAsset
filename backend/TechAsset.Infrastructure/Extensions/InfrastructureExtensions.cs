using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Common;
using TechAsset.Infrastructure.Data;
using TechAsset.Infrastructure.Interceptors;
using TechAsset.Infrastructure.Repositories;
using TechAsset.Infrastructure.Security;
using TechAsset.Infrastructure.Services;

namespace TechAsset.Infrastructure.Extensions;

public static class InfrastructureExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<AuditoriaInterceptor>();

        var connectionString = ConstruirCadenaConexion(configuration);

        services.AddDbContext<AppDbContext>((sp, options) =>
        {
            var interceptor = sp.GetRequiredService<AuditoriaInterceptor>();
            options.AddInterceptors(interceptor);

            if (string.IsNullOrWhiteSpace(connectionString)
                || connectionString.Contains("TU_PASSWORD_AQUI", StringComparison.OrdinalIgnoreCase)
                || connectionString.Contains("<CONTRASENA_AQUI>", StringComparison.OrdinalIgnoreCase))
            {
                options.UseInMemoryDatabase("TechAssetInMemoryDb");
            }
            else
            {
                options.UseNpgsql(connectionString, npgsqlOptions =>
                {
                    npgsqlOptions.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName);
                });
            }
        });

        // Reloj y Zona Horaria (America/Lima)
        services.AddSingleton<IRelojServicio, RelojServicio>();

        // Repositorios y Unit of Work
        services.AddScoped<IAreaRepository, AreaRepository>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IEquipoRepository, EquipoRepository>();
        services.AddScoped<IPrestamoRepository, PrestamoRepository>();
        services.AddScoped<IMovimientoEquipoRepository, MovimientoEquipoRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Seguridad (Hasher sin atajos)
        services.AddSingleton<IPasswordHasherService, PasswordHasherService>();

        // Seeder
        services.AddScoped<DatabaseSeeder>();

        return services;
    }

    private static string? ConstruirCadenaConexion(IConfiguration config)
    {
        var dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? config["DB_HOST"] ?? "localhost";
        var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? config["DB_PORT"] ?? "5432";
        var dbName = Environment.GetEnvironmentVariable("POSTGRES_DB") ?? config["POSTGRES_DB"] ?? "techasset_db";

        // Prioridad 1: Si se invoca explícitamente como postgres (para DDL/migraciones administrativas)
        var pgUser = Environment.GetEnvironmentVariable("POSTGRES_USER");
        var pgPass = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD") ?? config["POSTGRES_PASSWORD"];
        if (pgUser == "postgres" && !string.IsNullOrWhiteSpace(pgPass))
        {
            return $"Host={dbHost};Port={dbPort};Database={dbName};Username=postgres;Password={pgPass};Include Error Detail=true";
        }

        // Prioridad 2: Credenciales de aplicación techasset_app
        var appUser = Environment.GetEnvironmentVariable("DB_APP_USER") ?? config["DB_APP_USER"] ?? "techasset_app";
        var appPass = Environment.GetEnvironmentVariable("DB_APP_PASSWORD") ?? config["DB_APP_PASSWORD"];
        if (!string.IsNullOrWhiteSpace(appPass))
        {
            return $"Host={dbHost};Port={dbPort};Database={dbName};Username={appUser};Password={appPass};Include Error Detail=true";
        }

        // Fallback a DefaultConnection si trae password integrado
        var rawConn = config.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrWhiteSpace(rawConn) && rawConn.Contains("Password=", StringComparison.OrdinalIgnoreCase))
        {
            return rawConn;
        }

        return null;
    }
}
