using System;
using TechAsset.Application.Interfaces;

namespace TechAsset.Infrastructure.Services;

public class RelojServicio : IRelojServicio
{
    private static readonly TimeZoneInfo ZonaLima = ObtenerZonaLima();

    private static TimeZoneInfo ObtenerZonaLima()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
        }
        catch
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById("America/Lima");
            }
            catch
            {
                return TimeZoneInfo.CreateCustomTimeZone("America/Lima", TimeSpan.FromHours(-5), "America/Lima", "America/Lima");
            }
        }
    }

    public TimeZoneInfo ZonaHoraria => ZonaLima;

    public DateTime Ahora => TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, ZonaLima);

    public DateTimeOffset AhoraOffset => TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, ZonaLima);

    public DateOnly Hoy => DateOnly.FromDateTime(Ahora);
}
