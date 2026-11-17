using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Application.Mappers;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;

namespace TechAsset.Application.Services;

public class EquipoService : IEquipoService
{
    private readonly IUnitOfWork _uow;
    private readonly IUsuarioActual _usuarioActual;

    public EquipoService(
        IUnitOfWork uow,
        IUsuarioActual usuarioActual)
    {
        _uow = uow;
        _usuarioActual = usuarioActual;
    }

    public async Task<PaginadoDto<EquipoDto>> ListarAsync(ParametrosConsultaEquipos parametros, CancellationToken ct = default)
    {
        var (items, totalItems) = await _uow.Equipos.ListarPaginadoAsync(parametros, ct);

        var tamano = Math.Clamp(parametros.TamanoPagina, 1, 100);
        var totalPaginas = (int)Math.Ceiling(totalItems / (double)tamano);
        var pagina = Math.Clamp(parametros.Pagina, 1, Math.Max(1, totalPaginas));

        return new PaginadoDto<EquipoDto>(
            items.Select(e => e.ToDto()).ToList(),
            pagina,
            tamano,
            totalItems,
            totalPaginas
        );
    }

    public async Task<EquipoDto> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        var equipo = await _uow.Equipos.ObtenerPorIdAsync(id, ct);
        if (equipo == null)
            throw new KeyNotFoundException(Mensajes.RecursoNoEncontrado);

        return equipo.ToDto();
    }

    public async Task<EquipoDto> CrearAsync(CrearEquipoDto dto, CancellationToken ct = default)
    {
        // RN-07: Unicidad de código patrimonial
        var existeCodigo = await _uow.Equipos.ExisteCodigoPatrimonialAsync(dto.CodigoPatrimonial, null, ct);
        if (existeCodigo)
            throw new DomainException(Mensajes.RN07_CodigoPatrimonialDuplicado, esConflicto: true);

        var nuevoEquipo = Equipo.Crear(
            dto.CodigoPatrimonial,
            dto.Nombre,
            dto.Categoria,
            dto.Marca,
            dto.Ubicacion,
            dto.EstadoInicial
        );

        await _uow.Equipos.AgregarAsync(nuevoEquipo, ct);

        // RF-17: Registro de movimiento inicial
        var movimiento = MovimientoEquipo.Registrar(
            nuevoEquipo.Id_Equipo,
            _usuarioActual.Id != Guid.Empty ? _usuarioActual.Id : Guid.NewGuid(),
            TipoMovimientoEquipo.Registro,
            "-",
            nuevoEquipo.Est_Equipo.ToString(),
            $"Alta de equipo {nuevoEquipo.Cop_Equipo} en inventario."
        );
        await _uow.MovimientosEquipo.AgregarAsync(movimiento, ct);

        await _uow.GuardarCambiosAsync(ct);
        return nuevoEquipo.ToDto();
    }

    public async Task<EquipoDto> ActualizarAsync(Guid id, ActualizarEquipoDto dto, CancellationToken ct = default)
    {
        var equipo = await _uow.Equipos.ObtenerPorIdAsync(id, ct);
        if (equipo == null)
            throw new KeyNotFoundException(Mensajes.RecursoNoEncontrado);

        equipo.Actualizar(dto.Nombre, dto.Categoria, dto.Marca, dto.Ubicacion);

        var movimiento = MovimientoEquipo.Registrar(
            equipo.Id_Equipo,
            _usuarioActual.Id != Guid.Empty ? _usuarioActual.Id : Guid.NewGuid(),
            TipoMovimientoEquipo.Edicion,
            equipo.Est_Equipo.ToString(),
            equipo.Est_Equipo.ToString(),
            $"Actualización de datos generales del equipo {equipo.Cop_Equipo}."
        );
        await _uow.MovimientosEquipo.AgregarAsync(movimiento, ct);

        await _uow.GuardarCambiosAsync(ct);
        return equipo.ToDto();
    }

    public async Task<EquipoDto> CambiarEstadoAsync(Guid id, CambiarEstadoEquipoDto dto, CancellationToken ct = default)
    {
        var equipo = await _uow.Equipos.ObtenerPorIdAsync(id, ct);
        if (equipo == null)
            throw new KeyNotFoundException(Mensajes.RecursoNoEncontrado);

        var estadoAnterior = equipo.Est_Equipo.ToString();
        var tienePrestamoActivo = await _uow.Prestamos.ExistePrestamoActivoAsync(id, ct);

        equipo.CambiarEstado(dto.NuevoEstado, tienePrestamoActivo);

        var detalle = string.IsNullOrWhiteSpace(dto.Motivo)
            ? $"Cambio de estado operativo a {dto.NuevoEstado}."
            : $"Cambio de estado a {dto.NuevoEstado}. Motivo: {dto.Motivo.Trim()}";

        var movimiento = MovimientoEquipo.Registrar(
            equipo.Id_Equipo,
            _usuarioActual.Id != Guid.Empty ? _usuarioActual.Id : Guid.NewGuid(),
            TipoMovimientoEquipo.CambioEstado,
            estadoAnterior,
            dto.NuevoEstado.ToString(),
            detalle
        );
        await _uow.MovimientosEquipo.AgregarAsync(movimiento, ct);

        await _uow.GuardarCambiosAsync(ct);
        return equipo.ToDto();
    }
}
