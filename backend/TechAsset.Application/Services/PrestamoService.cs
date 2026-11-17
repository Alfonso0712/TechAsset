using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Application.Mappers;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;
using TechAsset.Domain.Exceptions;

namespace TechAsset.Application.Services;

public class PrestamoService : IPrestamoService
{
    private readonly IUnitOfWork _uow;
    private readonly IUsuarioActual _usuarioActual;

    public PrestamoService(
        IUnitOfWork uow,
        IUsuarioActual usuarioActual)
    {
        _uow = uow;
        _usuarioActual = usuarioActual;
    }

    public async Task<PaginadoDto<PrestamoDto>> ListarAsync(ParametrosConsultaPrestamos parametros, CancellationToken ct = default)
    {
        var (items, totalItems) = await _uow.Prestamos.ListarPaginadoAsync(
            parametros,
            _usuarioActual.Rol,
            _usuarioActual.Id,
            ct
        );

        var tamano = Math.Clamp(parametros.TamanoPagina, 1, 100);
        var totalPaginas = (int)Math.Ceiling(totalItems / (double)tamano);
        var pagina = Math.Clamp(parametros.Pagina, 1, Math.Max(1, totalPaginas));

        return new PaginadoDto<PrestamoDto>(
            items.Select(p => p.ToDto()).ToList(),
            pagina,
            tamano,
            totalItems,
            totalPaginas
        );
    }

    public async Task<IReadOnlyList<PrestamoDto>> ListarActivosAsync(CancellationToken ct = default)
    {
        Guid? idUsuario = _usuarioActual.Rol == RolUsuario.Colaborador ? _usuarioActual.Id : null;
        var activos = await _uow.Prestamos.ListarActivosAsync(idUsuario, ct);
        return activos.Select(p => p.ToDto()).ToList();
    }

    public async Task<PrestamoDto> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        var prestamo = await _uow.Prestamos.ObtenerConDetalleAsync(id, ct);
        if (prestamo == null)
            throw new KeyNotFoundException(Mensajes.RecursoNoEncontrado);

        if (_usuarioActual.Rol == RolUsuario.Colaborador && prestamo.Idu_Prestamo != _usuarioActual.Id)
            throw new UnauthorizedAccessException(Mensajes.NoAutorizado);

        return prestamo.ToDto();
    }

    public async Task<PrestamoDto> SolicitarAsync(SolicitarPrestamoDto dto, CancellationToken ct = default)
    {
        var idColaborador = _usuarioActual.Id;
        if (idColaborador == Guid.Empty)
            throw new UnauthorizedAccessException(Mensajes.NoAutorizado);

        var equipo = await _uow.Equipos.ObtenerPorIdAsync(dto.IdEquipo, ct);
        if (equipo == null)
            throw new KeyNotFoundException("El equipo solicitado no existe.");

        // RN-02 y RN-03: No prestar equipos en Mantenimiento o Baja
        if (!equipo.PuedePrestarse())
        {
            if (equipo.Est_Equipo == EstadoEquipo.Mantenimiento)
                throw new DomainException(Mensajes.RN02_EquipoEnMantenimiento);
            if (equipo.Est_Equipo == EstadoEquipo.Baja)
                throw new DomainException(Mensajes.RN03_EquipoEnBaja);
            if (equipo.Est_Equipo == EstadoEquipo.Prestado)
                throw new DomainException(Mensajes.RN01_EquipoConPrestamoActivo);
        }

        // RN-01: Verificación de no préstamo activo previo
        var tieneActivo = await _uow.Prestamos.ExistePrestamoActivoAsync(dto.IdEquipo, ct);
        if (tieneActivo)
            throw new DomainException(Mensajes.RN01_EquipoConPrestamoActivo);

        var prestamo = Prestamo.CrearSolicitud(
            idColaborador,
            dto.IdEquipo,
            dto.FechaPrestamo,
            dto.FechaDevolucionEstimada,
            dto.Motivo
        );

        await _uow.Prestamos.AgregarAsync(prestamo, ct);

        var movimiento = MovimientoEquipo.Registrar(
            equipo.Id_Equipo,
            idColaborador,
            TipoMovimientoEquipo.PrestamoSolicitado,
            equipo.Est_Equipo.ToString(),
            equipo.Est_Equipo.ToString(),
            $"Solicitud de préstamo ingresada por colaborador para {dto.FechaPrestamo:yyyy-MM-dd} hasta {dto.FechaDevolucionEstimada:yyyy-MM-dd}."
        );
        await _uow.MovimientosEquipo.AgregarAsync(movimiento, ct);

        await _uow.GuardarCambiosAsync(ct);
        return (await _uow.Prestamos.ObtenerConDetalleAsync(prestamo.Id_Prestamo, ct))!.ToDto();
    }

    public async Task<PrestamoDto> CrearDirectoAsync(CrearPrestamoDirectoDto dto, CancellationToken ct = default)
    {
        var idResponsable = _usuarioActual.Id;
        if (idResponsable == Guid.Empty)
            throw new UnauthorizedAccessException(Mensajes.NoAutorizado);

        var equipo = await _uow.Equipos.ObtenerPorIdAsync(dto.IdEquipo, ct);
        if (equipo == null)
            throw new KeyNotFoundException("El equipo solicitado no existe.");

        if (!equipo.PuedePrestarse())
        {
            if (equipo.Est_Equipo == EstadoEquipo.Mantenimiento)
                throw new DomainException(Mensajes.RN02_EquipoEnMantenimiento);
            if (equipo.Est_Equipo == EstadoEquipo.Baja)
                throw new DomainException(Mensajes.RN03_EquipoEnBaja);
            if (equipo.Est_Equipo == EstadoEquipo.Prestado)
                throw new DomainException(Mensajes.RN01_EquipoConPrestamoActivo);
        }

        var tieneActivo = await _uow.Prestamos.ExistePrestamoActivoAsync(dto.IdEquipo, ct);
        if (tieneActivo)
            throw new DomainException(Mensajes.RN01_EquipoConPrestamoActivo);

        var prestamo = Prestamo.CrearDirecto(
            dto.IdUsuario,
            dto.IdEquipo,
            idResponsable,
            dto.FechaPrestamo,
            dto.FechaDevolucionEstimada,
            dto.Motivo
        );

        equipo.MarcarComoPrestado();

        await _uow.Prestamos.AgregarAsync(prestamo, ct);

        var movimiento = MovimientoEquipo.Registrar(
            equipo.Id_Equipo,
            idResponsable,
            TipoMovimientoEquipo.PrestamoAprobado,
            "Disponible",
            "Prestado",
            $"Préstamo directo otorgado y equipo marcado como Prestado."
        );
        await _uow.MovimientosEquipo.AgregarAsync(movimiento, ct);

        await _uow.GuardarCambiosAsync(ct);
        return (await _uow.Prestamos.ObtenerConDetalleAsync(prestamo.Id_Prestamo, ct))!.ToDto();
    }

    public async Task<PrestamoDto> AprobarAsync(Guid id, CancellationToken ct = default)
    {
        var idResponsable = _usuarioActual.Id;
        if (idResponsable == Guid.Empty)
            throw new UnauthorizedAccessException(Mensajes.NoAutorizado);

        var prestamo = await _uow.Prestamos.ObtenerPorIdAsync(id, ct);
        if (prestamo == null)
            throw new KeyNotFoundException(Mensajes.RecursoNoEncontrado);

        var equipo = await _uow.Equipos.ObtenerPorIdAsync(prestamo.Ide_Prestamo, ct);
        if (equipo == null)
            throw new KeyNotFoundException("El equipo asociado no existe.");

        // RN-01: Doble protección contra préstamos activos simultáneos
        var yaTieneActivo = await _uow.Prestamos.ExistePrestamoActivoAsync(equipo.Id_Equipo, ct);
        if (yaTieneActivo)
            throw new DomainException(Mensajes.RN01_EquipoConPrestamoActivo);

        // RN-02 y RN-03: No prestar equipos en Mantenimiento o Baja
        if (!equipo.PuedePrestarse())
        {
            if (equipo.Est_Equipo == EstadoEquipo.Mantenimiento)
                throw new DomainException(Mensajes.RN02_EquipoEnMantenimiento);
            if (equipo.Est_Equipo == EstadoEquipo.Baja)
                throw new DomainException(Mensajes.RN03_EquipoEnBaja);
            if (equipo.Est_Equipo == EstadoEquipo.Prestado)
                throw new DomainException(Mensajes.RN01_EquipoConPrestamoActivo);
        }

        prestamo.Aprobar(idResponsable);
        equipo.MarcarComoPrestado();

        var movimiento = MovimientoEquipo.Registrar(
            equipo.Id_Equipo,
            idResponsable,
            TipoMovimientoEquipo.PrestamoAprobado,
            "Disponible",
            "Prestado",
            $"Solicitud de préstamo aprobada por responsable de tecnología."
        );
        await _uow.MovimientosEquipo.AgregarAsync(movimiento, ct);

        await _uow.GuardarCambiosAsync(ct);
        return (await _uow.Prestamos.ObtenerConDetalleAsync(prestamo.Id_Prestamo, ct))!.ToDto();
    }

    public async Task<PrestamoDto> RechazarAsync(Guid id, RechazarPrestamoDto dto, CancellationToken ct = default)
    {
        var idResponsable = _usuarioActual.Id;
        if (idResponsable == Guid.Empty)
            throw new UnauthorizedAccessException(Mensajes.NoAutorizado);

        var prestamo = await _uow.Prestamos.ObtenerPorIdAsync(id, ct);
        if (prestamo == null)
            throw new KeyNotFoundException(Mensajes.RecursoNoEncontrado);

        prestamo.Rechazar(idResponsable, dto.Motivo);

        var movimiento = MovimientoEquipo.Registrar(
            prestamo.Ide_Prestamo,
            idResponsable,
            TipoMovimientoEquipo.PrestamoRechazado,
            "Disponible",
            "Disponible",
            $"Solicitud rechazada. Motivo: {dto.Motivo.Trim()}"
        );
        await _uow.MovimientosEquipo.AgregarAsync(movimiento, ct);

        await _uow.GuardarCambiosAsync(ct);
        return (await _uow.Prestamos.ObtenerConDetalleAsync(prestamo.Id_Prestamo, ct))!.ToDto();
    }

    public async Task<PrestamoDto> RegistrarDevolucionAsync(Guid id, DevolverPrestamoDto dto, CancellationToken ct = default)
    {
        var idResponsable = _usuarioActual.Id;
        if (idResponsable == Guid.Empty)
            throw new UnauthorizedAccessException(Mensajes.NoAutorizado);

        var prestamo = await _uow.Prestamos.ObtenerPorIdAsync(id, ct);
        if (prestamo == null)
            throw new KeyNotFoundException(Mensajes.RecursoNoEncontrado);

        var equipo = await _uow.Equipos.ObtenerPorIdAsync(prestamo.Ide_Prestamo, ct);
        if (equipo == null)
            throw new KeyNotFoundException("El equipo asociado no existe.");

        // RN-10: Exigencia de observación obligatoria no vacía
        // RN-04: Fdr posterior o igual a Fpr
        prestamo.RegistrarDevolucion(dto.Observacion, dto.FechaDevolucionReal);
        equipo.MarcarComoDisponible();

        var movimiento = MovimientoEquipo.Registrar(
            equipo.Id_Equipo,
            idResponsable,
            TipoMovimientoEquipo.Devolucion,
            "Prestado",
            "Disponible",
            $"Devolución registrada. Observación técnica: {dto.Observacion.Trim()}"
        );
        await _uow.MovimientosEquipo.AgregarAsync(movimiento, ct);

        await _uow.GuardarCambiosAsync(ct);
        return (await _uow.Prestamos.ObtenerConDetalleAsync(prestamo.Id_Prestamo, ct))!.ToDto();
    }
}
