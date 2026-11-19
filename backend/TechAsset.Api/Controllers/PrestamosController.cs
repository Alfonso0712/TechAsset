using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Constants;

namespace TechAsset.Api.Controllers;

[ApiController]
[Route("api/prestamos")]
[Authorize]
public class PrestamosController : ControllerBase
{
    private readonly IPrestamoService _prestamoService;

    public PrestamosController(IPrestamoService prestamoService)
    {
        _prestamoService = prestamoService;
    }

    [HttpGet]
    [Authorize(Policy = Permisos.PrestamosVer)]
    public async Task<ActionResult<PaginadoDto<PrestamoDto>>> Listar(
        [FromQuery] ParametrosConsultaPrestamos parametros,
        CancellationToken ct)
    {
        var resultado = await _prestamoService.ListarAsync(parametros, ct);
        return Ok(resultado);
    }

    [HttpGet("activos")]
    [Authorize(Policy = Permisos.PrestamosVer)]
    public async Task<ActionResult<IReadOnlyList<PrestamoDto>>> ListarActivos(CancellationToken ct)
    {
        var resultado = await _prestamoService.ListarActivosAsync(ct);
        return Ok(resultado);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Policy = Permisos.PrestamosVer)]
    public async Task<ActionResult<PrestamoDto>> ObtenerPorId(Guid id, CancellationToken ct)
    {
        var prestamo = await _prestamoService.ObtenerPorIdAsync(id, ct);
        return Ok(prestamo);
    }

    [HttpPost]
    [Authorize(Policy = Permisos.PrestamosSolicitar)]
    public async Task<ActionResult<PrestamoDto>> Solicitar(
        [FromBody] SolicitarPrestamoDto dto,
        CancellationToken ct)
    {
        var creado = await _prestamoService.SolicitarAsync(dto, ct);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
    }

    [HttpPost("directo")]
    [Authorize(Policy = Permisos.PrestamosAprobarRechazar)]
    public async Task<ActionResult<PrestamoDto>> CrearDirecto(
        [FromBody] CrearPrestamoDirectoDto dto,
        CancellationToken ct)
    {
        var creado = await _prestamoService.CrearDirectoAsync(dto, ct);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
    }

    [HttpPatch("{id:guid}/aprobar")]
    [Authorize(Policy = Permisos.PrestamosAprobarRechazar)]
    public async Task<ActionResult<PrestamoDto>> Aprobar(Guid id, CancellationToken ct)
    {
        var aprobado = await _prestamoService.AprobarAsync(id, ct);
        return Ok(aprobado);
    }

    [HttpPatch("{id:guid}/rechazar")]
    [Authorize(Policy = Permisos.PrestamosAprobarRechazar)]
    public async Task<ActionResult<PrestamoDto>> Rechazar(
        Guid id,
        [FromBody] RechazarPrestamoDto dto,
        CancellationToken ct)
    {
        var rechazado = await _prestamoService.RechazarAsync(id, dto, ct);
        return Ok(rechazado);
    }

    [HttpPatch("{id:guid}/devolver")]
    [HttpPost("{id:guid}/devolver")]
    [Authorize(Policy = Permisos.PrestamosDevolver)]
    public async Task<ActionResult<PrestamoDto>> RegistrarDevolucion(
        Guid id,
        [FromBody] DevolverPrestamoDto dto,
        CancellationToken ct)
    {
        var devuelto = await _prestamoService.RegistrarDevolucionAsync(id, dto, ct);
        return Ok(devuelto);
    }
}
