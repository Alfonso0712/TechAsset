using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using TechAsset.Domain.Common;

namespace TechAsset.Infrastructure.Interceptors;

public class AuditoriaInterceptor : SaveChangesInterceptor
{
    private readonly IActorProvider? _actorProvider;

    public AuditoriaInterceptor(IActorProvider? actorProvider = null)
    {
        _actorProvider = actorProvider;
    }

    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        ActualizarAuditoria(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ActualizarAuditoria(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void ActualizarAuditoria(DbContext? context)
    {
        if (context == null) return;

        var ahora = DateTime.UtcNow;
        var usuarioActual = _actorProvider?.Actor?.NombreCompleto ?? "Sistema";

        foreach (var entry in context.ChangeTracker.Entries<AuditableEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.Fre_Creacion = ahora;
                entry.Entity.Ucr_Creador ??= usuarioActual;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.Fma_Modificacion = ahora;
                entry.Entity.Umo_Modificador = usuarioActual;
            }
        }
    }
}
