using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechAsset.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MigracionInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "areas",
                columns: table => new
                {
                    id_area = table.Column<Guid>(type: "uuid", nullable: false),
                    nom_area = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    act_area = table.Column<bool>(type: "boolean", nullable: false),
                    fre_area = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fma_area = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ucr_area = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    umo_area = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_areas", x => x.id_area);
                });

            migrationBuilder.CreateTable(
                name: "equipos",
                columns: table => new
                {
                    id_equipo = table.Column<Guid>(type: "uuid", nullable: false),
                    cop_equipo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    nom_equipo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    cat_equipo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    mar_equipo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    est_equipo = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    ubi_equipo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    fre_equipo = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fma_equipo = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ucr_equipo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    umo_equipo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_equipos", x => x.id_equipo);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id_usuario = table.Column<Guid>(type: "uuid", nullable: false),
                    nom_usuario = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ape_usuario = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    cor_usuario = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    has_usuario = table.Column<string>(type: "text", nullable: false),
                    rol_usuario = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ida_usuario = table.Column<Guid>(type: "uuid", nullable: false),
                    act_usuario = table.Column<bool>(type: "boolean", nullable: false),
                    tema = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "claro"),
                    tamano_letra = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "normal"),
                    fre_usuario = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fma_usuario = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ucr_usuario = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    umo_usuario = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios", x => x.id_usuario);
                    table.CheckConstraint("CK_usuarios_tamano_letra", "tamano_letra IN ('pequeno', 'normal', 'grande', 'A-', 'A', 'A+')");
                    table.CheckConstraint("CK_usuarios_tema", "tema IN ('claro', 'oscuro')");
                    table.ForeignKey(
                        name: "FK_usuarios_areas_ida_usuario",
                        column: x => x.ida_usuario,
                        principalTable: "areas",
                        principalColumn: "id_area",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "movimientos_equipo",
                columns: table => new
                {
                    id_movimiento = table.Column<Guid>(type: "uuid", nullable: false),
                    ide_movimiento = table.Column<Guid>(type: "uuid", nullable: false),
                    idu_movimiento = table.Column<Guid>(type: "uuid", nullable: false),
                    tip_movimiento = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    est_anterior = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    est_nuevo = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    det_movimiento = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    fec_movimiento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fre_movimiento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fma_movimiento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ucr_movimiento = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    umo_movimiento = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_movimientos_equipo", x => x.id_movimiento);
                    table.ForeignKey(
                        name: "FK_movimientos_equipo_equipos_ide_movimiento",
                        column: x => x.ide_movimiento,
                        principalTable: "equipos",
                        principalColumn: "id_equipo",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_movimientos_equipo_usuarios_idu_movimiento",
                        column: x => x.idu_movimiento,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "prestamos",
                columns: table => new
                {
                    id_prestamo = table.Column<Guid>(type: "uuid", nullable: false),
                    fpr_prestamo = table.Column<DateOnly>(type: "date", nullable: false),
                    fde_prestamo = table.Column<DateOnly>(type: "date", nullable: false),
                    fdr_prestamo = table.Column<DateOnly>(type: "date", nullable: true),
                    mot_prestamo = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    obs_prestamo = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    est_prestamo = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    idu_prestamo = table.Column<Guid>(type: "uuid", nullable: false),
                    ide_prestamo = table.Column<Guid>(type: "uuid", nullable: false),
                    idr_prestamo = table.Column<Guid>(type: "uuid", nullable: true),
                    fre_prestamo = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fma_prestamo = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ucr_prestamo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    umo_prestamo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_prestamos", x => x.id_prestamo);
                    table.CheckConstraint("CK_prestamos_fechas", "fde_prestamo > fpr_prestamo");
                    table.CheckConstraint("CK_prestamos_fechas_real", "fdr_prestamo IS NULL OR fdr_prestamo >= fpr_prestamo");
                    table.CheckConstraint("CK_prestamos_responsable_activo", "est_prestamo <> 'Activo' OR idr_prestamo IS NOT NULL");
                    table.ForeignKey(
                        name: "FK_prestamos_equipos_ide_prestamo",
                        column: x => x.ide_prestamo,
                        principalTable: "equipos",
                        principalColumn: "id_equipo",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_prestamos_usuarios_idr_prestamo",
                        column: x => x.idr_prestamo,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_prestamos_usuarios_idu_prestamo",
                        column: x => x.idu_prestamo,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_areas_nom_area",
                table: "areas",
                column: "nom_area",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_equipos_cop_equipo",
                table: "equipos",
                column: "cop_equipo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_movimientos_equipo_ide_movimiento",
                table: "movimientos_equipo",
                column: "ide_movimiento");

            migrationBuilder.CreateIndex(
                name: "IX_movimientos_equipo_idu_movimiento",
                table: "movimientos_equipo",
                column: "idu_movimiento");

            migrationBuilder.CreateIndex(
                name: "IX_prestamos_equipo_activo",
                table: "prestamos",
                column: "ide_prestamo",
                unique: true,
                filter: "est_prestamo = 'Activo'");

            migrationBuilder.CreateIndex(
                name: "IX_prestamos_idr_prestamo",
                table: "prestamos",
                column: "idr_prestamo");

            migrationBuilder.CreateIndex(
                name: "IX_prestamos_idu_prestamo",
                table: "prestamos",
                column: "idu_prestamo");

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_cor_usuario",
                table: "usuarios",
                column: "cor_usuario",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_ida_usuario",
                table: "usuarios",
                column: "ida_usuario");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "movimientos_equipo");

            migrationBuilder.DropTable(
                name: "prestamos");

            migrationBuilder.DropTable(
                name: "equipos");

            migrationBuilder.DropTable(
                name: "usuarios");

            migrationBuilder.DropTable(
                name: "areas");
        }
    }
}
