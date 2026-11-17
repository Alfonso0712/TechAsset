using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using TechAsset.Infrastructure.Data;

namespace TechAsset.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Usuarios
            .Include(u => u.Area)
            .FirstOrDefaultAsync(u => u.Id_Usuario == id, ct);
    }

    public async Task<Usuario?> ObtenerPorCorreoAsync(string correo, CancellationToken ct = default)
    {
        var c = correo.Trim().ToLowerInvariant();
        return await _context.Usuarios
            .Include(u => u.Area)
            .FirstOrDefaultAsync(u => u.Cor_Usuario.ToLower() == c, ct);
    }

    public async Task<bool> ExisteCorreoAsync(string correo, Guid? excluirId = null, CancellationToken ct = default)
    {
        var c = correo.Trim().ToLowerInvariant();
        var query = _context.Usuarios.AsNoTracking().Where(u => u.Cor_Usuario.ToLower() == c);
        if (excluirId.HasValue)
        {
            query = query.Where(u => u.Id_Usuario != excluirId.Value);
        }
        return await query.AnyAsync(ct);
    }

    public async Task<IReadOnlyList<Usuario>> ListarResponsablesAsync(CancellationToken ct = default)
    {
        return await _context.Usuarios
            .AsNoTracking()
            .Where(u => u.Act_Usuario && (u.Rol_Usuario == RolUsuario.ResponsableTecnologia || u.Rol_Usuario == RolUsuario.Administrador))
            .OrderBy(u => u.Nom_Usuario)
            .ToListAsync(ct);
    }

    public async Task AgregarAsync(Usuario usuario, CancellationToken ct = default)
    {
        await _context.Usuarios.AddAsync(usuario, ct);
    }
}
