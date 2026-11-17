# TechAsset — Sistema de Gestión de Inventario y Préstamo de Equipos Tecnológicos

[![Build & Tests](https://img.shields.io/badge/Build-Passing-0F766E.svg)](#)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-0F766E.svg)](#)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-0F766E.svg)](#)

Aplicación web corporativa para registrar, inventariar, prestar, devolver y auditar activos tecnológicos en **Innovatech Solutions S.A.C.**, asegurando trazabilidad integral y control estricto de disponibilidad.

---

## 1. Problema que Resuelve

Con más de 500 colaboradores distribuidos en múltiples áreas operativas, la asignación manual o no centralizada de activos de TI (laptops, servidores de red, impresoras, monitores) genera duplicidad de préstamos, falta de custodia técnica en devoluciones e inconsistencia entre el inventario teórico y real. 

**TechAsset** centraliza el flujo de custodia de equipos mediante una arquitectura limpia y robusta, garantizando:
- Prevención total de préstamos duplicados mediante reglas de dominio e **índices únicos parciales** en PostgreSQL.
- Transiciones de estado seguras (`Disponible` → `Prestado` → `Devuelto`) respaldadas por una bitácora inmutable de movimientos (`movimientos_equipo`).
- Exigencia de evaluación técnica obligatoria en toda devolución de equipo.
- Dashboard gerencial con 6 KPIs y visualizaciones estadísticas en tiempo real.

---

## 2. Funcionalidades del Sistema (RF-01 a RF-17)

| Código | Módulo | Funcionalidad | Descripción |
| :--- | :--- | :--- | :--- |
| **RF-01** | Usuarios | Registro de Usuarios | Alta de usuarios asignados a áreas funcionales con validación de correo corporativo único (Admin). |
| **RF-02** | Usuarios | Actualización de Usuarios | Edición de nombres, apellidos, área funcional y rol (Admin). |
| **RF-03** | Usuarios | Consulta de Usuarios | Búsqueda por texto, filtros por rol, estado y paginación en tabla accesible. |
| **RF-04** | Usuarios | Deshabilitación de Usuarios | Desactivación lógica (soft delete) bloqueada si el colaborador posee préstamos activos. |
| **RF-05** | Inventario | Registro de Equipos | Alta de activos con código patrimonial único, categoría, marca y ubicación. |
| **RF-06** | Inventario | Edición de Equipos | Modificación de datos descriptivos, marca y ubicación del activo. |
| **RF-07** | Inventario | Consulta de Inventario | Catálogo paginado con `FilterBar` multidimensional (categoría, estado, área). |
| **RF-08** | Inventario | Cambio de Estado Operativo | Transición a `Disponible`, `Mantenimiento` o `Baja` (bloqueado si está prestado). |
| **RF-09** | Préstamos | Registro de Préstamos | Solicitud `Pendiente` por colaborador o préstamo directo `Activo` por responsable/admin. |
| **RF-10** | Préstamos | Registro de Devoluciones | Retorno formal del activo con observación técnica obligatoria y registro de movimiento. |
| **RF-11** | Préstamos | Historial de Préstamos | Bitácora de préstamos pasados con detalle de solicitante, fechas y responsable. |
| **RF-12** | Préstamos | Préstamos Activos | Panel de control de equipos actualmente en custodia temporal con fechas de entrega. |
| **RF-13** | Dashboard | Dashboard General | 6 KPIs principales, gráfico de dona SVG de estados y ranking por área. |
| **RF-14** | Reportes | Equipos por Estado | Distribución cuantitativa y porcentual de equipos según estado operativo. |
| **RF-15** | Reportes | Equipos Más Utilizados | Ranking analítico de equipos con mayor rotación de préstamos. |
| **RF-16** | Reportes | Préstamos por Área | Métricas de demanda de activos tecnológicos agrupadas por área de la empresa. |
| **RF-17** | Reportes | Historial de Movimientos | Auditoría cronológica inmutable de todas las transacciones sobre los activos. |

---

## 3. Reglas de Negocio Implementadas (RN-01 a RN-10)

1. **RN-01 (Unicidad de Préstamo Activo):** Un equipo solo puede tener un préstamo activo simultáneamente (Doble validación en servicio + índice parcial `WHERE est_prestamo = 'Activo'`).
2. **RN-02 (Bloqueo en Mantenimiento):** No se pueden prestar equipos en estado `Mantenimiento` (`Equipo.PuedePrestarse()`).
3. **RN-03 (Bloqueo en Baja):** Equipos en estado `Baja` no admiten solicitudes ni transiciones a activo.
4. **RN-04 (Coherencia Cronológica):** Fecha de devolución estimada > fecha de préstamo (`fde_prestamo > fpr_prestamo`).
5. **RN-05 (Responsable de TI Obligatorio):** Ningún préstamo puede estar en estado `Activo` sin responsable de tecnología asignado (`Idr_Prestamo`).
6. **RN-06 (Baja Lógica de Equipos):** Prohibido el borrado físico (`DELETE`) de equipos; los equipos obsoletos pasan a estado `Baja`.
7. **RN-07 (Unicidad de Código Patrimonial):** El código patrimonial (`cop_equipo`) es estrictamente único en BD y aplicación.
8. **RN-08 (Unicidad de Correo Institucional):** El correo electrónico corporativo (`cor_usuario`) es único en BD y aplicación.
9. **RN-09 (Protección de Desactivación):** Solo el Administrador deshabilita usuarios; bloqueado si el usuario posee préstamos activos.
10. **RN-10 (Observación Obligatoria en Devolución):** Toda devolución de activo exige observación obligatoria no vacía sobre su estado.

---

## 4. Stack Tecnológico

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| **Backend API** | ASP.NET Core 8 Web API | `8.0` (`net8.0`) |
| **ORM & Driver BD** | Entity Framework Core / Npgsql PostgreSQL | `8.0.11` |
| **Seguridad & Hash** | PBKDF2 (100k iteraciones) via Identity PasswordHasher | `8.0.11` |
| **Documentación** | Swashbuckle (Swagger UI en Development) | `6.6.2` |
| **Base de Datos** | PostgreSQL (esquema estricto, UUIDs, CHECKs) | `16+` / `18` |
| **Frontend** | React + Vite | `18.3.1` / `8.3.5` |
| **Estilos & Iconos** | Tailwind CSS / Lucide React / Montserrat | Tailwind `3.4.3` · Lucide `0.460.0` |
| **Pruebas Backend** | xUnit + Moq + Mvc.Testing + EF InMemory | xUnit `2.5.3` · Moq `4.20.72` |
| **Pruebas Frontend** | Vitest + Testing Library + jsdom | Vitest `3.2.7` · RTL `16.3.3` |
| **Calidad de Código** | ESLint 9 Flat Config + Prettier + EditorConfig | ESLint `9.39.5` (no-console error) |

---

## 5. Estructura de la Solución (Clean Architecture)

```text
TechAsset/
├── .editorconfig                 # Reglas globales de espaciado y fin de línea (LF)
├── .env.example                  # Plantilla de variables de entorno
├── .gitignore                    # Exclusiones de Git (seguridad y artefactos)
├── .prettierrc                   # Reglas de formateo unificado de código
├── README.md                     # Documentación general del proyecto
├── TechAsset.sln                 # Solución principal de .NET
├── backend/
│   ├── TechAsset.Domain/         # Entidades ricas, Enums, Excepciones, Reglas de Negocio
│   ├── TechAsset.Application/    # Casos de uso (Services), DTOs records, Mappers, Interfaces
│   ├── TechAsset.Infrastructure/ # AppDbContext, Interceptores, Repositorios, Seeder
│   ├── TechAsset.Api/            # Controllers, Middlewares, Auth por Cookies HttpOnly, Policies
│   └── scripts/                  # Scripts SQL de soporte
├── docs/
│   ├── analisis.md               # Especificación técnica, análisis, trazabilidad y ciclo de vida
│   ├── database/init/            # Scripts de creación de base y rol de mínimo privilegio
│   └── diagramas/                # Diagramas arquitectónicos en Mermaid (.mmd)
├── frontend/
│   ├── package.json              # Dependencias y scripts de Vite/Vitest
│   ├── vite.config.js            # Configuración de servidor de desarrollo y pruebas
│   ├── eslint.config.js          # ESLint 9 flat config (no-console, jsx-a11y)
│   ├── tailwind.config.js        # Tokens de color teal/esmeralda, tipografía y radios
│   └── src/
│       ├── components/           # UI reutilizable (ui/, formulario/, navegacion/, dominio/)
│       ├── context/              # Autenticación y Preferencias accesibles
│       ├── hooks/                # Hooks personalizados (useFormulario, useTrampaFoco, etc.)
│       ├── pages/                # Vistas: Login, Panel, Equipos, Prestamos, Usuarios, Reportes
│       ├── routes/               # Enrutamiento protegido por RBAC
│       └── services/             # Cliente API con soporte para Fetch y Mocks
└── tests/
    └── TechAsset.Tests/          # Pruebas unitarias de invariantes y pruebas de integración
```

---

## 6. Puesta en Marcha Local

### 6.1. Requisitos Previos
- **.NET SDK 8.0** o superior (soporta compilador .NET 10 en target `net8.0`).
- **Node.js 18+** y npm.
- **PostgreSQL 16+** activo en el puerto `5432`.

### 6.2. Configuración de Variables de Entorno
Copie el archivo `.env.example` como `.env` en la raíz del proyecto y configure sus credenciales locales:
```bash
cp .env.example .env
```
> **Nota de Seguridad:** El archivo `.env` está expresamente excluido de Git para impedir la divulgación de credenciales sensibles.

### 6.3. Base de Datos
Ejecute el script de inicialización para crear la base `techasset_db` y el rol restringido `techasset_app`:
```bash
psql -U postgres -f docs/database/init/01-crear-base-y-rol.sql
```

### 6.4. Ejecución del Backend
```bash
dotnet restore TechAsset.sln
dotnet run --project backend/TechAsset.Api
```
La API estará disponible en `http://localhost:5000` (Swagger UI en `http://localhost:5000/swagger`).

### 6.5. Ejecución del Frontend
```bash
cd frontend
npm install
npm run dev
```
La aplicación web se ejecutará en `http://localhost:5173`.

---

## 7. Ejecución de Pruebas Automatizadas

```bash
# Pruebas unitarias y de integración del backend
dotnet test TechAsset.sln

# Pruebas unitarias del frontend
cd frontend
npm run test

# Verificación de calidad y linter (cero advertencias)
npm run lint
```

---

## 8. Cuentas de Demostración (Seed Data)

Las contraseñas de los usuarios de prueba han sido generadas mediante hash PBKDF2 (sin atajos en código):

| Rol | Correo de Acceso | Contraseña de Prueba |
| :--- | :--- | :--- |
| **Administrador** | `admin@innovatech.com` | `Admin123*` |
| **Responsable de Tecnología** | `resp.tecnologia@innovatech.com` | `Resp123*` |
| **Colaborador** | `colaborador1@innovatech.com` | `Colab123*` |
