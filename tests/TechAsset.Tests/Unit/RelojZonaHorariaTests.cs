using System;
using TechAsset.Application.Interfaces;
using Xunit;

namespace TechAsset.Tests.Unit;

public class RelojFalso : IRelojServicio
{
    private readonly DateTimeOffset _ahoraUtc;
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

    public RelojFalso(DateTimeOffset ahoraUtc)
    {
        _ahoraUtc = ahoraUtc;
    }

    public TimeZoneInfo ZonaHoraria => ZonaLima;
    public DateTime Ahora => TimeZoneInfo.ConvertTimeFromUtc(_ahoraUtc.UtcDateTime, ZonaLima);
    public DateTimeOffset AhoraOffset => TimeZoneInfo.ConvertTime(_ahoraUtc, ZonaLima);
    public DateOnly Hoy => DateOnly.FromDateTime(Ahora);
}

public class RelojZonaHorariaTests
{
    [Fact]
    public void RelojLima_A_Las_23_36_Del_17_Noviembre_Devuelve_Hoy_17_A_Pesar_De_Que_UTC_Es_18()
    {
        // 23:36 en Lima (UTC-5) del 17 de noviembre corresponde a las 04:36 UTC del 18 de noviembre
        var utcNextDay = new DateTimeOffset(2026, 11, 18, 4, 36, 0, TimeSpan.Zero);
        var reloj = new RelojFalso(utcNextDay);

        Assert.Equal(new DateOnly(2026, 11, 17), reloj.Hoy);
        Assert.Equal(23, reloj.Ahora.Hour);
        Assert.Equal(36, reloj.Ahora.Minute);
        Assert.Equal(17, reloj.Ahora.Day);
    }
}
