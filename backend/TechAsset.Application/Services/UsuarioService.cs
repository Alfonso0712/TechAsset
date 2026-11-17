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
using TechAsset.Domain.Exceptions;

namespace TechAsset.Application.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUnitOfWork _uow;
    private readonly IPasswordHasherService _hasher;
    private readonly IUsuarioActual _usuarioActual;

    public UsuarioService(
        IUnitOfWork uow,
        IPasswordHasherService hasher,
        IUsuarioActual usuarioActual)
    {
        _uow = uow;
        _hasher = hasher;
        _usuarioActual = usuarioActual;
    }

    public async Task<PaginadoDto<UsuarioDto>> ListarAsync(ParametrosConsultaUsuarios parametros, CancellationToken ct = default)
    {
        var (items, totalItems) = await _uow.Usuarios.ListarPaginadoAsync(parametros, ct);

        var tamano = Math.Clamp(parametros.TamanoPagina, 1, 100);
        var totalPaginas = (int)Math.Ceiling(totalItems / (double)tamano);
        var pagina = Math.Clamp(parametros.Pagina, 1, Math.Max(1, totalPaginas));

        return new PaginadoDto<UsuarioDto>(
            items.Select(u => u.ToDto()).ToList(),
            pagina,
            tamano,
            totalItems,
            totalPaginas
        );
    }

    public async Task<UsuarioDto> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        var usuario = await _uow.Usuarios.ObtenerPorIdAsync(id, ct);
        if (usuario == null)
            throw new KeyNotFoundException(Mensajes.RecursoNoEncontrado);

        return usuario.ToDto();
    }

    public async Task<UsuarioDto> CrearAsync(CrearUsuarioDto dto, CancellationToken ct = default)
    {
        // RN-08: Unicidad de correo
        var existeCorreo = await _uow.Usuarios.ExisteCorreoAsync(dto.Correo, null, ct);
        if (existeCorreo)
            throw new DomainException(Mensajes.RN08_CorreoUsuarioDuplicado, esConflicto: true);

        var area = await _uow.Areas.ObtenerPorIdAsync(dto.AreaId, ct);
        if (area == null || !area.Act_Area)
            throw new DomainException("El área seleccionada no existe o se encuentra inactiva.");

        var hash = _hasher.HashPassword(dto.Contrasena);
        var nuevoUsuario = Usuario.Crear(dto.Nombres, dto.Apellidos, dto.Correo, hash, dto.Rol, dto.AreaId);

        await _uow.Usuarios.AgregarAsync(nuevoUsuario, ct);
        await _uow.GuardarCambiosAsync(ct);

        return (await _uow.Usuarios.ObtenerPorIdAsync(nuevoUsuario.Id_Usuario, ct))!.ToDto();
    }

    public async Task<UsuarioDto> ActualizarAsync(Guid id, ActualizarUsuarioDto dto, CancellationToken ct = default)
    {
        var usuario = await _uow.Usuarios.ObtenerPorIdAsync(id, ct);
        if (usuario == null)
            throw new KeyNotFoundException(Mensajes.RecursoNoEncontrado);

        var area = await _uow.Areas.ObtenerPorIdAsync(dto.AreaId, ct);
        if (area == null || !area.Act_Area)
            throw new DomainException("El área seleccionada no existe o se encuentra inactiva.");

        usuario.ActualizarDatos(dto.Nombres, dto.Apellidos, dto.AreaId, dto.Rol);
        await _uow.GuardarCambiosAsync(ct);

        return usuario.ToDto();
    }

    public async Task<UsuarioDto> CambiarEstadoAsync(Guid id, CambiarEstadoUsuarioDto dto, CancellationToken ct = default)
    {
        var usuario = await _uow.Usuarios.ObtenerPorIdAsync(id, ct);
        if (usuario == null)
            throw new KeyNotFoundException(Mensajes.RecursoNoEncontrado);

        // RN-09: Prohibido deshabilitar usuario con préstamos Activos
        if (!dto.Activo)
        {
            var tienePrestamosActivos = await _uow.Prestamos.UsuarioTienePrestamosActivosAsync(id, ct);
            if (tienePrestamosActivos)
                throw new DomainException(Mensajes.RN09_UsuarioConPrestamosActivos);

            usuario.Desactivar();
        }
        else
        {
            usuario.Activar();
        }

        await _uow.GuardarCambiosAsync(ct);
        return usuario.ToDto();
    }

    public async Task<IReadOnlyList<UsuarioDto>> ListarResponsablesAsync(CancellationToken ct = default)
    {
        var responsables = await _uow.Usuarios.ListarResponsablesAsync(ct);
        return responsables.Select(u => u.ToDto()).ToList();
    }

    public async Task ActualizarPreferenciasAsync(ActualizarPreferenciasDto dto, CancellationToken ct = default)
    {
        if (!_usuarioActual.EstaAutenticado || _usuarioActual.Id == Guid.Empty)
            throw new UnauthorizedAccessException(Mensajes.NoAutorizado);

        var usuario = await _uow.Usuarios.ObtenerPorIdAsync(_usuarioActual.Id, ct);
        if (usuario == null)
            throw new KeyNotFoundException(Mensajes.RecursoNoEncontrado);

        usuario.ActualizarPreferencias(dto.Tema, dto.TamanoLetra);
        await _uow.GuardarCambiosAsync(ct);
    }
}
