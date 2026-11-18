using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Enums;

namespace TechAsset.Api.Controllers;

[ApiController]
[Route("api/usuarios")]
[Authorize]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginadoDto<UsuarioDto>>> Listar(
        [FromQuery] ParametrosConsultaUsuarios parametros,
        CancellationToken ct)
    {
        var esAdmin = User.IsInRole(nameof(RolUsuario.Administrador));
        var esResp = User.IsInRole(nameof(RolUsuario.ResponsableTecnologia));
        if (!esAdmin && !esResp)
        {
            return Forbid();
        }

        var resultado = await _usuarioService.ListarAsync(parametros, ct);
        return Ok(resultado);
    }

    [HttpGet("responsables")]
    [Authorize(Policy = Permisos.UsuariosListarResponsables)]
    public async Task<ActionResult<IReadOnlyList<UsuarioDto>>> ListarResponsables(CancellationToken ct)
    {
        var responsables = await _usuarioService.ListarResponsablesAsync(ct);
        return Ok(responsables);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Policy = Permisos.UsuariosListar)]
    public async Task<ActionResult<UsuarioDto>> ObtenerPorId(Guid id, CancellationToken ct)
    {
        var usuario = await _usuarioService.ObtenerPorIdAsync(id, ct);
        return Ok(usuario);
    }

    [HttpPost]
    [Authorize(Policy = Permisos.UsuariosCrear)]
    public async Task<ActionResult<UsuarioDto>> Crear([FromBody] CrearUsuarioDto dto, CancellationToken ct)
    {
        var creado = await _usuarioService.CrearAsync(dto, ct);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = Permisos.UsuariosEditar)]
    public async Task<ActionResult<UsuarioDto>> Actualizar(
        Guid id,
        [FromBody] ActualizarUsuarioDto dto,
        CancellationToken ct)
    {
        var actualizado = await _usuarioService.ActualizarAsync(id, dto, ct);
        return Ok(actualizado);
    }

    [HttpPatch("{id:guid}/estado")]
    [Authorize(Policy = Permisos.UsuariosCambiarEstado)]
    public async Task<ActionResult<UsuarioDto>> CambiarEstado(
        Guid id,
        [FromBody] CambiarEstadoUsuarioDto dto,
        CancellationToken ct)
    {
        var actualizado = await _usuarioService.CambiarEstadoAsync(id, dto, ct);
        return Ok(actualizado);
    }

    [HttpPut("preferencias")]
    public async Task<IActionResult> ActualizarPreferencias(
        [FromBody] ActualizarPreferenciasDto dto,
        CancellationToken ct)
    {
        await _usuarioService.ActualizarPreferenciasAsync(dto, ct);
        return NoContent();
    }
}
