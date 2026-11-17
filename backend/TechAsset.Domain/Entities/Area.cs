using System;
using TechAsset.Domain.Common;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Exceptions;

namespace TechAsset.Domain.Entities;

public class Area : AuditableEntity
{
    public Guid Id_Area { get; private set; }
    public string Nom_Area { get; private set; } = string.Empty;
    public bool Act_Area { get; private set; } = true;

    // Constructor privado para EF Core
    private Area() { }

    private Area(Guid id, string nombre)
    {
        Id_Area = id;
        Nom_Area = nombre;
        Act_Area = true;
    }

    public static Area Crear(string nombre, Guid? id = null)
    {
        if (string.IsNullOrWhiteSpace(nombre) || nombre.Trim().Length < 2)
            throw new DomainException("El nombre del área debe contener al menos 2 caracteres.");

        return new Area(id ?? Guid.NewGuid(), nombre.Trim());
    }

    public void Actualizar(string nombre)
    {
        if (string.IsNullOrWhiteSpace(nombre) || nombre.Trim().Length < 2)
            throw new DomainException("El nombre del área debe contener al menos 2 caracteres.");

        Nom_Area = nombre.Trim();
    }

    public void Desactivar() => Act_Area = false;
    public void Activar() => Act_Area = true;
}
