using System;
using System.Text.RegularExpressions;
using TechAsset.Domain.Common;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;

namespace TechAsset.Domain.Entities;

public class Usuario : AuditableEntity
{
    private static readonly Regex RegexCorreo = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);

    public Guid Id_Usuario { get; private set; }
    public string Nom_Usuario { get; private set; } = string.Empty;
    public string Ape_Usuario { get; private set; } = string.Empty;
    public string Cor_Usuario { get; private set; } = string.Empty;
    public string Has_Usuario { get; private set; } = string.Empty;
    public RolUsuario Rol_Usuario { get; private set; }
    public Guid Ida_Usuario { get; private set; }
    public bool Act_Usuario { get; private set; } = true;
    public string Tema { get; private set; } = "claro";
    public string Tamano_Letra { get; private set; } = "normal";

    // Navegación
    public virtual Area? Area { get; private set; }

    // Constructor privado para EF Core
    private Usuario() { }

    public static Usuario Crear(
        string nombres,
        string apellidos,
        string correo,
        string hashContrasena,
        RolUsuario rol,
        Guid idArea,
        Guid? id = null)
    {
        var nom = nombres?.Trim() ?? string.Empty;
        var ape = apellidos?.Trim() ?? string.Empty;
        var cor = correo?.Trim().ToLowerInvariant() ?? string.Empty;

        ValidarInvariantes(nom, ape, cor, hashContrasena, idArea);

        return new Usuario
        {
            Id_Usuario = id ?? Guid.NewGuid(),
            Nom_Usuario = nom,
            Ape_Usuario = ape,
            Cor_Usuario = cor,
            Has_Usuario = hashContrasena,
            Rol_Usuario = rol,
            Ida_Usuario = idArea,
            Act_Usuario = true,
            Tema = "claro",
            Tamano_Letra = "normal"
        };
    }

    public void ActualizarDatos(string nombres, string apellidos, Guid idArea, RolUsuario? nuevoRol = null)
    {
        var nom = nombres?.Trim() ?? string.Empty;
        var ape = apellidos?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(nom) || nom.Length < ReglasUsuario.MinLongitudNombre || nom.Length > ReglasUsuario.MaxLongitudNombre)
            throw new DomainException("El nombre del usuario no cumple con la longitud permitida (2-100 caracteres).");

        if (string.IsNullOrWhiteSpace(ape) || ape.Length < ReglasUsuario.MinLongitudApellido || ape.Length > ReglasUsuario.MaxLongitudApellido)
            throw new DomainException("El apellido del usuario no cumple con la longitud permitida (2-100 caracteres).");

        if (idArea == Guid.Empty)
            throw new DomainException(Mensajes.AreaRequerida);

        Nom_Usuario = nom;
        Ape_Usuario = ape;
        Ida_Usuario = idArea;

        if (nuevoRol.HasValue)
        {
            Rol_Usuario = nuevoRol.Value;
        }
    }

    public void ActualizarContrasena(string nuevoHash)
    {
        if (string.IsNullOrWhiteSpace(nuevoHash))
            throw new DomainException("El hash de contraseña es obligatorio.");

        Has_Usuario = nuevoHash;
    }

    public void ActualizarPreferencias(string? tema, string? tamanoLetra)
    {
        if (tema != null)
        {
            var t = tema.Trim().ToLowerInvariant();
            if (t != "claro" && t != "oscuro")
                throw new DomainException("El tema debe ser 'claro' u 'oscuro'.");
            Tema = t;
        }

        if (tamanoLetra != null)
        {
            var tl = tamanoLetra.Trim();
            // Permite 'pequeno', 'normal', 'grande', 'A-', 'A', 'A+'
            if (tl != "pequeno" && tl != "normal" && tl != "grande" && tl != "A-" && tl != "A" && tl != "A+")
                throw new DomainException("El tamaño de fuente no es válido.");
            Tamano_Letra = tl;
        }
    }

    public void Desactivar() => Act_Usuario = false;
    public void Activar() => Act_Usuario = true;

    private static void ValidarInvariantes(string nombres, string apellidos, string correo, string hash, Guid idArea)
    {
        if (string.IsNullOrWhiteSpace(nombres) || nombres.Length < ReglasUsuario.MinLongitudNombre || nombres.Length > ReglasUsuario.MaxLongitudNombre)
            throw new DomainException("El nombre del usuario debe tener entre 2 y 100 caracteres.");

        if (string.IsNullOrWhiteSpace(apellidos) || apellidos.Length < ReglasUsuario.MinLongitudApellido || apellidos.Length > ReglasUsuario.MaxLongitudApellido)
            throw new DomainException("El apellido del usuario debe tener entre 2 y 100 caracteres.");

        if (string.IsNullOrWhiteSpace(correo) || correo.Length > ReglasUsuario.MaxLongitudCorreo || !RegexCorreo.IsMatch(correo))
            throw new DomainException("El formato del correo corporativo no es válido.");

        if (string.IsNullOrWhiteSpace(hash))
            throw new DomainException("La contraseña es requerida.");

        if (idArea == Guid.Empty)
            throw new DomainException(Mensajes.AreaRequerida);
    }
}
