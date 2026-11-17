using Microsoft.AspNetCore.Identity;
using TechAsset.Application.Interfaces;

namespace TechAsset.Infrastructure.Security;

/// <summary>
/// Mejora Obligatoria #1: Verificación de contraseñas exclusivamente criptográfica por hash PBKDF2.
/// Cero contraseñas en texto plano, atajos o backdoors en código.
/// </summary>
public class PasswordHasherService : IPasswordHasherService
{
    private readonly PasswordHasher<object> _hasher = new();
    private readonly string _dummyHash;

    public PasswordHasherService()
    {
        _dummyHash = _hasher.HashPassword(new object(), "DummyPasswordSegura2026*");
    }

    public string HashPassword(string contrasena)
    {
        return _hasher.HashPassword(new object(), contrasena);
    }

    public bool VerifyPassword(string hash, string contrasenaProporcionada)
    {
        if (string.IsNullOrWhiteSpace(hash) || string.IsNullOrWhiteSpace(contrasenaProporcionada))
            return false;

        var result = _hasher.VerifyHashedPassword(new object(), hash, contrasenaProporcionada);
        return result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded;
    }

    /// <summary>
    /// Mitigación de timing attack en inicios de sesión con usuarios inexistentes.
    /// </summary>
    public void VerifyDummyPassword()
    {
        _hasher.VerifyHashedPassword(new object(), _dummyHash, "DummyPasswordPrueba");
    }
}
