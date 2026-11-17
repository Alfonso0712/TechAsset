using System;
using System.Security.Claims;
using System.Threading.RateLimiting;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TechAsset.Api.Security;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Security;
using TechAsset.Infrastructure.Data;

namespace TechAsset.Api.Extensions;

public static class ApiExtensions
{
    public const string CorsPolicyName = "FrontendCors";
    public const string LoginRateLimiterPolicy = "LoginLimiter";

    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var idStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(idStr, out var id) ? id : Guid.Empty;
    }

    public static RolUsuario GetUserRole(this ClaimsPrincipal user)
    {
        var rolStr = user.FindFirstValue(ClaimTypes.Role);
        return Enum.TryParse<RolUsuario>(rolStr, true, out var rol) ? rol : RolUsuario.Colaborador;
    }

    public static IServiceCollection AddFrontendCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(CorsPolicyName, policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                      .AllowCredentials()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });
        return services;
    }

    public static IServiceCollection AddAuthCookie(this IServiceCollection services, IWebHostEnvironment env)
    {
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Cookie.Name = "TechAsset.Auth";
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.Lax;
                options.Cookie.SecurePolicy = env.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;

                options.Events.OnRedirectToLogin = ctx =>
                {
                    ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };

                options.Events.OnRedirectToAccessDenied = async ctx =>
                {
                    ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
                    ctx.Response.ContentType = "application/json";
                    await ctx.Response.WriteAsJsonAsync(new { error = Mensajes.AccesoDenegado, mensaje = Mensajes.AccesoDenegado });
                };

                // MEJORA OBLIGATORIA #3: Validación activa de usuario y rol en BD por cada request autenticado
                options.Events.OnValidatePrincipal = async ctx =>
                {
                    var dbContext = ctx.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                    var userIdStr = ctx.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (!Guid.TryParse(userIdStr, out var userId))
                    {
                        ctx.RejectPrincipal();
                        await ctx.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                        return;
                    }

                    var usuario = await dbContext.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Id_Usuario == userId);
                    if (usuario == null || !usuario.Act_Usuario)
                    {
                        ctx.RejectPrincipal();
                        await ctx.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                        return;
                    }

                    var claimRol = ctx.Principal?.FindFirstValue(ClaimTypes.Role);
                    if (usuario.Rol_Usuario.ToString() != claimRol)
                    {
                        ctx.RejectPrincipal();
                        await ctx.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                        return;
                    }
                };
            });

        return services;
    }

    public static IServiceCollection AddPoliticasDeAcceso(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<IUsuarioActual, UsuarioActual>();
        services.AddScoped<IAuthorizationHandler, PermisoAuthorizationHandler>();

        services.AddAuthorization(options =>
        {
            foreach (var permiso in Permisos.Todos)
            {
                options.AddPolicy(permiso, policy => policy.Requirements.Add(new PermisoRequirement(permiso)));
            }
        });

        return services;
    }

    public static IServiceCollection AddLoginRateLimiting(this IServiceCollection services, IWebHostEnvironment? env = null)
    {
        var limite = env != null && env.IsDevelopment() ? 50 : 5;
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.OnRejected = async (context, token) =>
            {
                context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.HttpContext.Response.Headers.RetryAfter = "60";
                context.HttpContext.Response.ContentType = "application/problem+json";

                var problem = new ProblemDetails
                {
                    Status = StatusCodes.Status429TooManyRequests,
                    Title = "Demasiados intentos",
                    Detail = "Ha superado el límite de intentos permitidos. Intente nuevamente en 60 segundos."
                };
                await context.HttpContext.Response.WriteAsJsonAsync(problem, cancellationToken: token);
            };

            options.AddPolicy(LoginRateLimiterPolicy, httpContext =>
            {
                var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonimo";
                return RateLimitPartition.GetFixedWindowLimiter(
                    ip,
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = limite,
                        Window = TimeSpan.FromMinutes(1),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
            });
        });

        return services;
    }
}
