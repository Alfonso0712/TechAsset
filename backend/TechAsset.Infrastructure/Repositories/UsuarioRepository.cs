using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechAsset.Application.DTOs;
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

    public async Task<(IReadOnlyList<Usuario> Items, int TotalItems)> ListarPaginadoAsync(ParametrosConsultaUsuarios parametros, CancellationToken ct = default)
    {
        var query = _context.Usuarios
            .AsNoTracking()
            .Include(u => u.Area)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(parametros.Texto))
        {
            var t = parametros.Texto.Trim().ToLower();
            query = query.Where(u => u.Nom_Usuario.ToLower().Contains(t)
                                  || u.Ape_Usuario.ToLower().Contains(t)
                                  || u.Cor_Usuario.ToLower().Contains(t));
        }

        if (parametros.Rol.HasValue)
        {
            query = query.Where(u => u.Rol_Usuario == parametros.Rol.Value);
        }

        if (parametros.Activo.HasValue)
        {
            query = query.Where(u => u.Act_Usuario == parametros.Activo.Value);
        }

        if (parametros.AreaId.HasValue)
        {
            query = query.Where(u => u.Ida_Usuario == parametros.AreaId.Value);
        }

        var totalItems = await query.CountAsync(ct);
        var tamano = Math.Clamp(parametros.TamanoPagina, 1, 100);
        var totalPaginas = (int)Math.Ceiling(totalItems / (double)tamano);
        var pagina = Math.Clamp(parametros.Pagina, 1, Math.Max(1, totalPaginas));

        var items = await query
            .OrderBy(u => u.Nom_Usuario)
            .ThenBy(u => u.Ape_Usuario)
            .Skip((pagina - 1) * tamano)
            .Take(tamano)
            .ToListAsync(ct);

        return (items, totalItems);
    }
}
