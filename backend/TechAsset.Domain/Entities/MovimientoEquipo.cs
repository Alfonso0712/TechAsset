using System;
using TechAsset.Domain.Common;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;

namespace TechAsset.Domain.Entities;

public class MovimientoEquipo : AuditableEntity
{
    public Guid Id_Movimiento { get; private set; }
    public Guid Ide_Movimiento { get; private set; }
    public Guid Idu_Movimiento { get; private set; }
    public TipoMovimientoEquipo Tip_Movimiento { get; private set; }
    public string Est_Anterior { get; private set; } = string.Empty;
    public string Est_Nuevo { get; private set; } = string.Empty;
    public string Det_Movimiento { get; private set; } = string.Empty;
    public DateTime Fec_Movimiento { get; private set; } = DateTime.UtcNow;

    // Navegación
    public virtual Equipo? Equipo { get; private set; }
    public virtual Usuario? Usuario { get; private set; }

    // Constructor privado para EF Core
    private MovimientoEquipo() { }

    public static MovimientoEquipo Registrar(
        Guid idEquipo,
        Guid idUsuario,
        TipoMovimientoEquipo tipo,
        string estadoAnterior,
        string estadoNuevo,
        string detalle,
        Guid? id = null)
    {
        if (idEquipo == Guid.Empty)
            throw new DomainException("El movimiento debe estar asociado a un equipo tecnológico.");

        if (idUsuario == Guid.Empty)
            throw new DomainException("El movimiento debe registrar al usuario responsable de la acción.");

        if (string.IsNullOrWhiteSpace(detalle))
            throw new DomainException("El detalle del movimiento no puede ser vacío.");

        return new MovimientoEquipo
        {
            Id_Movimiento = id ?? Guid.NewGuid(),
            Ide_Movimiento = idEquipo,
            Idu_Movimiento = idUsuario,
            Tip_Movimiento = tipo,
            Est_Anterior = estadoAnterior?.Trim() ?? string.Empty,
            Est_Nuevo = estadoNuevo?.Trim() ?? string.Empty,
            Det_Movimiento = detalle.Trim(),
            Fec_Movimiento = DateTime.UtcNow
        };
    }
}
