using Microsoft.EntityFrameworkCore;
using TechAsset.Domain.Constants;
using TechAsset.Domain.Entities;
using TechAsset.Domain.Enums;

namespace TechAsset.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Area> Areas => Set<Area>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Equipo> Equipos => Set<Equipo>();
    public DbSet<Prestamo> Prestamos => Set<Prestamo>();
    public DbSet<MovimientoEquipo> MovimientosEquipo => Set<MovimientoEquipo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigurarArea(modelBuilder);
        ConfigurarUsuario(modelBuilder);
        ConfigurarEquipo(modelBuilder);
        ConfigurarPrestamo(modelBuilder);
        ConfigurarMovimientoEquipo(modelBuilder);
    }

    private static void ConfigurarArea(ModelBuilder mb)
    {
        mb.Entity<Area>(b =>
        {
            b.ToTable("areas");
            b.HasKey(a => a.Id_Area);

            b.Property(a => a.Id_Area).HasColumnName("id_area");
            b.Property(a => a.Nom_Area).HasColumnName("nom_area").HasMaxLength(100).IsRequired();
            b.Property(a => a.Act_Area).HasColumnName("act_area").IsRequired();

            // Auditoría
            b.Property(a => a.Fre_Creacion).HasColumnName("fre_area").IsRequired();
            b.Property(a => a.Fma_Modificacion).HasColumnName("fma_area");
            b.Property(a => a.Ucr_Creador).HasColumnName("ucr_area").HasMaxLength(150);
            b.Property(a => a.Umo_Modificador).HasColumnName("umo_area").HasMaxLength(150);

            b.HasIndex(a => a.Nom_Area).IsUnique();
        });
    }

    private static void ConfigurarUsuario(ModelBuilder mb)
    {
        mb.Entity<Usuario>(b =>
        {
            b.ToTable("usuarios", t =>
            {
                t.HasCheckConstraint("CK_usuarios_tema", "tema IN ('claro', 'oscuro')");
                t.HasCheckConstraint("CK_usuarios_tamano_letra", "tamano_letra IN ('normal', 'grande', 'extragrande')");
            });

            b.HasKey(u => u.Id_Usuario);

            b.Property(u => u.Id_Usuario).HasColumnName("id_usuario");
            b.Property(u => u.Nom_Usuario).HasColumnName("nom_usuario").HasMaxLength(ReglasUsuario.MaxLongitudNombre).IsRequired();
            b.Property(u => u.Ape_Usuario).HasColumnName("ape_usuario").HasMaxLength(ReglasUsuario.MaxLongitudApellido).IsRequired();
            b.Property(u => u.Cor_Usuario).HasColumnName("cor_usuario").HasMaxLength(ReglasUsuario.MaxLongitudCorreo).IsRequired();
            b.Property(u => u.Has_Usuario).HasColumnName("has_usuario").IsRequired();
            b.Property(u => u.Rol_Usuario).HasColumnName("rol_usuario").HasConversion<string>().HasMaxLength(50).IsRequired();
            b.Property(u => u.Ida_Usuario).HasColumnName("ida_usuario").IsRequired();
            b.Property(u => u.Act_Usuario).HasColumnName("act_usuario").IsRequired();
            b.Property(u => u.Tema).HasColumnName("tema").HasMaxLength(20).HasDefaultValue("claro").IsRequired();
            b.Property(u => u.Tamano_Letra).HasColumnName("tamano_letra").HasMaxLength(20).HasDefaultValue("normal").IsRequired();

            // Auditoría
            b.Property(u => u.Fre_Creacion).HasColumnName("fre_usuario").IsRequired();
            b.Property(u => u.Fma_Modificacion).HasColumnName("fma_usuario");
            b.Property(u => u.Ucr_Creador).HasColumnName("ucr_usuario").HasMaxLength(150);
            b.Property(u => u.Umo_Modificador).HasColumnName("umo_usuario").HasMaxLength(150);

            // RN-08: Correo único
            b.HasIndex(u => u.Cor_Usuario).IsUnique();

            b.HasOne(u => u.Area)
             .WithMany()
             .HasForeignKey(u => u.Ida_Usuario)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigurarEquipo(ModelBuilder mb)
    {
        mb.Entity<Equipo>(b =>
        {
            b.ToTable("equipos");
            b.HasKey(e => e.Id_Equipo);

            b.Property(e => e.Id_Equipo).HasColumnName("id_equipo");
            b.Property(e => e.Cop_Equipo).HasColumnName("cop_equipo").HasMaxLength(ReglasEquipo.MaxLongitudCodigo).IsRequired();
            b.Property(e => e.Nom_Equipo).HasColumnName("nom_equipo").HasMaxLength(ReglasEquipo.MaxLongitudNombre).IsRequired();
            b.Property(e => e.Cat_Equipo).HasColumnName("cat_equipo").HasConversion<string>().HasMaxLength(50).IsRequired();
            b.Property(e => e.Mar_Equipo).HasColumnName("mar_equipo").HasMaxLength(ReglasEquipo.MaxLongitudMarca).IsRequired();
            b.Property(e => e.Est_Equipo).HasColumnName("est_equipo").HasConversion<string>().HasMaxLength(30).IsRequired();
            b.Property(e => e.Ubi_Equipo).HasColumnName("ubi_equipo").HasMaxLength(ReglasEquipo.MaxLongitudUbicacion).IsRequired();

            // Auditoría
            b.Property(e => e.Fre_Creacion).HasColumnName("fre_equipo").IsRequired();
            b.Property(e => e.Fma_Modificacion).HasColumnName("fma_equipo");
            b.Property(e => e.Ucr_Creador).HasColumnName("ucr_equipo").HasMaxLength(150);
            b.Property(e => e.Umo_Modificador).HasColumnName("umo_equipo").HasMaxLength(150);

            // RN-07: Código patrimonial único
            b.HasIndex(e => e.Cop_Equipo).IsUnique();
        });
    }

    private static void ConfigurarPrestamo(ModelBuilder mb)
    {
        mb.Entity<Prestamo>(b =>
        {
            b.ToTable("prestamos", t =>
            {
                // RN-04: fde > fpr
                t.HasCheckConstraint("CK_prestamos_fechas", "fde_prestamo > fpr_prestamo");
                // RN-04: fdr >= fpr
                t.HasCheckConstraint("CK_prestamos_fechas_real", "fdr_prestamo IS NULL OR fdr_prestamo >= fpr_prestamo");
                // RN-05: Activo exige responsable
                t.HasCheckConstraint("CK_prestamos_responsable_activo", "est_prestamo <> 'Activo' OR idr_prestamo IS NOT NULL");
            });

            b.HasKey(p => p.Id_Prestamo);

            b.Property(p => p.Id_Prestamo).HasColumnName("id_prestamo");
            b.Property(p => p.Fpr_Prestamo).HasColumnName("fpr_prestamo").IsRequired();
            b.Property(p => p.Fde_Prestamo).HasColumnName("fde_prestamo").IsRequired();
            b.Property(p => p.Fdr_Prestamo).HasColumnName("fdr_prestamo");
            b.Property(p => p.Mot_Prestamo).HasColumnName("mot_prestamo").HasMaxLength(ReglasPrestamo.MaxLongitudMotivo).IsRequired();
            b.Property(p => p.Obs_Prestamo).HasColumnName("obs_prestamo").HasMaxLength(ReglasPrestamo.MaxLongitudObservacion);
            b.Property(p => p.Est_Prestamo).HasColumnName("est_prestamo").HasConversion<string>().HasMaxLength(30).IsRequired();
            b.Property(p => p.Idu_Prestamo).HasColumnName("idu_prestamo").IsRequired();
            b.Property(p => p.Ide_Prestamo).HasColumnName("ide_prestamo").IsRequired();
            b.Property(p => p.Idr_Prestamo).HasColumnName("idr_prestamo");

            // Auditoría
            b.Property(p => p.Fre_Creacion).HasColumnName("fre_prestamo").IsRequired();
            b.Property(p => p.Fma_Modificacion).HasColumnName("fma_prestamo");
            b.Property(p => p.Ucr_Creador).HasColumnName("ucr_prestamo").HasMaxLength(150);
            b.Property(p => p.Umo_Modificador).HasColumnName("umo_prestamo").HasMaxLength(150);

            // RN-01: Índice único parcial para préstamo activo
            b.HasIndex(p => p.Ide_Prestamo)
             .HasDatabaseName("IX_prestamos_equipo_activo")
             .HasFilter("est_prestamo = 'Activo'")
             .IsUnique();

            // Relaciones con Restrict
            b.HasOne(p => p.Solicitante)
             .WithMany()
             .HasForeignKey(p => p.Idu_Prestamo)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(p => p.Equipo)
             .WithMany()
             .HasForeignKey(p => p.Ide_Prestamo)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(p => p.Responsable)
             .WithMany()
             .HasForeignKey(p => p.Idr_Prestamo)
             .OnDelete(DeleteBehavior.SetNull);
        });
    }

    private static void ConfigurarMovimientoEquipo(ModelBuilder mb)
    {
        mb.Entity<MovimientoEquipo>(b =>
        {
            b.ToTable("movimientos_equipo");
            b.HasKey(m => m.Id_Movimiento);

            b.Property(m => m.Id_Movimiento).HasColumnName("id_movimiento");
            b.Property(m => m.Ide_Movimiento).HasColumnName("ide_movimiento").IsRequired();
            b.Property(m => m.Idu_Movimiento).HasColumnName("idu_movimiento").IsRequired();
            b.Property(m => m.Tip_Movimiento).HasColumnName("tip_movimiento").HasConversion<string>().HasMaxLength(50).IsRequired();
            b.Property(m => m.Est_Anterior).HasColumnName("est_anterior").HasMaxLength(30).IsRequired();
            b.Property(m => m.Est_Nuevo).HasColumnName("est_nuevo").HasMaxLength(30).IsRequired();
            b.Property(m => m.Det_Movimiento).HasColumnName("det_movimiento").HasMaxLength(500).IsRequired();
            b.Property(m => m.Fec_Movimiento).HasColumnName("fec_movimiento").IsRequired();

            // Auditoría
            b.Property(m => m.Fre_Creacion).HasColumnName("fre_movimiento").IsRequired();
            b.Property(m => m.Fma_Modificacion).HasColumnName("fma_movimiento");
            b.Property(m => m.Ucr_Creador).HasColumnName("ucr_movimiento").HasMaxLength(150);
            b.Property(m => m.Umo_Modificador).HasColumnName("umo_movimiento").HasMaxLength(150);

            b.HasOne(m => m.Equipo)
             .WithMany()
             .HasForeignKey(m => m.Ide_Movimiento)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(m => m.Usuario)
             .WithMany()
             .HasForeignKey(m => m.Idu_Movimiento)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
