namespace TechAsset.Application.Interfaces;

public interface IPasswordHasherService
{
    string HashPassword(string contrasena);
    bool VerifyPassword(string hash, string contrasenaProporcionada);
    void VerifyDummyPassword();
}
