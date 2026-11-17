using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;

namespace TechAsset.Application.Interfaces;

public interface IAuthService
{
    Task<LoginRespuestaDto> IniciarSesionAsync(LoginDto dto, CancellationToken ct = default);
    Task<UsuarioDto> ObtenerUsuarioActualAsync(CancellationToken ct = default);
}
