using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;

namespace TechAsset.Infrastructure.Data;

public class DatabaseSeeder
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasherService _hasher;
    private readonly IRelojServicio _reloj;

    public DatabaseSeeder(AppDbContext context, IPasswordHasherService hasher, IRelojServicio reloj)
    {
        _context = context;
        _hasher = hasher;
        _reloj = reloj;
    }

    public async Task SeedAsync(bool forzar = false, CancellationToken ct = default)
    {
        if (!forzar && await _context.MovimientosEquipo.AnyAsync(ct))
            return;

        // Limpiar datos previos si forzar es true o si no había movimientos registrados
        _context.MovimientosEquipo.RemoveRange(_context.MovimientosEquipo);
        _context.Prestamos.RemoveRange(_context.Prestamos);
        _context.Equipos.RemoveRange(_context.Equipos);
        _context.Usuarios.RemoveRange(_context.Usuarios);
        _context.Areas.RemoveRange(_context.Areas);
        await _context.SaveChangesAsync(ct);

        // 1. Áreas Funcionales (6 áreas de Innovatech Solutions)
        var areaDesarrollo = Area.Crear("Desarrollo de Software");
        var areaQA = Area.Crear("Aseguramiento de Calidad (QA)");
        var areaInfra = Area.Crear("Infraestructura y Redes");
        var areaSoporte = Area.Crear("Soporte Técnico de TI");
        var areaDiseno = Area.Crear("Diseño y Experiencia (UX/UI)");
        var areaGestion = Area.Crear("Gestión de Proyectos y Operaciones");

        var areas = new[] { areaDesarrollo, areaQA, areaInfra, areaSoporte, areaDiseno, areaGestion };
        await _context.Areas.AddRangeAsync(areas, ct);
        await _context.SaveChangesAsync(ct);

        // 2. Usuarios Demo (1 Admin, 2 Responsables, 8 Colaboradores)
        var passAdmin = _hasher.HashPassword("Admin123*");
        var passResp = _hasher.HashPassword("Resp123*");
        var passColab = _hasher.HashPassword("Colab123*");

        var admin = Usuario.Crear("Carlos", "Mendoza Ramos", "admin@innovatech.com", passAdmin, RolUsuario.Administrador, areaSoporte.Id_Area);
        var respElena = Usuario.Crear("Elena", "Huamán Rojas", "resp.tecnologia@innovatech.com", passResp, RolUsuario.ResponsableTecnologia, areaSoporte.Id_Area);
        var respMiguel = Usuario.Crear("Miguel Ángel", "Cárdenas Castro", "resp.redes@innovatech.com", passResp, RolUsuario.ResponsableTecnologia, areaInfra.Id_Area);

        var colab1 = Usuario.Crear("Marco", "Paredes Soto", "colaborador1@innovatech.com", passColab, RolUsuario.Colaborador, areaDesarrollo.Id_Area);
        var colab2 = Usuario.Crear("Lucía", "Gómez Flores", "colaborador2@innovatech.com", passColab, RolUsuario.Colaborador, areaQA.Id_Area);
        var colab3 = Usuario.Crear("Jorge Luis", "Fernández Ríos", "colaborador3@innovatech.com", passColab, RolUsuario.Colaborador, areaDesarrollo.Id_Area);
        var colab4 = Usuario.Crear("Ana María", "Torres Meza", "colaborador4@innovatech.com", passColab, RolUsuario.Colaborador, areaDiseno.Id_Area);
        var colab5 = Usuario.Crear("Diego Alonso", "Ramos Quispe", "colaborador5@innovatech.com", passColab, RolUsuario.Colaborador, areaDesarrollo.Id_Area);
        var colab6 = Usuario.Crear("Valeria", "Salazar Poma", "colaborador6@innovatech.com", passColab, RolUsuario.Colaborador, areaGestion.Id_Area);
        var colab7 = Usuario.Crear("Christian", "Vargas Cano", "colaborador7@innovatech.com", passColab, RolUsuario.Colaborador, areaQA.Id_Area);
        var colab8 = Usuario.Crear("Fiorella", "Castro Chávez", "colaborador8@innovatech.com", passColab, RolUsuario.Colaborador, areaDesarrollo.Id_Area);

        var usuarios = new[] { admin, respElena, respMiguel, colab1, colab2, colab3, colab4, colab5, colab6, colab7, colab8 };
        await _context.Usuarios.AddRangeAsync(usuarios, ct);
        await _context.SaveChangesAsync(ct);

        // 3. Equipos Tecnológicos (31 equipos de las 7 categorías y 4 estados)
        var equipos = new List<Equipo>();

        // Laptops (10)
        equipos.Add(Equipo.Crear("EQ-LAP-001", "MacBook Pro 16 M3 Max", CategoriaEquipo.Laptop, "Apple", "Piso 3 - Lab Desarrollo", EstadoEquipo.Prestado));
        equipos.Add(Equipo.Crear("EQ-LAP-002", "ThinkPad T14 Gen 4", CategoriaEquipo.Laptop, "Lenovo", "Piso 3 - Estación 12", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-LAP-003", "Dell XPS 15 9530", CategoriaEquipo.Laptop, "Dell", "Piso 3 - Estación 14", EstadoEquipo.Prestado));
        equipos.Add(Equipo.Crear("EQ-LAP-004", "HP EliteBook 840 G10", CategoriaEquipo.Laptop, "HP", "Piso 2 - QA Lab", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-LAP-005", "MacBook Air 15 M2", CategoriaEquipo.Laptop, "Apple", "Piso 4 - Diseño UX", EstadoEquipo.Prestado));
        equipos.Add(Equipo.Crear("EQ-LAP-006", "ThinkPad P16s Workstation", CategoriaEquipo.Laptop, "Lenovo", "Piso 3 - Servidores", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-LAP-007", "Dell Latitude 5540", CategoriaEquipo.Laptop, "Dell", "Piso 2 - Almacén TI", EstadoEquipo.Mantenimiento));
        equipos.Add(Equipo.Crear("EQ-LAP-008", "ASUS Zenbook Pro Duo", CategoriaEquipo.Laptop, "ASUS", "Piso 4 - Multimedia", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-LAP-009", "HP ProBook 450 G9", CategoriaEquipo.Laptop, "HP", "Piso 2 - Depósito TI", EstadoEquipo.Baja));
        equipos.Add(Equipo.Crear("EQ-LAP-010", "MacBook Pro 14 M2 Pro", CategoriaEquipo.Laptop, "Apple", "Piso 3 - Lab Desarrollo", EstadoEquipo.Disponible));

        // Computadoras de Escritorio (5)
        equipos.Add(Equipo.Crear("EQ-PC-001", "HP Z2 Tower G9 Workstation", CategoriaEquipo.ComputadoraEscritorio, "HP", "Piso 3 - Servidores Locales", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-PC-002", "Dell OptiPlex 7010 Micro", CategoriaEquipo.ComputadoraEscritorio, "Dell", "Piso 2 - Soporte", EstadoEquipo.Prestado));
        equipos.Add(Equipo.Crear("EQ-PC-003", "Lenovo ThinkCentre M90t", CategoriaEquipo.ComputadoraEscritorio, "Lenovo", "Piso 3 - Lab Pruebas", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-PC-004", "Apple Mac Studio M2 Max", CategoriaEquipo.ComputadoraEscritorio, "Apple", "Piso 4 - Sala Render", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-PC-005", "Dell Precision 3660", CategoriaEquipo.ComputadoraEscritorio, "Dell", "Piso 2 - Taller TI", EstadoEquipo.Mantenimiento));

        // Monitores (5)
        equipos.Add(Equipo.Crear("EQ-MON-001", "Dell UltraSharp 32 4K USB-C", CategoriaEquipo.Monitor, "Dell", "Piso 3 - Estación 10", EstadoEquipo.Prestado));
        equipos.Add(Equipo.Crear("EQ-MON-002", "LG UltraWide 34 Curvo", CategoriaEquipo.Monitor, "LG", "Piso 4 - UX Station", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-MON-003", "BenQ PD3220U DesignVue", CategoriaEquipo.Monitor, "BenQ", "Piso 4 - Diseño 02", EstadoEquipo.Prestado));
        equipos.Add(Equipo.Crear("EQ-MON-004", "Samsung ViewFinity S8 27", CategoriaEquipo.Monitor, "Samsung", "Piso 2 - Pool Monitores", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-MON-005", "ViewSonic VG2448", CategoriaEquipo.Monitor, "ViewSonic", "Piso 2 - Depósito", EstadoEquipo.Baja));

        // Impresoras (3)
        equipos.Add(Equipo.Crear("EQ-IMP-001", "HP LaserJet Pro MFP 4103fdw", CategoriaEquipo.Impresora, "HP", "Piso 2 - Pasillo Central", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-IMP-002", "Epson EcoTank L5590", CategoriaEquipo.Impresora, "Epson", "Piso 3 - Operaciones", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-IMP-003", "Brother HL-L6400DW Láser", CategoriaEquipo.Impresora, "Brother", "Piso 2 - Taller TI", EstadoEquipo.Mantenimiento));

        // Tablets (3)
        equipos.Add(Equipo.Crear("EQ-TAB-001", "iPad Pro 12.9 M2 256GB", CategoriaEquipo.Tablet, "Apple", "Piso 4 - UX Testing", EstadoEquipo.Prestado));
        equipos.Add(Equipo.Crear("EQ-TAB-002", "Samsung Galaxy Tab S9 Ultra", CategoriaEquipo.Tablet, "Samsung", "Piso 2 - QA Mobile Lab", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-TAB-003", "iPad Air 10.9 5ta Gen", CategoriaEquipo.Tablet, "Apple", "Piso 2 - Almacén", EstadoEquipo.Disponible));

        // Proyectores (2)
        equipos.Add(Equipo.Crear("EQ-PRO-001", "Epson PowerLite L530U Láser", CategoriaEquipo.Proyector, "Epson", "Piso 5 - Auditorio Principal", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-PRO-002", "Optoma EH400+ Full HD", CategoriaEquipo.Proyector, "Optoma", "Piso 3 - Sala Innovación", EstadoEquipo.Prestado));

        // Equipos de Red (3)
        equipos.Add(Equipo.Crear("EQ-RED-001", "Cisco Catalyst 2960-X 24P", CategoriaEquipo.EquipoRed, "Cisco", "Data Center - Rack A1", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-RED-002", "Ubiquiti UniFi Dream Machine Pro", CategoriaEquipo.EquipoRed, "Ubiquiti", "Data Center - Rack A2", EstadoEquipo.Disponible));
        equipos.Add(Equipo.Crear("EQ-RED-003", "MikroTik CCR2004 Cloud Router", CategoriaEquipo.EquipoRed, "MikroTik", "Data Center - Rack B1", EstadoEquipo.Mantenimiento));

        await _context.Equipos.AddRangeAsync(equipos, ct);
        await _context.SaveChangesAsync(ct);

        // 4. Préstamos (~25 préstamos para sustentar todos los KPIs y escenarios)
        // Zona horaria de negocio: America/Lima (UTC-5)
        var hoy = _reloj.Hoy;
        var prestamos = new List<Prestamo>();
        var movimientos = new List<MovimientoEquipo>();

        // 4.1. Préstamos Activos (cumplen RN-01, RN-04, RN-05)
        // Préstamo 1: Empieza HOY en Lima (garantiza "Hoy: 1 préstamo registrado")
        var pActivo1 = Prestamo.CrearDirecto(colab1.Id_Usuario, equipos[0].Id_Equipo, respElena.Id_Usuario, hoy, hoy.AddDays(15), "Desarrollo de módulos críticos de arquitectura.");
        prestamos.Add(pActivo1);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[0].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.PrestamoAprobado, "Disponible", "Prestado", "Préstamo activo aprobado para colaborador 1."));

        // Préstamo 2: Activo vigente
        var pActivo2 = Prestamo.CrearDirecto(colab3.Id_Usuario, equipos[2].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-4), hoy.AddDays(10), "Pruebas de carga e integración continua.");
        prestamos.Add(pActivo2);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[2].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.PrestamoAprobado, "Disponible", "Prestado", "Préstamo activo aprobado para colaborador 3."));

        // Préstamo 3: Activo vigente
        var pActivo3 = Prestamo.CrearDirecto(colab4.Id_Usuario, equipos[4].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-3), hoy.AddDays(8), "Diseño de wireframes y prototipos interactivos.");
        prestamos.Add(pActivo3);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[4].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.PrestamoAprobado, "Disponible", "Prestado", "Préstamo activo aprobado para colaborador 4."));

        // Préstamo 4: VENCIDO (Activo con devolución estimada < hoy Lima)
        var pActivo4 = Prestamo.CrearDirecto(colab5.Id_Usuario, equipos[11].Id_Equipo, respMiguel.Id_Usuario, hoy.AddDays(-10), hoy.AddDays(-2), "Ambiente de pruebas de backend distribuido (periodo vencido pendiente de retorno).");
        prestamos.Add(pActivo4);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[11].Id_Equipo, respMiguel.Id_Usuario, TipoMovimientoEquipo.PrestamoAprobado, "Disponible", "Prestado", "Préstamo activo asignado a colaborador 5 (vencido)."));

        // Préstamo 5: Activo vigente
        var pActivo5 = Prestamo.CrearDirecto(colab1.Id_Usuario, equipos[15].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-5), hoy.AddDays(15), "Monitor secundario para estación de desarrollo.");
        prestamos.Add(pActivo5);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[15].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.PrestamoAprobado, "Disponible", "Prestado", "Préstamo de monitor aprobado."));

        // Préstamo 6: Activo vigente
        var pActivo6 = Prestamo.CrearDirecto(colab4.Id_Usuario, equipos[17].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-2), hoy.AddDays(8), "Monitor de alta fidelidad de color para UI.");
        prestamos.Add(pActivo6);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[17].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.PrestamoAprobado, "Disponible", "Prestado", "Monitor de diseño asignado."));

        // Préstamo 7: Vence ESTA SEMANA (en +2 días)
        var pActivo7 = Prestamo.CrearDirecto(colab2.Id_Usuario, equipos[23].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-3), hoy.AddDays(2), "Pruebas de compatibilidad móvil en iPadOS.");
        prestamos.Add(pActivo7);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[23].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.PrestamoAprobado, "Disponible", "Prestado", "Tablet asignada para testing QA."));

        // Préstamo 8: Vence ESTA SEMANA (en +4 días)
        var pActivo8 = Prestamo.CrearDirecto(colab6.Id_Usuario, equipos[27].Id_Equipo, respMiguel.Id_Usuario, hoy.AddDays(-2), hoy.AddDays(4), "Reunión de demostración mensual de avance.");
        prestamos.Add(pActivo8);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[27].Id_Equipo, respMiguel.Id_Usuario, TipoMovimientoEquipo.PrestamoAprobado, "Disponible", "Prestado", "Proyector asignado a gestión."));

        // 4.2. Solicitudes Pendientes (para la bandeja de aprobación)
        var pPendiente1 = Prestamo.CrearSolicitud(colab7.Id_Usuario, equipos[1].Id_Equipo, hoy.AddDays(1), hoy.AddDays(10), "Pruebas automatizadas de rendimiento.");
        prestamos.Add(pPendiente1);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[1].Id_Equipo, colab7.Id_Usuario, TipoMovimientoEquipo.PrestamoSolicitado, "Disponible", "Disponible", "Solicitud de préstamo ingresada por colaborador 7."));

        var pPendiente2 = Prestamo.CrearSolicitud(colab8.Id_Usuario, equipos[3].Id_Equipo, hoy.AddDays(2), hoy.AddDays(12), "Desarrollo de API de integración bancaria.");
        prestamos.Add(pPendiente2);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[3].Id_Equipo, colab8.Id_Usuario, TipoMovimientoEquipo.PrestamoSolicitado, "Disponible", "Disponible", "Solicitud de préstamo ingresada por colaborador 8."));

        var pPendiente3 = Prestamo.CrearSolicitud(colab2.Id_Usuario, equipos[24].Id_Equipo, hoy.AddDays(1), hoy.AddDays(5), "Validación de layout responsive en tablet Android.");
        prestamos.Add(pPendiente3);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[24].Id_Equipo, colab2.Id_Usuario, TipoMovimientoEquipo.PrestamoSolicitado, "Disponible", "Disponible", "Solicitud de tablet ingresada por QA."));

        // 4.3. Solicitudes Rechazadas (cumpliendo con justificación de rechazo)
        var pRechazado1 = Prestamo.CrearSolicitud(colab5.Id_Usuario, equipos[5].Id_Equipo, hoy.AddDays(-10), hoy.AddDays(-5), "Uso personal no corporativo.");
        pRechazado1.Rechazar(respElena.Id_Usuario, "El motivo no corresponde a las políticas de uso de activos corporativos.");
        prestamos.Add(pRechazado1);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[5].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.PrestamoRechazado, "Disponible", "Disponible", "Solicitud rechazada por política corporativa."));

        var pRechazado2 = Prestamo.CrearSolicitud(colab3.Id_Usuario, equipos[16].Id_Equipo, hoy.AddDays(-8), hoy.AddDays(-3), "Demasiados activos solicitados simultáneamente.");
        pRechazado2.Rechazar(respElena.Id_Usuario, "El colaborador ya posee monitores suficientes asignados a su puesto.");
        prestamos.Add(pRechazado2);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[16].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.PrestamoRechazado, "Disponible", "Disponible", "Solicitud de monitor rechazada."));

        // 4.4. Préstamos Históricos Devueltos (con observación obligatoria RN-10)
        var pDevuelto1 = Prestamo.CrearDirecto(colab1.Id_Usuario, equipos[1].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-30), hoy.AddDays(-20), "Sprint 1 de arquitectura.");
        pDevuelto1.RegistrarDevolucion("Equipo retornado en perfecto estado físico y operativo.", hoy.AddDays(-21));
        prestamos.Add(pDevuelto1);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[1].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "Devolución conforme. Equipo en perfecto estado."));

        var pDevuelto2 = Prestamo.CrearDirecto(colab2.Id_Usuario, equipos[3].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-25), hoy.AddDays(-15), "Pruebas de regresión.");
        pDevuelto2.RegistrarDevolucion("Laptop entregada con cargador original, sin daños.", hoy.AddDays(-16));
        prestamos.Add(pDevuelto2);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[3].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "Devolución conforme con accesorios completos."));

        var pDevuelto3 = Prestamo.CrearDirecto(colab3.Id_Usuario, equipos[5].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-20), hoy.AddDays(-10), "Benchmarking de microservicios.");
        pDevuelto3.RegistrarDevolucion("Equipo devuelto sin rayones, operativo al 100%.", hoy.AddDays(-10));
        prestamos.Add(pDevuelto3);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[5].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "Devolución conforme tras benchmark."));

        var pDevuelto4 = Prestamo.CrearDirecto(colab4.Id_Usuario, equipos[7].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-18), hoy.AddDays(-8), "Diseño de landing corporativa.");
        pDevuelto4.RegistrarDevolucion("Equipo operativo, formateado para nuevo uso.", hoy.AddDays(-9));
        prestamos.Add(pDevuelto4);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[7].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "Devolución y saneamiento de software."));

        var pDevuelto5 = Prestamo.CrearDirecto(colab5.Id_Usuario, equipos[9].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-15), hoy.AddDays(-5), "Taller de capacitación en TypeScript.");
        pDevuelto5.RegistrarDevolucion("Retorno de laptop en óptimas condiciones.", hoy.AddDays(-6));
        prestamos.Add(pDevuelto5);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[9].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "Devolución de equipo de taller."));

        var pDevuelto6 = Prestamo.CrearDirecto(colab6.Id_Usuario, equipos[26].Id_Equipo, respMiguel.Id_Usuario, hoy.AddDays(-12), hoy.AddDays(-11), "Presentación a directores de Innovatech.");
        pDevuelto6.RegistrarDevolucion("Proyector y cables HDMI retornados en estuche.", hoy.AddDays(-11));
        prestamos.Add(pDevuelto6);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[26].Id_Equipo, respMiguel.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "Proyector devuelto con kit completo."));

        var pDevuelto7 = Prestamo.CrearDirecto(colab7.Id_Usuario, equipos[16].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-22), hoy.AddDays(-12), "Testing de interfaz dual.");
        pDevuelto7.RegistrarDevolucion("Monitor devuelto en perfectas condiciones.", hoy.AddDays(-13));
        prestamos.Add(pDevuelto7);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[16].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "Monitor retornado sin fallas de píxeles."));

        var pDevuelto8 = Prestamo.CrearDirecto(colab8.Id_Usuario, equipos[24].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-14), hoy.AddDays(-7), "Pruebas de app móvil.");
        pDevuelto8.RegistrarDevolucion("Tablet devuelta con funda y stylus sin rasguños.", hoy.AddDays(-8));
        prestamos.Add(pDevuelto8);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[24].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "Tablet Galaxy Tab retornada con stylus."));

        var pDevuelto9 = Prestamo.CrearDirecto(colab1.Id_Usuario, equipos[2].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-40), hoy.AddDays(-30), "Migración de base de datos.");
        pDevuelto9.RegistrarDevolucion("Laptop entregada limpia y operativa.", hoy.AddDays(-31));
        prestamos.Add(pDevuelto9);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[2].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "Devolución conforme de laptop."));

        var pDevuelto10 = Prestamo.CrearDirecto(colab3.Id_Usuario, equipos[12].Id_Equipo, respMiguel.Id_Usuario, hoy.AddDays(-28), hoy.AddDays(-18), "Pruebas locales de clúster.");
        pDevuelto10.RegistrarDevolucion("PC devuelta con teclado y mouse originales.", hoy.AddDays(-19));
        prestamos.Add(pDevuelto10);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[12].Id_Equipo, respMiguel.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "PC Lenovo devuelta completa."));

        var pDevuelto11 = Prestamo.CrearDirecto(colab4.Id_Usuario, equipos[25].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-16), hoy.AddDays(-9), "Dibujo de iconografía y componentes vectoriales.");
        pDevuelto11.RegistrarDevolucion("iPad Air entregado sin golpes ni rayas.", hoy.AddDays(-10));
        prestamos.Add(pDevuelto11);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[25].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "iPad retornado conforme."));

        var pDevuelto12 = Prestamo.CrearDirecto(colab6.Id_Usuario, equipos[18].Id_Equipo, respElena.Id_Usuario, hoy.AddDays(-35), hoy.AddDays(-25), "Consolidación de presupuestos trimestrales.");
        pDevuelto12.RegistrarDevolucion("Monitor entregado con base y cable de energía.", hoy.AddDays(-26));
        prestamos.Add(pDevuelto12);
        movimientos.Add(MovimientoEquipo.Registrar(equipos[18].Id_Equipo, respElena.Id_Usuario, TipoMovimientoEquipo.Devolucion, "Prestado", "Disponible", "Monitor devuelto conforme."));

        await _context.Prestamos.AddRangeAsync(prestamos, ct);
        await _context.MovimientosEquipo.AddRangeAsync(movimientos, ct);
        await _context.SaveChangesAsync(ct);
    }
}
