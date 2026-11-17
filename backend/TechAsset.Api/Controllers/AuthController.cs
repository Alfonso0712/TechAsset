using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Logging;
using TechAsset.Api.Extensions;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Security;

namespace TechAsset.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    [EnableRateLimiting(ApiExtensions.LoginRateLimiterPolicy)]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto, CancellationToken ct)
    {
        var respuesta = await _authService.IniciarSesionAsync(loginDto, ct);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, respuesta.Usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, respuesta.Usuario.NombreCompleto),
            new Claim(ClaimTypes.Email, respuesta.Usuario.Correo),
            new Claim(ClaimTypes.Role, respuesta.Usuario.Rol.ToString())
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

        return Ok(new
        {
            usuario = respuesta.Usuario,
            permisos = respuesta.Permisos
        });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { mensaje = "Sesión cerrada correctamente" });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> ObtenerUsuarioActual(CancellationToken ct)
    {
        var usuario = await _authService.ObtenerUsuarioActualAsync(ct);
        var permisos = PoliticaDeAcceso.ObtenerPermisos(usuario.Rol);

        return Ok(new
        {
            usuario,
            permisos
        });
    }

    [HttpGet("yo")]
    [Authorize]
    public Task<IActionResult> ObtenerUsuarioActualAlias(CancellationToken ct) => ObtenerUsuarioActual(ct);
}
