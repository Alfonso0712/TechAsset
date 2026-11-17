using Microsoft.Extensions.DependencyInjection;
using TechAsset.Application.Interfaces;
using TechAsset.Application.Services;

namespace TechAsset.Application.Extensions;

public static class ApplicationExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAreaService, AreaService>();
        services.AddScoped<IUsuarioService, UsuarioService>();
        services.AddScoped<IEquipoService, EquipoService>();
        services.AddScoped<IPrestamoService, PrestamoService>();
        services.AddScoped<IReporteService, ReporteService>();

        return services;
    }
}
