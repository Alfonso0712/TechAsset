using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Constants;

namespace TechAsset.Api.Controllers;

[ApiController]
[Route("api/equipos")]
[Authorize]
public class EquiposController : ControllerBase
{
    private readonly IEquipoService _equipoService;

    public EquiposController(IEquipoService equipoService)
    {
        _equipoService = equipoService;
    }

    [HttpGet]
    [Authorize(Policy = Permisos.EquiposVer)]
    public async Task<ActionResult<PaginadoDto<EquipoDto>>> Listar(
        [FromQuery] ParametrosConsultaEquipos parametros,
        CancellationToken ct)
    {
        var resultado = await _equipoService.ListarAsync(parametros, ct);
        return Ok(resultado);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Policy = Permisos.EquiposVer)]
    public async Task<ActionResult<EquipoDto>> ObtenerPorId(Guid id, CancellationToken ct)
    {
        var equipo = await _equipoService.ObtenerPorIdAsync(id, ct);
        return Ok(equipo);
    }

    [HttpPost]
    [Authorize(Policy = Permisos.EquiposCrear)]
    public async Task<ActionResult<EquipoDto>> Crear([FromBody] CrearEquipoDto dto, CancellationToken ct)
    {
        var creado = await _equipoService.CrearAsync(dto, ct);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = Permisos.EquiposEditar)]
    public async Task<ActionResult<EquipoDto>> Actualizar(
        Guid id,
        [FromBody] ActualizarEquipoDto dto,
        CancellationToken ct)
    {
        var actualizado = await _equipoService.ActualizarAsync(id, dto, ct);
        return Ok(actualizado);
    }

    [HttpPatch("{id:guid}/estado")]
    [Authorize(Policy = Permisos.EquiposCambiarEstado)]
    public async Task<ActionResult<EquipoDto>> CambiarEstado(
        Guid id,
        [FromBody] CambiarEstadoEquipoDto dto,
        CancellationToken ct)
    {
        var actualizado = await _equipoService.CambiarEstadoAsync(id, dto, ct);
        return Ok(actualizado);
    }
}
