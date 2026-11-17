using System;
using TechAsset.Domain.Common;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;

namespace TechAsset.Domain.Entities;

public class Equipo : AuditableEntity
{
    public Guid Id_Equipo { get; private set; }
    public string Cop_Equipo { get; private set; } = string.Empty;
    public string Nom_Equipo { get; private set; } = string.Empty;
    public CategoriaEquipo Cat_Equipo { get; private set; }
    public string Mar_Equipo { get; private set; } = string.Empty;
    public EstadoEquipo Est_Equipo { get; private set; } = EstadoEquipo.Disponible;
    public string Ubi_Equipo { get; private set; } = string.Empty;

    // Constructor privado para EF Core
    private Equipo() { }

    public static Equipo Crear(
        string codigoPatrimonial,
        string nombre,
        CategoriaEquipo categoria,
        string marca,
        string ubicacion,
        EstadoEquipo estadoInicial = EstadoEquipo.Disponible,
        Guid? id = null)
    {
        var cop = codigoPatrimonial?.Trim().ToUpperInvariant() ?? string.Empty;
        var nom = nombre?.Trim() ?? string.Empty;
        var mar = marca?.Trim() ?? string.Empty;
        var ubi = ubicacion?.Trim() ?? string.Empty;

        ValidarInvariantes(cop, nom, mar, ubi);

        return new Equipo
        {
            Id_Equipo = id ?? Guid.NewGuid(),
            Cop_Equipo = cop,
            Nom_Equipo = nom,
            Cat_Equipo = categoria,
            Mar_Equipo = mar,
            Est_Equipo = estadoInicial,
            Ubi_Equipo = ubi
        };
    }

    public void Actualizar(
        string nombre,
        CategoriaEquipo categoria,
        string marca,
        string ubicacion)
    {
        var nom = nombre?.Trim() ?? string.Empty;
        var mar = marca?.Trim() ?? string.Empty;
        var ubi = ubicacion?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(nom) || nom.Length < ReglasEquipo.MinLongitudNombre || nom.Length > ReglasEquipo.MaxLongitudNombre)
            throw new DomainException("El nombre del equipo debe tener entre 3 y 100 caracteres.");

        if (string.IsNullOrWhiteSpace(mar) || mar.Length < ReglasEquipo.MinLongitudMarca || mar.Length > ReglasEquipo.MaxLongitudMarca)
            throw new DomainException("La marca del equipo debe tener entre 2 y 50 caracteres.");

        if (string.IsNullOrWhiteSpace(ubi) || ubi.Length < ReglasEquipo.MinLongitudUbicacion || ubi.Length > ReglasEquipo.MaxLongitudUbicacion)
            throw new DomainException("La ubicación del equipo debe tener entre 2 y 100 caracteres.");

        Nom_Equipo = nom;
        Cat_Equipo = categoria;
        Mar_Equipo = mar;
        Ubi_Equipo = ubi;
    }

    /// <summary>
    /// RN-02 y RN-03: Evalúa si el activo tecnológico está apto para ser prestado.
    /// Solo puede prestarse si su estado operativo es Disponible.
    /// </summary>
    public bool PuedePrestarse() => Est_Equipo == EstadoEquipo.Disponible;

    public void MarcarComoPrestado()
    {
        if (Est_Equipo == EstadoEquipo.Mantenimiento)
            throw new DomainException(Mensajes.RN02_EquipoEnMantenimiento);

        if (Est_Equipo == EstadoEquipo.Baja)
            throw new DomainException(Mensajes.RN03_EquipoEnBaja);

        if (Est_Equipo == EstadoEquipo.Prestado)
            throw new DomainException(Mensajes.RN01_EquipoConPrestamoActivo);

        Est_Equipo = EstadoEquipo.Prestado;
    }

    public void MarcarComoDisponible()
    {
        if (Est_Equipo == EstadoEquipo.Baja)
            throw new DomainException(Mensajes.RN03_EquipoEnBaja);

        Est_Equipo = EstadoEquipo.Disponible;
    }

    public void CambiarEstado(EstadoEquipo nuevoEstado, bool tienePrestamoActivo = false)
    {
        if (tienePrestamoActivo && (nuevoEstado == EstadoEquipo.Mantenimiento || nuevoEstado == EstadoEquipo.Baja))
            throw new DomainException("No es posible pasar a Mantenimiento o Baja un equipo con un préstamo activo vigente.");

        if (Est_Equipo == EstadoEquipo.Baja && nuevoEstado != EstadoEquipo.Baja)
            throw new DomainException(Mensajes.RN03_EquipoEnBaja);

        Est_Equipo = nuevoEstado;
    }

    private static void ValidarInvariantes(string cop, string nom, string mar, string ubi)
    {
        if (string.IsNullOrWhiteSpace(cop) || cop.Length < ReglasEquipo.MinLongitudCodigo || cop.Length > ReglasEquipo.MaxLongitudCodigo)
            throw new DomainException("El código patrimonial debe tener entre 3 y 50 caracteres.");

        if (string.IsNullOrWhiteSpace(nom) || nom.Length < ReglasEquipo.MinLongitudNombre || nom.Length > ReglasEquipo.MaxLongitudNombre)
            throw new DomainException("El nombre del equipo debe tener entre 3 y 100 caracteres.");

        if (string.IsNullOrWhiteSpace(mar) || mar.Length < ReglasEquipo.MinLongitudMarca || mar.Length > ReglasEquipo.MaxLongitudMarca)
            throw new DomainException("La marca del equipo debe tener entre 2 y 50 caracteres.");

        if (string.IsNullOrWhiteSpace(ubi) || ubi.Length < ReglasEquipo.MinLongitudUbicacion || ubi.Length > ReglasEquipo.MaxLongitudUbicacion)
            throw new DomainException("La ubicación física debe tener entre 2 y 100 caracteres.");
    }
}
