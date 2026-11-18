using System;

namespace TechAsset.Application.Interfaces;

public interface IRelojServicio
{
    DateOnly Hoy { get; }
    DateTime Ahora { get; }
    DateTimeOffset AhoraOffset { get; }
    TimeZoneInfo ZonaHoraria { get; }
}
