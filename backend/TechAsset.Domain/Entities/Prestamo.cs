using System;
using TechAsset.Domain.Common;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;

namespace TechAsset.Domain.Entities;

public class Prestamo : AuditableEntity
{
    public Guid Id_Prestamo { get; private set; }
    public DateOnly Fpr_Prestamo { get; private set; }
    public DateOnly Fde_Prestamo { get; private set; }
    public DateOnly? Fdr_Prestamo { get; private set; }
    public string Mot_Prestamo { get; private set; } = string.Empty;
    public string? Obs_Prestamo { get; private set; }
    public EstadoPrestamo Est_Prestamo { get; private set; } = EstadoPrestamo.Pendiente;
    public Guid Idu_Prestamo { get; private set; }
    public Guid Ide_Prestamo { get; private set; }
    public Guid? Idr_Prestamo { get; private set; }

    // Navegación
    public virtual Usuario? Solicitante { get; private set; }
    public virtual Equipo? Equipo { get; private set; }
    public virtual Usuario? Responsable { get; private set; }

    // Constructor privado para EF Core
    private Prestamo() { }

    /// <summary>
    /// Flujo Colaborador: Crea una solicitud en estado Pendiente (sin responsable asignado aún).
    /// </summary>
    public static Prestamo CrearSolicitud(
        Guid idUsuario,
        Guid idEquipo,
        DateOnly fechaPrestamo,
        DateOnly fechaDevolucionEstimada,
        string motivo,
        Guid? id = null)
    {
        ValidarInvariantesBase(idUsuario, idEquipo, fechaPrestamo, fechaDevolucionEstimada, motivo);

        return new Prestamo
        {
            Id_Prestamo = id ?? Guid.NewGuid(),
            Fpr_Prestamo = fechaPrestamo,
            Fde_Prestamo = fechaDevolucionEstimada,
            Fdr_Prestamo = null,
            Mot_Prestamo = motivo.Trim(),
            Obs_Prestamo = null,
            Est_Prestamo = EstadoPrestamo.Pendiente,
            Idu_Prestamo = idUsuario,
            Ide_Prestamo = idEquipo,
            Idr_Prestamo = null
        };
    }

    /// <summary>
    /// Flujo Directo Responsable/Admin: Nace directamente en estado Activo con responsable asignado (RN-05).
    /// </summary>
    public static Prestamo CrearDirecto(
        Guid idUsuario,
        Guid idEquipo,
        Guid idResponsable,
        DateOnly fechaPrestamo,
        DateOnly fechaDevolucionEstimada,
        string motivo,
        Guid? id = null)
    {
        ValidarInvariantesBase(idUsuario, idEquipo, fechaPrestamo, fechaDevolucionEstimada, motivo);

        if (idResponsable == Guid.Empty)
            throw new DomainException(Mensajes.RN05_ResponsableRequeridoEnActivo);

        return new Prestamo
        {
            Id_Prestamo = id ?? Guid.NewGuid(),
            Fpr_Prestamo = fechaPrestamo,
            Fde_Prestamo = fechaDevolucionEstimada,
            Fdr_Prestamo = null,
            Mot_Prestamo = motivo.Trim(),
            Obs_Prestamo = null,
            Est_Prestamo = EstadoPrestamo.Activo,
            Idu_Prestamo = idUsuario,
            Ide_Prestamo = idEquipo,
            Idr_Prestamo = idResponsable
        };
    }

    /// <summary>
    /// Transición de Pendiente a Activo por parte del Responsable de Tecnología (RN-05).
    /// </summary>
    public void Aprobar(Guid idResponsable)
    {
        if (Est_Prestamo != EstadoPrestamo.Pendiente)
            throw new DomainException("Solo se pueden aprobar préstamos en estado Pendiente.");

        if (idResponsable == Guid.Empty)
            throw new DomainException(Mensajes.RN05_ResponsableRequeridoEnActivo);

        Est_Prestamo = EstadoPrestamo.Activo;
        Idr_Prestamo = idResponsable;
    }

    /// <summary>
    /// Transición de Pendiente a Rechazado con motivo justificado.
    /// </summary>
    public void Rechazar(Guid idResponsable, string motivoRechazo)
    {
        if (Est_Prestamo != EstadoPrestamo.Pendiente)
            throw new DomainException("Solo se pueden rechazar préstamos en estado Pendiente.");

        if (idResponsable == Guid.Empty)
            throw new DomainException(Mensajes.ResponsableRequerido);

        if (string.IsNullOrWhiteSpace(motivoRechazo) || motivoRechazo.Trim().Length < 5)
            throw new DomainException("El rechazo de una solicitud exige un motivo de al menos 5 caracteres.");

        Est_Prestamo = EstadoPrestamo.Rechazado;
        Idr_Prestamo = idResponsable;
        Obs_Prestamo = motivoRechazo.Trim();
    }

    /// <summary>
    /// RN-10: Toda devolución física exige una observación no vacía.
    /// RN-04: La fecha de devolución real no puede ser anterior a la de préstamo.
    /// </summary>
    public void RegistrarDevolucion(string observacion, DateOnly? fechaDevolucionReal = null, DateOnly? fechaReferenciaHoy = null)
    {
        if (Est_Prestamo != EstadoPrestamo.Activo)
            throw new DomainException("Solo es posible registrar la devolución de un préstamo en estado Activo.");

        if (string.IsNullOrWhiteSpace(observacion) || observacion.Trim().Length < ReglasPrestamo.MinLongitudObservacion)
            throw new DomainException(Mensajes.RN10_ObservacionDevolucionRequerida);

        var fdr = fechaDevolucionReal ?? fechaReferenciaHoy ?? DateOnly.FromDateTime(DateTime.UtcNow.AddHours(-5));

        if (fdr < Fpr_Prestamo)
            throw new DomainException(Mensajes.RN04_FechaDevolucionRealInvalida);

        Est_Prestamo = EstadoPrestamo.Devuelto;
        Fdr_Prestamo = fdr;
        Obs_Prestamo = observacion.Trim();
    }

    private static void ValidarInvariantesBase(
        Guid idUsuario,
        Guid idEquipo,
        DateOnly fechaPrestamo,
        DateOnly fechaDevolucionEstimada,
        string motivo)
    {
        if (idUsuario == Guid.Empty)
            throw new DomainException("Debe indicarse un usuario solicitante válido.");

        if (idEquipo == Guid.Empty)
            throw new DomainException("Debe indicarse un equipo tecnológico válido.");

        // RN-04: Fecha estimada posterior a fecha de préstamo
        if (fechaDevolucionEstimada <= fechaPrestamo)
            throw new DomainException(Mensajes.RN04_FechaDevolucionInvalida);

        if (string.IsNullOrWhiteSpace(motivo) || motivo.Trim().Length < ReglasPrestamo.MinLongitudMotivo || motivo.Trim().Length > ReglasPrestamo.MaxLongitudMotivo)
            throw new DomainException($"El motivo del préstamo debe tener entre {ReglasPrestamo.MinLongitudMotivo} y {ReglasPrestamo.MaxLongitudMotivo} caracteres.");
    }
}
