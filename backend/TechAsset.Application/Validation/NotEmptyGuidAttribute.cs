using System;
using System.ComponentModel.DataAnnotations;

namespace TechAsset.Application.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
public sealed class NotEmptyGuidAttribute : ValidationAttribute
{
    public const string MensajePorDefecto = "El identificador especificado no puede ser un GUID vacío.";

    public NotEmptyGuidAttribute() : base(MensajePorDefecto)
    {
    }

    public override bool IsValid(object? value)
    {
        if (value is null)
            return true; // [Required] valida nulidad si corresponde

        return value switch
        {
            Guid guid => guid != Guid.Empty,
            string str => Guid.TryParse(str, out var parsed) && parsed != Guid.Empty,
            _ => false
        };
    }
}
