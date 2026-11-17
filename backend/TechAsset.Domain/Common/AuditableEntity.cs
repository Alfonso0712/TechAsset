using System;

namespace TechAsset.Domain.Common;

/// <summary>
/// Clase base para auditoría transversal de entidades.
/// Rellenada automáticamente por SaveChangesInterceptor.
/// </summary>
public abstract class AuditableEntity
{
    public DateTime Fre_Creacion { get; set; } = DateTime.UtcNow;
    public DateTime? Fma_Modificacion { get; set; }
    public string? Ucr_Creador { get; set; }
    public string? Umo_Modificador { get; set; }
}
