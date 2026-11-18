using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Enums;

namespace TechAsset.Api.Controllers;

[ApiController]
[Route("api/reportes")]
[Authorize]
public class ReportesController : ControllerBase
{
    private readonly IReporteService _reporteService;

    public ReportesController(IReporteService reporteService)
    {
        _reporteService = reporteService;
    }

    [HttpGet("dashboard")]
    [Authorize(Policy = Permisos.DashboardVer)]
    public async Task<ActionResult<DashboardDto>> ObtenerDashboard(CancellationToken ct)
    {
        var dashboard = await _reporteService.ObtenerDashboardAsync(ct);
        return Ok(dashboard);
    }

    [HttpGet("equipos-por-estado")]
    [Authorize(Policy = Permisos.ReportesVer)]
    public async Task<ActionResult<IReadOnlyList<EquiposPorEstadoDto>>> ObtenerEquiposPorEstado(CancellationToken ct)
    {
        var resultado = await _reporteService.ObtenerEquiposPorEstadoAsync(ct);
        return Ok(resultado);
    }

    [HttpGet("equipos-mas-utilizados")]
    [Authorize(Policy = Permisos.ReportesVer)]
    public async Task<ActionResult<IReadOnlyList<EquiposMasUtilizadosDto>>> ObtenerEquiposMasUtilizados(
        [FromQuery] int limite = 10,
        [FromQuery] CategoriaEquipo? categoria = null,
        [FromQuery] DateOnly? fechaDesde = null,
        [FromQuery] DateOnly? fechaHasta = null,
        CancellationToken ct = default)
    {
        var resultado = await _reporteService.ObtenerEquiposMasUtilizadosAsync(limite, categoria, fechaDesde, fechaHasta, ct);
        return Ok(resultado);
    }

    [HttpGet("prestamos-por-area")]
    [Authorize(Policy = Permisos.ReportesVer)]
    public async Task<ActionResult<IReadOnlyList<PrestamosPorAreaDto>>> ObtenerPrestamosPorArea(
        [FromQuery] DateOnly? fechaDesde = null,
        [FromQuery] DateOnly? fechaHasta = null,
        CancellationToken ct = default)
    {
        var resultado = await _reporteService.ObtenerPrestamosPorAreaAsync(fechaDesde, fechaHasta, ct);
        return Ok(resultado);
    }

    [HttpGet("movimientos")]
    [Authorize(Policy = Permisos.ReportesVer)]
    public async Task<ActionResult<PaginadoDto<MovimientoEquipoDto>>> ObtenerMovimientos(
        [FromQuery] ParametrosConsultaMovimientos parametros,
        CancellationToken ct)
    {
        var resultado = await _reporteService.ObtenerMovimientosAsync(parametros, ct);
        return Ok(resultado);
    }
}
