using System;

namespace TechAsset.Domain.Exceptions;

/// <summary>
/// Excepción lanzada cuando se vulnera una invariante o regla de negocio del dominio.
/// </summary>
public class DomainException : Exception
{
    public bool EsConflicto { get; }

    public DomainException(string mensaje, bool esConflicto = false) : base(mensaje)
    {
        EsConflicto = esConflicto;
    }
}
