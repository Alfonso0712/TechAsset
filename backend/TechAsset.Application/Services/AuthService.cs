using System;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Application.Mappers;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Exceptions;
using TechAsset.Domain.Security;

namespace TechAsset.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _uow;
    private readonly IPasswordHasherService _hasher;
    private readonly IUsuarioActual _usuarioActual;

    public AuthService(
        IUnitOfWork uow,
        IPasswordHasherService hasher,
        IUsuarioActual usuarioActual)
    {
        _uow = uow;
        _hasher = hasher;
        _usuarioActual = usuarioActual;
    }

    public async Task<LoginRespuestaDto> IniciarSesionAsync(LoginDto dto, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Correo) || string.IsNullOrWhiteSpace(dto.Contrasena))
        {
            _hasher.VerifyDummyPassword();
            throw new DomainException("El correo y la contraseña son obligatorios.");
        }

        var usuario = await _uow.Usuarios.ObtenerPorCorreoAsync(dto.Correo, ct);
        if (usuario == null)
        {
            _hasher.VerifyDummyPassword();
            throw new UnauthorizedAccessException("Credenciales incorrectas.");
        }

        if (!usuario.Act_Usuario)
        {
            _hasher.VerifyDummyPassword();
            throw new UnauthorizedAccessException("La cuenta de usuario se encuentra deshabilitada.");
        }

        var valida = _hasher.VerifyPassword(usuario.Has_Usuario, dto.Contrasena);
        if (!valida)
        {
            throw new UnauthorizedAccessException("Credenciales incorrectas.");
        }

        var permisos = PoliticaDeAcceso.ObtenerPermisos(usuario.Rol_Usuario);
        return new LoginRespuestaDto(usuario.ToDto(), permisos);
    }

    public async Task<UsuarioDto> ObtenerUsuarioActualAsync(CancellationToken ct = default)
    {
        if (!_usuarioActual.EstaAutenticado || _usuarioActual.Id == Guid.Empty)
        {
            throw new UnauthorizedAccessException(Mensajes.NoAutorizado);
        }

        var usuario = await _uow.Usuarios.ObtenerPorIdAsync(_usuarioActual.Id, ct);
        if (usuario == null || !usuario.Act_Usuario)
        {
            throw new UnauthorizedAccessException("Usuario no encontrado o inactivo.");
        }

        return usuario.ToDto();
    }
}
