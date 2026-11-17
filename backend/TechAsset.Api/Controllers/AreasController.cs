using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;

namespace TechAsset.Api.Controllers;

[ApiController]
[Route("api/areas")]
[Authorize]
public class AreasController : ControllerBase
{
    private readonly IAreaService _areaService;

    public AreasController(IAreaService areaService)
    {
        _areaService = areaService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AreaDto>>> ListarActivas(CancellationToken ct)
    {
        var areas = await _areaService.ListarActivasAsync(ct);
        return Ok(areas);
    }
}
